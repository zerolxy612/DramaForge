/**
 * 漫剧共创平台 - 核心类型定义
 */

// ============ 枚举类型 ============

export enum DramaStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export enum AssetType {
  ACTOR = 'ACTOR',
  SCENE = 'SCENE',
  PROP = 'PROP',
}

export enum BranchStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  MERGED = 'merged',
}

// ============ 剧集相关 ============

export interface Drama {
  dramaId: string;
  title: string;
  description: string;
  genesisCid: string;
  creator: `0x${string}`;
  targetDuration: number; // 秒
  currentDuration: number;
  status: DramaStatus;
  createdAt: Date;
  
  // 扩展字段（链下）
  coverImage?: string;
  tags?: string[];
  participantCount?: number;
}

// ============ 故事节点相关 ============

export interface StoryNode {
  nodeId: string;
  dramaId: string;
  parentNodeIds: string[];
  depth: number;
  
  // 确认的分镜
  confirmedFrame: FrameData;
  
  contributor: `0x${string}`;
  timestamp: Date;
  
  // 统计
  childCount: number;
  totalVisits: number;
}

export interface FrameData {
  frameCid: string;
  duration: number; // 秒，默认5
  actorIds: string[];
  sceneId: string;
  propIds: string[];
  script: string;
  
  // 媒体资源（链下）
  videoUrl?: string;
  thumbnailUrl?: string;
}

// ============ 候选分镜（链下临时数据）============

export interface CandidateFrame {
  candidateId: string;
  frameData: FrameData;
  
  // AI 生成的资产（尚未上链）
  pendingAssets: PendingAsset[];
  
  // 是否为可编辑分镜
  isEditable: boolean;
}

export interface PendingAsset {
  tempId: string;
  assetType: AssetType;
  name: string;
  metadataCid: string;
  thumbnailUrl: string;
}

// ============ 资产相关 ============

export interface Asset {
  assetId: string;
  assetType: AssetType;
  
  // 元数据
  name: string;
  description?: string;
  metadataCid: string;
  thumbnailUrl: string;
  
  // 归属
  creator: `0x${string}`;
  originDramaId: string;
  originNodeId: string;
  
  // 统计
  usageCount: number;
  createdAt: Date;
}

// ============ 分支相关 ============

export interface Branch {
  branchId: string;
  dramaId: string;
  
  nodePath: string[];
  currentNodeId: string;
  
  // 温度系统
  temperature: number; // 0-100
  participantCount: number;
  lastActiveAt: Date;
  
  status: BranchStatus;
  mergedIntoBranchId?: string;
}

// ============ 用户积分（链下）============

export interface UserPoints {
  userId: `0x${string}`;
  balance: number;
  
  dailyFreeRefresh: number;
  lastResetDate: string; // YYYY-MM-DD
  
  totalEarned: number;
  totalSpent: number;
}

// ============ 用户贡献统计 ============

export interface UserContribution {
  userId: `0x${string}`;
  
  // 节点贡献
  nodesConfirmed: number;
  
  // 资产创建
  assetsCreated: {
    actors: number;
    scenes: number;
    props: number;
  };
  
  // 剧集参与
  dramasParticipated: string[];
  
  // 空投资格分数（测试网后计算）
  airdropScore?: number;
}

// ============ API 请求/响应类型 ============

export interface GenerateFramesRequest {
  dramaId: string;
  parentNodeId: string;
}

export interface GenerateFramesResponse {
  frames: CandidateFrame[];
  customModeTriggered: boolean;
  remainingFreeRefresh: number;
}

export interface RefreshFramesRequest {
  dramaId: string;
  parentNodeId: string;
}

export interface RefreshFramesResponse {
  frames: CandidateFrame[];
  customModeTriggered: boolean;
  remainingFreeRefresh: number;
  pointsSpent: number;
}

export interface ConfirmFrameRequest {
  dramaId: string;
  parentNodeId: string;
  selectedFrame: CandidateFrame;
  signature: string;
}

export interface ConfirmFrameResponse {
  nodeId: string;
  txHash: string;
  newAssets: Asset[];
}

export interface CustomFrameRequest {
  dramaId: string;
  parentNodeId: string;
  actorIds: string[];
  sceneId: string;
  propIds: string[];
  script: string;
}

export interface CustomFrameResponse {
  frame: CandidateFrame;
  pointsSpent: number;
}

// ============ 事件类型 ============

export interface DramaCreatedEvent {
  dramaId: string;
  creator: `0x${string}`;
  title: string;
  targetDuration: number;
  blockNumber: number;
  transactionHash: string;
}

export interface NodeConfirmedEvent {
  nodeId: string;
  dramaId: string;
  contributor: `0x${string}`;
  parentNodeIds: string[];
  frameCid: string;
  duration: number;
  blockNumber: number;
  transactionHash: string;
}

export interface AssetRegisteredEvent {
  assetId: string;
  assetType: AssetType;
  creator: `0x${string}`;
  originDramaId: string;
  metadataCid: string;
  blockNumber: number;
  transactionHash: string;
}

