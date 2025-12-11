'use client';

import { useState, useEffect } from 'react';
import { useCustomFrameEditorStore, useTheaterStore, useAssetLibraryStore } from '@/lib/stores/theaterStore';
import type { Asset } from '@/lib/types';
import { AssetType } from '@/lib/types';

interface CustomFrameEditorProps {
  dramaId: string;
}

export function CustomFrameEditor({ dramaId }: CustomFrameEditorProps) {
  const { setIsCustomMode, isGenerating: isTheaterGenerating, generateCustomFrame: theaterGenerateCustomFrame } = useTheaterStore();
  const {
    selectedActors,
    selectedScene,
    selectedProps,
    script,
    addActor,
    removeActor,
    setScene,
    addProp,
    removeProp,
    setScript,
    canGenerate,
    getGenerateParams,
    reset,
  } = useCustomFrameEditorStore();
  
  const {
    actors,
    scenes,
    props,
    loadAssets,
    isLoading: isLoadingAssets,
  } = useAssetLibraryStore();
  
  const [activeTab, setActiveTab] = useState<AssetType | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 加载资产库
  useEffect(() => {
    if (actors.length === 0 || scenes.length === 0 || props.length === 0) {
      loadAssets();
    }
  }, [actors.length, scenes.length, props.length, loadAssets]);
  
  const handleCancel = () => {
    reset();
    setIsCustomMode(false);
  };
  
  const handleGenerate = async () => {
    if (!canGenerate()) return;
    
    setIsGeneratingPreview(true);
    
    try {
      await theaterGenerateCustomFrame(getGenerateParams());
      reset();
    } catch (error) {
      console.error('Failed to generate custom frame:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };
  
  const handleSelectAsset = (asset: Asset) => {
    switch (asset.assetType) {
      case AssetType.ACTOR:
        addActor(asset);
        break;
      case AssetType.SCENE:
        setScene(asset);
        break;
      case AssetType.PROP:
        addProp(asset);
        break;
    }
    setActiveTab(null);
    setSearchQuery('');
  };

  // 过滤资产
  const getFilteredAssets = (): Asset[] => {
    let assetList: Asset[] = [];
    switch (activeTab) {
      case AssetType.ACTOR:
        assetList = actors;
        break;
      case AssetType.SCENE:
        assetList = scenes;
        break;
      case AssetType.PROP:
        assetList = props;
        break;
      default:
        return [];
    }

    if (!searchQuery) return assetList;

    const query = searchQuery.toLowerCase();
    return assetList.filter(asset =>
      asset.name.toLowerCase().includes(query) ||
      asset.description?.toLowerCase().includes(query)
    );
  };
  
  return (
    <div className="glass-veil rounded-2xl border border-accent/30 overflow-hidden animate-scale-in max-w-5xl w-full mx-auto">
      {/* 头部 */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-accent/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">✨</span>
            <div>
              <h2 className="text-lg font-semibold text-white">自定义分镜编辑器</h2>
              <p className="text-white/60 text-sm">从社区资产库选择素材，创作你的专属分镜</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition grid place-items-center"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        {/* 左侧：编辑区 */}
        <div className="p-5 space-y-6">
          {/* 角色选择 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <span>👤</span> 角色 <span className="text-accent">*</span>
              </label>
              <button
                onClick={() => setActiveTab(AssetType.ACTOR)}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <span>+</span> 添加角色
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedActors.length > 0 ? (
                selectedActors.map((actor: Asset) => (
                  <div
                    key={actor.assetId}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/20 group hover:border-accent/30 transition"
                  >
                    {actor.thumbnailUrl && (
                      <img
                        src={actor.thumbnailUrl}
                        alt={actor.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-white/80 text-sm">@{actor.name}</span>
                    <button
                      onClick={() => removeActor(actor.assetId)}
                      className="text-white/40 hover:text-red-400 transition ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-white/40 text-sm py-2">请选择至少一个角色</div>
              )}
            </div>
          </div>
          
          {/* 场景选择 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <span>🏞️</span> 场景 <span className="text-accent">*</span>
              </label>
              <button
                onClick={() => setActiveTab(AssetType.SCENE)}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                {selectedScene ? '更换场景' : <><span>+</span> 选择场景</>}
              </button>
            </div>
            {selectedScene ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/20 group hover:border-accent/30 transition">
                {selectedScene.thumbnailUrl && (
                  <img 
                    src={selectedScene.thumbnailUrl} 
                    alt={selectedScene.name}
                    className="h-12 w-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <span className="text-white/80">{selectedScene.name}</span>
                  <p className="text-white/40 text-xs mt-0.5">点击更换</p>
                </div>
                <button
                  onClick={() => setScene(null)}
                  className="text-white/40 hover:text-red-400 transition"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="text-white/40 text-sm py-2">请选择一个场景</div>
            )}
          </div>
          
          {/* 道具选择 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <span>🔧</span> 道具 <span className="text-white/40 text-xs">(可选)</span>
              </label>
              <button
                onClick={() => setActiveTab(AssetType.PROP)}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <span>+</span> 添加道具
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedProps.length > 0 ? (
                selectedProps.map((prop: Asset) => (
                  <div
                    key={prop.assetId}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/20 group hover:border-accent/30 transition"
                  >
                    {prop.thumbnailUrl && (
                      <img
                        src={prop.thumbnailUrl}
                        alt={prop.name}
                        className="h-5 w-5 rounded object-cover"
                      />
                    )}
                    <span className="text-white/80 text-sm">{prop.name}</span>
                    <button
                      onClick={() => removeProp(prop.assetId)}
                      className="text-white/40 hover:text-red-400 transition ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-white/40 text-sm py-2">添加道具可以丰富画面</div>
              )}
            </div>
          </div>
          
          {/* 分镜脚本 */}
          <div>
            <label className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <span>📝</span> 分镜脚本 <span className="text-accent">*</span>
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="描述这个分镜的内容，例如：远景镜头，K手持芯片站在雨中，身后霓虹灯闪烁..."
              className="w-full h-28 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:border-accent/50 transition"
              maxLength={200}
            />
            <div className="flex justify-between mt-2">
              <p className="text-white/40 text-xs">
                提示：描述越具体，生成效果越好
              </p>
              <p className={`text-xs ${script.length > 180 ? 'text-orange-400' : 'text-white/40'}`}>
                {script.length} / 200
              </p>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-3.5 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/30 transition font-medium"
            >
              取消
            </button>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate() || isGeneratingPreview || isTheaterGenerating}
              className={`
                flex-1 py-3.5 rounded-xl font-semibold transition relative overflow-hidden
                ${canGenerate() && !isGeneratingPreview && !isTheaterGenerating
                  ? 'bg-gradient-to-r from-accent to-red-500 text-white hover:opacity-90 hover:scale-[1.02]'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'}
              `}
            >
              {/* 闪光效果 */}
              {canGenerate() && !isGeneratingPreview && !isTheaterGenerating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
              
              <span className="relative">
                {isGeneratingPreview || isTheaterGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI 生成中...
                  </span>
                ) : (
                  '✨ 生成分镜'
                )}
              </span>
            </button>
          </div>
          
          {/* 积分提示 */}
          <p className="text-center text-white/40 text-xs flex items-center justify-center gap-2">
            <span>💰</span>
            自定义分镜生成消耗 <span className="text-accent font-medium">10</span> 积分
          </p>
        </div>

        {/* 右侧：实时预览 (新增) */}
        <div className="hidden lg:block border-l border-white/10 bg-black/20 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-white/80">AI 实时推演</span>
          </div>
          
          {/* 模拟结构化卡片 */}
          <div className="bg-[#1a1b20] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
             {/* 头部 */}
             <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <span className="text-xs font-mono text-white/60">FRAME-PREVIEW</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent/20 text-accent font-medium">AI GENERATED</span>
             </div>
             
             {/* 画面预览 (合成图) */}
             <div className="aspect-video relative bg-black group overflow-hidden">
                {selectedScene ? (
                   <img src={selectedScene.thumbnailUrl} alt="scene" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                ) : (
                   <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-black">
                      <span className="text-white/20 text-xs">等待场景...</span>
                   </div>
                )}
                
                {/* 角色叠加 */}
                <div className="absolute bottom-0 left-0 right-0 h-2/3 flex items-end justify-center pb-0 gap-4">
                   {selectedActors.map((actor: Asset, idx: number) => (
                      <div key={actor.assetId} className="relative w-24 h-24 mb-[-10px] transition-all hover:translate-y-[-5px]">
                          {actor.thumbnailUrl && (
                             <img src={actor.thumbnailUrl} className="w-full h-full object-cover rounded-t-xl border-2 border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
                          )}
                      </div>
                   ))}
                </div>
                
                {/* 构图网格线 */}
                <div className="absolute inset-0 border border-white/5 pointer-events-none" style={{backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '33.3% 33.3%', backgroundPosition: 'center', opacity: 0.1}} />
                
                {/* 运镜指示器 */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] text-white/60 font-mono">
                   CAM: DOLLY_IN
                </div>
             </div>
             
             {/* 结构化参数 */}
             <div className="p-4 space-y-4">
                {/* 画面描述 */}
                <div className="space-y-1.5">
                   <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Visual Prompt / 画面描述</span>
                   <p className="text-xs text-white/80 leading-relaxed min-h-[3em] bg-white/5 p-2 rounded border border-white/5">
                      {script || <span className="text-white/20 italic">等待输入脚本以生成描述...</span>}
                   </p>
                </div>
                
                {/* 模拟参数 */}
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-white/5 rounded p-2 border border-white/5">
                      <span className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Mood / 氛围</span>
                      <span className="text-xs text-white font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        {selectedScene ? "Cyberpunk / Noir" : "Waiting..."}
                      </span>
                   </div>
                   <div className="bg-white/5 rounded p-2 border border-white/5">
                      <span className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Lighting / 光照</span>
                      <span className="text-xs text-white font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Neon / Volumetric
                      </span>
                   </div>
                </div>
                
                {/* AI 思考步骤模拟 */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                   {[
                      { step: "Analyzing Script", status: script.length > 5 ? "done" : "waiting" },
                      { step: "Generating Composition", status: selectedScene ? "done" : "waiting" },
                      { step: "Rendering Assets", status: selectedActors.length > 0 ? "processing" : "waiting" }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'done' ? 'bg-green-500' : 
                            item.status === 'processing' ? 'bg-accent animate-pulse' : 'bg-white/10'
                         }`} />
                         <span className={`text-[10px] ${
                            item.status === 'waiting' ? 'text-white/20' : 'text-white/60'
                         }`}>{item.step}...</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* 资产选择弹窗 */}
      {activeTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div 
            className="glass rounded-2xl max-w-lg w-full border border-white/20 animate-scale-in max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  {activeTab === AssetType.ACTOR && <span>👤</span>}
                  {activeTab === AssetType.SCENE && <span>🏞️</span>}
                  {activeTab === AssetType.PROP && <span>🔧</span>}
                  选择{activeTab === AssetType.ACTOR ? '角色' : activeTab === AssetType.SCENE ? '场景' : '道具'}
                </h3>
                <button
                  onClick={() => {
                    setActiveTab(null);
                    setSearchQuery('');
                  }}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition grid place-items-center"
                >
                  ✕
                </button>
              </div>
              
              {/* 搜索框 */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索资产..."
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  🔍
                </span>
              </div>
            </div>
            
            {/* 资产列表 */}
            <div className="flex-1 overflow-y-auto p-5">
              {isLoadingAssets ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-white/60 text-sm">加载资产中...</p>
                </div>
              ) : (
                <div className={`grid gap-3 ${activeTab === AssetType.SCENE ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {getFilteredAssets().map((asset: Asset) => {
                    const isSelected =
                      (activeTab === AssetType.ACTOR && selectedActors.some((a: Asset) => a.assetId === asset.assetId)) ||
                      (activeTab === AssetType.SCENE && selectedScene?.assetId === asset.assetId) ||
                      (activeTab === AssetType.PROP && selectedProps.some((p: Asset) => p.assetId === asset.assetId));

                    return (
                      <div
                        key={asset.assetId}
                        onClick={() => !isSelected && handleSelectAsset(asset)}
                        className={`
                          rounded-xl overflow-hidden border transition cursor-pointer group
                          ${isSelected
                            ? 'border-accent/50 bg-accent/10 cursor-not-allowed opacity-60'
                            : 'border-white/10 hover:border-accent/30 bg-white/5 hover:bg-white/10'}
                        `}
                      >
                        {/* 预览图 */}
                        <div className={`relative overflow-hidden ${activeTab === AssetType.SCENE ? 'aspect-video' : 'aspect-square'}`}>
                          {asset.thumbnailUrl ? (
                            <img
                              src={asset.thumbnailUrl}
                              alt={asset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 grid place-items-center text-2xl">
                              {activeTab === AssetType.ACTOR ? '👤' : activeTab === AssetType.SCENE ? '🏞️' : '🔧'}
                            </div>
                          )}
                          
                          {/* 已选中标记 */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-accent/20 grid place-items-center">
                              <span className="h-8 w-8 rounded-full bg-accent text-white grid place-items-center">
                                ✓
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* 信息 */}
                        <div className="p-3">
                          <p className="text-white/90 text-sm font-medium truncate">{asset.name}</p>
                          <p className="text-white/40 text-xs mt-0.5">
                            使用 {asset.usageCount} 次
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {!isLoadingAssets && getFilteredAssets().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/40 text-sm">没有找到匹配的资产</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
