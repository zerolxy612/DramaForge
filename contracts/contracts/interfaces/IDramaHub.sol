// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IDramaHub
 * @notice 剧集管理主合约接口
 */
interface IDramaHub {
    enum DramaStatus { ONGOING, COMPLETED }
    
    struct Drama {
        address creator;
        string title;
        string genesisCid;           // 初始设定 IPFS CID
        uint256 targetDuration;      // 目标时长（秒）
        uint256 currentDuration;     // 当前累计时长
        DramaStatus status;
        uint256 createdAt;
    }
    
    event DramaCreated(
        uint256 indexed dramaId,
        address indexed creator,
        string title,
        uint256 targetDuration
    );
    
    event DramaProgressUpdated(
        uint256 indexed dramaId,
        uint256 addedDuration,
        uint256 newTotalDuration
    );
    
    event DramaCompleted(
        uint256 indexed dramaId,
        uint256 finalDuration,
        uint256 completedAt
    );
    
    /**
     * @notice 创建新剧集
     * @param title 剧集标题
     * @param genesisCid 初始设定的 IPFS CID
     * @param targetDuration 目标时长（秒）
     * @return dramaId 新创建的剧集ID
     */
    function createDrama(
        string calldata title,
        string calldata genesisCid,
        uint256 targetDuration
    ) external returns (uint256 dramaId);
    
    /**
     * @notice 更新剧集时长（由 StoryNodeRegistry 调用）
     * @param dramaId 剧集ID
     * @param addedDuration 新增时长（秒）
     */
    function updateDuration(uint256 dramaId, uint256 addedDuration) external;
    
    /**
     * @notice 标记剧集完成
     * @param dramaId 剧集ID
     */
    function completeDrama(uint256 dramaId) external;
    
    /**
     * @notice 获取剧集信息
     * @param dramaId 剧集ID
     * @return drama 剧集详情
     */
    function getDrama(uint256 dramaId) external view returns (Drama memory);
    
    /**
     * @notice 获取剧集总数
     */
    function totalDramas() external view returns (uint256);
}



