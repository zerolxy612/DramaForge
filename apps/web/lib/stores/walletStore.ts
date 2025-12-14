import { create } from "zustand";
import { PublicKey, Connection } from "@solana/web3.js";
import { connection, DRAP_MINT, DRAP_DECIMALS } from "../solana";

interface WalletState {
  // 钱包状态
  publicKey: PublicKey | null;
  connected: boolean;
  
  // DRAP 积分余额
  drapBalance: number;
  isLoadingBalance: boolean;
  
  // 每日免费刷新次数
  dailyFreeRefresh: number;
  
  // Actions
  setWallet: (publicKey: PublicKey | null) => void;
  fetchDrapBalance: () => Promise<void>;
  resetDailyRefresh: () => void;
  useRefresh: () => boolean;
}

const MAX_DAILY_FREE_REFRESH = 10;

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: null,
  connected: false,
  drapBalance: 0,
  isLoadingBalance: false,
  dailyFreeRefresh: MAX_DAILY_FREE_REFRESH,

  setWallet: (publicKey) => {
    set({
      publicKey,
      connected: !!publicKey,
    });
    
    if (publicKey) {
      get().fetchDrapBalance();
    } else {
      set({ drapBalance: 0 });
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
