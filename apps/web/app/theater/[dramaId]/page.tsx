'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useTheaterStore } from '@/lib/stores/theaterStore';
import { CinematicIntro } from './components/CinematicIntro';
import { ImmersivePlayer } from './components/ImmersivePlayer';
import { DirectorChoicePanel } from './components/DirectorChoicePanel';
import { AssetDrawer } from './components/AssetDrawer';
import { StoryTimeline } from './components/StoryTimeline';
import { CustomFrameEditor } from './components/CustomFrameEditor';
import { DemoEndScreen } from './components/DemoEndScreen';
import { PointsToast } from './components/PointsToast';
import { OnChainConfirmation } from './components/OnChainConfirmation';
import { FilmStripPreview } from './components/FilmStripPreview';
import { WalletPanel } from './components/WalletPanel';

type PlayPhase = 'intro' | 'watching' | 'choosing' | 'transitioning';

export default function TheaterPage() {
  const params = useParams();
  const dramaId = params.dramaId as string;
  
  const {
    currentDrama,
    currentNode,
    nodePath,
    candidateFrames,
    selectedFrame,
    isCustomMode,
    isLoading,
    isTransitioning,
    userPoints,
    isDemoEnd,
    pointsChange,
    setPointsChange,
    setIsCustomMode,
    loadMockDrama,
  } = useTheaterStore();
  
  // 播放阶段状态
  const [phase, setPhase] = useState<PlayPhase>('intro');
  const [showUI, setShowUI] = useState(false);
  const [showOnChainConfirm, setShowOnChainConfirm] = useState(false);
  
  // 加载剧集
  useEffect(() => {
    if (dramaId === 'demo') {
      loadMockDrama();
    }
  }, [dramaId, loadMockDrama]);
  
  // Intro 完成
  const handleIntroComplete = useCallback(() => {
    setPhase('watching');
    // 延迟显示 UI
    setTimeout(() => setShowUI(true), 500);
  }, []);
  
  // 场景播放完成
  const handleSceneEnd = useCallback(() => {
    // 如果有候选分镜，进入选择阶段
    if (candidateFrames.length > 0) {
      setPhase('choosing');
    }
  }, [candidateFrames]);
  
  // 监听节点变化
  useEffect(() => {
    if (currentNode && nodePath.length > 1) {
      // 新节点，重新开始播放
      setPhase('watching');
      // 显示链上确认
      setShowOnChainConfirm(true);
    }
  }, [currentNode?.nodeId]);
  
  // 监听转场状态
  useEffect(() => {
    if (isTransitioning) {
      setPhase('transitioning');
    }
  }, [isTransitioning]);
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            {/* 导演椅加载动画 */}
            <div className="h-24 w-24 mx-auto relative">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🎬</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-white font-medium mb-1">布置拍摄现场...</p>
            <p className="text-white/40 text-sm">Preparing Director's Cut</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 结束画面
  if (isDemoEnd) {
    return <DemoEndScreen dramaId={dramaId} />;
  }
  
  // 自定义编辑器模式
  if (isCustomMode) {
    return (
      <div className="absolute inset-0 bg-black overflow-auto">
        <div className="min-h-screen py-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* 返回按钮 */}
            <button
              onClick={() => setIsCustomMode(false)}
              className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回剧场
            </button>
            
            <CustomFrameEditor dramaId={dramaId} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* 钱包面板 */}
      <WalletPanel />
      
      {/* 开场动画 */}
      {phase === 'intro' && currentDrama && (
        <CinematicIntro
          title={currentDrama.title}
          chapter={currentNode?.depth ?? 1}
          onComplete={handleIntroComplete}
        />
      )}
      
      {/* 全屏沉浸式播放器 */}
      {phase !== 'intro' && (
        <ImmersivePlayer
          frame={currentNode?.confirmedFrame}
          isPlaying={phase === 'watching'}
          onSceneEnd={handleSceneEnd}
        />
      )}
      
      {/* 转场遮罩 */}
      {phase === 'transitioning' && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="h-16 w-16 mx-auto">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <p className="text-white/60 text-sm tracking-wider">下一幕准备中...</p>
          </div>
        </div>
      )}
      
      {/* 顶部故事时间轴 - 沉浸时淡出 */}
      <div className={`
        transition-all duration-500
        ${showUI && phase !== 'transitioning' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}>
        <StoryTimeline
          nodes={nodePath}
          currentIndex={nodePath.length - 1}
          totalExpected={5}
          dramaTitle={currentDrama?.title}
          userPoints={userPoints?.balance ?? 0}
        />
      </div>
      
      {/* 选择面板 - 放在中上方 */}
      <DirectorChoicePanel
        frames={candidateFrames}
        isVisible={phase === 'choosing' && !isTransitioning}
        remainingFreeRefresh={userPoints?.dailyFreeRefresh ?? 10}
        onCustomMode={() => setIsCustomMode(true)}
        position="top"
      />
      
      {/* 底部资产抽屉 - 观看时显示 */}
      <div className={`
        transition-all duration-500
        ${showUI && phase === 'watching' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}>
        <AssetDrawer
          frame={currentNode?.confirmedFrame}
          isChoosing={phase === 'choosing'}
        />
      </div>
      
      {/* 胶片时间轴 - 放在底部 */}
      {phase === 'choosing' && !isTransitioning && (
        <div className="absolute left-0 right-0 bottom-0 z-30 pointer-events-none">
          {/* 底部渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent -top-20" />
          <div className="relative w-full pointer-events-auto pb-4">
            <FilmStripPreview
              nodePath={nodePath}
              isChoosing={true}
              totalFrames={6}
              onInsertCustom={(afterIndex) => {
                console.log(`在第 ${afterIndex + 1} 幕后插入自定义分镜`);
                setIsCustomMode(true);
              }}
            />
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
      
      {/* 链上确认详情 */}
      <OnChainConfirmation
        isVisible={showOnChainConfirm}
        nodeId={currentNode?.nodeId}
        newAssetsCount={0}
        onClose={() => setShowOnChainConfirm(false)}
      />
    </div>
  );
}
