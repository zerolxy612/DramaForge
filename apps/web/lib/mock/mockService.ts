/**
 * Mock Service - 模拟后端 API 行为
 * 包含延迟、随机触发、状态管理等
 */

import {
  DEMO_DRAMA,
  DEMO_USER_POINTS,
  STORY_NODES,
  CANDIDATE_FRAMES,
  CHOICE_TO_NODE,
  DEMO_ASSETS,
  getAssetById,
  getAssetsByType,
} from './demo-data';
import type { 
  Drama, 
  StoryNode, 
  CandidateFrame, 
  UserPoints, 
  Asset, 
  AssetType 
} from '../types';

// ============================================================
// ⚙️ 配置
// ============================================================

const CONFIG = {
  // API 延迟模拟 (ms)
  API_DELAY: {
    MIN: 800,
    MAX: 1500,
  },
  // 自定义模式触发概率
  CUSTOM_MODE_CHANCE: 0.3, // 30% (演示用，原为 0.1)
  // 每日免费刷新次数
  DAILY_FREE_REFRESH: 10,
  // 积分规则
  POINTS: {
    CONFIRM_NODE: 10,
    CREATE_ASSET: 5,
    WATCH_AD: 2,
    REFRESH_COST: 5,
    SKIP_AD_COST: 3,
    CUSTOM_FRAME_COST: 10,
  },
};

// ============================================================
// 🎲 工具函数
// ============================================================

/**
 * 模拟 API 延迟
 */
async function simulateDelay(minMs?: number, maxMs?: number): Promise<void> {
  const min = minMs ?? CONFIG.API_DELAY.MIN;
  const max = maxMs ?? CONFIG.API_DELAY.MAX;
  const delay = Math.random() * (max - min) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * 随机决定是否触发自定义模式
 */
function shouldTriggerCustomMode(): boolean {
  return Math.random() < CONFIG.CUSTOM_MODE_CHANCE;
}

/**
 * 深拷贝对象
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================
// 📦 Mock Session State (模拟用户会话)
// ============================================================

interface MockSessionState {
  currentDrama: Drama;
  currentNode: StoryNode;
  nodePath: StoryNode[];
  userPoints: UserPoints;
  totalDuration: number;
}

let sessionState: MockSessionState | null = null;

function initSession(): MockSessionState {
  const drama = deepClone(DEMO_DRAMA);
  const rootNode = deepClone(STORY_NODES['node-root']);
  
  return {
    currentDrama: drama,
    currentNode: rootNode,
    nodePath: [rootNode],
    userPoints: deepClone(DEMO_USER_POINTS),
    totalDuration: rootNode.confirmedFrame.duration,
  };
}

function getSession(): MockSessionState {
  if (!sessionState) {
    sessionState = initSession();
  }
  return sessionState;
}

export function resetSession(): void {
  sessionState = null;
}

// ============================================================
// 🎬 Mock API Functions
// ============================================================

/**
 * 加载剧集初始数据
 */
export async function loadDrama(): Promise<{
  drama: Drama;
  currentNode: StoryNode;
  candidates: CandidateFrame[];
  userPoints: UserPoints;
}> {
  await simulateDelay();
  
  const session = getSession();
  const candidates = getCandidatesWithCustomChance(session.currentNode.nodeId);
  
  return {
    drama: session.currentDrama,
    currentNode: session.currentNode,
    candidates,
    userPoints: session.userPoints,
  };
}

/**
 * 获取候选分镜（可能触发自定义模式）
 */
function getCandidatesWithCustomChance(nodeId: string): CandidateFrame[] {
  const baseCandidates = deepClone(CANDIDATE_FRAMES[nodeId] || []);
  
  // 检查是否已有可编辑选项
  const hasEditable = baseCandidates.some(c => c.isEditable);
  
  // 10% 概率将第一个非编辑选项变为可编辑
  if (!hasEditable && shouldTriggerCustomMode()) {
    const editableIndex = baseCandidates.findIndex(c => !c.isEditable);
    if (editableIndex !== -1) {
      baseCandidates[editableIndex] = {
        ...baseCandidates[editableIndex],
        isEditable: true,
        frameData: {
          ...baseCandidates[editableIndex].frameData,
          script: '✨ [幸运触发] ' + baseCandidates[editableIndex].frameData.script,
        },
      };
    }
  }
  
  return baseCandidates;
}

/**
 * 刷新候选分镜
 */
export async function refreshCandidates(nodeId: string): Promise<{
  candidates: CandidateFrame[];
  remainingFreeRefresh: number;
  pointsSpent: number;
  customModeTriggered: boolean;
}> {
  await simulateDelay();
  
  const session = getSession();
  let pointsSpent = 0;
  
  // 检查免费刷新次数
  if (session.userPoints.dailyFreeRefresh > 0) {
    session.userPoints.dailyFreeRefresh -= 1;
  } else {
    // 消耗积分
    pointsSpent = CONFIG.POINTS.REFRESH_COST;
    session.userPoints.balance -= pointsSpent;
    session.userPoints.totalSpent += pointsSpent;
  }
  
  // 获取新的候选（重新计算随机）
  const candidates = getCandidatesWithCustomChance(nodeId);
  const customModeTriggered = candidates.some(c => c.isEditable);
  
  return {
    candidates,
    remainingFreeRefresh: session.userPoints.dailyFreeRefresh,
    pointsSpent,
    customModeTriggered,
  };
}

/**
 * 确认选择分镜
 */
export async function confirmChoice(candidateId: string): Promise<{
  nextNode: StoryNode | null;
  newAssets: Asset[];
  pointsEarned: number;
  drama: Drama;
  isCustomMode: boolean;
  isDemoEnd: boolean;
}> {
  await simulateDelay(1000, 2000); // 稍长延迟模拟上链
  
  const session = getSession();
  const nextNodeId = CHOICE_TO_NODE[candidateId];
  
  // 检查是否触发自定义模式
  const candidate = Object.values(CANDIDATE_FRAMES)
    .flat()
    .find(c => c.candidateId === candidateId);
  
  if (candidate?.isEditable) {
    return {
      nextNode: null,
      newAssets: [],
      pointsEarned: 0,
      drama: session.currentDrama,
      isCustomMode: true,
      isDemoEnd: false,
    };
  }
  
  // 获取下一节点
  const nextNode = nextNodeId ? deepClone(STORY_NODES[nextNodeId]) : null;
  
  if (!nextNode) {
    // Demo 结束
    return {
      nextNode: null,
      newAssets: [],
      pointsEarned: 0,
      drama: session.currentDrama,
      isCustomMode: false,
      isDemoEnd: true,
    };
  }
  
  // 更新状态
  session.currentNode = nextNode;
  session.nodePath.push(nextNode);
  session.totalDuration += nextNode.confirmedFrame.duration;
  
  // 更新剧集进度
  session.currentDrama.currentDuration = session.totalDuration;
  
  // 奖励积分
  const pointsEarned = CONFIG.POINTS.CONFIRM_NODE;
  session.userPoints.balance += pointsEarned;
  session.userPoints.totalEarned += pointsEarned;
  
  // 模拟新资产（简化：实际中由 AI 生成）
  const newAssets: Asset[] = [];
  
  // 检查是否 Demo 结束
  const isDemoEnd = nextNode.nodeId === 'node-5-ending' || 
                     !CANDIDATE_FRAMES[nextNode.nodeId] ||
                     CANDIDATE_FRAMES[nextNode.nodeId].length === 0;
  
  return {
    nextNode,
    newAssets,
    pointsEarned,
    drama: session.currentDrama,
    isCustomMode: false,
    isDemoEnd,
  };
}

/**
 * 生成自定义分镜
 */
export async function generateCustomFrame(params: {
  actorIds: string[];
  sceneId: string;
  propIds: string[];
  script: string;
}): Promise<{
  node: StoryNode;
  pointsSpent: number;
}> {
  await simulateDelay(2000, 3000); // 更长延迟模拟 AI 生成
  
  const session = getSession();
  
  // 扣除积分
  const pointsSpent = CONFIG.POINTS.CUSTOM_FRAME_COST;
  session.userPoints.balance -= pointsSpent;
  session.userPoints.totalSpent += pointsSpent;
  
  // 创建自定义节点
  const customNode: StoryNode = {
    nodeId: `custom-${Date.now()}`,
    dramaId: 'demo',
    parentNodeIds: [session.currentNode.nodeId],
    depth: session.currentNode.depth + 1,
    confirmedFrame: {
      frameCid: `QmCustom-${Date.now()}`,
      duration: 5,
      actorIds: params.actorIds,
      sceneId: params.sceneId,
      propIds: params.propIds,
      script: params.script,
      thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=450&fit=crop',
    },
    contributor: session.userPoints.userId,
    timestamp: new Date(),
    childCount: 0,
    totalVisits: 1,
  };
  
  // 更新状态
  session.currentNode = customNode;
  session.nodePath.push(customNode);
  session.totalDuration += customNode.confirmedFrame.duration;
  session.currentDrama.currentDuration = session.totalDuration;
  
  return {
    node: customNode,
    pointsSpent,
  };
}

/**
 * 获取资产库
 */
export async function getAssetLibrary(type?: AssetType): Promise<Asset[]> {
  await simulateDelay(300, 600);
  
  if (type) {
    return getAssetsByType(type);
  }
  
  return Object.values(DEMO_ASSETS);
}

/**
 * 搜索资产
 */
export async function searchAssets(query: string, type?: AssetType): Promise<Asset[]> {
  await simulateDelay(200, 400);
  
  const allAssets = type ? getAssetsByType(type) : Object.values(DEMO_ASSETS);
  const lowerQuery = query.toLowerCase();
  
  return allAssets.filter(asset => 
    asset.name.toLowerCase().includes(lowerQuery) ||
    asset.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * 获取当前会话状态（用于调试）
 */
export function getSessionState(): MockSessionState | null {
  return sessionState;
}

/**
 * 获取下一幕候选
 */
export async function getNextCandidates(): Promise<CandidateFrame[]> {
  await simulateDelay(300, 500);
  
  const session = getSession();
  return getCandidatesWithCustomChance(session.currentNode.nodeId);
}

// ============================================================
// 📊 统计数据（用于 UI 展示）
// ============================================================

export function getDemoStats(): {
  totalNodes: number;
  totalAssets: number;
  maxDepth: number;
  branches: number;
} {
  return {
    totalNodes: Object.keys(STORY_NODES).length,
    totalAssets: Object.keys(DEMO_ASSETS).length,
    maxDepth: 5,
    branches: Object.keys(CANDIDATE_FRAMES).length,
  };
}
