'use client';

import { useState, useEffect } from 'react';

interface CinematicIntroProps {
  title: string;
  chapter: number;
  onComplete: () => void;
}

export function CinematicIntro({ title, chapter, onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<'countdown' | 'filmroll' | 'title' | 'done'>('countdown');
  const [countdownNumber, setCountdownNumber] = useState(3);
  
  useEffect(() => {
    // 倒计时阶段
    if (phase === 'countdown') {
      if (countdownNumber > 0) {
        const timer = setTimeout(() => setCountdownNumber(countdownNumber - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setPhase('filmroll');
      }
    }
    
    // 胶片滚动阶段
    if (phase === 'filmroll') {
      const timer = setTimeout(() => setPhase('title'), 1200);
      return () => clearTimeout(timer);
    }
    
    // 标题展示阶段
    if (phase === 'title') {
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, countdownNumber, onComplete]);
  
  if (phase === 'done') return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* 胶片边框装饰 */}
      <div className="absolute top-0 left-0 right-0 h-16 flex">
        {[...Array(20)].map((_, i) => (
          <div key={`top-${i}`} className="flex-1 border-r border-white/10 flex items-center justify-center">
            <div className="w-4 h-8 rounded-sm bg-white/5" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 flex">
        {[...Array(20)].map((_, i) => (
          <div key={`bottom-${i}`} className="flex-1 border-r border-white/10 flex items-center justify-center">
            <div className="w-4 h-8 rounded-sm bg-white/5" />
          </div>
        ))}
      </div>
      
      {/* 倒计时 */}
      {phase === 'countdown' && (
        <div className="relative">
          {/* 老式电影倒计时圆圈 */}
          <div className="relative h-64 w-64">
            {/* 外圈 */}
            <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }}>
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="#E50914"
                strokeWidth="2"
                strokeDasharray="754"
                strokeDashoffset={754 - (754 * (3 - countdownNumber)) / 3}
                className="transition-all duration-700"
                transform="rotate(-90 128 128)"
              />
            </svg>
            
            {/* 刻度线 */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-white/20"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-100px)`,
                }}
              />
            ))}
            
            {/* 数字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span 
                key={countdownNumber}
                className="text-8xl font-bold text-white animate-countdown"
                style={{ fontFamily: 'monospace' }}
              >
                {countdownNumber || '▶'}
              </span>
            </div>
          </div>
          
          {/* 闪烁的噪点 */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="film-grain" />
          </div>
        </div>
      )}
      
      {/* 胶片滚动 */}
      {phase === 'filmroll' && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* 胶片条 */}
          <div className="absolute inset-0 flex items-center animate-filmroll-fast">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-[300px] h-[200px] mx-4 bg-white/5 rounded-lg border border-white/10"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=200&fit=crop')`,
                  backgroundSize: 'cover',
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
          
          {/* 中心聚光 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]" />
          
          {/* 扫描线 */}
          <div className="scanline" />
          
          {/* 噪点 */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="film-grain" />
          </div>
        </div>
      )}
      
      {/* 标题展示 */}
      {phase === 'title' && (
        <div className="relative text-center px-8 animate-fadeIn">
          {/* 制作方标签 */}
          <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-white/40 text-sm tracking-[0.3em] uppercase">Drama Protocol Presents</span>
          </div>
          
          {/* 主标题 */}
          <h1 
            className="text-5xl md:text-7xl font-display font-bold text-white mb-4 animate-slide-in-up"
            style={{ 
              animationDelay: '0.4s',
              textShadow: '0 0 60px rgba(229,9,20,0.5), 0 0 120px rgba(229,9,20,0.3)'
            }}
          >
            {title}
          </h1>
          
          {/* 章节 */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <span className="inline-block px-6 py-2 rounded-full border border-accent/50 text-accent text-lg">
              第 {chapter} 幕
            </span>
          </div>
          
          {/* 装饰线 */}
          <div className="mt-8 flex items-center justify-center gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent" />
          </div>
        </div>
      )}
      
      {/* 暗角效果 */}
      <div className="absolute inset-0 pointer-events-none vignette" />
      
      {/* 跳过按钮 */}
      <button
        onClick={() => {
          setPhase('done');
          onComplete();
        }}
        className="absolute bottom-8 right-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 text-sm hover:bg-white/20 hover:text-white transition-all"
      >
        跳过 →
      </button>
      
      <style jsx>{`
        @keyframes filmroll-fast {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-filmroll-fast {
          animation: filmroll-fast 1s linear;
        }
      `}</style>
    </div>
  );
}
