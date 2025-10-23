export const CampaignManager = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_userRegistry",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addMilestone",
      "inputs": [
        { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
        { "name": "_threshold", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_rewardAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "awardPoints",
      "inputs": [
        { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
        { "name": "_fan", "type": "address", "internalType": "address" },
        { "name": "_points", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "campaignCounter",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "campaigns",
      "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "outputs": [
        { "name": "creator", "type": "address", "internalType": "address" },
        { "name": "name", "type": "string", "internalType": "string" },
        { "name": "description", "type": "string", "internalType": "string" },
        { "name": "startTime", "type": "uint256", "internalType": "uint256" },
        { "name": "endTime", "type": "uint256", "internalType": "uint256" },
        { "name": "isActive", "type": "bool", "internalType": "bool" },
        {
          "name": "totalRewardPool",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "distributedRewards",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "claimMilestoneReward",
      "inputs": [
        { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_milestoneIndex",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createCampaign",
      "inputs": [
        { "name": "_name", "type": "string", "internalType": "string" },
        { "name": "_description", "type": "string", "internalType": "string" },
        { "name": "_startTime", "type": "uint256", "internalType": "uint256" },
        { "name": "_endTime", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_totalRewardPool",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "creatorCampaigns",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "fanCampaigns",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "fanProgress",
      "inputs": [
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "points", "type": "uint256", "internalType": "uint256" },
        {
          "name": "lastClaimTime",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCampaignMilestones",
      "inputs": [
        { "name": "_campaignId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct CampaignManager.Milestone[]",
          "components": [
            {
              "name": "threshold",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "rewardAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "isActive", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCreatorCampaigns",
      "inputs": [
        { "name": "_creator", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getFanCampaigns",
      "inputs": [
        { "name": "_fan", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getFanProgress",
      "inputs": [
        { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
        { "name": "_fan", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isMilestoneClaimed",
      "inputs": [
        { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
        { "name": "_fan", "type": "address", "internalType": "address" },
        {
          "name": "_milestoneIndex",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "toggleCampaignStatus",
      "inputs": [
        { "name": "_campaignId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "userRegistry",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract UserRegistry"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "CampaignCreated",
      "inputs": [
        {
          "name": "campaignId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "name",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CampaignStatusChanged",
      "inputs": [
        {
          "name": "campaignId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "isActive",
          "type": "bool",
          "indexed": false,
          "internalType": "bool"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "MilestoneAdded",
      "inputs": [
        {
          "name": "campaignId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "milestoneIndex",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "threshold",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "reward",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PointsAwarded",
      "inputs": [
        {
          "name": "campaignId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "fan",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "points",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RewardClaimed",
      "inputs": [
        {
          "name": "campaignId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "fan",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "milestoneIndex",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "reward",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
  ]