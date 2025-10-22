 // src/PointsOracle.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

contract PointsOracle is AutomationCompatibleInterface {
    address public immutable campaignManager;
    uint256 public lastAwarded;
    uint256 public constant INTERVAL = 5 minutes;

    uint256 public campaignId;
    address public fan;
    uint256 public points;

    constructor(address _campaignManager, uint256 _campaignId, address _fan, uint256 _points) {
        campaignManager = _campaignManager;
        campaignId = _campaignId;
        fan = _fan;
        points = _points;
    }

    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp - lastAwarded) >= INTERVAL;
        if (upkeepNeeded) {
            performData = abi.encode(campaignId, fan, points);
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        (uint256 cid, address f, uint256 p) = abi.decode(performData, (uint256, address, uint256));
        require(block.timestamp - lastAwarded >= INTERVAL, "Too soon");
        lastAwarded = block.timestamp;

        (bool success, ) = campaignManager.call(
            abi.encodeWithSignature("awardPoints(uint256,address,uint256)", cid, f, p)
        );
        require(success, "awardPoints failed");
    }
}