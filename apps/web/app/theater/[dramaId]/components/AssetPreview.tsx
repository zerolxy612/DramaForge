'use client';

import { useMemo } from 'react';
import type { FrameData } from '@/lib/types';
import { getAssetById } from '@/lib/mock';

interface AssetPreviewProps {
  frame?: FrameData;
}

export function AssetPreview({ frame }: AssetPreviewProps) {
  // 获取真实资产数据
  const assets = useMemo(() => {
    if (!frame) return { actors: [], scene: null, props: [] };
    
    const actors = frame.actorIds
      .map(id => getAssetById(id))
      .filter(Boolean);
    
    const scene = frame.sceneId ? getAssetById(frame.sceneId) : null;
    
    const props = frame.propIds
      .map(id => getAssetById(id))
      .filter(Boolean);
    
    return { actors, scene, props };
  }, [frame]);
  
  if (!frame) {
    return (
      <div className="glass rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>🎭</span> 当前分镜资产
        </h3>
        <p className="text-white/40 text-sm">暂无分镜数据</p>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 space-y-5">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <span>🎭</span> 当前分镜资产
      </h3>
      
      {/* 角色 */}
      <div>
        <p className="text-xs uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
          <span>👤</span> 角色
        </p>
        <div className="space-y-2">
          {assets.actors.length > 0 ? (
            assets.actors.map((actor) => (
              <div 
                key={actor!.assetId}
                className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition group cursor-pointer"
              >
                {/* 角色头像 */}
                <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                  {actor!.thumbnailUrl ? (
                    <img 
                      src={actor!.thumbnailUrl} 
                      alt={actor!.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-600 grid place-items-center text-white text-xs font-bold">
                      {actor!.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* 角色信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm font-medium truncate">
                    {actor!.name}
                  </p>
                  <p className="text-white/40 text-xs">
                    被使用 {actor!.usageCount} 次
                  </p>
                </div>
                
                {/* 链接图标 */}
                <div className="text-white/30 group-hover:text-accent transition">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            ))
          ) : (
            <span className="text-white/40 text-sm">暂无角色</span>
          )}
        </div>
      </div>
      
      {/* 场景 */}
      <div>
        <p className="text-xs uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
          <span>🏞️</span> 场景
        </p>
        {assets.scene ? (
          <div className="rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition group cursor-pointer">
            {/* 场景预览图 */}
            <div className="aspect-video relative overflow-hidden">
              {assets.scene.thumbnailUrl ? (
                <img 
                  src={assets.scene.thumbnailUrl} 
                  alt={assets.scene.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 grid place-items-center">
                  <span className="text-3xl">📍</span>
                </div>
              )}
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* 场景名称 */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-medium text-sm">{assets.scene.name}</p>
                <p className="text-white/50 text-xs">使用 {assets.scene.usageCount} 次</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg">📍</span>
            <span className="text-white/40 text-sm">暂无场景</span>
          </div>
        )}
      </div>
      
      {/* 道具 */}
      <div>
        <p className="text-xs uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
          <span>🔧</span> 道具
        </p>
        <div className="flex flex-wrap gap-2">
          {assets.props.length > 0 ? (
            assets.props.map((prop) => (
              <div 
                key={prop!.assetId}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition group cursor-pointer"
              >
                {/* 道具图标 */}
                <div className="h-6 w-6 rounded overflow-hidden flex-shrink-0">
                  {prop!.thumbnailUrl ? (
                    <img 
                      src={prop!.thumbnailUrl} 
                      alt={prop!.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 grid place-items-center text-xs">
                      🔧
                    </div>
                  )}
                </div>
                <span className="text-white/80 text-sm">{prop!.name}</span>
              </div>
            ))
          ) : (
            <span className="text-white/40 text-sm">暂无道具</span>
          )}
        </div>
      </div>
      
      {/* 资产库链接 */}
      <div className="pt-3 border-t border-white/10">
        <a 
          href="/assets"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-accent hover:border-accent/30 transition text-sm"
        >
          <span>🗄️</span>
          浏览社区资产库
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
