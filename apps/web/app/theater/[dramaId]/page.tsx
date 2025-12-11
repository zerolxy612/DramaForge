'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useTheaterStore } from '@/lib/stores/theaterStore';
import type { StoryNode } from '@/lib/types';
import { ParticleBackground } from '@/app/components/ParticleBackground';
import { CinematicIntro } from './components/CinematicIntro';
import { CinematicPlayer } from './components/CinematicPlayer';
import { CinematicBranchSelector } from './components/CinematicBranchSelector';
import { ProgressBar } from './components/ProgressBar';
import { AssetPreview } from './components/AssetPreview';
import { CustomFrameEditor } from './components/CustomFrameEditor';
import { DemoEndScreen } from './components/DemoEndScreen';
import { PointsToast } from './components/PointsToast';
import { VideoPreview } from './components/VideoPreview';

export default function TheaterPage() {
  const params = useParams();
  const dramaId = params.dramaId as string;
  
  const {
    currentDrama,
    currentNode,
    nodePath,
    candidateFrames,
    isCustomMode,
    isLoading,
    isTransitioning,
    userPoints,
    isDemoEnd,
    pointsChange,
    setPointsChange,
    loadMockDrama,
  } = useTheaterStore();
  
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  
  // 获取预告片视频URL（只有开场节点有）
  const trailerVideoUrl = currentNode?.confirmedFrame?.videoUrl;
  const showTrailer = !!trailerVideoUrl && nodePath.length === 1; // 只在第一幕显示预告片
  
  useEffect(() => {
    if (dramaId === 'demo') {
      loadMockDrama();
    } else {
      console.log('Loading drama:', dramaId);
    }
  }, [dramaId, loadMockDrama]);
  
  // Intro 完成后开始播放
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setTimeout(() => {
      setIsPlaying(true);
      setShowControls(true);
    }, 500);
  }, []);
  
  // 节点变化时触发新的场景转换
  useEffect(() => {
    if (currentNode && nodePath.length > 1) {
      setIsPlaying(false);
      // 短暂延迟后开始播放新场景
      const timer = setTimeout(() => setIsPlaying(true), 800);
      return () => clearTimeout(timer);
    }
  }, [currentNode?.nodeId]);
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          {/* 电影放映机加载动画 */}
          <div className="relative h-24 w-24 mx-auto">
            {/* 胶片卷轴 */}
            <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
            <div className="absolute inset-2 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-4 border-4 border-white/10 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🎬</span>
            </div>
          </div>
          
          <div>
            <p className="text-white font-medium mb-1">正在准备放映...</p>
            <p className="text-white/40 text-sm">Loading Cinematic Experience</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 结束画面
  if (isDemoEnd) {
    return <DemoEndScreen dramaId={dramaId} />;
  }
  
  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* 电影开场动画 */}
      {showIntro && currentDrama && (
        <CinematicIntro
          title={currentDrama.title}
          chapter={currentNode?.depth ?? 1}
          onComplete={handleIntroComplete}
        />
      )}
      
      {/* 背景层 */}
      <div className="fixed inset-0 bg-[#030303]" />
      
      {/* 动态背景 - 基于当前场景 */}
      {currentNode?.confirmedFrame.thumbnailUrl && (
        <div 
          className="fixed inset-0 opacity-20 blur-3xl scale-110 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${currentNode.confirmedFrame.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* 粒子效果 */}
      <div className="fixed inset-0 opacity-30">
        <ParticleBackground />
      </div>
      
      {/* 噪点纹理 */}
      <div className="fixed inset-0 noise pointer-events-none opacity-20" />
      
      {/* 积分变化提示 */}
      {pointsChange && (
        <PointsToast
          amount={pointsChange.amount}
          type={pointsChange.type}
          onClose={() => setPointsChange(null)}
        />
      )}
      
      {/* 转场遮罩 */}
      {isTransitioning && (
        <div className="fixed inset-0 z-40 bg-black flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              {/* 电影胶片转动 */}
              <div className="h-20 w-20 mx-auto relative">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <p className="text-white/60 text-sm tracking-wider">场景切换中...</p>
          </div>
        </div>
      )}
      
      {/* 主内容 */}
      <div className={`
        relative z-10 transition-opacity duration-500
        ${showIntro ? 'opacity-0' : 'opacity-100'}
      `}>
        {/* 顶部控制栏 */}
        <header className={`
          fixed top-0 left-0 right-0 z-30
          transition-all duration-500
          ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}>
          <div className="bg-gradient-to-b from-black via-black/80 to-transparent py-4 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* 左侧：返回 + 标题 */}
              <div className="flex items-center gap-4">
                <a 
                  href="/"
                  className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 grid place-items-center text-white/60 hover:text-white hover:bg-white/20 transition"
                >
                  ←
                </a>
                
                <div>
                  <h1 className="text-lg font-display font-bold text-white">
                    {currentDrama?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">第 {currentNode?.depth ?? 1} 幕</span>
                    <span className="text-white/30">|</span>
                    <span className="text-white/40">
                      {nodePath.length} 个场景
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 右侧：积分 */}
              <div className="flex items-center gap-4">
                {/* 故事树入口 */}
                <a
                  href={`/drama/${dramaId}/tree`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition text-sm"
                >
                  <span>🌳</span>
                  <span className="hidden md:inline">故事树</span>
                </a>
                
                {/* 积分显示 */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-lg">💰</span>
                  <span className="text-accent font-bold">{userPoints?.balance ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* 进度条 - 固定在页面内容顶部（跟随内容滚动） */}
        <div className={`
          sticky top-20 z-20 px-6 py-2 bg-gradient-to-b from-black/80 to-transparent
          transition-all duration-500
          ${showControls ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="max-w-7xl mx-auto">
            <ProgressBar 
              current={currentDrama?.currentDuration ?? 0}
              target={currentDrama?.targetDuration ?? 300}
            />
          </div>
        </div>
        
        {/* 主舞台区域 */}
        <main className="pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* 自定义编辑器模式 */}
            {isCustomMode ? (
              <div className="max-w-5xl mx-auto animate-fadeIn">
                <CustomFrameEditor dramaId={dramaId} />
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                {/* 左侧：主播放器 + 选择器 */}
                <div className="space-y-8">
                  {/* 电影播放器 */}
                  <CinematicPlayer 
                    frame={currentNode?.confirmedFrame}
                    isPlaying={isPlaying}
                  />
                  
                  {/* 分支选择器 */}
                  <CinematicBranchSelector 
                    frames={candidateFrames}
                    remainingFreeRefresh={userPoints?.dailyFreeRefresh ?? 10}
                  />
                </div>
                
                {/* 右侧：资产面板 */}
                <aside className="hidden lg:block space-y-6">
                  {/* 预告视频 - 只在第一幕显示 */}
                  {showTrailer && !isVideoMinimized && (
                    <VideoPreview
                      videoUrl={trailerVideoUrl}
                      thumbnailUrl={currentNode?.confirmedFrame?.thumbnailUrl}
                      title="剧集预告"
                      isMinimized={false}
                      onToggleMinimize={() => setIsVideoMinimized(true)}
                    />
                  )}
                  
                  <AssetPreview frame={currentNode?.confirmedFrame} />
                  
                  {/* 当前故事线 */}
                  <div className="glass rounded-xl p-5 border border-white/10">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <span>📍</span> 当前故事线
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {nodePath.map((node: StoryNode, index: number) => (
                        <div 
                          key={node.nodeId}
                          className={`flex items-center gap-2 text-xs ${
                            index === nodePath.length - 1 ? 'text-accent' : 'text-white/40'
                          }`}
                        >
                          <span className={`
                            h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold
                            ${index === nodePath.length - 1 
                              ? 'bg-accent text-white' 
                              : 'bg-white/10 text-white/60'
                            }
                          `}>
                            {index + 1}
                          </span>
                          <span className="truncate">
                            {node.confirmedFrame.script.slice(0, 30)}...
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 快捷操作 */}
                  <div className="glass rounded-xl p-5 border border-white/10 space-y-3">
                    <a
                      href={`/drama/${dramaId}/tree`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">🌳</span>
                      <div>
                        <p className="text-white/80 text-sm font-medium">查看故事树</p>
                        <p className="text-white/40 text-xs">探索所有分支</p>
                      </div>
                    </a>
                    <a
                      href="/assets"
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">🗄️</span>
                      <div>
                        <p className="text-white/80 text-sm font-medium">资产库</p>
                        <p className="text-white/40 text-xs">浏览社区资产</p>
                      </div>
                    </a>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* 底部装饰 - 电影院座位暗示 */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
      
      {/* 最小化的预告视频悬浮窗 */}
      {showTrailer && isVideoMinimized && (
        <VideoPreview
          videoUrl={trailerVideoUrl}
          thumbnailUrl={currentNode?.confirmedFrame?.thumbnailUrl}
          title="剧集预告"
          isMinimized={true}
          onToggleMinimize={() => setIsVideoMinimized(false)}
        />
      )}
    </div>
  );
}
