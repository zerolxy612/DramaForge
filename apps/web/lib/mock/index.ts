/**
 * Mock 模块统一导出
 */

// 数据
export {
  DEMO_DRAMA,
  DEMO_ASSETS,
  DEMO_USER_POINTS,
  STORY_NODES,
  CANDIDATE_FRAMES,
  CHOICE_TO_NODE,
  getAssetById,
  getAssetsByType,
  getNodeById,
  getCandidatesForNode,
  getNextNodeId,
} from './demo-data';

// 服务
export {
  loadDrama,
  refreshCandidates,
  confirmChoice,
  generateCustomFrame,
  getAssetLibrary,
  searchAssets,
  getNextCandidates,
  getDemoStats,
  resetSession,
  getSessionState,
} from './mockService';

