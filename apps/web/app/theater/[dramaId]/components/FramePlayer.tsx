'use client';

import { useState, useRef, useEffect } from 'react';
import type { FrameData } from '@/lib/types';

interface FramePlayerProps {
  frame?: FrameData;
  isPlaying: boolean;
}

export function FramePlayer({ frame, isPlaying }: FramePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(frame?.duration ?? 5);
  
  useEffect(() => {
    if (!isPlaying || !videoRef.current) return;
    
    // 模拟播放进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (duration * 10));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration]);
  
  // 占位状态
  if (!frame) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden glass border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-accent/20 grid place-items-center">
              <span className="text-3xl">🎬</span>
            </div>
            <p className="text-white/60">等待分镜生成...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative rounded-2xl overflow-hidden glass border border-white/10">
      {/* 视频区域 */}
      <div className="aspect-video bg-black/50 relative">
        {frame.videoUrl ? (
          <video
            ref={videoRef}
            src={frame.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        ) : (
          // 占位图
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-white/5">
            {frame.thumbnailUrl ? (
              <img 
                src={frame.thumbnailUrl} 
                alt="分镜预览"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-2">
                <div className="h-20 w-20 mx-auto rounded-full bg-white/10 grid place-items-center">
                  <span className="text-4xl">▶</span>
                </div>
                <p className="text-white/60 text-sm">分镜预览</p>
              </div>
            )}
          </div>
        )}
        
        {/* 播放进度条 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full bg-accent transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* 时长标签 */}
        <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-sm text-white/80">
          {duration}s
        </div>
      </div>
      
      {/* 分镜脚本 */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs uppercase tracking-wider text-accent mb-2">分镜脚本</p>
        <p className="text-white/80 leading-relaxed">
          {frame.script || '暂无脚本描述'}
        </p>
      </div>
    </div>
  );
}

