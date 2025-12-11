'use client';

import { useState, useEffect } from 'react';

interface OnChainConfirmationProps {
  isVisible: boolean;
  nodeId?: string;
  txHash?: string;
  newAssetsCount?: number;
  onClose: () => void;
}

export function OnChainConfirmation({ 
  isVisible, 
  nodeId,
  txHash,
  newAssetsCount = 0,
  onClose 
}: OnChainConfirmationProps) {
  const [phase, setPhase] = useState<'confirming' | 'success'>('confirming');
  const [showDetails, setShowDetails] = useState(false);
  
  // 模拟链上数据
  const mockTxHash = txHash || `5xKd${Math.random().toString(36).slice(2, 10)}...${Math.random().toString(36).slice(2, 6)}Pq`;
  const mockNodeId = nodeId || `node_${Math.random().toString(36).slice(2, 10)}`;
  const mockBlockNumber = Math.floor(234567890 + Math.random() * 1000);
  
  useEffect(() => {
    if (isVisible) {
      setPhase('confirming');
      // 模拟链上确认延迟
      const timer = setTimeout(() => {
        setPhase('success');
        setShowDetails(true);
      }, 1500);
      
      // 自动关闭
      const closeTimer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-20 right-4 z-50 w-80 animate-slide-in-up">
      <div className={`
        rounded-2xl overflow-hidden border backdrop-blur-xl shadow-2xl
        transition-all duration-500
        ${phase === 'success' 
          ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' 
          : 'bg-gradient-to-br from-accent/10 to-orange-500/10 border-accent/30'
        }
      `}>
        {/* 头部 */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {phase === 'confirming' ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">上链确认中</p>
                    <p className="text-white/50 text-xs">Writing to Solana...</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">已上链</p>
                    <p className="text-green-400 text-xs">Confirmed on Solana</p>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="text-white/40 hover:text-white/80 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 详情 */}
        <div className={`
          transition-all duration-500 overflow-hidden
          ${showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="p-4 space-y-3">
            {/* 交易哈希 */}
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">交易哈希</span>
              <a 
                href={`https://solscan.io/tx/${mockTxHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-xs font-mono hover:underline flex items-center gap-1"
              >
                {mockTxHash}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            {/* 节点 ID */}
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">节点 ID</span>
              <span className="text-white/80 text-xs font-mono">{mockNodeId}</span>
            </div>
            
            {/* 区块高度 */}
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">区块高度</span>
              <span className="text-white/80 text-xs font-mono">#{mockBlockNumber.toLocaleString()}</span>
            </div>
            
            {/* 新资产提示 */}
            {newAssetsCount > 0 && (
              <div className="mt-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <div>
                    <p className="text-white text-xs font-medium">
                      发现 {newAssetsCount} 个新资产！
                    </p>
                    <p className="text-white/50 text-xs">
                      已注册为链上 NFT，你是首创者
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="pt-2 flex gap-2">
              <a
                href={`https://solscan.io/tx/${mockTxHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-white/80 text-xs hover:bg-white/20 transition"
              >
                <span>🔍</span> 查看交易
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(mockTxHash);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/80 text-xs hover:bg-white/20 transition"
              >
                <span>📋</span> 复制
              </button>
            </div>
          </div>
        </div>
        
        {/* 底部装饰 */}
        <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 animate-shimmer" />
      </div>
    </div>
  );
}
