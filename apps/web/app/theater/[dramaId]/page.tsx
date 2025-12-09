'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTheaterStore } from '@/lib/stores/theaterStore';
import { ParticleBackground } from '@/app/components/ParticleBackground';
import { FramePlayer } from './components/FramePlayer';
import { BranchSelector } from './components/BranchSelector';
import { ProgressBar } from './components/ProgressBar';
import { AssetPreview } from './components/AssetPreview';
import { CustomFrameEditor } from './components/CustomFrameEditor';

export default function TheaterPage() {
  const params = useParams();
  const dramaId = params.dramaId as string;
  
  const {
    currentDrama,
    currentNode,
    candidateFrames,
    isCustomMode,
    isLoading,
    userPoints,
    setIsLoading,
  } = useTheaterStore();
  
  useEffect(() => {
    // TODO: 加载剧集数据
    console.log('Loading drama:', dramaId);
  }, [dramaId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">加载中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0b10] to-[#06060a]" />
      <ParticleBackground />
      <div className="absolute inset-0 noise pointer-events-none opacity-30" />
      
      {/* 主内容 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部信息 */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {currentDrama?.title || '互动漫剧'}
            </h1>
            <p className="text-white/60 text-sm mt-1">
              第 {currentNode?.depth ?? 0} 幕
            </p>
          </div>
          
          {/* 用户积分 */}
          <div className="glass rounded-full px-4 py-2 border border-white/10">
            <span className="text-white/60 text-sm">积分: </span>
            <span className="text-accent font-semibold">
              {userPoints?.balance ?? 0}
            </span>
          </div>
        </header>
        
        {/* 进度条 */}
        <ProgressBar 
          current={currentDrama?.currentDuration ?? 0}
          target={currentDrama?.targetDuration ?? 7200}
        />
        
        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* 左侧：分镜播放器 */}
          <div className="lg:col-span-2 space-y-6">
            <FramePlayer 
              frame={currentNode?.confirmedFrame}
              isPlaying={true}
            />
            
            {/* 分支选择器 或 自定义编辑器 */}
            {isCustomMode ? (
              <CustomFrameEditor dramaId={dramaId} />
            ) : (
              <BranchSelector 
                frames={candidateFrames}
                remainingFreeRefresh={userPoints?.dailyFreeRefresh ?? 10}
              />
            )}
          </div>
          
          {/* 右侧：资产预览 */}
          <div className="space-y-6">
            <AssetPreview frame={currentNode?.confirmedFrame} />
            
            {/* 故事树入口 */}
            <div className="glass rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">故事树</h3>
              <p className="text-white/60 text-sm mb-4">
                查看所有分支的发展路径
              </p>
              <a 
                href={`/drama/${dramaId}/tree`}
                className="block w-full py-2 text-center rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
              >
                查看故事树 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

