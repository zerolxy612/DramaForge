'use client';

import { useState } from 'react';
import { useWalletStore } from '@/lib/stores/walletStore';

type TabType = 'overview' | 'assets' | 'history';

export function WalletPanel() {
  const {
    isConnected,
    isConnecting,
    shortAddress,
    solBalance,
    drapBalance,
    assets,
    recentTransactions,
    stats,
    connect,
    disconnect,
  } = useWalletStore();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // 格式化时间
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return `${Math.floor(diff / 86400000)} 天前`;
  };
  
  // 交易类型图标
  const getTxIcon = (type: string) => {
    switch (type) {
      case 'EARN_POINTS': return '💰';
      case 'SPEND_POINTS': return '💸';
      case 'MINT_ASSET': return '✨';
      case 'CONFIRM_NODE': return '🎬';
      default: return '📝';
    }
  };
  
  // 资产类型颜色
  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'ACTOR': return 'text-blue-400 bg-blue-500/20';
      case 'SCENE': return 'text-green-400 bg-green-500/20';
      case 'PROP': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-white/60 bg-white/10';
    }
  };
  
  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-accent border border-white/20 text-white font-medium hover:scale-105 transition-all shadow-lg"
      >
        {isConnecting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            连接中...
          </>
        ) : (
          <>
            <span>👛</span>
            连接钱包
          </>
        )}
      </button>
    );
  }
  
  return (
    <div className="fixed top-4 right-4 z-[100]">
      {/* 收起状态 - 简洁徽章 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-2xl
          bg-black/80 backdrop-blur-xl border border-white/10
          hover:border-white/20 transition-all
          ${isExpanded ? 'rounded-b-none border-b-0' : 'shadow-xl'}
        `}
      >
        {/* 连接状态指示 */}
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-50" />
        </div>
        
        {/* 地址 */}
        <span className="text-white/80 text-sm font-mono">{shortAddress}</span>
        
        {/* SOL 余额 */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5">
          <span className="text-purple-400 text-xs">◎</span>
          <span className="text-white/70 text-xs">{solBalance.toFixed(2)}</span>
        </div>
        
        {/* DRAP 余额 */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/20">
          <span className="text-accent text-xs">🎬</span>
          <span className="text-white/70 text-xs">{drapBalance}</span>
        </div>
        
        {/* 展开箭头 */}
        <svg 
          className={`w-4 h-4 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* 展开面板 */}
      {isExpanded && (
        <div className="w-[360px] bg-black/90 backdrop-blur-xl border border-white/10 border-t-0 rounded-b-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* 标签页 */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'overview', label: '概览', icon: '📊' },
              { id: 'assets', label: '资产', icon: '💎' },
              { id: 'history', label: '记录', icon: '📜' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'text-white border-b-2 border-accent bg-white/5' 
                    : 'text-white/50 hover:text-white/70'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* 内容区 */}
          <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-hide">
            {/* 概览 */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* 统计卡片 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-white/40 text-xs mb-1">贡献节点</div>
                    <div className="text-white text-xl font-bold">{stats.totalNodesContributed}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-white/40 text-xs mb-1">创建资产</div>
                    <div className="text-white text-xl font-bold">{stats.totalAssetsCreated}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="text-accent/60 text-xs mb-1">累计获得积分</div>
                    <div className="text-accent text-xl font-bold">{stats.totalPointsEarned}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="text-purple-400/60 text-xs mb-1">参与剧集</div>
                    <div className="text-purple-400 text-xl font-bold">{stats.participatedDramas}</div>
                  </div>
                </div>
                
                {/* 钱包地址 */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-xs">钱包地址</span>
                    <button 
                      className="text-accent text-xs hover:underline"
                      onClick={() => navigator.clipboard.writeText(useWalletStore.getState().address || '')}
                    >
                      复制
                    </button>
                  </div>
                  <div className="font-mono text-white/70 text-sm break-all">
                    {useWalletStore.getState().address}
                  </div>
                </div>
                
                {/* 快速链接 */}
                <div className="flex items-center gap-2">
                  <a 
                    href={`https://solscan.io/account/${useWalletStore.getState().address}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition"
                  >
                    <span>🔍</span>
                    <span>Solscan</span>
                  </a>
                  <button 
                    onClick={disconnect}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition"
                  >
                    <span>🔌</span>
                    <span>断开连接</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* 资产 */}
            {activeTab === 'assets' && (
              <div className="space-y-3">
                {/* 代币 */}
                <div className="mb-4">
                  <h4 className="text-white/40 text-xs mb-2 px-1">代币</h4>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-red-600 flex items-center justify-center text-white font-bold">
                          D
                        </div>
                        <div>
                          <div className="text-white font-medium">DRAP Token</div>
                          <div className="text-white/40 text-xs">平台积分</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{drapBalance}</div>
                        <div className="text-white/40 text-xs">≈ ${(drapBalance * 0.01).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* NFT 资产 */}
                <div>
                  <h4 className="text-white/40 text-xs mb-2 px-1">剧集资产 NFT</h4>
                  <div className="space-y-2">
                    {assets.filter(a => a.type === 'NFT').map((asset) => (
                      <div 
                        key={asset.mint}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {/* 缩略图 */}
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden flex-shrink-0">
                            {asset.imageUrl ? (
                              <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/30 text-xl">
                                {asset.attributes?.type === 'ACTOR' ? '👤' : 
                                 asset.attributes?.type === 'SCENE' ? '🏠' : '🔧'}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium truncate">{asset.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] ${getAssetTypeColor(asset.attributes?.type || '')}`}>
                                {asset.attributes?.type === 'ACTOR' ? '角色' :
                                 asset.attributes?.type === 'SCENE' ? '场景' : '道具'}
                              </span>
                            </div>
                            <div className="text-white/40 text-xs truncate">{asset.collection}</div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <div className="text-white/60 text-xs">被使用</div>
                            <div className="text-accent font-bold">{asset.attributes?.usageCount}次</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 空投提示 */}
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-accent/10 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🎁</span>
                    <div>
                      <div className="text-white text-sm font-medium">空投预告</div>
                      <div className="text-white/50 text-xs mt-0.5">
                        你创建的资产被使用越多，测试网结束后的空投奖励越丰厚！
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 交易历史 */}
            {activeTab === 'history' && (
              <div className="space-y-2">
                {recentTransactions.map((tx) => (
                  <div 
                    key={tx.signature}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                        {getTxIcon(tx.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">{tx.description}</span>
                          {tx.amount && (
                            <span className="text-green-400 text-sm font-bold">+{tx.amount}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                          <span>{formatTime(tx.timestamp)}</span>
                          <span>·</span>
                          <span className="font-mono">{tx.signature}</span>
                        </div>
                      </div>
                      
                      <div className={`
                        px-2 py-0.5 rounded-full text-[10px]
                        ${tx.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : tx.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }
                      `}>
                        {tx.status === 'confirmed' ? '已确认' : tx.status === 'pending' ? '处理中' : '失败'}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 查看更多 */}
                <a 
                  href={`https://solscan.io/account/${useWalletStore.getState().address}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 text-accent text-sm hover:underline"
                >
                  在 Solscan 查看全部交易 →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
