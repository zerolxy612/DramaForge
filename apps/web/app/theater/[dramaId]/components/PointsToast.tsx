'use client';

import { useEffect, useState } from 'react';

interface PointsToastProps {
  amount: number;
  type: 'earn' | 'spend';
  onClose: () => void;
}

export function PointsToast({ amount, type, onClose }: PointsToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // 入场动画
    setTimeout(() => setIsVisible(true), 50);
    
    // 自动关闭
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const isEarn = type === 'earn';
  
  return (
    <div className={`
      absolute top-24 right-4 z-50
      transition-all duration-300
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        flex items-center gap-3 px-5 py-3 rounded-xl
        ${isEarn 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' 
          : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30'}
        backdrop-blur-lg shadow-lg
      `}>
        {/* 图标 */}
        <div className={`
          h-10 w-10 rounded-full grid place-items-center text-lg
          ${isEarn ? 'bg-green-500/30' : 'bg-orange-500/30'}
        `}>
          {isEarn ? '💰' : '💸'}
        </div>
        
        {/* 内容 */}
        <div>
          <div className={`
            text-lg font-bold
            ${isEarn ? 'text-green-400' : 'text-orange-400'}
          `}>
            {isEarn ? '+' : '-'}{amount} 导演积分
          </div>
          <div className="text-white/60 text-xs">
            {isEarn ? '执导奖励' : '已扣除'}
          </div>
        </div>
        
        {/* 动画粒子 */}
        {isEarn && (
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
