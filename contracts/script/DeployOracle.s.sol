// script/DeployOracle.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/PointsOracle.sol";

contract DeployOracle is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address campaignManager = vm.envAddress("CAMPAIGN_MANAGER_ADDRESS");
        address fan = vm.envAddress("FAN_ADDRESS");

        vm.startBroadcast(deployerKey);

        PointsOracle oracle = new PointsOracle(
            campaignManager,
            0,        // campaignId
            fan,      // fan address
            10        // 10 points
        );

        console.log("PointsOracle deployed at:", address(oracle));

        vm.stopBroadcast();
    }
}