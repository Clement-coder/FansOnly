// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FansOnly.sol";

/**
 * @title DeployFansOnly
 * @notice Deployment script for FansOnly platform on Base
 * @dev Run with: forge script script/DeployFansOnly.s.sol:DeployFansOnly --rpc-url <RPC_URL> --broadcast --verify
 */
contract DeployFansOnly is Script {
    // Deployment addresses will be stored here
    FansOnlyFactory public factory;
    UserRegistry public userRegistry;
    CampaignManager public campaignManager;
    AccessControl public accessControl;
    RedemptionManager public redemptionManager;

    // Oracle address for awarding points (should be your backend service)
    address public oracleAddress;

    function setUp() public {
        // Load oracle address from environment variable
        oracleAddress = vm.envAddress("ORACLE_ADDRESS");
    }

    function run() public {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying FansOnly Platform...");
        console.log("Deployer address:", deployer);
        console.log("Oracle address:", oracleAddress);

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the factory (which deploys all other contracts)
        factory = new FansOnlyFactory();
        console.log("FansOnlyFactory deployed at:", address(factory));

        // Get references to deployed contracts
        (
            address userRegistryAddr,
            address campaignManagerAddr,
            address accessControlAddr,
            address redemptionManagerAddr
        ) = factory.getContracts();

        userRegistry = UserRegistry(userRegistryAddr);
        campaignManager = CampaignManager(campaignManagerAddr);
        accessControl = AccessControl(accessControlAddr);
        redemptionManager = RedemptionManager(payable(redemptionManagerAddr));

        console.log("UserRegistry deployed at:", address(userRegistry));
        console.log("CampaignManager deployed at:", address(campaignManager));
        console.log("AccessControl deployed at:", address(accessControl));
        console.log("RedemptionManager deployed at:", address(redemptionManager));

        // Transfer ownership of CampaignManager to oracle
        campaignManager.transferOwnership(oracleAddress);
        console.log("CampaignManager ownership transferred to oracle");

        // Transfer ownership of RedemptionManager to oracle
        redemptionManager.transferOwnership(oracleAddress);
        console.log("RedemptionManager ownership transferred to oracle");

        // Fund RedemptionManager with initial ETH for cashouts (optional)
        uint256 initialFunding = 1 ether; // Adjust as needed
        if (deployer.balance >= initialFunding) {
            (bool success, ) = address(redemptionManager).call{value: initialFunding}("");
            require(success, "Failed to fund RedemptionManager");
            console.log("RedemptionManager funded with", initialFunding / 1 ether, "ETH");
        }

        vm.stopBroadcast();

        // Save deployment addresses to file
        saveDeploymentInfo();

        console.log("\n=== Deployment Complete ===");
        console.log("Save these addresses for your frontend/backend:");
        console.log("Factory:", address(factory));
        console.log("UserRegistry:", address(userRegistry));
        console.log("CampaignManager:", address(campaignManager));
        console.log("AccessControl:", address(accessControl));
        console.log("RedemptionManager:", address(redemptionManager));
    }

    function saveDeploymentInfo() internal {
        string memory json = string(
            abi.encodePacked(
                '{\n',
                '  "network": "base",\n',
                '  "factory": "', vm.toString(address(factory)), '",\n',
                '  "userRegistry": "', vm.toString(address(userRegistry)), '",\n',
                '  "campaignManager": "', vm.toString(address(campaignManager)), '",\n',
                '  "accessControl": "', vm.toString(address(accessControl)), '",\n',
                '  "redemptionManager": "', vm.toString(address(redemptionManager)), '",\n',
                '  "oracleAddress": "', vm.toString(oracleAddress), '"\n',
                '}'
            )
        );

        vm.writeFile("./deployments/latest.json", json);
        console.log("\nDeployment info saved to ./deployments/latest.json");
    }
}

/**
 * @title DeployFansOnlyTestnet
 * @notice Deployment script for testnet with additional setup
 */
contract DeployFansOnlyTestnet is Script {
    FansOnlyFactory public factory;
    UserRegistry public userRegistry;
    CampaignManager public campaignManager;
    AccessControl public accessControl;
    RedemptionManager public redemptionManager;

    address public oracleAddress;
    address public testCreator;
    address public testFan;

    function setUp() public {
        oracleAddress = vm.envAddress("ORACLE_ADDRESS");
        
        // For testnet, we can create test accounts
        testCreator = vm.envOr("TEST_CREATOR", address(0));
        testFan = vm.envOr("TEST_FAN", address(0));
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying FansOnly Platform to TESTNET...");
        console.log("Deployer:", deployer);
        console.log("Oracle:", oracleAddress);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy factory
        factory = new FansOnlyFactory();
        console.log("FansOnlyFactory deployed at:", address(factory));
        
        // Get contract references
        (
            address userRegistryAddr,
            address campaignManagerAddr,
            address accessControlAddr,
            address redemptionManagerAddr
        ) = factory.getContracts();

        userRegistry = UserRegistry(userRegistryAddr);
        campaignManager = CampaignManager(campaignManagerAddr);
        accessControl = AccessControl(accessControlAddr);
        redemptionManager = RedemptionManager(payable(redemptionManagerAddr));

        console.log("UserRegistry deployed at:", address(userRegistry));
        console.log("CampaignManager deployed at:", address(campaignManager));
        console.log("AccessControl deployed at:", address(accessControl));
        console.log("RedemptionManager deployed at:", address(redemptionManager));

        // Don't transfer ownership - keep deployer as owner for testing
        // In production, you would transfer to oracle here
        console.log("Keeping deployer as owner for all contracts (testnet mode)");
        console.log("UserRegistry owner:", deployer);
        console.log("CampaignManager owner:", deployer);
        console.log("AccessControl owner:", deployer);
        console.log("RedemptionManager owner:", deployer);

        // Fund with more ETH for testing
        uint256 testnetFunding = 0.1 ether;
        if (deployer.balance >= testnetFunding) {
            (bool success, ) = address(redemptionManager).call{value: testnetFunding}("");
            require(success, "Failed to fund RedemptionManager");
            console.log("RedemptionManager funded with", testnetFunding / 1e15, "milli-ETH");
        } else {
            console.log("Warning: Insufficient balance to fund RedemptionManager");
            console.log("Deployer balance:", deployer.balance / 1e15, "milli-ETH");
        }

        vm.stopBroadcast();

        // Log deployment info
        console.log("\n=== TESTNET Deployment Complete ===");
        console.log("Factory:", address(factory));
        console.log("UserRegistry:", address(userRegistry));
        console.log("CampaignManager:", address(campaignManager));
        console.log("AccessControl:", address(accessControl));
        console.log("RedemptionManager:", address(redemptionManager));
        console.log("\nOracle Address (for future use):", oracleAddress);
        
        if (testCreator != address(0)) {
            console.log("Test Creator:", testCreator);
        }
        if (testFan != address(0)) {
            console.log("Test Fan:", testFan);
        }

        // Save deployment
        saveTestnetDeploymentInfo();
        
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Save the contract addresses above");
        console.log("2. Update your .env with CAMPAIGN_MANAGER_ADDRESS");
        console.log("3. To transfer ownership to oracle later, call:");
        console.log("   - campaignManager.transferOwnership(oracleAddress)");
        console.log("   - redemptionManager.transferOwnership(oracleAddress)");
    }

    function saveTestnetDeploymentInfo() internal {
        string memory json = string(
            abi.encodePacked(
                '{\n',
                '  "network": "base-sepolia",\n',
                '  "factory": "', vm.toString(address(factory)), '",\n',
                '  "userRegistry": "', vm.toString(address(userRegistry)), '",\n',
                '  "campaignManager": "', vm.toString(address(campaignManager)), '",\n',
                '  "accessControl": "', vm.toString(address(accessControl)), '",\n',
                '  "redemptionManager": "', vm.toString(address(redemptionManager)), '",\n',
                '  "oracleAddress": "', vm.toString(oracleAddress), '"\n',
                '}'
            )
        );

        vm.writeFile("./deployments/testnet.json", json);
        console.log("\nTestnet deployment info saved to ./deployments/testnet.json");
    }
}

/**
 * @title VerifyContracts
 * @notice Script to verify all deployed contracts on Basescan
 */
contract VerifyContracts is Script {
    function run() public {
        // Read deployment addresses from file
        string memory json = vm.readFile("./deployments/latest.json");
        
        console.log("Verifying contracts on Basescan...");
        console.log("Make sure you have BASESCAN_API_KEY in your .env");
        console.log("\nRun these commands manually:");
        console.log("\nforge verify-contract <FACTORY_ADDRESS> FansOnlyFactory --chain-id 8453");
        console.log("forge verify-contract <USER_REGISTRY_ADDRESS> UserRegistry --chain-id 8453");
        console.log("forge verify-contract <CAMPAIGN_MANAGER_ADDRESS> CampaignManager --chain-id 8453");
        console.log("forge verify-contract <ACCESS_CONTROL_ADDRESS> AccessControl --chain-id 8453");
        console.log("forge verify-contract <REDEMPTION_MANAGER_ADDRESS> RedemptionManager --chain-id 8453");
    }
}