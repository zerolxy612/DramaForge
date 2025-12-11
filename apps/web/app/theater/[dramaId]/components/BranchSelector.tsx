'use client';

import { useState, useEffect } from 'react';
import { useTheaterStore } from '@/lib/stores/theaterStore';
import type { CandidateFrame } from '@/lib/types';
import { TiltCard } from '@/app/components/TiltCard';

interface BranchSelectorProps {
  frames: CandidateFrame[];
  remainingFreeRefresh: number;
}

export function BranchSelector({ frames, remainingFreeRefresh }: BranchSelectorProps) {
  const { 
    currentDrama,
    selectedFrame, 
    setSelectedFrame, 
    isGenerating,
    isConfirming,
    isTransitioning,
    setIsCustomMode,
    selectCandidate,
    refreshFrames,
  } = useTheaterStore();
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showRefreshEffect, setShowRefreshEffect] = useState(false);
  
  const handleRefresh = async () => {
    setShowRefreshEffect(true);
    await refreshFrames();
    setTimeout(() => setShowRefreshEffect(false), 500);
  };
  
  const handleConfirm = async () => {
    if (!selectedFrame) return;
    await selectCandidate(selectedFrame.candidateId);
  };
  
  // 检查是否有可编辑分镜
  const editableFrame = frames.find(f => f.isEditable);
  
  // 没有候选时显示
  if (frames.length === 0 && !isGenerating) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/10 text-center">
        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-accent/20 grid place-items-center">
          <span className="text-3xl">🎬</span>
        </div>
        <p className="text-white/60">正在生成下一幕候选...</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 transition-opacity duration-500 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
      {/* 分支选项标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            选择下一幕
            {editableFrame && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent animate-pulse">
                ✨ 可自定义
              </span>
            )}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            从以下 {frames.length} 个分支中选择一个继续剧情
          </p>
        </div>
        
        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          disabled={isGenerating || isConfirming}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 
            hover:border-accent/50 transition disabled:opacity-50
            ${showRefreshEffect ? 'animate-pulse' : ''}
          `}
        >
          <span className={`text-lg ${isGenerating ? 'animate-spin' : ''}`}>🔄</span>
          <span className="text-white/80 text-sm">
            刷新 {remainingFreeRefresh}/10
          </span>
        </button>
      </div>
      
      {/* 可编辑分镜提示 */}
      {editableFrame && (
        <div className="relative overflow-hidden glass-veil rounded-xl p-4 border border-accent/30 bg-accent/5">
          {/* 闪光效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-shimmer" />
          
          <div className="relative flex items-center gap-3">
            <span className="text-2xl animate-bounce">✨</span>
            <div className="flex-1">
              <p className="text-accent font-semibold">恭喜！触发自定义分镜模式</p>
              <p className="text-white/60 text-sm">你可以自由编辑这个分镜的角色、场景和道具</p>
            </div>
            <button
              onClick={() => setIsCustomMode(true)}
              className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition hover:scale-105 active:scale-95"
            >
              开始创作
            </button>
          </div>
        </div>
      )}
      
      {/* 分支卡片 */}
      <div className="grid md:grid-cols-3 gap-4">
        {frames.map((frame, index) => (
          <TiltCard
            key={frame.candidateId}
            tiltMaxAngle={8}
            glareEnable={true}
            className={`
              relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
              ${selectedFrame?.candidateId === frame.candidateId 
                ? 'ring-2 ring-accent shadow-[0_0_30px_rgba(229,9,20,0.3)] scale-[1.02]' 
                : 'hover:ring-1 hover:ring-white/30 hover:scale-[1.01]'
              }
              ${frame.isEditable ? 'bg-gradient-to-br from-accent/20 to-purple-500/20' : 'glass'}
            `}
            onClick={() => !isConfirming && setSelectedFrame(frame)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* 序号标签 */}
            <div className={`
              absolute top-3 left-3 z-10 h-8 w-8 rounded-full grid place-items-center text-white font-bold
              ${index === 0 ? 'bg-gradient-to-br from-red-500 to-orange-600' :
                index === 1 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                'bg-gradient-to-br from-blue-500 to-cyan-600'}
            `}>
              {String.fromCharCode(65 + index)}
            </div>
            
            {/* 可编辑标记 */}
            {frame.isEditable && (
              <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-accent text-white text-xs font-medium animate-pulse">
                ✨ 可编辑
              </div>
            )}
            
            {/* 分镜预览图 */}
            <div className="aspect-video bg-black/30 relative overflow-hidden group">
              {frame.frameData.thumbnailUrl ? (
                <>
                  <img 
                    src={frame.frameData.thumbnailUrl}
                    alt={`选项 ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* 悬停时的渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                  <div className={`
                    h-12 w-12 rounded-lg grid place-items-center text-white font-bold text-xl
                    ${index === 0 ? 'bg-gradient-to-br from-red-500 to-orange-600' :
                      index === 1 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      'bg-gradient-to-br from-blue-500 to-cyan-600'}
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>
                </div>
              )}
              
              {/* 悬停时显示的"点击选择"提示 */}
              {hoveredIndex === index && !selectedFrame && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                    点击选择此分支
                  </span>
                </div>
              )}
            </div>
            
            {/* 分镜信息 */}
            <div className="p-4 space-y-3">
              {/* 脚本预览 */}
              <p className="text-white/90 text-sm leading-relaxed line-clamp-3 min-h-[4.5em]">
                {frame.frameData.script || '分镜脚本描述...'}
              </p>
              
              {/* 选择状态指示 */}
              <div className={`
                flex items-center gap-2 text-sm transition-all duration-300 pt-2 border-t border-white/10
                ${selectedFrame?.candidateId === frame.candidateId 
                  ? 'text-accent' 
                  : 'text-white/40'}
              `}>
                {selectedFrame?.candidateId === frame.candidateId ? (
                  <>
                    <span className="h-4 w-4 rounded-full bg-accent grid place-items-center text-white text-xs">✓</span>
                    <span className="font-medium">已选择</span>
                  </>
                ) : (
                  <span>点击选择</span>
                )}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
      
      {/* 确认按钮 */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedFrame || isConfirming}
          className={`
            relative px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden
            ${selectedFrame && !isConfirming
              ? 'bg-gradient-to-r from-accent via-red-500 to-accent text-white shadow-[0_10px_40px_rgba(229,9,20,0.4)] hover:scale-105 hover:shadow-[0_15px_50px_rgba(229,9,20,0.5)]' 
              : 'bg-white/10 text-white/40 cursor-not-allowed'}
          `}
        >
          {/* 按钮光效 */}
          {selectedFrame && !isConfirming && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
          
          <span className="relative">
            {isConfirming ? (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                上链中...
              </span>
            ) : (
              '确认选择并生成 →'
            )}
          </span>
        </button>
      </div>
      
      {/* 提示文字 */}
      <p className="text-center text-white/40 text-xs">
        确认后将获得 <span className="text-accent">+10</span> 积分奖励
      </p>
    </div>
  );
}
