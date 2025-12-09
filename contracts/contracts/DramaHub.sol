// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "openzeppelin-solidity/access/Ownable.sol";
import "openzeppelin-solidity/utils/ReentrancyGuard.sol";
import "./interfaces/IDramaHub.sol";

/**
 * @title DramaHub
 * @notice 剧集管理主合约
 * @dev 管理剧集的创建、进度更新和完成状态
 */
contract DramaHub is IDramaHub, Ownable, ReentrancyGuard {
    // 存储所有剧集
    Drama[] private _dramas;
    
    // 授权的节点注册合约地址
    address public storyNodeRegistry;
    
    // 用户创建的剧集
    mapping(address => uint256[]) private _userDramas;
    
    modifier onlyStoryNodeRegistry() {
        require(msg.sender == storyNodeRegistry, "DramaHub: caller is not StoryNodeRegistry");
        _;
    }
    
    modifier dramaExists(uint256 dramaId) {
        require(dramaId < _dramas.length, "DramaHub: drama does not exist");
        _;
    }
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @notice 设置故事节点注册合约地址
     * @param _storyNodeRegistry 节点注册合约地址
     */
    function setStoryNodeRegistry(address _storyNodeRegistry) external onlyOwner {
        require(_storyNodeRegistry != address(0), "DramaHub: invalid address");
        storyNodeRegistry = _storyNodeRegistry;
    }
    
    /**
     * @inheritdoc IDramaHub
     */
    function createDrama(
        string calldata title,
        string calldata genesisCid,
        uint256 targetDuration
    ) external nonReentrant returns (uint256 dramaId) {
        require(bytes(title).length > 0, "DramaHub: title cannot be empty");
        require(bytes(genesisCid).length > 0, "DramaHub: genesisCid cannot be empty");
        require(targetDuration > 0, "DramaHub: targetDuration must be positive");
        
        dramaId = _dramas.length;
        
        _dramas.push(Drama({
            creator: msg.sender,
            title: title,
            genesisCid: genesisCid,
            targetDuration: targetDuration,
            currentDuration: 0,
            status: DramaStatus.ONGOING,
            createdAt: block.timestamp
        }));
        
        _userDramas[msg.sender].push(dramaId);
        
        emit DramaCreated(dramaId, msg.sender, title, targetDuration);
    }
    
    /**
     * @inheritdoc IDramaHub
     */
    function updateDuration(
        uint256 dramaId, 
        uint256 addedDuration
    ) external onlyStoryNodeRegistry dramaExists(dramaId) {
        Drama storage drama = _dramas[dramaId];
        require(drama.status == DramaStatus.ONGOING, "DramaHub: drama already completed");
        
        drama.currentDuration += addedDuration;
        
        emit DramaProgressUpdated(dramaId, addedDuration, drama.currentDuration);
        
        // 自动完成检查
        if (drama.currentDuration >= drama.targetDuration) {
            _completeDrama(dramaId);
        }
    }
    
    /**
     * @inheritdoc IDramaHub
     */
    function completeDrama(uint256 dramaId) external dramaExists(dramaId) {
        Drama storage drama = _dramas[dramaId];
        require(
            msg.sender == drama.creator || msg.sender == owner(),
            "DramaHub: not authorized"
        );
        require(drama.status == DramaStatus.ONGOING, "DramaHub: drama already completed");
        
        _completeDrama(dramaId);
    }
    
    /**
     * @notice 内部完成剧集逻辑
     */
    function _completeDrama(uint256 dramaId) internal {
        Drama storage drama = _dramas[dramaId];
        drama.status = DramaStatus.COMPLETED;
        
        emit DramaCompleted(dramaId, drama.currentDuration, block.timestamp);
    }
    
    /**
     * @inheritdoc IDramaHub
     */
    function getDrama(uint256 dramaId) external view dramaExists(dramaId) returns (Drama memory) {
        return _dramas[dramaId];
    }
    
    /**
     * @inheritdoc IDramaHub
     */
    function totalDramas() external view returns (uint256) {
        return _dramas.length;
    }
    
    /**
     * @notice 获取用户创建的剧集列表
     * @param user 用户地址
     * @return dramaIds 剧集ID列表
     */
    function getUserDramas(address user) external view returns (uint256[] memory) {
        return _userDramas[user];
    }
    
    /**
     * @notice 获取剧集完成进度百分比
     * @param dramaId 剧集ID
     * @return progress 进度百分比 (0-100)
     */
    function getDramaProgress(uint256 dramaId) external view dramaExists(dramaId) returns (uint256) {
        Drama storage drama = _dramas[dramaId];
        if (drama.targetDuration == 0) return 0;
        
        uint256 progress = (drama.currentDuration * 100) / drama.targetDuration;
        return progress > 100 ? 100 : progress;
    }
}

