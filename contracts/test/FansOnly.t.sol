// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FansOnly.sol";

contract FansOnlyTest is Test {
    FansOnlyFactory fansOnlyFactory;
    UserRegistry userRegistry;
    CampaignManager campaignManager;
    AccessControl accessControl;
    RedemptionManager redemptionManager;

    address owner = makeAddr("owner");
    address creator = makeAddr("creator");
    address fan = makeAddr("fan");

    function setUp() public {
        // Deploy the main factory
        fansOnlyFactory = new FansOnlyFactory();

        // Get references to deployed contracts
        (address u, address c, address a, address r) = fansOnlyFactory.getContracts();
        userRegistry = UserRegistry(u);
        campaignManager = CampaignManager(c);
        accessControl = AccessControl(a);
        redemptionManager = RedemptionManager(payable(r)); // ✅ fixed explicit cast
    }

    // =========== USER TESTS ===========
    function testRegisterUserAsCreator() public {
        vm.prank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");
        (UserRegistry.UserRole role, bool isRegistered,,) = userRegistry.users(creator);
        assertTrue(isRegistered);
        assertEq(uint(role), uint(UserRegistry.UserRole.CREATOR));
    }

    function testRegisterUserAsFan() public {
        vm.prank(fan);
        userRegistry.registerUser(UserRegistry.UserRole.FAN, "ipfs://fan");
        (UserRegistry.UserRole role, bool isRegistered,,) = userRegistry.users(fan);
        assertTrue(isRegistered);
        assertEq(uint(role), uint(UserRegistry.UserRole.FAN));
    }

    // =========== CAMPAIGN TESTS ===========
    function testCreateCampaign() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");

        uint256 campaignId = campaignManager.createCampaign(
            "Launch",
            "First campaign",
            block.timestamp + 10,
            block.timestamp + 1000,
            100 ether
        );

        vm.stopPrank();

        (address creatorAddr, string memory name,,,,,,) = campaignManager.campaigns(campaignId);
        assertEq(creatorAddr, creator);
        assertEq(name, "Launch");
    }

    // =========== ACCESS CONTROL TESTS ===========
    function testCreateAccessTier() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");

        uint256 tierId = accessControl.createAccessTier(
            "Gold",
            100,
            0,
            "ipfs://content"
        );

        vm.stopPrank();

        AccessControl.AccessTier[] memory tiers = accessControl.getCreatorTiers(creator);
        assertEq(tiers[tierId].name, "Gold");
        assertEq(tiers[tierId].coinThreshold, 100);
    }

    // =========== REDEMPTION TESTS ===========
    function testSetRedemptionRate() public {
        vm.startPrank(creator);
        userRegistry.registerUser(UserRegistry.UserRole.CREATOR, "ipfs://creator");

        redemptionManager.setRedemptionRate(10);
        vm.stopPrank();

        (uint256 rate, bool active) = redemptionManager.creatorRedemptionRates(creator);
        assertEq(rate, 10);
        assertTrue(active);
    }
}
