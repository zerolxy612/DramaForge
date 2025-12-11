import { create } from 'zustand';
import type { 
  Drama, 
  StoryNode, 
  CandidateFrame, 
  UserPoints,
  Asset,
  AssetType 
} from '../types';
import {
  loadDrama,
  confirmChoice,
  refreshCandidates,
  generateCustomFrame,
  getNextCandidates,
  resetSession,
  getAssetLibrary,
  searchAssets,
} from '../mock';

// ============================================================
// 🎬 剧场 Store
// ============================================================

interface TheaterState {
  // 当前剧集
  currentDrama: Drama | null;
  setCurrentDrama: (drama: Drama | null) => void;
  
  // 当前节点
  currentNode: StoryNode | null;
  setCurrentNode: (node: StoryNode | null) => void;
  
  // 节点路径（从根到当前）
  nodePath: StoryNode[];
  setNodePath: (path: StoryNode[]) => void;
  
  // 候选分镜
  candidateFrames: CandidateFrame[];
  setCandidateFrames: (frames: CandidateFrame[]) => void;
  
  // 选中的分镜
  selectedFrame: CandidateFrame | null;
  setSelectedFrame: (frame: CandidateFrame | null) => void;
  
  // 自定义模式
  isCustomMode: boolean;
  setIsCustomMode: (isCustom: boolean) => void;
  
  // 用户积分
  userPoints: UserPoints | null;
  setUserPoints: (points: UserPoints | null) => void;
  
  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 生成中状态
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  
  // 确认中状态
  isConfirming: boolean;
  setIsConfirming: (confirming: boolean) => void;
  
  // Demo 结束状态
  isDemoEnd: boolean;
  setIsDemoEnd: (ended: boolean) => void;
  
  // 积分变化提示
  pointsChange: { amount: number; type: 'earn' | 'spend' } | null;
  setPointsChange: (change: { amount: number; type: 'earn' | 'spend' } | null) => void;
  
  // 转场动画状态
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  
  // 重置状态
  reset: () => void;

  // ========== Actions ==========
  
  // 加载 Demo 剧集
  loadMockDrama: () => Promise<void>;
  
  // 选择候选分镜
  selectCandidate: (candidateId: string) => Promise<void>;
  
  // 刷新候选分镜
  refreshFrames: () => Promise<void>;
  
  // 生成自定义分镜
  generateCustomFrame: (params: {
    actorIds: string[];
    sceneId: string;
    propIds: string[];
    script: string;
  }) => Promise<void>;
  
  // 重新开始 Demo
  restartDemo: () => Promise<void>;
}

export const useTheaterStore = create<TheaterState>((set, get) => ({
  currentDrama: null,
  setCurrentDrama: (drama) => set({ currentDrama: drama }),
  
  currentNode: null,
  setCurrentNode: (node) => set({ currentNode: node }),
  
  nodePath: [],
  setNodePath: (path) => set({ nodePath: path }),
  
  candidateFrames: [],
  setCandidateFrames: (frames) => set({ candidateFrames: frames }),
  
  selectedFrame: null,
  setSelectedFrame: (frame) => set({ selectedFrame: frame }),
  
  isCustomMode: false,
  setIsCustomMode: (isCustom) => set({ isCustomMode: isCustom }),
  
  userPoints: null,
  setUserPoints: (points) => set({ userPoints: points }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  isGenerating: false,
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  
  isConfirming: false,
  setIsConfirming: (confirming) => set({ isConfirming: confirming }),
  
  isDemoEnd: false,
  setIsDemoEnd: (ended) => set({ isDemoEnd: ended }),
  
  pointsChange: null,
  setPointsChange: (change) => set({ pointsChange: change }),
  
  isTransitioning: false,
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  
  reset: () => set({
    currentDrama: null,
    currentNode: null,
    nodePath: [],
    candidateFrames: [],
    selectedFrame: null,
    isCustomMode: false,
    isLoading: false,
    isGenerating: false,
    isConfirming: false,
    isDemoEnd: false,
    pointsChange: null,
    isTransitioning: false,
  }),

  // ========== 加载 Demo ==========
  loadMockDrama: async () => {
    set({ isLoading: true });
    
    try {
      const { drama, currentNode, candidates, userPoints } = await loadDrama();
      
      set({
        currentDrama: drama,
        currentNode: currentNode,
        nodePath: [currentNode],
        candidateFrames: candidates,
        userPoints: userPoints,
        isLoading: false,
        isDemoEnd: false,
        isCustomMode: false,
      });
    } catch (error) {
      console.error('Failed to load drama:', error);
      set({ isLoading: false });
    }
  },

  // ========== 选择候选分镜 ==========
  selectCandidate: async (candidateId: string) => {
    const { candidateFrames, userPoints } = get();
    
    // 找到选中的候选
    const selected = candidateFrames.find(f => f.candidateId === candidateId);
    if (!selected) return;
    
    set({ 
      isConfirming: true,
      isTransitioning: true,
      selectedFrame: selected,
    });
    
    try {
      const result = await confirmChoice(candidateId);
      
      // 处理自定义模式
      if (result.isCustomMode) {
        set({
          isConfirming: false,
          isTransitioning: false,
          isCustomMode: true,
        });
        return;
      }
      
      // 处理 Demo 结束
      if (result.isDemoEnd) {
        set({
          isConfirming: false,
          isTransitioning: false,
          isDemoEnd: true,
          currentDrama: result.drama,
        });
        return;
      }
      
      // 正常推进
      if (result.nextNode) {
        const { nodePath } = get();
        
        // 显示积分变化
        if (result.pointsEarned > 0) {
          set({ pointsChange: { amount: result.pointsEarned, type: 'earn' } });
          setTimeout(() => set({ pointsChange: null }), 2000);
        }
        
        // 获取下一幕的候选
        const nextCandidates = await getNextCandidates();
        
        // 更新状态
        set({
          currentNode: result.nextNode,
          nodePath: [...nodePath, result.nextNode],
          currentDrama: result.drama,
          candidateFrames: nextCandidates,
          selectedFrame: null,
          userPoints: userPoints ? {
            ...userPoints,
            balance: userPoints.balance + result.pointsEarned,
            totalEarned: userPoints.totalEarned + result.pointsEarned,
          } : null,
          isConfirming: false,
          isTransitioning: false,
          // 如果没有下一幕候选，则 Demo 结束
          isDemoEnd: nextCandidates.length === 0,
        });
      }
    } catch (error) {
      console.error('Failed to confirm choice:', error);
      set({ 
        isConfirming: false,
        isTransitioning: false,
      });
    }
  },

  // ========== 刷新候选分镜 ==========
  refreshFrames: async () => {
    const { currentNode, userPoints } = get();
    if (!currentNode) return;
    
    set({ isGenerating: true });
    
    try {
      const result = await refreshCandidates(currentNode.nodeId);
      
      // 显示积分变化
      if (result.pointsSpent > 0) {
        set({ pointsChange: { amount: result.pointsSpent, type: 'spend' } });
        setTimeout(() => set({ pointsChange: null }), 2000);
      }
      
      set({
        candidateFrames: result.candidates,
        userPoints: userPoints ? {
          ...userPoints,
          balance: userPoints.balance - result.pointsSpent,
          dailyFreeRefresh: result.remainingFreeRefresh,
          totalSpent: userPoints.totalSpent + result.pointsSpent,
        } : null,
        isGenerating: false,
      });
    } catch (error) {
      console.error('Failed to refresh frames:', error);
      set({ isGenerating: false });
    }
  },

  // ========== 生成自定义分镜 ==========
  generateCustomFrame: async (params) => {
    const { userPoints, nodePath } = get();
    
    set({ isGenerating: true });
    
    try {
      const result = await generateCustomFrame(params);
      
      // 显示积分变化
      set({ pointsChange: { amount: result.pointsSpent, type: 'spend' } });
      setTimeout(() => set({ pointsChange: null }), 2000);
      
      // 获取下一幕的候选（自定义节点后可能继续或结束）
      const nextCandidates = await getNextCandidates();
      
      set({
        currentNode: result.node,
        nodePath: [...nodePath, result.node],
        candidateFrames: nextCandidates,
        userPoints: userPoints ? {
          ...userPoints,
          balance: userPoints.balance - result.pointsSpent,
          totalSpent: userPoints.totalSpent + result.pointsSpent,
        } : null,
        isGenerating: false,
        isCustomMode: false,
        // 自定义分镜后结束 Demo
        isDemoEnd: true,
      });
    } catch (error) {
      console.error('Failed to generate custom frame:', error);
      set({ isGenerating: false });
    }
  },

  // ========== 重新开始 Demo ==========
  restartDemo: async () => {
    // 重置 mock 服务状态
    resetSession();
    
    // 重置 store
    get().reset();
    
    // 重新加载
    await get().loadMockDrama();
  },
}));

// ============================================================
// 🗄 资产库 Store
// ============================================================

interface AssetLibraryState {
  // 资产列表（按类型）
  actors: Asset[];
  scenes: Asset[];
  props: Asset[];
  
  // 设置资产
  setAssets: (type: AssetType, assets: Asset[]) => void;
  
  // 搜索结果
  searchResults: Asset[];
  setSearchResults: (results: Asset[]) => void;
  
  // 搜索关键词
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // 当前筛选的类型
  filterType: AssetType | 'ALL';
  setFilterType: (type: AssetType | 'ALL') => void;
  
  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Actions
  loadAssets: (type?: AssetType) => Promise<void>;
  search: (query: string, type?: AssetType) => Promise<void>;
}

export const useAssetLibraryStore = create<AssetLibraryState>((set, get) => ({
  actors: [],
  scenes: [],
  props: [],
  
  setAssets: (type, assets) => {
    switch (type) {
      case 'ACTOR':
        set({ actors: assets });
        break;
      case 'SCENE':
        set({ scenes: assets });
        break;
      case 'PROP':
        set({ props: assets });
        break;
    }
  },
  
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  filterType: 'ALL',
  setFilterType: (type) => set({ filterType: type }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // 加载资产
  loadAssets: async (type) => {
    set({ isLoading: true });
    try {
      const assets = await getAssetLibrary(type);
      
      if (type) {
        get().setAssets(type, assets);
      } else {
        // 分类存储
        set({
          actors: assets.filter(a => a.assetType === 'ACTOR'),
          scenes: assets.filter(a => a.assetType === 'SCENE'),
          props: assets.filter(a => a.assetType === 'PROP'),
        });
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to load assets:', error);
      set({ isLoading: false });
    }
  },
  
  // 搜索资产
  search: async (query, type) => {
    set({ isLoading: true, searchQuery: query });
    try {
      const results = await searchAssets(query, type);
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      console.error('Failed to search assets:', error);
      set({ isLoading: false });
    }
  },
}));

// ============================================================
// ✏️ 自定义分镜编辑 Store
// ============================================================

interface CustomFrameEditorState {
  // 已选择的资产
  selectedActors: Asset[];
  selectedScene: Asset | null;
  selectedProps: Asset[];
  
  // 分镜脚本
  script: string;
  
  // 操作方法
  addActor: (actor: Asset) => void;
  removeActor: (actorId: string) => void;
  setScene: (scene: Asset | null) => void;
  addProp: (prop: Asset) => void;
  removeProp: (propId: string) => void;
  setScript: (script: string) => void;
  
  // 验证是否可以生成
  canGenerate: () => boolean;
  
  // 获取生成参数
  getGenerateParams: () => {
    actorIds: string[];
    sceneId: string;
    propIds: string[];
    script: string;
  };
  
  // 重置
  reset: () => void;
}

export const useCustomFrameEditorStore = create<CustomFrameEditorState>((set, get) => ({
  selectedActors: [],
  selectedScene: null,
  selectedProps: [],
  script: '',
  
  addActor: (actor) => {
    const { selectedActors } = get();
    if (!selectedActors.find(a => a.assetId === actor.assetId)) {
      set({ selectedActors: [...selectedActors, actor] });
    }
  },
  
  removeActor: (actorId) => {
    const { selectedActors } = get();
    set({ selectedActors: selectedActors.filter(a => a.assetId !== actorId) });
  },
  
  setScene: (scene) => set({ selectedScene: scene }),
  
  addProp: (prop) => {
    const { selectedProps } = get();
    if (!selectedProps.find(p => p.assetId === prop.assetId)) {
      set({ selectedProps: [...selectedProps, prop] });
    }
  },
  
  removeProp: (propId) => {
    const { selectedProps } = get();
    set({ selectedProps: selectedProps.filter(p => p.assetId !== propId) });
  },
  
  setScript: (script) => set({ script }),
  
  canGenerate: () => {
    const { selectedActors, selectedScene, script } = get();
    return selectedActors.length > 0 && selectedScene !== null && script.trim().length > 0;
  },
  
  getGenerateParams: () => {
    const { selectedActors, selectedScene, selectedProps, script } = get();
    return {
      actorIds: selectedActors.map(a => a.assetId),
      sceneId: selectedScene?.assetId || '',
      propIds: selectedProps.map(p => p.assetId),
      script,
    };
  },
  
  reset: () => set({
    selectedActors: [],
    selectedScene: null,
    selectedProps: [],
    script: '',
  }),
}));
