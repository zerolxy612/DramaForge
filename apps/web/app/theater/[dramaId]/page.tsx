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
import { DemoEndScreen } from './components/DemoEndScreen';
import { PointsToast } from './components/PointsToast';

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
  
  useEffect(() => {
    if (dramaId === 'demo') {
      loadMockDrama();
    } else {
      // TODO: 加载真实剧集数据
      console.log('Loading drama:', dramaId);
    }
  }, [dramaId, loadMockDrama]);
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          {/* 加载动画 */}
          <div className="relative h-20 w-20 mx-auto">
            <div className="absolute inset-0 border-2 border-accent/30 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-4 border-2 border-white/20 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
          </div>
          
          <div>
            <p className="text-white font-medium mb-1">正在加载剧场...</p>
            <p className="text-white/40 text-sm">准备你的赛博朋克冒险</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 剧集结束
  if (isDemoEnd) {
    return <DemoEndScreen dramaId={dramaId} />;
  }
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-[#0a0b10] to-[#06060a]" />
      <ParticleBackground />
      <div className="fixed inset-0 noise pointer-events-none opacity-30" />
      
      {/* 转场遮罩 */}
      {isTransitioning && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-white/80">正在生成下一幕...</p>
          </div>
        </div>
      )}
      
      {/* 积分变化提示 */}
      {pointsChange && (
        <PointsToast
          amount={pointsChange.amount}
          type={pointsChange.type}
          onClose={() => setPointsChange(null)}
        />
      )}
      
      {/* 主内容 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部信息 */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* 返回按钮 */}
            <a 
              href="/"
              className="h-10 w-10 rounded-full glass border border-white/10 grid place-items-center text-white/60 hover:text-white hover:border-white/30 transition"
            >
              ←
            </a>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {currentDrama?.title || '互动漫剧'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white/60 text-sm">
                  第 {currentNode?.depth ?? 0} 幕
                </span>
                {currentDrama?.tags?.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 用户积分 */}
          <div className="glass rounded-full px-5 py-2.5 border border-white/10 flex items-center gap-3">
            <span className="text-lg">💰</span>
            <div>
              <div className="text-accent font-bold text-lg">
                {userPoints?.balance ?? 0}
              </div>
              <div className="text-white/40 text-xs -mt-0.5">积分</div>
            </div>
          </div>
        </header>
        
        {/* 进度条 */}
        <ProgressBar 
          current={currentDrama?.currentDuration ?? 0}
          target={currentDrama?.targetDuration ?? 300}
        />
        
        {/* 故事路径指示器 */}
        {nodePath.length > 1 && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-white/40 text-xs flex-shrink-0">故事线：</span>
            {nodePath.map((node, index) => (
              <div key={node.nodeId} className="flex items-center gap-2 flex-shrink-0">
                <div className={`
                  h-6 w-6 rounded-full grid place-items-center text-xs font-medium
                  ${index === nodePath.length - 1 
                    ? 'bg-accent text-white' 
                    : 'bg-white/10 text-white/60'}
                `}>
                  {index + 1}
                </div>
                {index < nodePath.length - 1 && (
                  <div className="w-4 h-0.5 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        )}
        
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
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>🌳</span> 故事树
              </h3>
              <p className="text-white/60 text-sm mb-4">
                查看所有分支的发展路径，发现隐藏结局
              </p>
              <a 
                href={`/drama/${dramaId}/tree`}
                className="block w-full py-3 text-center rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition"
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
