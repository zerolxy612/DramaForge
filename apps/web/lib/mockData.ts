/**
 * Mock Data 兼容层
 * 
 * 这个文件保持向后兼容，实际数据已迁移到 ./mock 目录
 */

export {
  DEMO_DRAMA as MOCK_DRAMA,
  DEMO_USER_POINTS as MOCK_USER_POINTS,
  STORY_NODES as MOCK_NODES,
  CANDIDATE_FRAMES as MOCK_CANDIDATES_ROOT,
  getNodeById as getNextNode,
} from './mock';

// 重导出所有新接口
export * from './mock';
