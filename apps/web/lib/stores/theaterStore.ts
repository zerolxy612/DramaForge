import { create } from 'zustand';
import type { 
  Drama, 
  StoryNode, 
  CandidateFrame, 
  UserPoints,
  Asset,
  AssetType 
} from '../types';

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
  
  // 重置状态
  reset: () => void;
}

export const useTheaterStore = create<TheaterState>((set) => ({
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
  }),
}));

// ============ 资产库 Store ============

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
}

export const useAssetLibraryStore = create<AssetLibraryState>((set) => ({
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
}));

// ============ 自定义分镜编辑 Store ============

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
  
  reset: () => set({
    selectedActors: [],
    selectedScene: null,
    selectedProps: [],
    script: '',
  }),
}));

