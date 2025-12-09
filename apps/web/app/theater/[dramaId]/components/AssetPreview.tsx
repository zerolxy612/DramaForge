'use client';

import type { FrameData } from '@/lib/types';

interface AssetPreviewProps {
  frame?: FrameData;
}

export function AssetPreview({ frame }: AssetPreviewProps) {
  if (!frame) {
    return (
      <div className="glass rounded-2xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">当前分镜资产</h3>
        <p className="text-white/40 text-sm">暂无分镜数据</p>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-2xl p-4 border border-white/10 space-y-4">
      <h3 className="text-white font-semibold">当前分镜资产</h3>
      
      {/* 角色 */}
      <div>
        <p className="text-xs uppercase tracking-wider text-accent mb-2">角色</p>
        <div className="flex flex-wrap gap-2">
          {frame.actorIds.length > 0 ? (
            frame.actorIds.map((actorId, i) => (
              <div 
                key={actorId}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 grid place-items-center text-white text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-white/80 text-sm">角色 {i + 1}</span>
              </div>
            ))
          ) : (
            <span className="text-white/40 text-sm">暂无角色</span>
          )}
        </div>
      </div>
      
      {/* 场景 */}
      <div>
        <p className="text-xs uppercase tracking-wider text-accent mb-2">场景</p>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <span className="text-lg">📍</span>
          <span className="text-white/80 text-sm">
            {frame.sceneId ? `场景 #${frame.sceneId}` : '暂无场景'}
          </span>
        </div>
      </div>
      
      {/* 道具 */}
      <div>
        <p className="text-xs uppercase tracking-wider text-accent mb-2">道具</p>
        <div className="flex flex-wrap gap-2">
          {frame.propIds.length > 0 ? (
            frame.propIds.map((propId, i) => (
              <div 
                key={propId}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-sm">🔧</span>
                <span className="text-white/80 text-sm">道具 {i + 1}</span>
              </div>
            ))
          ) : (
            <span className="text-white/40 text-sm">暂无道具</span>
          )}
        </div>
      </div>
      
      {/* 资产库链接 */}
      <div className="pt-2 border-t border-white/10">
        <a 
          href="/assets"
          className="text-sm text-accent hover:underline"
        >
          浏览社区资产库 →
        </a>
      </div>
    </div>
  );
}

