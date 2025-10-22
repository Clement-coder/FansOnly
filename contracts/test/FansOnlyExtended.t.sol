// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FansOnly.sol";

/**
 * @title MockZoraCoin
 * @notice Mock Zora Creator Coin for testing
 */
contract MockZoraCoin {
    mapping(address => uint256) public balanceOf;
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }
    
    function burn(address from, uint256 amount) external {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract FansOnlyExtendedTest is Test {
    UserRegistry userRegistry;
    CampaignManager campaignManager;
    AccessControl accessControl;
    RedemptionManager redemptionManager;
    MockZoraCoin creatorCoin;

    address owner = makeAddr("owner");
    address oracle = makeAddr("oracle");
    address creator = makeAddr("creator");
    address fan = makeAddr("fan");

    uint256 initialFanBalance = 1_000 ether;
    uint256 campaignRewardPool = 100 ether;

    function setUp() public {
        // Deploy contracts directly instead of using factory
        // This gives the test contract ownership
        userRegistry = new UserRegistry();
        campaignManager = new CampaignManager(address(userRegistry));
        accessControl = new AccessControl(address(userRegistry));
        redemptionManager = new RedemptionManager(address(userRegistry), address(campaignManager));
        
        // Deploy mock coin
        creatorCoin = new MockZoraCoin();
        
        // Transfer ownership to oracle for point awarding
        // The test contract (address(this)) is the initial owner
        campaignManager.transferOwnership(oracle);
        redemptionManager.transferOwnership(oracle);

        // Fund test accounts
        vm.deal(fan, initialFanBalance);
        vm.deal(creator, 10 ether);
        vm.deal(address(redemptionManager), 50 ether); // Fund for cashouts
    }

    /// @notice Full FansOnly lifecycle test:
    /// Creator registers → creates campaign → adds milestones → fan earns points → claims rewards
    function testFullFansOnlyFlow() public {
        // STEP 1: Creator registers
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creatorProfile");
        vm.stopPrank();

        // STEP 2: Deploy and link creator coin
        creatorCoin = new MockZoraCoin();
        vm.prank(creator);
        userRegistry.linkCreatorCoin(address(creatorCoin));

        // STEP 3: Fan registers
        vm.startPrank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fanProfile");
        vm.stopPrank();

        // STEP 4: Creator creates campaign
        vm.startPrank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Creator Launch",
            "Exclusive launch rewards for fans",
            block.timestamp + 1,
            block.timestamp + 1000,
            campaignRewardPool
        );
        
        // STEP 5: Creator adds milestones
        campaignManager.addMilestone(campaignId, 100, 10 ether);  // Bronze: 100 points = 10 coins
        campaignManager.addMilestone(campaignId, 500, 50 ether);  // Silver: 500 points = 50 coins
        campaignManager.addMilestone(campaignId, 1000, 100 ether); // Gold: 1000 points = 100 coins
        
        // STEP 6: Creator sets redemption rate
        redemptionManager.setRedemptionRate(100); // 100 points = 1 coin
        vm.stopPrank();

        // STEP 7: Oracle awards points to fan for engagement
        vm.warp(block.timestamp + 2); // Move past campaign start time
        vm.startPrank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150); // Fan earns 150 points
        vm.stopPrank();

        // STEP 8: Fan claims bronze milestone reward
        vm.startPrank(fan);
        uint256 fanBalanceBefore = creatorCoin.balanceOf(fan);
        campaignManager.claimMilestoneReward(campaignId, 0); // Claim bronze (index 0)
        uint256 fanBalanceAfter = creatorCoin.balanceOf(fan);
        vm.stopPrank();

        // ========= VALIDATIONS ==========

        // Creator is properly registered
        (UserRegistry.UserRole role, bool isRegistered,,) = userRegistry.users(creator);
        assertTrue(isRegistered, "Creator not registered");
        assertEq(uint256(role), uint256(UserRegistry.UserRole.CREATOR), "Incorrect creator role");

        // Fan is properly registered
        (, bool isFanRegistered,,) = userRegistry.users(fan);
        assertTrue(isFanRegistered, "Fan not registered");

        // Creator coin is linked
        address linkedCoin = userRegistry.creatorCoinAddress(creator);
        assertEq(linkedCoin, address(creatorCoin), "Creator coin not linked");

        // Campaign details - Split to avoid stack too deep
        {
            (
                address creatorAddr,
                string memory name,
                string memory description,
                ,, // skip startTime and endTime
                bool isActive,
                uint256 totalRewardPool,
                uint256 distributedRewards
            ) = campaignManager.campaigns(campaignId);

            assertEq(creatorAddr, creator, "Creator mismatch in campaign");
            assertEq(name, "Creator Launch", "Campaign name mismatch");
            assertEq(description, "Exclusive launch rewards for fans", "Description mismatch");
            assertTrue(isActive, "Campaign should be active");
            assertEq(totalRewardPool, campaignRewardPool, "Total reward pool mismatch");
            assertEq(distributedRewards, 10 ether, "Distributed rewards should equal bronze milestone");
        }

        // Fan progress validation (earned points)
        (uint256 fanPoints, uint256 lastClaimTime) = campaignManager.getFanProgress(campaignId, fan);
        assertEq(fanPoints, 150, "Fan should have 150 points");
        assertGt(lastClaimTime, 0, "Last claim time should be set");

        // Milestone was claimed
        bool isClaimed = campaignManager.isMilestoneClaimed(campaignId, fan, 0);
        assertTrue(isClaimed, "Bronze milestone should be claimed");

        // Fan received coins
        assertEq(fanBalanceAfter - fanBalanceBefore, 10 ether, "Fan should receive 10 coins");

        // Redemption rate correctly set
        (uint256 rate, bool active) = redemptionManager.creatorRedemptionRates(creator);
        assertEq(rate, 100, "Redemption rate should be 100");
        assertTrue(active, "Redemption should be active");

        // Check milestones
        CampaignManager.Milestone[] memory milestones = campaignManager.getCampaignMilestones(campaignId);
        assertEq(milestones.length, 3, "Should have 3 milestones");
        assertEq(milestones[0].threshold, 100, "Bronze threshold should be 100");
        assertEq(milestones[0].rewardAmount, 10 ether, "Bronze reward should be 10 coins");
    }

    /// @notice Test multiple fans earning and claiming rewards
    function testMultipleFansEngagement() public {
        address fan2 = makeAddr("fan2");
        vm.deal(fan2, 1000 ether);

        // Setup creator and campaign
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        vm.stopPrank();

        creatorCoin = new MockZoraCoin();
        vm.prank(creator);
        userRegistry.linkCreatorCoin(address(creatorCoin));

        vm.startPrank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Multi-Fan Campaign",
            "Test multiple fans",
            block.timestamp,
            block.timestamp + 1000,
            200 ether
        );
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        vm.stopPrank();

        // Register fans
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan1");
        
        vm.prank(fan2);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan2");

        // Oracle awards points to both fans
        vm.startPrank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150);
        campaignManager.awardPoints(campaignId, fan2, 200);
        vm.stopPrank();

        // Both fans claim
        vm.prank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);

        vm.prank(fan2);
        campaignManager.claimMilestoneReward(campaignId, 0);

        // Validations
        assertEq(creatorCoin.balanceOf(fan), 10 ether, "Fan1 should have 10 coins");
        assertEq(creatorCoin.balanceOf(fan2), 10 ether, "Fan2 should have 10 coins");

        (uint256 fan1Points,) = campaignManager.getFanProgress(campaignId, fan);
        (uint256 fan2Points,) = campaignManager.getFanProgress(campaignId, fan2);
        assertEq(fan1Points, 150, "Fan1 should have 150 points");
        assertEq(fan2Points, 200, "Fan2 should have 200 points");
    }

    /// @notice Test access control based on coin holdings
    function testAccessControlWithCoinThreshold() public {
        // Setup creator
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        vm.stopPrank();

        creatorCoin = new MockZoraCoin();
        vm.prank(creator);
        userRegistry.linkCreatorCoin(address(creatorCoin));

        // Creator creates access tiers
        vm.startPrank(creator);
        uint256 vipTierId = accessControl.createAccessTier(
            "VIP Content",
            50 ether, // Need 50 coins
            0,
            "ipfs://vip"
        );

        uint256 premiumTierId = accessControl.createAccessTier(
            "Premium Content",
            100 ether, // Need 100 coins
            0,
            "ipfs://premium"
        );
        vm.stopPrank();

        // Register fan
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");

        // Fan has no coins initially
        bool hasVipAccess = accessControl.checkAccess(creator, fan, vipTierId);
        assertFalse(hasVipAccess, "Fan should not have VIP access without coins");

        // Give fan 50 coins
        creatorCoin.mint(fan, 50 ether);
        hasVipAccess = accessControl.checkAccess(creator, fan, vipTierId);
        assertTrue(hasVipAccess, "Fan should have VIP access with 50 coins");

        bool hasPremiumAccess = accessControl.checkAccess(creator, fan, premiumTierId);
        assertFalse(hasPremiumAccess, "Fan should not have Premium access with only 50 coins");

        // Give fan more coins
        creatorCoin.mint(fan, 50 ether); // Total 100
        hasPremiumAccess = accessControl.checkAccess(creator, fan, premiumTierId);
        assertTrue(hasPremiumAccess, "Fan should have Premium access with 100 coins");
    }

    /// @notice Test platform points conversion to coins
    function testPlatformPointsConversion() public {
        // Setup creator
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        vm.stopPrank();

        creatorCoin = new MockZoraCoin();
        vm.prank(creator);
        userRegistry.linkCreatorCoin(address(creatorCoin));

        // Set redemption rate
        vm.prank(creator);
        redemptionManager.setRedemptionRate(100); // 100 points = 1 coin

        // Register fan
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");

        // Oracle awards platform points
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 500);

        uint256 points = redemptionManager.getPlatformPoints(fan);
        assertEq(points, 500, "Fan should have 500 platform points");

        // Fan converts points to coins
        uint256 balanceBefore = creatorCoin.balanceOf(fan);
        vm.prank(fan);
        redemptionManager.convertPointsToCoins(creator, 500);
        uint256 balanceAfter = creatorCoin.balanceOf(fan);

        // 500 points / 100 points per coin = 5 coins
        assertEq(balanceAfter - balanceBefore, 5, "Fan should receive 5 coins");
        assertEq(redemptionManager.getPlatformPoints(fan), 0, "Points should be consumed");
    }

    /// @notice Test cashout request and processing
    function testCashoutFlow() public {
        // Setup creator
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        vm.stopPrank();

        creatorCoin = new MockZoraCoin();
        vm.prank(creator);
        userRegistry.linkCreatorCoin(address(creatorCoin));

        // Register fan
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");

        // Give fan some coins
        creatorCoin.mint(fan, 100 ether);

        // Fan requests cashout
        uint256 fanBalanceBefore = fan.balance;
        vm.prank(fan);
        uint256 requestId = redemptionManager.requestCashout(creator, 50 ether);

        // Verify coins were burned
        assertEq(creatorCoin.balanceOf(fan), 50 ether, "50 coins should be burned");

        // Oracle processes cashout
        vm.prank(oracle);
        redemptionManager.processCashout(requestId, 2 ether);

        // Verify fan received ETH
        uint256 fanBalanceAfter = fan.balance;
        assertEq(fanBalanceAfter - fanBalanceBefore, 2 ether, "Fan should receive 2 ETH");

        // Verify request is marked as processed
        (,,,, bool processed,) = redemptionManager.cashoutRequests(requestId);
        assertTrue(processed, "Request should be processed");
    }

    /// @notice Test that non-creators cannot create campaigns
    function test_RevertWhen_NonCreatorTriesToCreateCampaign() public {
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");

        vm.prank(fan);
        vm.expectRevert("Not a creator");
        campaignManager.createCampaign(
            "Invalid Campaign",
            "Should fail",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
    }

    /// @notice Test that fans cannot claim rewards without sufficient points
    function test_RevertWhen_ClaimingWithoutSufficientPoints() public {
        // Setup
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");

        creatorCoin = new MockZoraCoin();
        vm.prank(creator);
        userRegistry.linkCreatorCoin(address(creatorCoin));

        vm.startPrank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        vm.stopPrank();

        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");

        // Fan has 0 points, tries to claim
        vm.prank(fan);
        vm.expectRevert("Insufficient points");
        campaignManager.claimMilestoneReward(campaignId, 0);
    }

    /// @notice Test campaign status toggle
    function testCampaignStatusToggle() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");

        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );

        // Check initial status
        (,,,,,bool isActive,,) = campaignManager.campaigns(campaignId);
        assertTrue(isActive, "Campaign should be active initially");

        // Toggle status
        campaignManager.toggleCampaignStatus(campaignId);

        // Check after toggle
        (,,,,,bool isActiveAfter,,) = campaignManager.campaigns(campaignId);
        assertFalse(isActiveAfter, "Campaign should be inactive after toggle");

        vm.stopPrank();
    }
}