// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "openzeppelin-solidity/access/Ownable.sol";
import "openzeppelin-solidity/utils/ReentrancyGuard.sol";
import "./interfaces/IStoryNodeRegistry.sol";
import "./interfaces/IDramaHub.sol";
import "./interfaces/IAssetRegistry.sol";

/**
 * @title StoryNodeRegistry
 * @notice 故事节点注册合约
 * @dev 管理故事节点的创建和树状结构
 */
contract StoryNodeRegistry is IStoryNodeRegistry, Ownable, ReentrancyGuard {
    // 存储所有节点
    StoryNode[] private _nodes;
    
    // 关联合约
    IDramaHub public dramaHub;
    IAssetRegistry public assetRegistry;
    
    // 剧集的根节点
    mapping(uint256 => uint256) private _dramaRootNodes;
    
    // 节点的子节点列表
    mapping(uint256 => uint256[]) private _nodeChildren;
    
    // 用户贡献统计
    mapping(address => uint256[]) private _userContributions;
    
    // 节点访问计数
    mapping(uint256 => uint256) private _nodeVisits;
    
    modifier nodeExists(uint256 nodeId) {
        require(nodeId < _nodes.length, "StoryNodeRegistry: node does not exist");
        _;
    }
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @notice 设置关联合约地址
     */
    function setContracts(address _dramaHub, address _assetRegistry) external onlyOwner {
        require(_dramaHub != address(0) && _assetRegistry != address(0), "Invalid address");
        dramaHub = IDramaHub(_dramaHub);
        assetRegistry = IAssetRegistry(_assetRegistry);
    }
    
    /**
     * @inheritdoc IStoryNodeRegistry
     */
    function confirmNode(
        uint256 dramaId,
        uint256[] calldata parentNodeIds,
        bytes32 frameCid,
        uint256[] calldata assetIds,
        uint256 duration
    ) external nonReentrant returns (uint256 nodeId) {
        // 验证剧集存在
        IDramaHub.Drama memory drama = dramaHub.getDrama(dramaId);
        require(drama.status == IDramaHub.DramaStatus.ONGOING, "Drama not ongoing");
        
        // 验证资产存在
        for (uint256 i = 0; i < assetIds.length; i++) {
            require(assetRegistry.assetExists(assetIds[i]), "Asset does not exist");
        }
        
        // 计算深度
        uint256 depth = 0;
        if (parentNodeIds.length > 0) {
            // 验证父节点存在且属于同一剧集
            for (uint256 i = 0; i < parentNodeIds.length; i++) {
                require(parentNodeIds[i] < _nodes.length, "Parent node does not exist");
                require(_nodes[parentNodeIds[i]].dramaId == dramaId, "Parent not in same drama");
                
                // 取最大深度 + 1
                if (_nodes[parentNodeIds[i]].depth >= depth) {
                    depth = _nodes[parentNodeIds[i]].depth + 1;
                }
            }
        } else {
            // 这是根节点
            require(_dramaRootNodes[dramaId] == 0 || _nodes.length == 0, "Root already exists");
        }
        
        nodeId = _nodes.length;
        
        // 创建节点
        _nodes.push(StoryNode({
            dramaId: dramaId,
            parentNodeIds: parentNodeIds,
            contributor: msg.sender,
            frameCid: frameCid,
            assetIds: assetIds,
            duration: duration,
            depth: depth,
            timestamp: block.timestamp
        }));
        
        // 如果是根节点，记录
        if (parentNodeIds.length == 0) {
            _dramaRootNodes[dramaId] = nodeId;
        }
        
        // 更新父节点的子节点列表
        for (uint256 i = 0; i < parentNodeIds.length; i++) {
            _nodeChildren[parentNodeIds[i]].push(nodeId);
        }
        
        // 记录用户贡献
        _userContributions[msg.sender].push(nodeId);
        
        // 记录资产使用
        if (assetIds.length > 0) {
            assetRegistry.batchRecordUsage(assetIds, nodeId);
        }
        
        // 更新剧集时长
        dramaHub.updateDuration(dramaId, duration);
        
        emit NodeConfirmed(nodeId, dramaId, msg.sender, parentNodeIds, frameCid, duration);
    }
    
    /**
     * @inheritdoc IStoryNodeRegistry
     */
    function getNode(uint256 nodeId) external view nodeExists(nodeId) returns (StoryNode memory) {
        return _nodes[nodeId];
    }
    
    /**
     * @inheritdoc IStoryNodeRegistry
     */
    function getNodeChildren(uint256 nodeId) external view nodeExists(nodeId) returns (uint256[] memory) {
        return _nodeChildren[nodeId];
    }
    
    /**
     * @inheritdoc IStoryNodeRegistry
     */
    function getNodePath(uint256 nodeId) external view nodeExists(nodeId) returns (uint256[] memory) {
        // 计算路径长度
        uint256 pathLength = _nodes[nodeId].depth + 1;
        uint256[] memory path = new uint256[](pathLength);
        
        // 从当前节点回溯到根
        uint256 currentId = nodeId;
        for (uint256 i = pathLength; i > 0; i--) {
            path[i - 1] = currentId;
            if (_nodes[currentId].parentNodeIds.length > 0) {
                currentId = _nodes[currentId].parentNodeIds[0]; // 取第一个父节点
            }
        }
        
        return path;
    }
    
    /**
     * @inheritdoc IStoryNodeRegistry
     */
    function getDramaRootNode(uint256 dramaId) external view returns (uint256) {
        return _dramaRootNodes[dramaId];
    }
    
    /**
     * @inheritdoc IStoryNodeRegistry
     */
    function totalNodes() external view returns (uint256) {
        return _nodes.length;
    }
    
    /**
     * @inheritdoc IStoryNodeRegistry
     */
    function getUserContributionCount(address contributor) external view returns (uint256) {
        return _userContributions[contributor].length;
    }
    
    /**
     * @notice 获取用户贡献的所有节点
     */
    function getUserContributions(address contributor) external view returns (uint256[] memory) {
        return _userContributions[contributor];
    }
    
    /**
     * @notice 记录节点访问
     */
    function recordVisit(uint256 nodeId) external nodeExists(nodeId) {
        _nodeVisits[nodeId]++;
        emit NodeVisited(nodeId, msg.sender);
    }
    
    /**
     * @notice 获取节点访问次数
     */
    function getNodeVisits(uint256 nodeId) external view nodeExists(nodeId) returns (uint256) {
        return _nodeVisits[nodeId];
    }
}

