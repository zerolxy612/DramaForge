'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
import type { StoryNode } from '@/lib/types';
import { getAssetById } from '@/lib/mock';
import { FrameDetailPopover, generateMockFrameDetail } from './FrameDetailPopover';

interface FilmStripPreviewProps {
  // 已经走过的节点（历史分镜）
  nodePath: StoryNode[];
  // 是否正在选择
  isChoosing: boolean;
  // 总共几幕
  totalFrames?: number;
}

// 单个胶片帧组件 - 电影胶卷风格
function FilmFrame({ 
  thumbnailUrl, 
  label, 
  script,
  index,
  isActive = false,
  isCurrent = false,
  actorNames = [],
}: {
  thumbnailUrl?: string;
  label: string;
  script?: string;
  index: number;
  isActive?: boolean;
  isCurrent?: boolean;
  actorNames?: string[];
}) {
  // 生成 mock 分镜详情
  const frameDetail = generateMockFrameDetail(index, 'history', thumbnailUrl);
  
  const frameContent = (
    <div className="relative flex-shrink-0 group">
      {/* 胶片帧外框 - 模拟电影胶片 */}
      <div className={`
        relative transition-all duration-500
        ${isCurrent ? 'scale-110 z-20' : 'hover:scale-105'}
      `}>
        {/* 胶片孔 - 上方 */}
        <div className="flex justify-center gap-3 mb-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`
              w-2 h-2 rounded-full
              ${isActive ? 'bg-white/30' : 'bg-white/10'}
            `} />
          ))}
        </div>
        
        {/* 主画面区域 */}
        <div className={`
          relative w-[300px] h-[168px] overflow-hidden
          border-4 transition-all duration-500
          ${isCurrent 
            ? 'border-accent shadow-[0_0_50px_rgba(229,9,20,0.7),inset_0_0_30px_rgba(229,9,20,0.2)]' 
            : isActive 
              ? 'border-white/50 shadow-xl' 
              : 'border-white/10'
          }
        `}>
          {/* 图片 */}
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={label}
              className={`
                w-full h-full object-cover
                transition-all duration-700
                ${isCurrent ? 'scale-110' : 'group-hover:scale-105'}
                ${!isActive ? 'grayscale opacity-30' : ''}
              `}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
              <div className="text-center">
                <span className="text-white/20 text-3xl block">?</span>
                <span className="text-white/10 text-[10px]">待续</span>
              </div>
            </div>
          )}
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          {/* 帧号标签 */}
          <div className={`
            absolute top-2 left-2 px-2 py-1 text-xs font-bold tracking-wider
            ${isCurrent 
              ? 'bg-accent text-white' 
              : isActive
                ? 'bg-black/70 text-white/90 border border-white/20'
                : 'bg-black/50 text-white/30'
            }
          `}>
            #{label}
          </div>
          
          {/* 当前帧标识 */}
          {isCurrent && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-[10px] font-bold">LIVE</span>
            </div>
          )}
          
          {/* 悬浮提示 */}
          {isActive && (
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white/60 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              悬浮查看详情
            </div>
          )}
          
          {/* 底部脚本预览 */}
          {script && isActive && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
              <p className="text-white/80 text-[10px] line-clamp-2 leading-tight italic">
                "{script.slice(0, 40)}..."
              </p>
            </div>
          )}
          
          {/* 角色指示器 */}
          {actorNames.length > 0 && isActive && !script && (
            <div className="absolute bottom-2 left-2 flex -space-x-1">
              {actorNames.slice(0, 2).map((name, i) => (
                <div 
                  key={i}
                  className="w-5 h-5 rounded-full bg-black/80 border border-white/30 flex items-center justify-center"
                >
                  <span className="text-[9px] text-white/90">{name.charAt(0)}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* 胶片纹理叠加 */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
        </div>
        
        {/* 胶片孔 - 下方 */}
        <div className="flex justify-center gap-3 mt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`
              w-2 h-2 rounded-full
              ${isActive ? 'bg-white/30' : 'bg-white/10'}
            `} />
          ))}
        </div>
      </div>
    </div>
  );

  // 只有激活的帧才有 Popover
  if (isActive) {
    return (
      <FrameDetailPopover detail={frameDetail} position="bottom">
        {frameContent}
      </FrameDetailPopover>
    );
  }
  
  return frameContent;
}

// "下一幕" 占位指示器
function NextFrameIndicator({ isChoosing }: { isChoosing: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      <div className="flex justify-center gap-3 mb-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-accent/30" />
        ))}
      </div>
      
      <div className={`
        relative w-[300px] h-[168px] overflow-hidden
        border-4 border-dashed transition-all duration-500
        ${isChoosing 
          ? 'border-accent/60 bg-accent/5' 
          : 'border-white/20 bg-white/5'
        }
        flex items-center justify-center
      `}>
        {isChoosing ? (
          <div className="text-center">
            <div className="relative mb-2">
              <div className="w-10 h-10 rounded-full border-2 border-accent/50 flex items-center justify-center">
                <span className="text-accent text-lg animate-pulse">▶</span>
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-accent/30 animate-ping" />
            </div>
            <span className="text-accent/80 text-xs font-medium">选择中...</span>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-white/20 text-2xl block">?</span>
            <span className="text-white/10 text-[10px]">下一幕</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-3 mt-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-accent/30" />
        ))}
      </div>
    </div>
  );
}

export function FilmStripPreview({ 
  nodePath, 
  isChoosing,
  totalFrames = 5
}: FilmStripPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  // 获取角色名称
  const getActorNames = (actorIds: string[]): string[] => {
    return actorIds
      .map(id => getAssetById(id))
      .filter(Boolean)
      .map(a => a!.name);
  };
  
  // 计算剩余帧数
  const remainingFrames = Math.max(0, totalFrames - nodePath.length - 1);

  // 鼠标移动时平滑驱动时间线滚动
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = Math.max(0, Math.min(maxScroll, maxScroll * rel));
  };
  
  return (
    <div className={`
      w-full
      transition-all duration-700
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
    `}>
      {/* 胶卷容器 */}
      <div className="relative">
        {/* 电影胶卷装饰边框 */}
        <div className="absolute -inset-3 bg-gradient-to-r from-transparent via-accent/5 to-transparent rounded-3xl blur-xl" />
        
        {/* 主容器 */}
        <div className="relative bg-gradient-to-b from-[#0a0a0a] to-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          {/* 顶部信息栏 */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/50">
            <div className="flex items-center gap-4">
              {/* 胶卷图标动画 */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/50">
                  <span className="text-xl">🎬</span>
                </div>
                {isChoosing && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              
              <div>
                <h3 className="text-white font-bold text-lg tracking-wide">故事进程</h3>
                <p className="text-white/40 text-xs">STORY TIMELINE</p>
              </div>
            </div>
            
            {/* 进度指示器 */}
            <div className="flex items-center gap-4">
              {/* 进度条 */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-red-400 transition-all duration-500"
                    style={{ width: `${(nodePath.length / totalFrames) * 100}%` }}
                  />
                </div>
                <span className="text-white/50 text-xs">{Math.round((nodePath.length / totalFrames) * 100)}%</span>
              </div>
              
              {/* 帧计数 */}
              <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-accent font-bold text-lg">{nodePath.length}</span>
                <span className="text-white/30">/</span>
                <span className="text-white/50">{totalFrames}</span>
                <span className="text-white/30 text-xs ml-1">幕</span>
              </div>
            </div>
          </div>
          
          {/* 胶卷帧区域 */}
          <div className="relative px-2 sm:px-6 py-6">
            {/* 胶片边缘装饰 - 左 */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black to-transparent z-10" />
            {/* 胶片边缘装饰 - 右 */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black to-transparent z-10" />
            
            {/* 横向滚动区域 */}
            <div
              ref={scrollRef}
              onMouseMove={handleMouseMove}
              className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-hide pb-2 px-3 sm:px-4 cursor-ew-resize"
            >
              {/* 历史帧 */}
              {nodePath.map((node, index) => (
                <FilmFrame
                  key={node.nodeId}
                  thumbnailUrl={node.confirmedFrame.thumbnailUrl}
                  label={`${index + 1}`}
                  script={node.confirmedFrame.script}
                  index={index}
                  isActive={true}
                  isCurrent={index === nodePath.length - 1 && !isChoosing}
                  actorNames={getActorNames(node.confirmedFrame.actorIds)}
                />
              ))}
              
              {/* 连接线 */}
              {nodePath.length > 0 && (
                <div className="flex-shrink-0 flex items-center">
                  <div className={`
                    w-12 h-0.5 
                    ${isChoosing 
                      ? 'bg-gradient-to-r from-white/30 via-accent to-accent animate-pulse' 
                      : 'bg-white/20'
                    }
                  `} />
                  {isChoosing && (
                    <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  )}
                </div>
              )}
              
              {/* 下一幕指示器 */}
              <NextFrameIndicator isChoosing={isChoosing} />
              
              {/* 未来帧占位 */}
              {[...Array(remainingFrames)].map((_, i) => (
                <FilmFrame
                  key={`future-${i}`}
                  label={`${nodePath.length + 2 + i}`}
                  index={nodePath.length + 1 + i}
                  isActive={false}
                />
              ))}
            </div>
          </div>
          
          {/* 底部状态栏 */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-black/30">
            {/* 状态提示 */}
            <div className="flex items-center gap-2">
              {isChoosing ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-accent text-sm">等待导演决策...</span>
                </>
              ) : nodePath.length > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-white/60 text-sm">第 {nodePath.length} 幕 · 播放中</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <span className="text-white/40 text-sm">故事即将开始</span>
                </>
              )}
            </div>
            
            {/* 图例 */}
            <div className="hidden sm:flex items-center gap-4 text-xs text-white/40">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border-2 border-white/40" />
                <span>已完成</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border-2 border-accent" />
                <span>当前</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border-2 border-dashed border-white/20" />
                <span>待续</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

