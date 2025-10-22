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

/**
 * @title FansOnlyComprehensiveTest
 * @notice Complete test suite covering all project flows and edge cases
 */
contract FansOnlyComprehensiveTest is Test {
    UserRegistry userRegistry;
    CampaignManager campaignManager;
    AccessControl accessControl;
    RedemptionManager redemptionManager;
    MockZoraCoin creatorCoin;
    MockZoraCoin creatorCoin2;

    address owner = makeAddr("owner");
    address oracle = makeAddr("oracle");
    address creator = makeAddr("creator");
    address creator2 = makeAddr("creator2");
    address fan = makeAddr("fan");
    address fan2 = makeAddr("fan2");

    uint256 initialFanBalance = 1_000 ether;
    uint256 campaignRewardPool = 100 ether;

    function setUp() public {
        // Deploy contracts
        userRegistry = new UserRegistry();
        campaignManager = new CampaignManager(address(userRegistry));
        accessControl = new AccessControl(address(userRegistry));
        redemptionManager = new RedemptionManager(address(userRegistry), address(campaignManager));
        
        // Deploy mock coins
        creatorCoin = new MockZoraCoin();
        creatorCoin2 = new MockZoraCoin();
        
        // Transfer ownership to oracle
        campaignManager.transferOwnership(oracle);
        redemptionManager.transferOwnership(oracle);

        // Fund test accounts
        vm.deal(fan, initialFanBalance);
        vm.deal(fan2, initialFanBalance);
        vm.deal(creator, 10 ether);
        vm.deal(creator2, 10 ether);
        vm.deal(address(redemptionManager), 50 ether);
    }

    // ==========================================
    // SECTION 1: USER REGISTRATION & ONBOARDING
    // ==========================================

    function testUserRegistrationAsCreator() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creatorProfile");
        
        (UserRegistry.UserRole role, bool isRegistered, uint256 registeredAt, string memory profile) = 
            userRegistry.users(creator);
        
        assertTrue(isRegistered, "Creator not registered");
        assertEq(uint256(role), uint256(UserRegistry.UserRole.CREATOR), "Incorrect role");
        assertGt(registeredAt, 0, "Registration timestamp not set");
        assertEq(profile, "ipfs://creatorProfile", "Profile URI mismatch");
    }

    function testUserRegistrationAsFan() public {
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fanProfile");
        
        (UserRegistry.UserRole role, bool isRegistered,,) = userRegistry.users(fan);
        
        assertTrue(isRegistered, "Fan not registered");
        assertEq(uint256(role), uint256(UserRegistry.UserRole.FAN), "Incorrect role");
    }

    function test_RevertWhen_AlreadyRegistered() public {
        vm.startPrank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.expectRevert("Already registered");
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fanNew");
        vm.stopPrank();
    }

    function test_RevertWhen_InvalidRole() public {
        vm.prank(fan);
        vm.expectRevert("Invalid role");
        userRegistry.registerUser(UserRegistry.UserRole.NONE, "ipfs://fan");
    }

    function testUpdateProfile() public {
        vm.startPrank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://oldProfile");
        
        userRegistry.updateProfile("ipfs://newProfile");
        vm.stopPrank();
        
        (,,, string memory profile) = userRegistry.users(fan);
        assertEq(profile, "ipfs://newProfile", "Profile not updated");
    }

    function test_RevertWhen_UnregisteredUserUpdatesProfile() public {
        vm.prank(fan);
        vm.expectRevert("User not registered");
        userRegistry.updateProfile("ipfs://profile");
    }

    function testLinkCreatorCoin() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
        
        address linkedCoin = userRegistry.creatorCoinAddress(creator);
        assertEq(linkedCoin, address(creatorCoin), "Coin not linked");
    }

    function test_RevertWhen_NonCreatorLinksCreatorCoin() public {
        vm.startPrank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.expectRevert("Not a creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
    }

    function test_RevertWhen_LinkingInvalidCoinAddress() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.expectRevert("Invalid coin address");
        userRegistry.linkCreatorCoin(address(0));
        vm.stopPrank();
    }

    // ==========================================
    // SECTION 2: CAMPAIGN CREATION & MANAGEMENT
    // ==========================================

    function testCreateCampaign() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        uint256 campaignId = campaignManager.createCampaign(
            "Test Campaign",
            "Test Description",
            block.timestamp + 10,
            block.timestamp + 1000,
            campaignRewardPool
        );
        vm.stopPrank();
        
        (
            address creatorAddr,
            string memory name,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 totalRewardPool,
            uint256 distributedRewards
        ) = campaignManager.campaigns(campaignId);
        
        assertEq(creatorAddr, creator, "Creator mismatch");
        assertEq(name, "Test Campaign", "Name mismatch");
        assertEq(description, "Test Description", "Description mismatch");
        assertEq(startTime, block.timestamp + 10, "Start time mismatch");
        assertEq(endTime, block.timestamp + 1000, "End time mismatch");
        assertTrue(isActive, "Campaign should be active");
        assertEq(totalRewardPool, campaignRewardPool, "Reward pool mismatch");
        assertEq(distributedRewards, 0, "Initial distributed rewards should be 0");
    }

    function test_RevertWhen_NonCreatorCreatesCampaign() public {
        vm.startPrank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.expectRevert("Not a creator");
        campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        vm.stopPrank();
    }

    function test_RevertWhen_InvalidTimeRange() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.expectRevert("Invalid time range");
        campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp + 1000,
            block.timestamp + 100, // End before start
            100 ether
        );
        vm.stopPrank();
    }

    function test_RevertWhen_StartTimeInPast() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        // First, warp forward to avoid underflow
        vm.warp(block.timestamp + 1000);
        
        // Now create a campaign with start time in the past (current timestamp - 100)
        uint256 pastTime = block.timestamp - 100;
        
        vm.expectRevert("Start time in past");
        campaignManager.createCampaign(
            "Test",
            "Test",
            pastTime,
            block.timestamp + 1000,
            100 ether
        );
        vm.stopPrank();
    }

    function testAddMilestone() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp + 10,
            block.timestamp + 1000,
            100 ether
        );
        
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        vm.stopPrank();
        
        CampaignManager.Milestone[] memory milestones = 
            campaignManager.getCampaignMilestones(campaignId);
        
        assertEq(milestones.length, 1, "Should have 1 milestone");
        assertEq(milestones[0].threshold, 100, "Threshold mismatch");
        assertEq(milestones[0].rewardAmount, 10 ether, "Reward amount mismatch");
        assertTrue(milestones[0].isActive, "Milestone should be active");
    }

    function test_RevertWhen_NonCreatorAddsMilestone() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.prank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp + 10,
            block.timestamp + 1000,
            100 ether
        );
        
        vm.prank(fan);
        vm.expectRevert("Not campaign creator");
        campaignManager.addMilestone(campaignId, 100, 10 ether);
    }

    function testToggleCampaignStatus() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        (,,,,,bool isActiveBefore,,) = campaignManager.campaigns(campaignId);
        assertTrue(isActiveBefore, "Should be active initially");
        
        campaignManager.toggleCampaignStatus(campaignId);
        
        (,,,,,bool isActiveAfter,,) = campaignManager.campaigns(campaignId);
        assertFalse(isActiveAfter, "Should be inactive after toggle");
        
        campaignManager.toggleCampaignStatus(campaignId);
        
        (,,,,,bool isActiveAgain,,) = campaignManager.campaigns(campaignId);
        assertTrue(isActiveAgain, "Should be active again");
        vm.stopPrank();
    }

    // ==========================================
    // SECTION 3: POINTS AWARDING & TIME BOUNDARIES
    // ==========================================

    function testAwardPoints() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.prank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150);
        
        (uint256 points,) = campaignManager.getFanProgress(campaignId, fan);
        assertEq(points, 150, "Points not awarded correctly");
    }

    function test_RevertWhen_AwardingPointsBeforeCampaignStarts() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.prank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp + 1000, // Starts in future
            block.timestamp + 2000,
            100 ether
        );
        
        vm.prank(oracle);
        vm.expectRevert("Not running");
        campaignManager.awardPoints(campaignId, fan, 100);
    }

    function test_RevertWhen_AwardingPointsAfterCampaignEnds() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.prank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        vm.warp(block.timestamp + 1001); // Move past end time
        
        vm.prank(oracle);
        vm.expectRevert("Not running");
        campaignManager.awardPoints(campaignId, fan, 100);
    }

    function test_RevertWhen_AwardingPointsToInactiveCampaign() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        campaignManager.toggleCampaignStatus(campaignId); // Deactivate
        vm.stopPrank();
        
        vm.prank(oracle);
        vm.expectRevert("Campaign not active");
        campaignManager.awardPoints(campaignId, fan, 100);
    }

    function testMultiplePointAwards() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.prank(creator);
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        vm.startPrank(oracle);
        campaignManager.awardPoints(campaignId, fan, 50);
        campaignManager.awardPoints(campaignId, fan, 75);
        campaignManager.awardPoints(campaignId, fan, 25);
        vm.stopPrank();
        
        (uint256 points,) = campaignManager.getFanProgress(campaignId, fan);
        assertEq(points, 150, "Cumulative points incorrect");
    }

    // ==========================================
    // SECTION 4: MILESTONE CLAIMING
    // ==========================================

    function testClaimMilestoneReward() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
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
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150);
        
        uint256 balanceBefore = creatorCoin.balanceOf(fan);
        
        vm.prank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);
        
        uint256 balanceAfter = creatorCoin.balanceOf(fan);
        assertEq(balanceAfter - balanceBefore, 10 ether, "Reward not received");
        
        bool isClaimed = campaignManager.isMilestoneClaimed(campaignId, fan, 0);
        assertTrue(isClaimed, "Milestone not marked as claimed");
    }

    function test_RevertWhen_ClaimingWithInsufficientPoints() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
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
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 50); // Only 50 points
        
        vm.prank(fan);
        vm.expectRevert("Insufficient points");
        campaignManager.claimMilestoneReward(campaignId, 0);
    }

    function test_RevertWhen_DoubleClaiming() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
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
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150);
        
        vm.startPrank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);
        
        vm.expectRevert("Already claimed");
        campaignManager.claimMilestoneReward(campaignId, 0);
        vm.stopPrank();
    }

    function testClaimMultipleMilestones() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            200 ether
        );
        
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        campaignManager.addMilestone(campaignId, 500, 50 ether);
        campaignManager.addMilestone(campaignId, 1000, 100 ether);
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 1200);
        
        vm.startPrank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);
        campaignManager.claimMilestoneReward(campaignId, 1);
        campaignManager.claimMilestoneReward(campaignId, 2);
        vm.stopPrank();
        
        uint256 balance = creatorCoin.balanceOf(fan);
        assertEq(balance, 160 ether, "Total rewards incorrect");
    }

    function testClaimMilestonesNonSequentially() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            200 ether
        );
        
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        campaignManager.addMilestone(campaignId, 500, 50 ether);
        campaignManager.addMilestone(campaignId, 1000, 100 ether);
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 1200);
        
        // Claim milestone 2 first (highest)
        vm.prank(fan);
        campaignManager.claimMilestoneReward(campaignId, 2);
        
        // Then claim milestone 0
        vm.prank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);
        
        uint256 balance = creatorCoin.balanceOf(fan);
        assertEq(balance, 110 ether, "Non-sequential claiming failed");
    }

    function test_RevertWhen_ClaimingWithoutCreatorCoin() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        // DON'T link creator coin
        
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
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150);
        
        vm.prank(fan);
        vm.expectRevert("Creator coin not set");
        campaignManager.claimMilestoneReward(campaignId, 0);
    }

    // ==========================================
    // SECTION 5: ACCESS CONTROL
    // ==========================================

    function testCreateAccessTier() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        uint256 tierId = accessControl.createAccessTier(
            "VIP",
            50 ether,
            0,
            "ipfs://vipContent"
        );
        vm.stopPrank();
        
        AccessControl.AccessTier[] memory tiers = accessControl.getCreatorTiers(creator);
        assertEq(tiers[tierId].name, "VIP", "Tier name mismatch");
        assertEq(tiers[tierId].coinThreshold, 50 ether, "Coin threshold mismatch");
        assertTrue(tiers[tierId].isActive, "Tier should be active");
    }

    function testCheckAccessWithCoinBalance() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 tierId = accessControl.createAccessTier(
            "VIP",
            50 ether,
            0,
            "ipfs://vip"
        );
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        // Fan has no coins
        bool hasAccess = accessControl.checkAccess(creator, fan, tierId);
        assertFalse(hasAccess, "Should not have access without coins");
        
        // Give fan coins
        creatorCoin.mint(fan, 50 ether);
        
        hasAccess = accessControl.checkAccess(creator, fan, tierId);
        assertTrue(hasAccess, "Should have access with sufficient coins");
    }

    function testAccessRevokedAfterCoinBurn() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 tierId = accessControl.createAccessTier(
            "VIP",
            50 ether,
            0,
            "ipfs://vip"
        );
        vm.stopPrank();
        
        creatorCoin.mint(fan, 50 ether);
        
        bool hasAccess = accessControl.checkAccess(creator, fan, tierId);
        assertTrue(hasAccess, "Should have access");
        
        // Fan burns coins
        creatorCoin.burn(fan, 50 ether);
        
        hasAccess = accessControl.checkAccess(creator, fan, tierId);
        assertFalse(hasAccess, "Access should be revoked after burn");
    }

    function testDeactivatedTierDeniesAccess() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 tierId = accessControl.createAccessTier(
            "VIP",
            50 ether,
            0,
            "ipfs://vip"
        );
        vm.stopPrank();
        
        creatorCoin.mint(fan, 100 ether);
        
        bool hasAccess = accessControl.checkAccess(creator, fan, tierId);
        assertTrue(hasAccess, "Should have access");
        
        // Deactivate tier
        vm.prank(creator);
        accessControl.updateTierStatus(tierId, false);
        
        hasAccess = accessControl.checkAccess(creator, fan, tierId);
        assertFalse(hasAccess, "Deactivated tier should deny access");
    }

    function testMultipleTiers() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 bronzeTier = accessControl.createAccessTier("Bronze", 10 ether, 0, "ipfs://bronze");
        uint256 silverTier = accessControl.createAccessTier("Silver", 50 ether, 0, "ipfs://silver");
        uint256 goldTier = accessControl.createAccessTier("Gold", 100 ether, 0, "ipfs://gold");
        vm.stopPrank();
        
        creatorCoin.mint(fan, 50 ether);
        
        assertTrue(accessControl.checkAccess(creator, fan, bronzeTier), "Should have bronze");
        assertTrue(accessControl.checkAccess(creator, fan, silverTier), "Should have silver");
        assertFalse(accessControl.checkAccess(creator, fan, goldTier), "Should not have gold");
    }

    // ==========================================
    // SECTION 6: REDEMPTION & POINTS CONVERSION
    // ==========================================

    function testSetRedemptionRate() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        redemptionManager.setRedemptionRate(100);
        vm.stopPrank();
        
        (uint256 rate, bool active) = redemptionManager.creatorRedemptionRates(creator);
        assertEq(rate, 100, "Rate not set correctly");
        assertTrue(active, "Should be active");
    }

    function testAwardPlatformPoints() public {
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 500);
        
        uint256 points = redemptionManager.getPlatformPoints(fan);
        assertEq(points, 500, "Points not awarded");
    }

    function testConvertPointsToCoins() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        redemptionManager.setRedemptionRate(100); // 100 points = 1 coin
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 500);
        
        uint256 balanceBefore = creatorCoin.balanceOf(fan);
        
        vm.prank(fan);
        redemptionManager.convertPointsToCoins(creator, 500);
        
        uint256 balanceAfter = creatorCoin.balanceOf(fan);
        assertEq(balanceAfter - balanceBefore, 5, "Should receive 5 coins");
        
        uint256 remainingPoints = redemptionManager.getPlatformPoints(fan);
        assertEq(remainingPoints, 0, "Points should be consumed");
    }

    function test_RevertWhen_ConvertingInsufficientPoints() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        redemptionManager.setRedemptionRate(100);
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 50);
        
        vm.prank(fan);
        vm.expectRevert("Insufficient points");
        redemptionManager.convertPointsToCoins(creator, 500);
    }

    function test_RevertWhen_ConvertingWithInactiveRedemption() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        // Register fan first
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 500);
        
        vm.prank(fan);
        vm.expectRevert("Redemption not active");
        redemptionManager.convertPointsToCoins(creator, 500);
    }

    function test_RevertWhen_ConvertingWithoutCreatorCoin() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        redemptionManager.setRedemptionRate(100);
        vm.stopPrank();
        
        // Register fan first
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 500);
        
        vm.prank(fan);
        vm.expectRevert("Creator coin not set");
        redemptionManager.convertPointsToCoins(creator, 500);
    }

    function testPartialPointsConversion() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        redemptionManager.setRedemptionRate(100);
        vm.stopPrank();
        
        // Register fan first
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 550);
        
        vm.prank(fan);
        redemptionManager.convertPointsToCoins(creator, 500);
        
        uint256 balance = creatorCoin.balanceOf(fan);
        assertEq(balance, 5, "Should receive 5 coins");
        
        uint256 remainingPoints = redemptionManager.getPlatformPoints(fan);
        assertEq(remainingPoints, 50, "Should have 50 points remaining");
    }

    // ==========================================
    // SECTION 7: CASHOUT FLOW
    // ==========================================

    function testRequestCashout() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        creatorCoin.mint(fan, 100 ether);
        
        vm.prank(fan);
        uint256 requestId = redemptionManager.requestCashout(creator, 50 ether);
        
        (
            address user,
            address requestCreator,
            uint256 coinAmount,
            uint256 ethValue,
            bool processed,
            uint256 timestamp
        ) = redemptionManager.cashoutRequests(requestId);
        
        assertEq(user, fan, "User mismatch");
        assertEq(requestCreator, creator, "Creator mismatch");
        assertEq(coinAmount, 50 ether, "Coin amount mismatch");
        assertEq(ethValue, 0, "ETH value should be 0 initially");
        assertFalse(processed, "Should not be processed yet");
        assertGt(timestamp, 0, "Timestamp not set");
        
        // Verify coins were burned
        assertEq(creatorCoin.balanceOf(fan), 50 ether, "Coins not burned");
    }

    function testProcessCashout() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
        
        creatorCoin.mint(fan, 100 ether);
        
        uint256 fanBalanceBefore = fan.balance;
        
        vm.prank(fan);
        uint256 requestId = redemptionManager.requestCashout(creator, 50 ether);
        
        vm.prank(oracle);
        redemptionManager.processCashout(requestId, 2 ether);
        
        uint256 fanBalanceAfter = fan.balance;
        assertEq(fanBalanceAfter - fanBalanceBefore, 2 ether, "ETH not transferred");
        
        (,,, uint256 ethValue, bool processed,) = redemptionManager.cashoutRequests(requestId);
        assertEq(ethValue, 2 ether, "ETH value not recorded");
        assertTrue(processed, "Request not marked as processed");
    }

    function test_RevertWhen_ProcessingAlreadyProcessedCashout() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
        
        creatorCoin.mint(fan, 100 ether);
        
        vm.prank(fan);
        uint256 requestId = redemptionManager.requestCashout(creator, 50 ether);
        
        vm.prank(oracle);
        redemptionManager.processCashout(requestId, 2 ether);
        
        vm.prank(oracle);
        vm.expectRevert("Already processed");
        redemptionManager.processCashout(requestId, 2 ether);
    }

    function testMultipleCashoutRequests() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
        
        creatorCoin.mint(fan, 200 ether);
        
        vm.startPrank(fan);
        uint256 requestId1 = redemptionManager.requestCashout(creator, 50 ether);
        uint256 requestId2 = redemptionManager.requestCashout(creator, 50 ether);
        vm.stopPrank();
        
        assertNotEq(requestId1, requestId2, "Request IDs should be unique");
        assertEq(creatorCoin.balanceOf(fan), 100 ether, "Total coins burned incorrect");
    }

    function test_RevertWhen_CashoutWithInsufficientCoins() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
        
        creatorCoin.mint(fan, 30 ether);
        
        vm.prank(fan);
        vm.expectRevert("Insufficient coins");
        redemptionManager.requestCashout(creator, 50 ether);
    }

    // ==========================================
    // SECTION 8: CREATOR AS FAN (DUAL ROLE)
    // ==========================================

    function testCreatorAsParticipant() public {
        // Setup creator1
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator1");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        vm.stopPrank();
        
        // Setup creator2
        vm.startPrank(creator2);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator2");
        userRegistry.linkCreatorCoin(address(creatorCoin2));
        
        uint256 campaignId = campaignManager.createCampaign(
            "Cross-Creator Campaign",
            "Test dual role",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        vm.stopPrank();
        
        // creator (also a creator) participates in creator2's campaign
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, creator, 150);
        
        (uint256 points,) = campaignManager.getFanProgress(campaignId, creator);
        assertEq(points, 150, "Creator should earn points as fan");
        
        // creator claims reward from creator2's campaign
        vm.prank(creator);
        campaignManager.claimMilestoneReward(campaignId, 0);
        
        uint256 balance = creatorCoin2.balanceOf(creator);
        assertEq(balance, 10 ether, "Creator should receive coins from other creator");
    }

    function testCreatorEngagingWithMultipleCreators() public {
        // Setup creator and creator2
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator1");
        
        vm.startPrank(creator2);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator2");
        userRegistry.linkCreatorCoin(address(creatorCoin2));
        
        uint256 campaign1 = campaignManager.createCampaign(
            "Campaign 1",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        campaignManager.addMilestone(campaign1, 100, 10 ether);
        vm.stopPrank();
        
        // Another creator creates a campaign
        address creator3 = makeAddr("creator3");
        MockZoraCoin coin3 = new MockZoraCoin();
        
        vm.startPrank(creator3);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator3");
        userRegistry.linkCreatorCoin(address(coin3));
        
        uint256 campaign2 = campaignManager.createCampaign(
            "Campaign 2",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        campaignManager.addMilestone(campaign2, 100, 20 ether);
        vm.stopPrank();
        
        // creator participates in both campaigns
        vm.startPrank(oracle);
        campaignManager.awardPoints(campaign1, creator, 150);
        campaignManager.awardPoints(campaign2, creator, 200);
        vm.stopPrank();
        
        // Claim from both
        vm.startPrank(creator);
        campaignManager.claimMilestoneReward(campaign1, 0);
        campaignManager.claimMilestoneReward(campaign2, 0);
        vm.stopPrank();
        
        assertEq(creatorCoin2.balanceOf(creator), 10 ether, "Should have coins from creator2");
        assertEq(coin3.balanceOf(creator), 20 ether, "Should have coins from creator3");
    }

    // ==========================================
    // SECTION 9: MULTI-USER & MULTI-CAMPAIGN
    // ==========================================

    function testMultipleFansEngagement() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 campaignId = campaignManager.createCampaign(
            "Multi-Fan Campaign",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            200 ether
        );
        
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan1");
        
        vm.prank(fan2);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan2");
        
        vm.startPrank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150);
        campaignManager.awardPoints(campaignId, fan2, 200);
        vm.stopPrank();
        
        vm.prank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);
        
        vm.prank(fan2);
        campaignManager.claimMilestoneReward(campaignId, 0);
        
        assertEq(creatorCoin.balanceOf(fan), 10 ether, "Fan1 should have 10 coins");
        assertEq(creatorCoin.balanceOf(fan2), 10 ether, "Fan2 should have 10 coins");
        
        (,,,,,, uint256 totalPool, uint256 distributed) = campaignManager.campaigns(campaignId);
        assertEq(distributed, 20 ether, "Distributed rewards incorrect");
        assertEq(totalPool, 200 ether, "Total pool should remain unchanged");
    }

    function testFanInMultipleCampaigns() public {
        // Creator1 campaign
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator1");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 campaign1 = campaignManager.createCampaign(
            "Campaign 1",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        campaignManager.addMilestone(campaign1, 100, 10 ether);
        vm.stopPrank();
        
        // Creator2 campaign
        vm.startPrank(creator2);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator2");
        userRegistry.linkCreatorCoin(address(creatorCoin2));
        
        uint256 campaign2 = campaignManager.createCampaign(
            "Campaign 2",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        campaignManager.addMilestone(campaign2, 100, 15 ether);
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        // Fan participates in both
        vm.startPrank(oracle);
        campaignManager.awardPoints(campaign1, fan, 150);
        campaignManager.awardPoints(campaign2, fan, 200);
        vm.stopPrank();
        
        vm.startPrank(fan);
        campaignManager.claimMilestoneReward(campaign1, 0);
        campaignManager.claimMilestoneReward(campaign2, 0);
        vm.stopPrank();
        
        assertEq(creatorCoin.balanceOf(fan), 10 ether, "Should have creator1 coins");
        assertEq(creatorCoin2.balanceOf(fan), 15 ether, "Should have creator2 coins");
        
        uint256[] memory fanCampaigns = campaignManager.getFanCampaigns(fan);
        assertEq(fanCampaigns.length, 2, "Fan should be in 2 campaigns");
    }

    function testCreatorMultipleCampaigns() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        uint256 campaign1 = campaignManager.createCampaign(
            "Campaign 1",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        uint256 campaign2 = campaignManager.createCampaign(
            "Campaign 2",
            "Test",
            block.timestamp + 10,
            block.timestamp + 2000,
            200 ether
        );
        vm.stopPrank();
        
        uint256[] memory creatorCampaigns = campaignManager.getCreatorCampaigns(creator);
        assertEq(creatorCampaigns.length, 2, "Creator should have 2 campaigns");
        assertEq(creatorCampaigns[0], campaign1, "First campaign ID mismatch");
        assertEq(creatorCampaigns[1], campaign2, "Second campaign ID mismatch");
    }

    // ==========================================
    // SECTION 10: EDGE CASES & VALIDATIONS
    // ==========================================

    function testCampaignDistributedRewardsTracking() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 campaignId = campaignManager.createCampaign(
            "Test",
            "Test",
            block.timestamp,
            block.timestamp + 1000,
            100 ether
        );
        
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        campaignManager.addMilestone(campaignId, 200, 20 ether);
        vm.stopPrank();
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 250);
        
        (,,,,,, uint256 totalPool, uint256 distributedBefore) = campaignManager.campaigns(campaignId);
        assertEq(distributedBefore, 0, "Should be 0 before claims");
        
        vm.startPrank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);
        campaignManager.claimMilestoneReward(campaignId, 1);
        vm.stopPrank();
        
        (,,,,,, uint256 totalPoolAfter, uint256 distributedAfter) = campaignManager.campaigns(campaignId);
        assertEq(distributedAfter, 30 ether, "Should track total distributed");
        assertEq(totalPoolAfter, totalPool, "Total pool should not change");
        assertLe(distributedAfter, totalPoolAfter, "Distributed should not exceed pool");
    }

    function testFanProgressLastClaimTime() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
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
        
        vm.prank(oracle);
        campaignManager.awardPoints(campaignId, fan, 150);
        
        (, uint256 lastClaimBefore) = campaignManager.getFanProgress(campaignId, fan);
        assertEq(lastClaimBefore, 0, "Last claim should be 0 initially");
        
        uint256 claimTime = block.timestamp + 100;
        vm.warp(claimTime);
        
        vm.prank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0);
        
        (, uint256 lastClaimAfter) = campaignManager.getFanProgress(campaignId, fan);
        assertEq(lastClaimAfter, claimTime, "Last claim time not updated");
    }

    function testZeroPointsConversion() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        redemptionManager.setRedemptionRate(100);
        vm.stopPrank();
        
        // Register fan first
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        vm.prank(oracle);
        redemptionManager.awardPlatformPoints(fan, 50); // Less than conversion threshold
        
        vm.prank(fan);
        vm.expectRevert("Insufficient points for conversion");
        redemptionManager.convertPointsToCoins(creator, 50);
    }

    function testEmptyCreatorCampaigns() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        uint256[] memory campaigns = campaignManager.getCreatorCampaigns(creator);
        assertEq(campaigns.length, 0, "New creator should have no campaigns");
    }

    function testEmptyFanCampaigns() public {
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        uint256[] memory campaigns = campaignManager.getFanCampaigns(fan);
        assertEq(campaigns.length, 0, "New fan should have no campaigns");
    }

    function testGetUserRole() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        UserRegistry.UserRole creatorRole = userRegistry.getUserRole(creator);
        UserRegistry.UserRole fanRole = userRegistry.getUserRole(fan);
        UserRegistry.UserRole unregisteredRole = userRegistry.getUserRole(makeAddr("unregistered"));
        
        assertEq(uint256(creatorRole), uint256(UserRegistry.UserRole.CREATOR), "Creator role mismatch");
        assertEq(uint256(fanRole), uint256(UserRegistry.UserRole.FAN), "Fan role mismatch");
        assertEq(uint256(unregisteredRole), uint256(UserRegistry.UserRole.NONE), "Unregistered should be NONE");
    }

    function testIsRegistered() public {
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        assertTrue(userRegistry.isRegistered(fan), "Fan should be registered");
        assertFalse(userRegistry.isRegistered(makeAddr("unregistered")), "Unregistered should return false");
    }

    function testIsCreator() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        
        assertTrue(userRegistry.isCreator(creator), "Should be creator");
        assertFalse(userRegistry.isCreator(fan), "Fan should not be creator");
        assertFalse(userRegistry.isCreator(makeAddr("unregistered")), "Unregistered should not be creator");
    }

    // ==========================================
    // SECTION 11: COMPLETE INTEGRATION TEST
    // ==========================================

    function testCompleteEcosystemFlow() public {
        // Phase 1: Setup ecosystem
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        userRegistry.linkCreatorCoin(address(creatorCoin));
        
        uint256 campaignId = campaignManager.createCampaign(
            "Complete Test Campaign",
            "Full integration test",
            block.timestamp,
            block.timestamp + 1000,
            500 ether
        );
        
        campaignManager.addMilestone(campaignId, 100, 10 ether);
        campaignManager.addMilestone(campaignId, 500, 50 ether);
        campaignManager.addMilestone(campaignId, 1000, 100 ether);
        
        uint256 vipTierId = accessControl.createAccessTier("VIP", 50 ether, 0, "ipfs://vip");
        
        redemptionManager.setRedemptionRate(100);
        vm.stopPrank();
        
        // Phase 2: Fans join
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan1");
        
        vm.prank(fan2);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan2");
        
        // Phase 3: Engagement and points
        vm.startPrank(oracle);
        campaignManager.awardPoints(campaignId, fan, 600);
        campaignManager.awardPoints(campaignId, fan2, 1200);
        redemptionManager.awardPlatformPoints(fan, 500);
        vm.stopPrank();
        
        // Phase 4: Claims and conversions
        vm.startPrank(fan);
        campaignManager.claimMilestoneReward(campaignId, 0); // 10 coins
        campaignManager.claimMilestoneReward(campaignId, 1); // 50 coins
        redemptionManager.convertPointsToCoins(creator, 500); // 5 coins
        vm.stopPrank();
        
        vm.startPrank(fan2);
        campaignManager.claimMilestoneReward(campaignId, 0);
        campaignManager.claimMilestoneReward(campaignId, 1);
        campaignManager.claimMilestoneReward(campaignId, 2); // 100 coins
        vm.stopPrank();
        
        // Phase 5: Access control checks
        bool fan1HasAccess = accessControl.checkAccess(creator, fan, vipTierId);
        bool fan2HasAccess = accessControl.checkAccess(creator, fan2, vipTierId);
        
        assertTrue(fan1HasAccess, "Fan1 should have VIP access with 65 coins");
        assertTrue(fan2HasAccess, "Fan2 should have VIP access with 160 coins");
        
        // Phase 6: Cashout
        uint256 fan2BalanceBefore = fan2.balance;
        vm.prank(fan2);
        uint256 requestId = redemptionManager.requestCashout(creator, 50 ether);
        
        vm.prank(oracle);
        redemptionManager.processCashout(requestId, 3 ether);
        
        uint256 fan2BalanceAfter = fan2.balance;
        
        // Final validations
        assertEq(creatorCoin.balanceOf(fan), 60 ether + 5, "Fan1 final balance incorrect (10 + 50 + 5)");
        assertEq(creatorCoin.balanceOf(fan2), 110 ether, "Fan2 final balance incorrect (160 - 50)");
        assertEq(fan2BalanceAfter - fan2BalanceBefore, 3 ether, "Fan2 should receive 3 ETH");
        
        (,,,,,, uint256 totalPool, uint256 distributed) = campaignManager.campaigns(campaignId);
        assertEq(distributed, 220 ether, "Total distributed: 10+50+10+50+100");
        assertLe(distributed, totalPool, "Should not exceed pool");
        
        uint256[] memory fan1Campaigns = campaignManager.getFanCampaigns(fan);
        uint256[] memory fan2Campaigns = campaignManager.getFanCampaigns(fan2);
        assertEq(fan1Campaigns.length, 1, "Fan1 should be in 1 campaign");
        assertEq(fan2Campaigns.length, 1, "Fan2 should be in 1 campaign");
    }
}