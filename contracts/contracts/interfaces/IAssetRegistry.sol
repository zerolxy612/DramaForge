// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAssetRegistry
 * @notice 资产注册合约接口 (ERC-1155)
 * @dev 管理演员、场景、道具三类资产的注册和使用统计
 */
interface IAssetRegistry {
    enum AssetType { ACTOR, SCENE, PROP }
    
    struct Asset {
        AssetType assetType;
        address creator;             // 首次落地该资产的用户
        bytes32 metadataCid;         // 资产元数据 IPFS CID hash
        uint256 originDramaId;       // 首次出现的剧集
        uint256 originNodeId;        // 首次出现的节点
        uint256 usageCount;          // 被使用次数
        uint256 createdAt;
    }
    
    event AssetRegistered(
        uint256 indexed assetId,
        AssetType assetType,
        address indexed creator,
        uint256 indexed originDramaId,
        bytes32 metadataCid
    );
    
    event AssetUsed(
        uint256 indexed assetId,
        uint256 indexed nodeId,
        address indexed user
    );
    
    /**
     * @notice 注册单个资产
     * @param assetType 资产类型
     * @param metadataCid 资产元数据的 IPFS CID hash
     * @param originDramaId 首次出现的剧集ID
     * @param originNodeId 首次出现的节点ID
     * @return assetId 新创建的资产ID
     */
    function registerAsset(
        AssetType assetType,
        bytes32 metadataCid,
        uint256 originDramaId,
        uint256 originNodeId
    ) external returns (uint256 assetId);
    
    /**
     * @notice 批量注册资产
     * @param types 资产类型数组
     * @param metadataCids 元数据CID数组
     * @param originDramaId 首次出现的剧集ID
     * @param originNodeId 首次出现的节点ID
     * @return assetIds 新创建的资产ID数组
     */
    function batchRegisterAssets(
        AssetType[] calldata types,
        bytes32[] calldata metadataCids,
        uint256 originDramaId,
        uint256 originNodeId
    ) external returns (uint256[] memory assetIds);
    
    /**
     * @notice 增加资产使用次数
     * @param assetId 资产ID
     * @param nodeId 使用该资产的节点ID
     */
    function recordUsage(uint256 assetId, uint256 nodeId) external;
    
    /**
     * @notice 批量记录资产使用
     * @param assetIds 资产ID数组
     * @param nodeId 使用这些资产的节点ID
     */
    function batchRecordUsage(uint256[] calldata assetIds, uint256 nodeId) external;
    
    /**
     * @notice 获取资产信息
     * @param assetId 资产ID
     * @return asset 资产详情
     */
    function getAsset(uint256 assetId) external view returns (Asset memory);
    
    /**
     * @notice 按类型获取资产列表
     * @param assetType 资产类型
     * @return assetIds 该类型的资产ID列表
     */
    function getAssetsByType(AssetType assetType) external view returns (uint256[] memory);
    
    /**
     * @notice 获取用户创建的资产
     * @param creator 用户地址
     * @return assetIds 该用户创建的资产ID列表
     */
    function getAssetsByCreator(address creator) external view returns (uint256[] memory);
    
    /**
     * @notice 获取资产总数
     */
    function totalAssets() external view returns (uint256);
    
    /**
     * @notice 检查资产是否存在
     * @param assetId 资产ID
     * @return exists 是否存在
     */
    function assetExists(uint256 assetId) external view returns (bool);
}

