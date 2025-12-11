'use client';

import { useState, useEffect } from 'react';
import type { FrameData } from '@/lib/types';
import { getAssetById } from '@/lib/mock';

interface CinematicPlayerProps {
  frame?: FrameData;
  isPlaying: boolean;
  onPlayComplete?: () => void;
}

export function CinematicPlayer({ frame, isPlaying, onPlayComplete }: CinematicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const duration = frame?.duration ?? 5;
  
  // 场景和角色资产
  const scene = frame?.sceneId ? getAssetById(frame.sceneId) : null;
  const actors = frame?.actorIds.map(id => getAssetById(id)).filter(Boolean) || [];
  
  useEffect(() => {
    if (!isPlaying || !frame) return;
    
    // 开场揭幕效果
    setIsRevealed(false);
    const revealTimer = setTimeout(() => setIsRevealed(true), 100);
    
    // 显示脚本
    const scriptTimer = setTimeout(() => setShowScript(true), 800);
    
    // 进度条
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onPlayComplete?.();
          return 100;
        }
        return prev + (100 / (duration * 20));
      });
    }, 50);
    
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(scriptTimer);
      clearInterval(interval);
    };
  }, [isPlaying, frame, duration, onPlayComplete]);
  
  // 占位状态
  if (!frame) {
    return (
      <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-black border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="h-20 w-20 mx-auto rounded-full bg-white/5 grid place-items-center">
                <div className="h-12 w-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <p className="text-white/40 text-sm">准备播放...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative group">
      {/* 电影院框架 */}
      <div className="absolute -inset-4 bg-gradient-to-b from-white/5 to-transparent rounded-2xl opacity-50" />
      
      {/* 主播放器 - 21:9 超宽屏 */}
      <div className={`
        relative aspect-[21/9] rounded-xl overflow-hidden bg-black
        shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,0.5)]
        transition-all duration-1000
        ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        {/* 场景背景 - 图片 */}
        <div className="absolute inset-0">
          {frame.thumbnailUrl || scene?.thumbnailUrl ? (
            <img
              src={frame.thumbnailUrl || scene?.thumbnailUrl}
              alt=""
              className={`
                w-full h-full object-cover
                transition-transform duration-[3000ms] ease-out
                ${isRevealed ? 'scale-100' : 'scale-110'}
              `}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-500/10" />
          )}
          
          {/* 电影级调色滤镜 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
        
        {/* 角色叠加层 */}
        {actors.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center gap-8 pb-8">
            {actors.slice(0, 3).map((actor, index) => (
              <div
                key={actor!.assetId}
                className={`
                  relative transition-all duration-700 ease-out
                  ${isRevealed 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                  }
                `}
                style={{ transitionDelay: `${index * 200 + 400}ms` }}
              >
                <div className="relative">
                  {/* 角色光晕 */}
                  <div className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl opacity-50" />
                  
                  {/* 角色图片 */}
                  <img
                    src={actor!.thumbnailUrl}
                    alt={actor!.name}
                    className="relative w-20 h-20 rounded-full object-cover border-2 border-white/30 shadow-2xl"
                  />
                  
                  {/* 角色名称 */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 text-white/80 text-xs backdrop-blur-sm">
                      {actor!.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 分镜脚本 - 电影字幕风格 */}
        <div className={`
          absolute bottom-0 left-0 right-0 p-8
          transition-all duration-700 ease-out
          ${showScript ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-8 py-4 border border-white/10">
              <p className="text-white text-lg md:text-xl leading-relaxed text-center font-light tracking-wide">
                {frame.script}
              </p>
            </div>
          </div>
        </div>
        
        {/* 电影时间码 */}
        <div className="absolute top-4 left-4 flex items-center gap-3 text-white/50 text-xs font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>REC</span>
          </div>
          <span>|</span>
          <span>FRAME {String(Math.floor(progress / 5)).padStart(4, '0')}</span>
        </div>
        
        {/* 分镜编号 */}
        <div className="absolute top-4 right-4 text-white/50 text-xs font-mono">
          <span className="px-2 py-1 rounded bg-black/40 backdrop-blur-sm">
            SHOT {duration}s
          </span>
        </div>
        
        {/* 进度条 - 电影胶片风格 */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-accent via-red-500 to-accent transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* 胶片齿孔装饰 */}
          <div className="h-3 bg-black/80 flex">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="flex-1 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-sm bg-white/10" />
              </div>
            ))}
          </div>
        </div>
        
        {/* 扫描线效果 */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
        </div>
        
        {/* 暗角 */}
        <div className="absolute inset-0 pointer-events-none vignette opacity-60" />
        
        {/* 轻微噪点 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="film-grain" />
        </div>
      </div>
      
      {/* 投射光效果 */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-20 bg-gradient-to-t from-transparent via-accent/5 to-transparent blur-3xl opacity-50" />
    </div>
  );
}
