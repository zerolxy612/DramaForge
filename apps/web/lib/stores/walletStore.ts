import { create } from 'zustand';

// Mock 钱包资产
export interface WalletAsset {
  mint: string;
  name: string;
  symbol: string;
  type: 'TOKEN' | 'NFT';
  balance?: number;
  decimals?: number;
  imageUrl?: string;
  // NFT 特有属性
  collection?: string;
  attributes?: Record<string, string>;
}

// Mock 交易记录
export interface WalletTransaction {
  signature: string;
  type: 'EARN_POINTS' | 'SPEND_POINTS' | 'MINT_ASSET' | 'CONFIRM_NODE';
  amount?: number;
  description: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
}

// 钱包状态
interface WalletState {
  // 连接状态
  isConnected: boolean;
  isConnecting: boolean;
  
  // 钱包信息
  address: string | null;
  shortAddress: string | null;
  
  // 余额
  solBalance: number;
  drapBalance: number;  // 平台积分代币
  
  // 资产
  assets: WalletAsset[];
  ownedDramaAssets: WalletAsset[];  // 用户创建/拥有的剧集资产
  
  // 交易历史
  recentTransactions: WalletTransaction[];
  
  // 统计
  stats: {
    totalNodesContributed: number;
    totalAssetsCreated: number;
    totalPointsEarned: number;
    participatedDramas: number;
  };
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

// Mock 数据
const MOCK_ADDRESS = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
const MOCK_SOL_BALANCE = 2.3456;
const MOCK_DRAP_BALANCE = 1250;

const MOCK_ASSETS: WalletAsset[] = [
  {
    mint: 'DRAPx9aH...vXYZ',
    name: 'DRAP Token',
    symbol: 'DRAP',
    type: 'TOKEN',
    balance: 1250,
    decimals: 9,
  },
  {
    mint: 'NFTx1abc...def1',
    name: '李医生',
    symbol: 'ACTOR',
    type: 'NFT',
    imageUrl: '/images/actor-li.jpg',
    collection: '末日医院角色',
    attributes: {
      type: 'ACTOR',
      origin: '末日医院',
      usageCount: '23',
    },
  },
  {
    mint: 'NFTx2ghi...jkl2',
    name: '废弃病房',
    symbol: 'SCENE',
    type: 'NFT',
    imageUrl: '/images/scene-hospital.jpg',
    collection: '末日医院场景',
    attributes: {
      type: 'SCENE',
      origin: '末日医院',
      usageCount: '45',
    },
  },
  {
    mint: 'NFTx3mno...pqr3',
    name: '手术刀',
    symbol: 'PROP',
    type: 'NFT',
    imageUrl: '/images/prop-knife.jpg',
    collection: '末日医院道具',
    attributes: {
      type: 'PROP',
      origin: '末日医院',
      usageCount: '12',
    },
  },
];

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    signature: '5KtP...xYz1',
    type: 'CONFIRM_NODE',
    description: '确认故事节点 #3',
    timestamp: Date.now() - 60000,
    status: 'confirmed',
  },
  {
    signature: '4JsQ...wVu2',
    type: 'EARN_POINTS',
    amount: 10,
    description: '执导奖励',
    timestamp: Date.now() - 120000,
    status: 'confirmed',
  },
  {
    signature: '3HrR...tUs3',
    type: 'MINT_ASSET',
    description: '铸造新资产: 手术刀',
    timestamp: Date.now() - 300000,
    status: 'confirmed',
  },
  {
    signature: '2GqS...sRt4',
    type: 'EARN_POINTS',
    amount: 10,
    description: '执导奖励',
    timestamp: Date.now() - 600000,
    status: 'confirmed',
  },
  {
    signature: '1FpT...rQs5',
    type: 'CONFIRM_NODE',
    description: '确认故事节点 #2',
    timestamp: Date.now() - 900000,
    status: 'confirmed',
  },
];

const MOCK_STATS = {
  totalNodesContributed: 23,
  totalAssetsCreated: 5,
  totalPointsEarned: 2850,
  participatedDramas: 3,
};

export const useWalletStore = create<WalletState>((set, get) => ({
  // 初始状态 - 默认已连接（mock）
  isConnected: true,
  isConnecting: false,
  
  address: MOCK_ADDRESS,
  shortAddress: `${MOCK_ADDRESS.slice(0, 4)}...${MOCK_ADDRESS.slice(-4)}`,
  
  solBalance: MOCK_SOL_BALANCE,
  drapBalance: MOCK_DRAP_BALANCE,
  
  assets: MOCK_ASSETS,
  ownedDramaAssets: MOCK_ASSETS.filter(a => a.type === 'NFT'),
  
  recentTransactions: MOCK_TRANSACTIONS,
  
  stats: MOCK_STATS,
  
  // 连接钱包
  connect: async () => {
    set({ isConnecting: true });
    
    // 模拟连接延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    set({
      isConnected: true,
      isConnecting: false,
      address: MOCK_ADDRESS,
      shortAddress: `${MOCK_ADDRESS.slice(0, 4)}...${MOCK_ADDRESS.slice(-4)}`,
      solBalance: MOCK_SOL_BALANCE,
      drapBalance: MOCK_DRAP_BALANCE,
      assets: MOCK_ASSETS,
      ownedDramaAssets: MOCK_ASSETS.filter(a => a.type === 'NFT'),
      recentTransactions: MOCK_TRANSACTIONS,
      stats: MOCK_STATS,
    });
  },
  
  // 断开连接
  disconnect: () => {
    set({
      isConnected: false,
      address: null,
      shortAddress: null,
      solBalance: 0,
      drapBalance: 0,
      assets: [],
      ownedDramaAssets: [],
      recentTransactions: [],
      stats: {
        totalNodesContributed: 0,
        totalAssetsCreated: 0,
        totalPointsEarned: 0,
        participatedDramas: 0,
      },
    });
  },
  
  // 刷新余额
  refreshBalance: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // 在实际应用中，这里会调用 RPC 获取最新余额
    set({
      solBalance: MOCK_SOL_BALANCE + Math.random() * 0.01,
      drapBalance: MOCK_DRAP_BALANCE + Math.floor(Math.random() * 10),
    });
  },
}));
