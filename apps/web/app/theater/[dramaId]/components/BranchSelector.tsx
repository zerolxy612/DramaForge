'use client';

import { useState } from 'react';
import { useTheaterStore } from '@/lib/stores/theaterStore';
import type { CandidateFrame } from '@/lib/types';
import { TiltCard } from '@/app/components/TiltCard';

interface BranchSelectorProps {
  frames: CandidateFrame[];
  remainingFreeRefresh: number;
}

export function BranchSelector({ frames, remainingFreeRefresh }: BranchSelectorProps) {
  const { 
    selectedFrame, 
    setSelectedFrame, 
    isGenerating,
    setIsGenerating,
    isConfirming,
    setIsConfirming,
    setIsCustomMode,
  } = useTheaterStore();
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const handleRefresh = async () => {
    setIsGenerating(true);
    // TODO: 调用刷新API
    console.log('Refreshing frames...');
    setTimeout(() => setIsGenerating(false), 2000);
  };
  
  const handleConfirm = async () => {
    if (!selectedFrame) return;
    setIsConfirming(true);
    // TODO: 调用确认API
    console.log('Confirming frame:', selectedFrame);
    setTimeout(() => setIsConfirming(false), 2000);
  };
  
  // 检查是否有可编辑分镜
  const editableFrame = frames.find(f => f.isEditable);
  
  return (
    <div className="space-y-6">
      {/* 分支选项标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">选择下一幕</h2>
          <p className="text-white/60 text-sm mt-1">
            从以下 {frames.length} 个分支中选择一个继续剧情
          </p>
        </div>
        
        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-accent/50 transition disabled:opacity-50"
        >
          <span className={`text-lg ${isGenerating ? 'animate-spin' : ''}`}>🔄</span>
          <span className="text-white/80 text-sm">
            刷新 {remainingFreeRefresh}/10
          </span>
        </button>
      </div>
      
      {/* 可编辑分镜提示 */}
      {editableFrame && (
        <div className="glass-veil rounded-xl p-4 border border-accent/30 bg-accent/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="flex-1">
              <p className="text-accent font-semibold">恭喜！触发自定义分镜</p>
              <p className="text-white/60 text-sm">你可以自由编辑这个分镜的角色、场景和道具</p>
            </div>
            <button
              onClick={() => setIsCustomMode(true)}
              className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition"
            >
              开始编辑
            </button>
          </div>
        </div>
      )}
      
      {/* 分支卡片 */}
      <div className="grid md:grid-cols-3 gap-4">
        {frames.length > 0 ? (
          frames.map((frame, index) => (
            <TiltCard
              key={frame.candidateId}
              tiltMaxAngle={8}
              glareEnable={true}
              className={`
                relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                ${selectedFrame?.candidateId === frame.candidateId 
                  ? 'ring-2 ring-accent shadow-[0_0_30px_rgba(229,9,20,0.3)]' 
                  : 'hover:ring-1 hover:ring-white/30'
                }
                ${frame.isEditable ? 'bg-accent/10' : 'glass'}
              `}
              onClick={() => setSelectedFrame(frame)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 可编辑标记 */}
              {frame.isEditable && (
                <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-accent text-white text-xs font-medium">
                  可编辑
                </div>
              )}
              
              {/* 分镜预览图 */}
              <div className="aspect-video bg-black/30 relative">
                {frame.frameData.thumbnailUrl ? (
                  <img 
                    src={frame.frameData.thumbnailUrl}
                    alt={`选项 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
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
              </div>
              
              {/* 分镜信息 */}
              <div className="p-4 space-y-3">
                {/* 资产标签 */}
                <div className="flex flex-wrap gap-1.5">
                  {frame.frameData.actorIds.slice(0, 2).map((actorId, i) => (
                    <span key={actorId} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/70">
                      @角色{i + 1}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/70">
                    📍场景
                  </span>
                </div>
                
                {/* 脚本预览 */}
                <p className="text-white/80 text-sm line-clamp-2">
                  {frame.frameData.script || '分镜脚本描述...'}
                </p>
                
                {/* 选择提示 */}
                <div className={`
                  flex items-center gap-2 text-sm transition-all duration-300
                  ${selectedFrame?.candidateId === frame.candidateId 
                    ? 'text-accent' 
                    : 'text-white/40'}
                `}>
                  <span>
                    {selectedFrame?.candidateId === frame.candidateId ? '✓ 已选择' : '点击选择'}
                  </span>
                </div>
              </div>
            </TiltCard>
          ))
        ) : (
          // 空状态占位
          [...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="glass rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-white/5" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* 确认按钮 */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedFrame || isConfirming}
          className={`
            px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
            ${selectedFrame 
              ? 'bg-gradient-to-r from-accent via-red-500 to-accent text-white shadow-[0_10px_40px_rgba(229,9,20,0.4)] hover:scale-105' 
              : 'bg-white/10 text-white/40 cursor-not-allowed'}
          `}
        >
          {isConfirming ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              确认中...
            </span>
          ) : (
            '确认选择并生成'
          )}
        </button>
      </div>
    </div>
  );
}

