import { create } from "zustand";
import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { connection, DRAP_MINT, DRAP_DECIMALS } from "../solana";

interface Asset {
  mint: string;
  name: string;
  type: 'NFT' | 'TOKEN';
  imageUrl?: string;
  collection?: string;
  attributes?: {
    type?: 'ACTOR' | 'SCENE' | 'PROP';
    usageCount?: number;
  };
}

interface Transaction {
  signature: string;
  type: 'EARN_POINTS' | 'SPEND_POINTS' | 'MINT_ASSET' | 'CONFIRM_NODE';
  description: string;
  amount?: number;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
}

interface WalletStats {
  totalNodesContributed: number;
  totalAssetsCreated: number;
  totalPointsEarned: number;
  participatedDramas: number;
}

interface WalletState {
  // 钱包状态
  publicKey: PublicKey | null;
  address: string | null;
  connected: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  shortAddress: string;
  
  // 余额
  solBalance: number;
  drapBalance: number;
  isLoadingBalance: boolean;
  
  // 资产和交易
  assets: Asset[];
  recentTransactions: Transaction[];
  stats: WalletStats;
  
  // 每日免费刷新次数
  dailyFreeRefresh: number;
  
  // Actions
  setWallet: (publicKey: PublicKey | null) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  fetchDrapBalance: () => Promise<void>;
  fetchSolBalance: () => Promise<void>;
  resetDailyRefresh: () => void;
  useRefresh: () => boolean;
}

const MAX_DAILY_FREE_REFRESH = 10;

// Helper to get short address
const getShortAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: null,
  address: null,
  connected: false,
  isConnected: false,
  isConnecting: false,
  shortAddress: '',
  solBalance: 0,
  drapBalance: 0,
  isLoadingBalance: false,
  dailyFreeRefresh: MAX_DAILY_FREE_REFRESH,
  assets: [],
  recentTransactions: [],
  stats: {
    totalNodesContributed: 0,
    totalAssetsCreated: 0,
    totalPointsEarned: 0,
    participatedDramas: 0,
  },

  setWallet: (publicKey) => {
    const address = publicKey?.toBase58() || null;
    set({
      publicKey,
      address,
      connected: !!publicKey,
      isConnected: !!publicKey,
      shortAddress: getShortAddress(address),
    });
    
    if (publicKey) {
      get().fetchDrapBalance();
      get().fetchSolBalance();
    } else {
      set({ drapBalance: 0, solBalance: 0 });
    }
  },

  connect: async () => {
    set({ isConnecting: true });
    
    try {
      // Check if Phantom wallet is available
      const phantom = (window as unknown as { solana?: { isPhantom?: boolean; connect: () => Promise<{ publicKey: PublicKey }> } }).solana;
      
      if (phantom?.isPhantom) {
        const response = await phantom.connect();
        get().setWallet(response.publicKey);
      } else {
        // Open Phantom download page if not installed
        window.open('https://phantom.app/', '_blank');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: () => {
    const phantom = (window as unknown as { solana?: { disconnect: () => Promise<void> } }).solana;
    phantom?.disconnect();
    set({
      publicKey: null,
      address: null,
      connected: false,
      isConnected: false,
      shortAddress: '',
      solBalance: 0,
      drapBalance: 0,
      assets: [],
      recentTransactions: [],
      stats: {
        totalNodesContributed: 0,
        totalAssetsCreated: 0,
        totalPointsEarned: 0,
        participatedDramas: 0,
      },
    });
  },

  fetchSolBalance: async () => {
    const { publicKey } = get();
    if (!publicKey) return;

    try {
      const balance = await connection.getBalance(publicKey);
      set({ solBalance: balance / LAMPORTS_PER_SOL });
    } catch (error) {
      console.error("Failed to fetch SOL balance:", error);
    }
  },

  fetchDrapBalance: async () => {
    const { publicKey } = get();
    if (!publicKey) return;

    set({ isLoadingBalance: true });

    try {
      // 获取用户的 DRAP 代币账户
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { mint: DRAP_MINT }
      );

      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount;
        set({ 
          drapBalance: balance.uiAmount || 0,
          isLoadingBalance: false 
        });
      } else {
        set({ drapBalance: 0, isLoadingBalance: false });
      }
    } catch (error) {
      console.error("Failed to fetch DRAP balance:", error);
      set({ isLoadingBalance: false });
    }
  },

  resetDailyRefresh: () => {
    set({ dailyFreeRefresh: MAX_DAILY_FREE_REFRESH });
  },

  useRefresh: () => {
    const { dailyFreeRefresh } = get();
    if (dailyFreeRefresh > 0) {
      set({ dailyFreeRefresh: dailyFreeRefresh - 1 });
      return true; // 使用免费刷新
    }
    return false; // 需要消耗积分
  },
}));
