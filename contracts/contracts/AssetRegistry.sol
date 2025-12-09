// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "openzeppelin-solidity/token/ERC1155/ERC1155.sol";
import "openzeppelin-solidity/access/Ownable.sol";
import "openzeppelin-solidity/utils/ReentrancyGuard.sol";
import "./interfaces/IAssetRegistry.sol";

/**
 * @title AssetRegistry
 * @notice 资产注册合约 (ERC-1155)
 * @dev 管理演员、场景、道具三类资产的注册和使用统计
 */
contract AssetRegistry is IAssetRegistry, ERC1155, Ownable, ReentrancyGuard {
    // 存储所有资产
    Asset[] private _assets;
    
    // 授权的节点注册合约
    address public storyNodeRegistry;
    
    // 按类型索引资产
    mapping(AssetType => uint256[]) private _assetsByType;
    
    // 按创建者索引资产
    mapping(address => uint256[]) private _assetsByCreator;
    
    // 资产元数据CID到ID的映射（防止重复注册）
    mapping(bytes32 => uint256) private _cidToAssetId;
    
    modifier onlyStoryNodeRegistry() {
        require(
            msg.sender == storyNodeRegistry || msg.sender == owner(),
            "AssetRegistry: caller not authorized"
        );
        _;
    }
    
    modifier assetExistsModifier(uint256 assetId) {
        require(assetId < _assets.length, "AssetRegistry: asset does not exist");
        _;
    }
    
    constructor(
        address initialOwner,
        string memory uri_
    ) ERC1155(uri_) Ownable(initialOwner) {}
    
    /**
     * @notice 设置故事节点注册合约地址
     */
    function setStoryNodeRegistry(address _storyNodeRegistry) external onlyOwner {
        require(_storyNodeRegistry != address(0), "Invalid address");
        storyNodeRegistry = _storyNodeRegistry;
    }
    
    /**
     * @notice 更新基础 URI
     */
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function registerAsset(
        AssetType assetType,
        bytes32 metadataCid,
        uint256 originDramaId,
        uint256 originNodeId
    ) external nonReentrant returns (uint256 assetId) {
        // 检查是否已注册
        require(_cidToAssetId[metadataCid] == 0 || _assets.length == 0, "Asset already registered");
        
        assetId = _assets.length;
        
        _assets.push(Asset({
            assetType: assetType,
            creator: msg.sender,
            metadataCid: metadataCid,
            originDramaId: originDramaId,
            originNodeId: originNodeId,
            usageCount: 1, // 首次使用
            createdAt: block.timestamp
        }));
        
        // 更新索引
        _assetsByType[assetType].push(assetId);
        _assetsByCreator[msg.sender].push(assetId);
        _cidToAssetId[metadataCid] = assetId + 1; // +1 避免0值歧义
        
        // Mint ERC1155 token 给创建者
        _mint(msg.sender, assetId, 1, "");
        
        emit AssetRegistered(assetId, assetType, msg.sender, originDramaId, metadataCid);
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function batchRegisterAssets(
        AssetType[] calldata types,
        bytes32[] calldata metadataCids,
        uint256 originDramaId,
        uint256 originNodeId
    ) external nonReentrant returns (uint256[] memory assetIds) {
        require(types.length == metadataCids.length, "Array length mismatch");
        require(types.length > 0, "Empty arrays");
        
        assetIds = new uint256[](types.length);
        
        for (uint256 i = 0; i < types.length; i++) {
            // 检查是否已注册
            if (_cidToAssetId[metadataCids[i]] != 0) {
                // 已存在，返回现有ID
                assetIds[i] = _cidToAssetId[metadataCids[i]] - 1;
                continue;
            }
            
            uint256 assetId = _assets.length;
            assetIds[i] = assetId;
            
            _assets.push(Asset({
                assetType: types[i],
                creator: msg.sender,
                metadataCid: metadataCids[i],
                originDramaId: originDramaId,
                originNodeId: originNodeId,
                usageCount: 1,
                createdAt: block.timestamp
            }));
            
            _assetsByType[types[i]].push(assetId);
            _assetsByCreator[msg.sender].push(assetId);
            _cidToAssetId[metadataCids[i]] = assetId + 1;
            
            _mint(msg.sender, assetId, 1, "");
            
            emit AssetRegistered(assetId, types[i], msg.sender, originDramaId, metadataCids[i]);
        }
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function recordUsage(
        uint256 assetId, 
        uint256 nodeId
    ) external onlyStoryNodeRegistry assetExistsModifier(assetId) {
        _assets[assetId].usageCount++;
        emit AssetUsed(assetId, nodeId, tx.origin);
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function batchRecordUsage(
        uint256[] calldata assetIds, 
        uint256 nodeId
    ) external onlyStoryNodeRegistry {
        for (uint256 i = 0; i < assetIds.length; i++) {
            if (assetIds[i] < _assets.length) {
                _assets[assetIds[i]].usageCount++;
                emit AssetUsed(assetIds[i], nodeId, tx.origin);
            }
        }
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function getAsset(uint256 assetId) external view assetExistsModifier(assetId) returns (Asset memory) {
        return _assets[assetId];
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function getAssetsByType(AssetType assetType) external view returns (uint256[] memory) {
        return _assetsByType[assetType];
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function getAssetsByCreator(address creator) external view returns (uint256[] memory) {
        return _assetsByCreator[creator];
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function totalAssets() external view returns (uint256) {
        return _assets.length;
    }
    
    /**
     * @inheritdoc IAssetRegistry
     */
    function assetExists(uint256 assetId) external view returns (bool) {
        return assetId < _assets.length;
    }
    
    /**
     * @notice 通过 CID 获取资产ID
     */
    function getAssetIdByCid(bytes32 metadataCid) external view returns (uint256) {
        uint256 id = _cidToAssetId[metadataCid];
        require(id > 0, "Asset not found");
        return id - 1;
    }
    
    /**
     * @notice 获取热门资产（按使用次数排序的前N个）
     * @dev 简化实现，实际生产环境建议链下排序
     */
    function getTopAssets(AssetType assetType, uint256 limit) external view returns (uint256[] memory) {
        uint256[] storage typeAssets = _assetsByType[assetType];
        uint256 count = typeAssets.length < limit ? typeAssets.length : limit;
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = typeAssets[typeAssets.length - 1 - i]; // 最新的
        }
        return result;
    }
}

