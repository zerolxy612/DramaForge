// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IStoryNodeRegistry
 * @notice 故事节点注册合约接口
 */
interface IStoryNodeRegistry {
    struct StoryNode {
        uint256 dramaId;
        uint256[] parentNodeIds;     // 支持 DAG，允许多父节点
        address contributor;          // 确认该节点的用户
        bytes32 frameCid;            // 分镜内容 IPFS CID hash
        uint256[] assetIds;          // 使用的资产ID列表
        uint256 duration;            // 分镜时长（秒）
        uint256 depth;               // 离根节点的距离
        uint256 timestamp;
    }
    
    event NodeConfirmed(
        uint256 indexed nodeId,
        uint256 indexed dramaId,
        address indexed contributor,
        uint256[] parentNodeIds,
        bytes32 frameCid,
        uint256 duration
    );
    
    event NodeVisited(
        uint256 indexed nodeId,
        address indexed visitor
    );
    
    /**
     * @notice 确认一个故事节点（用户选择分镜后调用）
     * @param dramaId 剧集ID
     * @param parentNodeIds 父节点ID数组（支持合流）
     * @param frameCid 分镜内容的 IPFS CID hash
     * @param assetIds 使用的资产ID列表
     * @param duration 分镜时长（秒）
     * @return nodeId 新创建的节点ID
     */
    function confirmNode(
        uint256 dramaId,
        uint256[] calldata parentNodeIds,
        bytes32 frameCid,
        uint256[] calldata assetIds,
        uint256 duration
    ) external returns (uint256 nodeId);
    
    /**
     * @notice 获取节点信息
     * @param nodeId 节点ID
     * @return node 节点详情
     */
    function getNode(uint256 nodeId) external view returns (StoryNode memory);
    
    /**
     * @notice 获取节点的所有子节点
     * @param nodeId 节点ID
     * @return childNodeIds 子节点ID数组
     */
    function getNodeChildren(uint256 nodeId) external view returns (uint256[] memory);
    
    /**
     * @notice 获取从根节点到指定节点的路径
     * @param nodeId 节点ID
     * @return path 节点ID路径数组
     */
    function getNodePath(uint256 nodeId) external view returns (uint256[] memory);
    
    /**
     * @notice 获取剧集的根节点
     * @param dramaId 剧集ID
     * @return rootNodeId 根节点ID
     */
    function getDramaRootNode(uint256 dramaId) external view returns (uint256);
    
    /**
     * @notice 获取节点总数
     */
    function totalNodes() external view returns (uint256);
    
    /**
     * @notice 获取用户贡献的节点数量
     * @param contributor 用户地址
     * @return count 贡献的节点数
     */
    function getUserContributionCount(address contributor) external view returns (uint256);
}

