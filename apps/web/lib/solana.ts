import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

// 网络配置
export type NetworkType = "devnet" | "mainnet-beta" | "localnet";

export const NETWORK: NetworkType = 
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as NetworkType) || "devnet";

// RPC 端点
export const RPC_ENDPOINT = 
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 
  (NETWORK === "localnet" 
    ? "http://localhost:8899" 
    : clusterApiUrl(NETWORK));

// Connection 实例
export const connection = new Connection(RPC_ENDPOINT, "confirmed");

// 程序 ID（部署后需要更新为真实地址）
export const PROGRAM_IDS = {
  dramaHub: new PublicKey("DramaHub111111111111111111111111111111111"),
  storyNode: new PublicKey("StoryNode11111111111111111111111111111111"),
  assetRegistry: new PublicKey("AssetReg111111111111111111111111111111111"),
  dramaToken: new PublicKey("DramaToken1111111111111111111111111111111"),
} as const;

// DRAP 代币 Mint 地址（初始化后需要更新）
export const DRAP_MINT = new PublicKey("DRAPMint11111111111111111111111111111111");

// 代币小数位数
export const DRAP_DECIMALS = 6;

// 格式化 DRAP 数量（从链上精度转换为显示精度）
export function formatDrapAmount(amount: number | bigint): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return (num / Math.pow(10, DRAP_DECIMALS)).toFixed(2);
}

// 转换为链上精度
export function toDrapAmount(amount: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, DRAP_DECIMALS)));
}

// 截断地址显示
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
