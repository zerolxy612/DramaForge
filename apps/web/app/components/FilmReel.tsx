'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';

interface FilmReelProps {
  children: ReactNode;
  delay?: number;
  index?: number;
}

export function FilmReel({ children, delay = 0, index = 0 }: FilmReelProps) {
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'flash' | 'visible'>('idle');
  const [flashCount, setFlashCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    // 倒计时阶段 - 显示数字
    const timer1 = setTimeout(() => {
      setPhase('countdown');
    }, delay);

    // 快速闪烁阶段 - 模拟电影帧快速播放
    const timer2 = setTimeout(() => {
      setPhase('flash');
      let count = 0;
      const flashInterval = setInterval(() => {
        setFlashCount(prev => prev + 1);
        count++;
        if (count >= 8) {
          clearInterval(flashInterval);
        }
      }, 80);
    }, delay + 600);

    // 最终显示
    const timer3 = setTimeout(() => {
      setPhase('visible');
    }, delay + 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isInView, delay]);

  return (
    <div ref={ref} className="relative">
      {/* 倒计数字 - 更大更明显 */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/90 rounded-2xl border-4 border-accent/50">
          <div className="relative">
            <span className="text-8xl sm:text-9xl font-bold text-accent drop-shadow-[0_0_30px_rgba(229,9,20,0.8)] font-mono animate-pulse">
              {index + 1}
            </span>
            <div className="absolute inset-0 text-8xl sm:text-9xl font-bold text-white/20 font-mono blur-sm">
              {index + 1}
            </div>
          </div>
        </div>
      )}

      {/* 胶片穿孔装饰 */}
      {phase === 'visible' && (
        <>
          <div className="absolute -left-3 top-0 bottom-0 w-2 flex flex-col justify-around animate-fadeIn">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-accent/40 rounded-sm" />
            ))}
          </div>
          <div className="absolute -right-3 top-0 bottom-0 w-2 flex flex-col justify-around animate-fadeIn">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-accent/40 rounded-sm" />
            ))}
          </div>
        </>
      )}

      {/* 扫描线效果 */}
      {phase === 'visible' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
          <div className="scanline" />
        </div>
      )}

      {/* 主内容 */}
      <div
        className={`
          transition-all duration-150
          ${phase === 'idle' ? 'opacity-0 scale-90' : ''}
          ${phase === 'countdown' ? 'opacity-0 scale-90 blur-md' : ''}
          ${phase === 'flash' ? `${flashCount % 2 === 0 ? 'opacity-100 scale-110 brightness-125' : 'opacity-40 scale-90 brightness-75'} blur-[2px]` : ''}
          ${phase === 'visible' ? 'opacity-100 scale-100 blur-0 brightness-100' : ''}
        `}
        style={{
          transform: phase === 'flash' ? `translateY(${flashCount % 2 === 0 ? '-4px' : '4px'}) rotate(${flashCount % 2 === 0 ? '1deg' : '-1deg'})` : 'translateY(0) rotate(0)'
        }}
      >
        {children}
      </div>

      {/* 胶片颗粒感 - 更明显 */}
      {phase === 'flash' && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden z-10 bg-black/20">
          <div className="film-grain opacity-60" />
        </div>
      )}

      {/* 暗角效果 */}
      {phase === 'visible' && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl vignette opacity-20" />
      )}
    </div>
  );
}

interface FilmReelContainerProps {
  children: ReactNode;
  startDelay?: number;
  itemDelay?: number;
}

export function FilmReelContainer({
  children,
  startDelay = 0,
  itemDelay = 150
}: FilmReelContainerProps) {
  const [showFlash, setShowFlash] = useState(false);
  const [flashIntensity, setFlashIntensity] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    // 放映机启动闪烁效果 - 适中强度
    const flashTimer = setTimeout(() => {
      // 第一次闪
      setShowFlash(true);
      setFlashIntensity(40);
      setTimeout(() => {
        setShowFlash(false);
      }, 80);

      // 第二次闪
      setTimeout(() => {
        setShowFlash(true);
        setFlashIntensity(35);
        setTimeout(() => {
          setShowFlash(false);
        }, 80);
      }, 200);

      // 第三次闪
      setTimeout(() => {
        setShowFlash(true);
        setFlashIntensity(30);
        setTimeout(() => {
          setShowFlash(false);
        }, 80);
      }, 380);
    }, startDelay);

    return () => clearTimeout(flashTimer);
  }, [isInView, startDelay]);

  return (
    <div ref={ref} className="relative">
      {/* 闪光效果 - 更强烈 */}
      {showFlash && (
        <div
          className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-100"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${flashIntensity / 100})`
          }}
        />
      )}

      {children}
    </div>
  );
}

