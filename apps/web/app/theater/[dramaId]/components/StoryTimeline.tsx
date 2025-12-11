'use client';

import { useState } from 'react';
import type { StoryNode } from '@/lib/types';

interface StoryTimelineProps {
  nodes: StoryNode[];
  currentIndex: number;
  totalExpected?: number; // 预期总共的节点数（用于显示未来节点）
  dramaTitle?: string;
  userPoints?: number;
  onNodeClick?: (index: number) => void;
}

export function StoryTimeline({ 
  nodes, 
  currentIndex, 
  totalExpected = 5,
  dramaTitle,
  userPoints = 0,
  onNodeClick 
}: StoryTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  // 生成时间轴节点（包括未来节点）
  const timelineNodes = Array.from({ length: totalExpected }, (_, i) => {
    if (i < nodes.length) {
      return { type: 'completed' as const, node: nodes[i], index: i };
    } else if (i === nodes.length) {
      return { type: 'current' as const, node: null, index: i };
    } else {
      return { type: 'future' as const, node: null, index: i };
    }
  });
  
  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      {/* 顶部渐变遮罩 */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
      
      {/* 主控制栏 */}
      <div className="relative px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* 左侧：返回 + 标题 */}
          <div className="flex items-center gap-4">
            <a 
              href="/"
              className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 grid place-items-center text-white/60 hover:text-white hover:bg-white/20 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            
            <div>
              <h1 className="text-lg font-display font-bold text-white">
                {dramaTitle || '未知剧集'}
              </h1>
              <p className="text-white/40 text-xs">
                第 {currentIndex + 1} / {totalExpected} 幕
              </p>
            </div>
          </div>
          
          {/* 中间：时间轴 */}
          <div className="hidden md:flex items-center gap-1">
            {timelineNodes.map(({ type, node, index }) => (
              <div 
                key={index}
                className="flex items-center"
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* 节点 */}
                <button
                  onClick={() => type === 'completed' && onNodeClick?.(index)}
                  disabled={type !== 'completed'}
                  className={`
                    relative w-8 h-8 rounded-full grid place-items-center text-xs font-bold
                    transition-all duration-300
                    ${type === 'completed' 
                      ? 'bg-accent text-white cursor-pointer hover:scale-110' 
                      : type === 'current'
                        ? 'bg-white text-black ring-2 ring-accent ring-offset-2 ring-offset-black animate-pulse'
                        : 'bg-white/10 text-white/30 cursor-default'
                    }
                  `}
                >
                  {type === 'completed' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : type === 'current' ? (
                    index + 1
                  ) : (
                    '?'
                  )}
                </button>
                
                {/* 连接线 */}
                {index < totalExpected - 1 && (
                  <div className={`
                    w-6 h-0.5 mx-1
                    ${index < nodes.length - 1 
                      ? 'bg-accent' 
                      : 'bg-white/10'
                    }
                  `} />
                )}
                
                {/* 悬停提示 */}
                {hoveredNode === index && type === 'completed' && node && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50">
                    <div className="px-3 py-2 rounded-lg bg-black/90 backdrop-blur-sm border border-white/10 whitespace-nowrap">
                      <p className="text-white text-xs max-w-[200px] truncate">
                        {node.confirmedFrame.script.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* 右侧：积分 + 更多 */}
          <div className="flex items-center gap-3">
            {/* 导演积分 */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-lg">🎬</span>
              <div className="text-right">
                <p className="text-accent font-bold text-sm leading-none">{userPoints}</p>
                <p className="text-white/40 text-[10px]">导演积分</p>
              </div>
            </div>
            
            {/* 故事树入口 */}
            <a
              href="#"
              className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 grid place-items-center text-white/60 hover:text-white hover:bg-white/20 transition"
              title="查看故事树"
            >
              🌳
            </a>
            
            {/* 展开详情 */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 grid place-items-center text-white/60 hover:text-white hover:bg-white/20 transition"
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 展开的故事线详情 */}
      <div className={`
        relative overflow-hidden transition-all duration-500
        ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span>📖</span> 你的故事线
              </h3>
              
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {nodes.map((node, index) => (
                  <div 
                    key={node.nodeId}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg transition
                      ${index === nodes.length - 1 
                        ? 'bg-accent/10 border border-accent/20' 
                        : 'bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className={`
                      h-6 w-6 rounded-full grid place-items-center text-xs font-bold flex-shrink-0
                      ${index === nodes.length - 1 
                        ? 'bg-accent text-white' 
                        : 'bg-white/20 text-white/60'
                      }
                    `}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`
                        text-sm leading-relaxed
                        ${index === nodes.length - 1 ? 'text-white' : 'text-white/70'}
                      `}>
                        {node.confirmedFrame.script}
                      </p>
                      <p className="text-white/30 text-xs mt-1">
                        时长 {node.confirmedFrame.duration}s
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
