'use client';

interface ProgressBarProps {
  current: number; // 秒
  target: number;  // 秒
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function ProgressBar({ current, target }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isNearComplete = percentage >= 80;
  
  return (
    <div className="glass rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">剧集进度</span>
          {isNearComplete && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent animate-pulse">
              即将完成
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-white font-semibold">{formatDuration(current)}</span>
          <span className="text-white/40"> / </span>
          <span className="text-white/60">{formatDuration(target)}</span>
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`
            absolute inset-y-0 left-0 rounded-full transition-all duration-500
            ${isNearComplete 
              ? 'bg-gradient-to-r from-accent via-red-500 to-orange-500' 
              : 'bg-gradient-to-r from-accent to-red-500'}
          `}
          style={{ width: `${percentage}%` }}
        />
        
        {/* 闪烁效果 */}
        {isNearComplete && (
          <div 
            className="absolute inset-y-0 left-0 rounded-full bg-white/20 animate-pulse"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      
      {/* 里程碑标记 */}
      <div className="relative mt-2 h-4">
        {[25, 50, 75].map((milestone) => (
          <div
            key={milestone}
            className="absolute top-0 transform -translate-x-1/2"
            style={{ left: `${milestone}%` }}
          >
            <div className={`
              h-2 w-0.5 
              ${percentage >= milestone ? 'bg-accent' : 'bg-white/20'}
            `} />
            <span className={`
              text-[10px] 
              ${percentage >= milestone ? 'text-white/60' : 'text-white/30'}
            `}>
              {milestone}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


