// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IZoraCreatorCoin
 * @notice Interface for Zora Creator Coin Protocol
 */
interface IZoraCreatorCoin {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

/**
 * @title UserRegistry
 * @notice Manages user registration and role assignment
 */
contract UserRegistry is Ownable {
    enum UserRole { NONE, FAN, CREATOR }
    
    struct User {
        UserRole role;
        bool isRegistered;
        uint256 registeredAt;
        string profileURI; // IPFS hash or metadata URI
    }
    
    mapping(address => User) public users;
    mapping(address => address) public creatorCoinAddress; // creator => coin contract
    
    event UserRegistered(address indexed user, UserRole role, uint256 timestamp);
    event UserRoleUpdated(address indexed user, UserRole oldRole, UserRole newRole);
    event ProfileUpdated(address indexed user, string profileURI);
    event CreatorCoinLinked(address indexed creator, address coinAddress);
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    modifier onlyCreator() {
        require(users[msg.sender].role == UserRole.CREATOR, "Not a creator");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Register a new user with role selection
     */
    function registerUser(UserRole _role, string calldata _profileURI) external {
        require(!users[msg.sender].isRegistered, "Already registered");
        require(_role == UserRole.FAN || _role == UserRole.CREATOR, "Invalid role");
        
        users[msg.sender] = User({
            role: _role,
            isRegistered: true,
            registeredAt: block.timestamp,
            profileURI: _profileURI
        });
        
        emit UserRegistered(msg.sender, _role, block.timestamp);
    }
    
    /**
     * @notice Update user profile metadata
     */
    function updateProfile(string calldata _profileURI) external onlyRegistered {
        users[msg.sender].profileURI = _profileURI;
        emit ProfileUpdated(msg.sender, _profileURI);
    }
    
    /**
     * @notice Link creator coin address (called after minting on Zora)
     */
    function linkCreatorCoin(address _coinAddress) external onlyCreator {
        require(_coinAddress != address(0), "Invalid coin address");
        creatorCoinAddress[msg.sender] = _coinAddress;
        emit CreatorCoinLinked(msg.sender, _coinAddress);
    }
    
    function isRegistered(address _user) external view returns (bool) {
        return users[_user].isRegistered;
    }
    
    function getUserRole(address _user) external view returns (UserRole) {
        return users[_user].role;
    }
    
    function isCreator(address _user) external view returns (bool) {
        return users[_user].role == UserRole.CREATOR;
    }
}

/**
 * @title CampaignManager
 * @notice Manages engagement campaigns and milestone tracking
 */
contract CampaignManager is Ownable, ReentrancyGuard {
    UserRegistry public userRegistry;
    
    struct Milestone {
        uint256 threshold;
        uint256 rewardAmount;
        bool isActive;
    }
    
    struct Campaign {
        address creator;
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalRewardPool;
        uint256 distributedRewards;
        Milestone[] milestones;
    }
    
    struct FanProgress {
        uint256 points;
        uint256 lastClaimTime;
        mapping(uint256 => bool) claimedMilestones;
    }
    
    uint256 public campaignCounter;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => FanProgress)) public fanProgress;
    mapping(address => uint256[]) public creatorCampaigns;
    mapping(address => uint256[]) public fanCampaigns;
    
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string name);
    event MilestoneAdded(uint256 indexed campaignId, uint256 milestoneIndex, uint256 threshold, uint256 reward);
    event PointsAwarded(uint256 indexed campaignId, address indexed fan, uint256 points);
    event RewardClaimed(uint256 indexed campaignId, address indexed fan, uint256 milestoneIndex, uint256 reward);
    event CampaignStatusChanged(uint256 indexed campaignId, bool isActive);
    
    constructor(address _userRegistry) Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
    }
    
    modifier onlyCreator() {
        require(userRegistry.isCreator(msg.sender), "Not a creator");
        _;
    }
    
    function createCampaign(
        string calldata _name,
        string calldata _description,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _totalRewardPool
    ) external onlyCreator returns (uint256) {
        require(_endTime > _startTime, "Invalid time range");
        require(_startTime >= block.timestamp, "Start time in past");
        
        uint256 campaignId = campaignCounter++;
        
        Campaign storage campaign = campaigns[campaignId];
        campaign.creator = msg.sender;
        campaign.name = _name;
        campaign.description = _description;
        campaign.startTime = _startTime;
        campaign.endTime = _endTime;
        campaign.isActive = true;
        campaign.totalRewardPool = _totalRewardPool;
        
        creatorCampaigns[msg.sender].push(campaignId);
        
        emit CampaignCreated(campaignId, msg.sender, _name);
        return campaignId;
    }

    function addMilestone(uint256 _campaignId, uint256 _threshold, uint256 _rewardAmount) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator == msg.sender, "Not campaign creator");
        require(campaign.isActive, "Campaign not active");
        
        campaign.milestones.push(Milestone({
            threshold: _threshold,
            rewardAmount: _rewardAmount,
            isActive: true
        }));
        
        emit MilestoneAdded(_campaignId, campaign.milestones.length - 1, _threshold, _rewardAmount);
    }

    function awardPoints(uint256 _campaignId, address _fan, uint256 _points) external onlyOwner {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign not active");
        require(block.timestamp >= campaign.startTime && block.timestamp <= campaign.endTime, "Not running");
        
        FanProgress storage progress = fanProgress[_campaignId][_fan];
        
        if (progress.points == 0) {
            fanCampaigns[_fan].push(_campaignId);
        }
        
        progress.points += _points;
        emit PointsAwarded(_campaignId, _fan, _points);
    }

    function claimMilestoneReward(uint256 _campaignId, uint256 _milestoneIndex) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign not active");
        
        FanProgress storage progress = fanProgress[_campaignId][msg.sender];
        require(!progress.claimedMilestones[_milestoneIndex], "Already claimed");
        
        Milestone storage milestone = campaign.milestones[_milestoneIndex];
        require(milestone.isActive, "Milestone not active");
        require(progress.points >= milestone.threshold, "Insufficient points");
        
        progress.claimedMilestones[_milestoneIndex] = true;
        progress.lastClaimTime = block.timestamp;
        campaign.distributedRewards += milestone.rewardAmount;
        
        address coinAddress = userRegistry.creatorCoinAddress(campaign.creator);
        require(coinAddress != address(0), "Creator coin not set");
        
        IZoraCreatorCoin(coinAddress).mint(msg.sender, milestone.rewardAmount);
        
        emit RewardClaimed(_campaignId, msg.sender, _milestoneIndex, milestone.rewardAmount);
    }

    function toggleCampaignStatus(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator == msg.sender, "Not campaign creator");
        campaign.isActive = !campaign.isActive;
        emit CampaignStatusChanged(_campaignId, campaign.isActive);
    }

    function getFanProgress(uint256 _campaignId, address _fan) external view returns (uint256, uint256) {
        FanProgress storage progress = fanProgress[_campaignId][_fan];
        return (progress.points, progress.lastClaimTime);
    }

    function isMilestoneClaimed(uint256 _campaignId, address _fan, uint256 _milestoneIndex) external view returns (bool) {
        return fanProgress[_campaignId][_fan].claimedMilestones[_milestoneIndex];
    }

    function getCampaignMilestones(uint256 _campaignId) external view returns (Milestone[] memory) {
        return campaigns[_campaignId].milestones;
    }

    function getCreatorCampaigns(address _creator) external view returns (uint256[] memory) {
        return creatorCampaigns[_creator];
    }

    function getFanCampaigns(address _fan) external view returns (uint256[] memory) {
        return fanCampaigns[_fan];
    }
}

/**
 * @title AccessControl
 * @notice Manages gated content and experience eligibility
 */
contract AccessControl is Ownable {
    UserRegistry public userRegistry;
    
    struct AccessTier {
        string name;
        uint256 coinThreshold;
        uint256 pointThreshold;
        bool isActive;
        string contentURI;
    }
    
    mapping(address => AccessTier[]) public creatorAccessTiers;
    mapping(address => mapping(uint256 => bool)) public hasAccess;
    
    event AccessTierCreated(address indexed creator, uint256 tierId, string name, uint256 coinThreshold);
    event AccessGranted(address indexed user, address indexed creator, uint256 tierId);
    event AccessRevoked(address indexed user, address indexed creator, uint256 tierId);
    
    constructor(address _userRegistry) Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
    }
    
    modifier onlyCreator() {
        require(userRegistry.isCreator(msg.sender), "Not a creator");
        _;
    }
    
    function createAccessTier(
        string calldata _name,
        uint256 _coinThreshold,
        uint256 _pointThreshold,
        string calldata _contentURI
    ) external onlyCreator returns (uint256) {
        AccessTier memory tier = AccessTier({
            name: _name,
            coinThreshold: _coinThreshold,
            pointThreshold: _pointThreshold,
            isActive: true,
            contentURI: _contentURI
        });
        
        creatorAccessTiers[msg.sender].push(tier);
        uint256 tierId = creatorAccessTiers[msg.sender].length - 1;
        
        emit AccessTierCreated(msg.sender, tierId, _name, _coinThreshold);
        return tierId;
    }
    
    function checkAccess(address _creator, address _user, uint256 _tierId) external view returns (bool) {
        AccessTier[] storage tiers = creatorAccessTiers[_creator];
        require(_tierId < tiers.length, "Invalid tier");
        
        AccessTier storage tier = tiers[_tierId];
        if (!tier.isActive) return false;
        
        address coinAddress = userRegistry.creatorCoinAddress(_creator);
        if (coinAddress != address(0)) {
            uint256 coinBalance = IZoraCreatorCoin(coinAddress).balanceOf(_user);
            if (coinBalance >= tier.coinThreshold) {
                return true;
            }
        }
        
        return false;
    }
    
    function getCreatorTiers(address _creator) external view returns (AccessTier[] memory) {
        return creatorAccessTiers[_creator];
    }
    
    function updateTierStatus(uint256 _tierId, bool _isActive) external onlyCreator {
        require(_tierId < creatorAccessTiers[msg.sender].length, "Invalid tier");
        creatorAccessTiers[msg.sender][_tierId].isActive = _isActive;
    }
}

/**
 * @title RedemptionManager
 * @notice Handles point-to-coin conversions and coin redemptions
 */
contract RedemptionManager is Ownable, ReentrancyGuard {
    UserRegistry public userRegistry;
    CampaignManager public campaignManager;
    
    struct RedemptionRate {
        uint256 pointsPerCoin;
        bool isActive;
    }
    
    struct CashoutRequest {
        address user;
        address creator;
        uint256 coinAmount;
        uint256 ethValue;
        bool processed;
        uint256 timestamp;
    }
    
    mapping(address => RedemptionRate) public creatorRedemptionRates;
    mapping(address => uint256) public platformPoints;
    uint256 public cashoutCounter;
    mapping(uint256 => CashoutRequest) public cashoutRequests;
    
    event RedemptionRateSet(address indexed creator, uint256 pointsPerCoin);
    event PointsConverted(address indexed user, address indexed creator, uint256 points, uint256 coins);
    event CashoutRequested(uint256 indexed requestId, address indexed user, uint256 coinAmount);
    event CashoutProcessed(uint256 indexed requestId, address indexed user, uint256 ethAmount);
    
    constructor(address _userRegistry, address _campaignManager) Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
        campaignManager = CampaignManager(_campaignManager);
    }
    
    modifier onlyCreator() {
        require(userRegistry.isCreator(msg.sender), "Not a creator");
        _;
    }
    
    function setRedemptionRate(uint256 _pointsPerCoin) external onlyCreator {
        require(_pointsPerCoin > 0, "Invalid rate");
        
        creatorRedemptionRates[msg.sender] = RedemptionRate({
            pointsPerCoin: _pointsPerCoin,
            isActive: true
        });
        
        emit RedemptionRateSet(msg.sender, _pointsPerCoin);
    }
    
    function convertPointsToCoins(address _creator, uint256 _points) external nonReentrant {
        require(userRegistry.isRegistered(msg.sender), "Not registered");
        require(platformPoints[msg.sender] >= _points, "Insufficient points");
        
        RedemptionRate storage rate = creatorRedemptionRates[_creator];
        require(rate.isActive, "Redemption not active");
        
        uint256 coinsToMint = _points / rate.pointsPerCoin;
        require(coinsToMint > 0, "Insufficient points for conversion");
        
        platformPoints[msg.sender] -= _points;
        
        address coinAddress = userRegistry.creatorCoinAddress(_creator);
        require(coinAddress != address(0), "Creator coin not set");
        
        IZoraCreatorCoin(coinAddress).mint(msg.sender, coinsToMint);
        
        emit PointsConverted(msg.sender, _creator, _points, coinsToMint);
    }
    
    function awardPlatformPoints(address _user, uint256 _points) external onlyOwner {
        platformPoints[_user] += _points;
    }
    
    function requestCashout(address _creator, uint256 _coinAmount) external nonReentrant returns (uint256) {
        address coinAddress = userRegistry.creatorCoinAddress(_creator);
        require(coinAddress != address(0), "Creator coin not set");
        
        uint256 balance = IZoraCreatorCoin(coinAddress).balanceOf(msg.sender);
        require(balance >= _coinAmount, "Insufficient coins");
        
        uint256 requestId = cashoutCounter++;
        
        cashoutRequests[requestId] = CashoutRequest({
            user: msg.sender,
            creator: _creator,
            coinAmount: _coinAmount,
            ethValue: 0,
            processed: false,
            timestamp: block.timestamp
        });
        
        IZoraCreatorCoin(coinAddress).burn(msg.sender, _coinAmount);
        
        emit CashoutRequested(requestId, msg.sender, _coinAmount);
        return requestId;
    }
    
    function processCashout(uint256 _requestId, uint256 _ethValue) external onlyOwner nonReentrant {
        CashoutRequest storage request = cashoutRequests[_requestId];
        require(!request.processed, "Already processed");
        require(_ethValue <= address(this).balance, "Insufficient balance");
        
        request.ethValue = _ethValue;
        request.processed = true;
        
        (bool success, ) = request.user.call{value: _ethValue}("");
        require(success, "ETH transfer failed");
        
        emit CashoutProcessed(_requestId, request.user, _ethValue);
    }
    
    function getPlatformPoints(address _user) external view returns (uint256) {
        return platformPoints[_user];
    }
    
    receive() external payable {}
}


/**
 * @title FansOnlyFactory
 * @notice Deploys and connects all platform contracts
 */
contract FansOnlyFactory is Ownable {
    UserRegistry public userRegistry;
    CampaignManager public campaignManager;
    AccessControl public accessControl;
    RedemptionManager public redemptionManager;
    
    event PlatformDeployed(
        address userRegistry,
        address campaignManager,
        address accessControl,
        address redemptionManager
    );
    
    constructor() Ownable(msg.sender) {
        userRegistry = new UserRegistry();
        campaignManager = new CampaignManager(address(userRegistry));
        accessControl = new AccessControl(address(userRegistry));
        redemptionManager = new RedemptionManager(address(userRegistry), address(campaignManager));
        
        emit PlatformDeployed(
            address(userRegistry),
            address(campaignManager),
            address(accessControl),
            address(redemptionManager)
        );
    }
    
    function getContracts() external view returns (
        address _userRegistry,
        address _campaignManager,
        address _accessControl,
        address _redemptionManager
    ) {
        return (
            address(userRegistry),
            address(campaignManager),
            address(accessControl),
            address(redemptionManager)
        );
    }
    
    /**
     * @notice Transfer ownership of all contracts to a new owner
     * @dev Only callable by the factory owner
     */
    function transferAllOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        userRegistry.transferOwnership(newOwner);
        campaignManager.transferOwnership(newOwner);
        accessControl.transferOwnership(newOwner);
        redemptionManager.transferOwnership(newOwner);
    }
    
    /**
     * @notice Transfer ownership of individual contracts
     */
    function transferUserRegistryOwnership(address newOwner) external onlyOwner {
        userRegistry.transferOwnership(newOwner);
    }
    
    function transferCampaignManagerOwnership(address newOwner) external onlyOwner {
        campaignManager.transferOwnership(newOwner);
    }
    
    function transferAccessControlOwnership(address newOwner) external onlyOwner {
        accessControl.transferOwnership(newOwner);
    }
    
    function transferRedemptionManagerOwnership(address newOwner) external onlyOwner {
        redemptionManager.transferOwnership(newOwner);
    }
}