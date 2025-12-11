'use client';

import { useState, useEffect } from 'react';
import type { FrameData } from '@/lib/types';
import { getAssetById } from '@/lib/mock';

interface ImmersivePlayerProps {
  frame?: FrameData;
  isPlaying: boolean;
  onSceneEnd?: () => void;
}

export function ImmersivePlayer({ frame, isPlaying, onSceneEnd }: ImmersivePlayerProps) {
  const [showScript, setShowScript] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const duration = frame?.duration ?? 5;
  
  // 获取角色资产
  const actors = frame?.actorIds?.map(id => getAssetById(id)).filter(Boolean) || [];
  
  useEffect(() => {
    if (!isPlaying || !frame) return;
    
    // 开场揭幕
    setIsRevealed(false);
    setShowScript(false);
    setProgress(0);
    
    const revealTimer = setTimeout(() => setIsRevealed(true), 100);
    const scriptTimer = setTimeout(() => setShowScript(true), 1000);
    
    // Ken Burns 效果 - 随机起始位置
    setImagePosition({
      x: 45 + Math.random() * 10,
      y: 45 + Math.random() * 10,
    });
    
    // 进度条
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onSceneEnd?.();
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
  }, [isPlaying, frame, duration, onSceneEnd]);
  
  if (!frame) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">准备场景中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* 全屏场景图 - Ken Burns 效果 */}
      <div 
        className={`
          absolute inset-0 transition-all duration-[8000ms] ease-out
          ${isRevealed ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}
        `}
        style={{
          backgroundImage: `url(${frame.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
        }}
      />
      
      {/* 电影级调色 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      
      {/* 宽银幕黑边 - 电影感 */}
      <div className="absolute top-0 left-0 right-0 h-[8vh] bg-black" />
      <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-black" />
      
      {/* 角色气泡 - 左下角 */}
      {actors.length > 0 && (
        <div className={`
          absolute left-8 bottom-[12vh] flex items-end gap-3
          transition-all duration-700 delay-500
          ${isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
        `}>
          {actors.slice(0, 3).map((actor, index) => (
            <div
              key={actor!.assetId}
              className="relative group"
              style={{ transitionDelay: `${500 + index * 150}ms` }}
            >
              {/* 角色头像 */}
              <div className="relative">
                <div className="absolute -inset-1 bg-accent/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition" />
                <img
                  src={actor!.thumbnailUrl}
                  alt={actor!.name}
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-2xl"
                />
              </div>
              
              {/* 角色名 - hover 显示 */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                <span className="px-2 py-1 rounded bg-black/80 text-white text-xs backdrop-blur-sm">
                  {actor!.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 字幕式脚本 - 底部居中 */}
      <div className={`
        absolute bottom-[12vh] left-0 right-0 px-8
        transition-all duration-700
        ${showScript ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-8 py-5 border border-white/5">
            <p className="text-white text-xl md:text-2xl leading-relaxed text-center font-light tracking-wide">
              {frame.script}
            </p>
          </div>
        </div>
      </div>
      
      {/* 场景进度条 - 底部黑边内 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-accent to-red-400 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 轻微噪点 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>
    </div>
  );
}
