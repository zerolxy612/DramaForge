'use client';

import { useEffect, useState } from 'react';
import { useTheaterStore } from '@/lib/stores/theaterStore';

interface DemoEndScreenProps {
  dramaId: string;
}

// 生成随机彩纸粒子
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100;
  const randomSize = 8 + Math.random() * 8;
  const randomDuration = 3 + Math.random() * 2;
  
  return (
    <div
      className="absolute animate-confetti-fall"
      style={{
        left: `${randomX}%`,
        top: '-20px',
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        animationDelay: `${delay}s`,
        animationDuration: `${randomDuration}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  );
}

export function DemoEndScreen({ dramaId }: DemoEndScreenProps) {
  const { 
    currentDrama, 
    nodePath, 
    userPoints,
    restartDemo,
  } = useTheaterStore();
  
  const [isVisible, setIsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  
  useEffect(() => {
    // 入场动画序列
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setShowConfetti(true), 300);
    const timer3 = setTimeout(() => setShowStats(true), 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  const handleRestart = async () => {
    setIsRestarting(true);
    await restartDemo();
  };
  
  const totalChoices = nodePath.length - 1;
  const totalDuration = nodePath.reduce((acc, node) => acc + node.confirmedFrame.duration, 0);
  
  // 彩纸颜色
  const confettiColors = ['#E50914', '#FF6B6B', '#FFE66D', '#4ECDC4', '#9B59B6', '#3498DB'];
  
  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      bg-black/90 backdrop-blur-xl
      transition-opacity duration-500
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      {/* CSS 彩纸效果 */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 0.05}
              color={confettiColors[i % confettiColors.length]}
            />
          ))}
        </div>
      )}
      
      {/* 背景动效 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 渐变光晕 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* 漂浮粒子 */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* 主内容 */}
      <div className={`
        relative max-w-2xl w-full mx-4 text-center
        transition-all duration-700 delay-200
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}>
        {/* 标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6 animate-pulse">
            <span className="text-accent text-sm font-medium">🎬 本章体验完成</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-shimmer-text">
              感谢你的参与！
            </span>
          </h1>
          
          <p className="text-white/60 text-lg max-w-md mx-auto">
            你刚刚体验了「<span className="text-accent">{currentDrama?.title || '赛博侦探'}</span>」的互动剧情
          </p>
        </div>
        
        {/* 统计数据 */}
        <div className={`
          grid grid-cols-3 gap-4 mb-8
          transition-all duration-500
          ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}
        `}>
          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition group">
            <div className="text-3xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform">{totalChoices}</div>
            <div className="text-white/60 text-sm">关键抉择</div>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition group">
            <div className="text-3xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform">{totalDuration}s</div>
            <div className="text-white/60 text-sm">剧情时长</div>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition group">
            <div className="text-3xl font-bold text-green-400 mb-1 group-hover:scale-110 transition-transform">+{(totalChoices * 10)}</div>
            <div className="text-white/60 text-sm">获得积分</div>
          </div>
        </div>
        
        {/* 你的选择路径 */}
        <div className={`
          glass rounded-2xl p-6 border border-white/10 mb-8 text-left
          transition-all duration-500 delay-300
          ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}
        `}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>📖</span> 你的故事线
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {nodePath.map((node, index) => (
              <div 
                key={node.nodeId} 
                className="flex items-start gap-3 animate-slide-in-up"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className={`
                  h-6 w-6 rounded-full grid place-items-center text-xs font-bold flex-shrink-0 mt-0.5
                  ${index === nodePath.length - 1 
                    ? 'bg-accent text-white ring-2 ring-accent/30' 
                    : 'bg-white/10 text-white/60'}
                `}>
                  {index + 1}
                </div>
                <p className={`
                  text-sm leading-relaxed
                  ${index === nodePath.length - 1 ? 'text-white' : 'text-white/60'}
                `}>
                  {node.confirmedFrame.script.slice(0, 80)}
                  {node.confirmedFrame.script.length > 80 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* 行动按钮 */}
        <div className={`
          flex flex-col sm:flex-row gap-4 justify-center
          transition-all duration-500 delay-500
          ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}
        `}>
          <button
            onClick={handleRestart}
            disabled={isRestarting}
            className="
              relative px-10 py-4 rounded-full font-semibold text-lg
              bg-gradient-to-r from-accent via-red-500 to-accent text-white
              shadow-[0_10px_40px_rgba(229,9,20,0.4)]
              hover:scale-105 hover:shadow-[0_15px_50px_rgba(229,9,20,0.5)]
              transition-all duration-300 overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            "
          >
            {/* 闪光效果 */}
            {!isRestarting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
            
            <span className="relative">
              {isRestarting ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  加载中...
                </span>
              ) : (
                '🔄 重新体验'
              )}
            </span>
          </button>
          
          <a
            href="/"
            className="
              px-10 py-4 rounded-full font-semibold text-lg
              border border-white/20 text-white/80
              hover:bg-white/5 hover:border-white/30
              transition-all duration-300
            "
          >
            返回首页
          </a>
        </div>
        
        {/* 底部提示 */}
        <div className={`
          mt-12 transition-all duration-500 delay-700
          ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}
        `}>
          <p className="text-white/40 text-sm mb-4">
            你的每个选择都将上链记录，成为独一无二的故事 🔗
          </p>
          
          <div className="flex justify-center gap-6">
            <a 
              href="#" 
              className="text-white/60 hover:text-accent text-sm flex items-center gap-1.5 transition"
            >
              <span>🐦</span> Twitter
            </a>
            <a 
              href="#" 
              className="text-white/60 hover:text-accent text-sm flex items-center gap-1.5 transition"
            >
              <span>💬</span> Discord
            </a>
            <a 
              href="/whitepaper" 
              className="text-white/60 hover:text-accent text-sm flex items-center gap-1.5 transition"
            >
              <span>📄</span> 白皮书
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
        
        @keyframes shimmer-text {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-shimmer-text {
          background-size: 200% auto;
          animation: shimmer-text 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
