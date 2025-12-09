'use client';

import { useState } from 'react';
import { useCustomFrameEditorStore, useTheaterStore } from '@/lib/stores/theaterStore';
import type { Asset, AssetType } from '@/lib/types';

interface CustomFrameEditorProps {
  dramaId: string;
}

export function CustomFrameEditor({ dramaId }: CustomFrameEditorProps) {
  const { setIsCustomMode, setIsGenerating } = useTheaterStore();
  const {
    selectedActors,
    selectedScene,
    selectedProps,
    script,
    removeActor,
    setScene,
    removeProp,
    setScript,
    canGenerate,
    reset,
  } = useCustomFrameEditorStore();
  
  const [activeTab, setActiveTab] = useState<AssetType | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  const handleCancel = () => {
    reset();
    setIsCustomMode(false);
  };
  
  const handleGenerate = async () => {
    if (!canGenerate()) return;
    
    setIsGeneratingPreview(true);
    // TODO: 调用自定义分镜生成API
    console.log('Generating custom frame:', {
      actors: selectedActors.map(a => a.assetId),
      scene: selectedScene?.assetId,
      props: selectedProps.map(p => p.assetId),
      script,
    });
    
    setTimeout(() => {
      setIsGeneratingPreview(false);
    }, 3000);
  };
  
  return (
    <div className="glass-veil rounded-2xl border border-accent/30 overflow-hidden">
      {/* 头部 */}
      <div className="p-4 border-b border-white/10 bg-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="text-lg font-semibold text-white">自定义分镜编辑器</h2>
              <p className="text-white/60 text-sm">从社区资产库选择素材，创作你的专属分镜</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-white/60 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* 角色选择 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white">
              角色 <span className="text-accent">*</span>
            </label>
            <button
              onClick={() => setActiveTab('ACTOR')}
              className="text-xs text-accent hover:underline"
            >
              + 添加角色
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedActors.length > 0 ? (
              selectedActors.map((actor) => (
                <div
                  key={actor.assetId}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/20"
                >
                  <span className="text-white/80 text-sm">@{actor.name}</span>
                  <button
                    onClick={() => removeActor(actor.assetId)}
                    className="text-white/40 hover:text-red-400 transition"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-white/40 text-sm">请选择至少一个角色</span>
            )}
          </div>
        </div>
        
        {/* 场景选择 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white">
              场景 <span className="text-accent">*</span>
            </label>
            <button
              onClick={() => setActiveTab('SCENE')}
              className="text-xs text-accent hover:underline"
            >
              {selectedScene ? '更换场景' : '+ 选择场景'}
            </button>
          </div>
          {selectedScene ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/20">
              <span className="text-lg">📍</span>
              <span className="text-white/80">{selectedScene.name}</span>
              <button
                onClick={() => setScene(null)}
                className="ml-auto text-white/40 hover:text-red-400 transition"
              >
                ×
              </button>
            </div>
          ) : (
            <span className="text-white/40 text-sm">请选择一个场景</span>
          )}
        </div>
        
        {/* 道具选择 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white">道具</label>
            <button
              onClick={() => setActiveTab('PROP')}
              className="text-xs text-accent hover:underline"
            >
              + 添加道具
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedProps.length > 0 ? (
              selectedProps.map((prop) => (
                <div
                  key={prop.assetId}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/20"
                >
                  <span className="text-sm">🔧</span>
                  <span className="text-white/80 text-sm">{prop.name}</span>
                  <button
                    onClick={() => removeProp(prop.assetId)}
                    className="text-white/40 hover:text-red-400 transition"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-white/40 text-sm">可选：添加道具丰富画面</span>
            )}
          </div>
        </div>
        
        {/* 分镜脚本 */}
        <div>
          <label className="text-sm font-medium text-white mb-2 block">
            分镜脚本 <span className="text-accent">*</span>
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="描述这个分镜的内容，例如：远景镜头，男主拉着女主慌张地往逃生通道跑..."
            className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:border-accent/50 transition"
          />
          <p className="text-right text-white/40 text-xs mt-1">
            {script.length} / 200
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 transition"
          >
            取消
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate() || isGeneratingPreview}
            className={`
              flex-1 py-3 rounded-xl font-semibold transition
              ${canGenerate() && !isGeneratingPreview
                ? 'bg-gradient-to-r from-accent to-red-500 text-white hover:opacity-90'
                : 'bg-white/10 text-white/40 cursor-not-allowed'}
            `}
          >
            {isGeneratingPreview ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                生成中...
              </span>
            ) : (
              '预览生成效果'
            )}
          </button>
        </div>
        
        {/* 积分提示 */}
        <p className="text-center text-white/40 text-xs">
          自定义分镜生成消耗 <span className="text-accent">10</span> 积分
        </p>
      </div>
      
      {/* 资产选择弹窗 - TODO: 实现完整的资产选择器 */}
      {activeTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 max-w-lg w-full mx-4 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                选择{activeTab === 'ACTOR' ? '角色' : activeTab === 'SCENE' ? '场景' : '道具'}
              </h3>
              <button
                onClick={() => setActiveTab(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* 搜索框 */}
            <input
              type="text"
              placeholder="搜索资产..."
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 mb-4"
            />
            
            {/* 资产列表占位 */}
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-accent/50 cursor-pointer transition"
                >
                  <div className="h-16 bg-white/5 rounded mb-2" />
                  <p className="text-white/80 text-sm truncate">
                    {activeTab === 'ACTOR' ? `角色 ${i}` : 
                     activeTab === 'SCENE' ? `场景 ${i}` : 
                     `道具 ${i}`}
                  </p>
                </div>
              ))}
            </div>
            
            <p className="text-center text-white/40 text-xs mt-4">
              资产选择器开发中...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

