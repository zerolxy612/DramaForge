'use client';

import { useState, useEffect } from 'react';
import { useTheaterStore } from '@/lib/stores/theaterStore';
import type { CandidateFrame } from '@/lib/types';
import { FrameDetailPopover, generateMockFrameDetail, type FrameDetail } from './FrameDetailPopover';

interface DirectorChoicePanelProps {
  frames: CandidateFrame[];
  isVisible: boolean;
  remainingFreeRefresh: number;
  onCustomMode: () => void;
}

export function DirectorChoicePanel({ 
  frames, 
  isVisible, 
  remainingFreeRefresh,
  onCustomMode 
}: DirectorChoicePanelProps) {
  const { 
    selectedFrame, 
    setSelectedFrame,
    isConfirming,
    selectCandidate,
    refreshFrames,
    isGenerating,
  } = useTheaterStore();
  
  const [countdown, setCountdown] = useState(15);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  
  // 面板显示动画
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowPanel(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowPanel(false);
    }
  }, [isVisible]);
  
  // 倒计时逻辑
  useEffect(() => {
    if (!isVisible || !showPanel) {
      setCountdown(15);
      setIsCountdownActive(false);
      return;
    }
    
    setIsCountdownActive(true);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // 时间到，自动选择第一个
          if (!selectedFrame && frames.length > 0) {
            setSelectedFrame(frames[0]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isVisible, showPanel, frames, selectedFrame, setSelectedFrame]);
  
  const handleConfirm = async () => {
    if (!selectedFrame) return;
    await selectCandidate(selectedFrame.candidateId);
  };
  
  const handleRefresh = async () => {
    setCountdown(15);
    await refreshFrames();
  };
  
  // 检查是否有可编辑分镜
  const hasEditableFrame = frames.some(f => f.isEditable);
  
  if (!isVisible || frames.length === 0) return null;
  
  // 倒计时圆环进度
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (countdown / 15) * circumference;
  
  return (
    <div className={`
      absolute inset-x-0 bottom-0 z-40
      transition-all duration-500 ease-out
      ${showPanel ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
    `}>
      {/* 背景渐变遮罩 - 减少向上扩展 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent -top-16" />
      
      <div className="relative px-6 pb-6 pt-8">
        <div className="max-w-5xl mx-auto">
          {/* 标题区 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* 倒计时圆环 */}
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke={countdown <= 5 ? '#ef4444' : '#E50914'}
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={(2 * Math.PI * 16) - (countdown / 15) * (2 * Math.PI * 16)}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`
                  absolute inset-0 flex items-center justify-center text-xs font-bold
                  ${countdown <= 5 ? 'text-red-400' : 'text-white'}
                `}>
                  {countdown}
                </span>
              </div>
              
              <div>
                <h2 className="text-lg font-display font-bold text-white">
                  选择你想要的剧情走向
                </h2>
              </div>
            </div>
            
            {/* 刷新按钮 */}
            <button
              onClick={handleRefresh}
              disabled={isGenerating || isConfirming}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition disabled:opacity-50"
            >
              <span className={`text-sm ${isGenerating ? 'animate-spin' : ''}`}>🎲</span>
              <span className="text-white/70 text-xs">换一批 ({remainingFreeRefresh})</span>
            </button>
          </div>
          
          {/* 选项卡片 - 横向排列 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {frames.map((frame, index) => {
              const isSelected = selectedFrame?.candidateId === frame.candidateId;
              const isHovered = hoveredIndex === index;
              const letter = String.fromCharCode(65 + index);
              
              // 生成 mock 分镜详情
              const frameDetail = generateMockFrameDetail(
                index, 
                'candidate', 
                frame.frameData.thumbnailUrl
              );
              
              return (
                <div key={frame.candidateId} className="relative group">
                  <button
                    onClick={() => !isConfirming && setSelectedFrame(frame)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    disabled={isConfirming}
                    className={`
                      relative w-full text-left rounded-xl overflow-hidden
                      transition-all duration-300
                      ${isSelected 
                        ? 'ring-2 ring-accent scale-[1.02] shadow-[0_0_30px_rgba(229,9,20,0.3)]' 
                        : isHovered 
                          ? 'ring-1 ring-white/30 scale-[1.01]' 
                          : 'ring-1 ring-white/10'
                      }
                    `}
                  >
                    {/* 背景图 */}
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                      {frame.frameData.thumbnailUrl && (
                        <img
                          src={frame.frameData.thumbnailUrl}
                          alt=""
                          className={`
                            w-full h-full object-cover
                            transition-transform duration-500
                            ${isHovered || isSelected ? 'scale-110' : 'scale-100'}
                          `}
                        />
                      )}
                      
                      {/* 渐变遮罩 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      
                      {/* 选项标签 */}
                      <div className={`
                        absolute top-3 left-3 w-8 h-8 rounded-full grid place-items-center text-sm font-bold
                        transition-all duration-300
                        ${isSelected 
                          ? 'bg-accent text-white' 
                          : 'bg-black/60 backdrop-blur-sm text-white/80'
                        }
                      `}>
                        {letter}
                      </div>
                      
                      {/* 可编辑标记 */}
                      {frame.isEditable && !isSelected && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded-full bg-accent/90 text-white text-xs font-medium">
                            ✨ 可自定义
                          </span>
                        </div>
                      )}
                      
                      {/* 选中指示器 */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 rounded-full bg-accent grid place-items-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 文字内容 */}
                    <div className="p-4 bg-black/80">
                      <p className={`
                        text-sm leading-relaxed line-clamp-2
                        ${isSelected ? 'text-white' : 'text-white/70'}
                      `}>
                        "{frame.frameData.script.slice(0, 60)}..."
                      </p>
                    </div>
                  </button>
                  
                  {/* 查看详情按钮 - 悬浮时显示 */}
                  <FrameDetailPopover detail={frameDetail} position="top">
                    <button
                      className={`
                        absolute bottom-16 right-3 px-3 py-1.5 rounded-full
                        bg-black/80 backdrop-blur-sm border border-white/20
                        text-white/80 text-xs font-medium
                        transition-all duration-300 z-10
                        hover:bg-white/20 hover:border-white/40
                        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                      `}
                      onClick={(e) => e.stopPropagation()}
                    >
                      📋 查看分镜
                    </button>
                  </FrameDetailPopover>
                </div>
              );
            })}
          </div>
          
          {/* 底部操作区 */}
          <div className="flex items-center justify-between">
            {/* 自定义分镜入口 */}
            {hasEditableFrame && (
              <button
                onClick={onCustomMode}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-accent/20 border border-accent/40 text-white hover:border-accent transition"
              >
                <span>✨</span>
                <span className="text-sm font-medium">自己写剧本</span>
              </button>
            )}
            
            {!hasEditableFrame && <div />}
            
            {/* 确认按钮 */}
            <button
              onClick={handleConfirm}
              disabled={!selectedFrame || isConfirming}
              className={`
                relative px-8 py-3 rounded-full font-semibold overflow-hidden
                transition-all duration-300
                ${selectedFrame 
                  ? 'bg-gradient-to-r from-accent via-red-500 to-accent text-white shadow-[0_0_40px_rgba(229,9,20,0.4)] hover:scale-105' 
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
            >
              {/* 流光效果 */}
              {selectedFrame && !isConfirming && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
              
              <span className="relative flex items-center gap-2">
                {isConfirming ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    剧情演进中...
                  </>
                ) : (
                  <>
                    <span>🎬</span>
                    开拍！
                  </>
                )}
              </span>
            </button>
          </div>
          
          {/* 积分提示 */}
          {selectedFrame && (
            <p className="text-center text-white/40 text-xs mt-4">
              确认后获得 <span className="text-green-400">+10</span> 导演积分
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

