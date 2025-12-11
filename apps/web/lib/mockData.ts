/**
 * Mock Data 兼容层
 * 
 * 这个文件保持向后兼容，实际数据已迁移到 ./mock 目录
 * 建议直接从 './mock' 导入
 */

// 别名导出（向后兼容）
export {
  DEMO_DRAMA as MOCK_DRAMA,
  DEMO_USER_POINTS as MOCK_USER_POINTS,
  STORY_NODES as MOCK_NODES,
  CANDIDATE_FRAMES as MOCK_CANDIDATES_ROOT,
  getNodeById as getNextNode,
} from './mock';

// 导出所有新接口（使用新名称）
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
} from './mock';
