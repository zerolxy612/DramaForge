'use client';

import { useState, useEffect, useMemo } from 'react';
import { ParticleBackground } from '@/app/components/ParticleBackground';
import { TiltCard } from '@/app/components/TiltCard';
import { DEMO_ASSETS, STORY_NODES } from '@/lib/mock';
import { Asset, AssetType } from '@/lib/types';

type FilterType = 'ALL' | AssetType;

// 资产使用历史
function getAssetUsageHistory(assetId: string) {
  const usages: { nodeId: string; dramaTitle: string; script: string }[] = [];
  
  Object.values(STORY_NODES).forEach(node => {
    const { actorIds, sceneId, propIds } = node.confirmedFrame;
    if (actorIds.includes(assetId) || sceneId === assetId || propIds.includes(assetId)) {
      usages.push({
        nodeId: node.nodeId,
        dramaTitle: '赛博侦探：失落的密钥',
        script: node.confirmedFrame.script.slice(0, 60) + '...',
      });
    }
  });
  
  return usages;
}

export default function AssetsPage() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);
  
  // 过滤和搜索资产
  const filteredAssets = useMemo(() => {
    let assets = Object.values(DEMO_ASSETS);
    
    // 类型过滤
    if (filter !== 'ALL') {
      assets = assets.filter(a => a.assetType === filter);
    }
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      assets = assets.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query)
      );
    }
    
    // 按使用次数排序
    return assets.sort((a, b) => b.usageCount - a.usageCount);
  }, [filter, searchQuery]);
  
  // 统计数据
  const stats = useMemo(() => {
    const all = Object.values(DEMO_ASSETS);
    return {
      total: all.length,
      actors: all.filter(a => a.assetType === AssetType.ACTOR).length,
      scenes: all.filter(a => a.assetType === AssetType.SCENE).length,
      props: all.filter(a => a.assetType === AssetType.PROP).length,
      totalUsage: all.reduce((sum, a) => sum + a.usageCount, 0),
    };
  }, []);
  
  const selectedAssetUsage = selectedAsset ? getAssetUsageHistory(selectedAsset.assetId) : [];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">正在加载资产库...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative">
      {/* 背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-[#0a0b10] to-[#06060a]" />
      <ParticleBackground />
      <div className="fixed inset-0 noise pointer-events-none opacity-30" />
      
      {/* 头部 */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                <span>🗄️</span> 社区资产库
              </h1>
              <p className="text-white/60 mt-1">
                发现并复用社区创建的角色、场景和道具
              </p>
            </div>
            
            <a
              href="/"
              className="px-6 py-2.5 rounded-full border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/30 transition"
            >
              返回首页
            </a>
          </div>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="glass rounded-xl p-4 text-center hover:border-accent/30 transition cursor-pointer" onClick={() => setFilter('ALL')}>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-white/50 text-sm">全部资产</div>
            </div>
            <div className="glass rounded-xl p-4 text-center hover:border-accent/30 transition cursor-pointer" onClick={() => setFilter(AssetType.ACTOR)}>
              <div className="text-2xl font-bold text-accent">{stats.actors}</div>
              <div className="text-white/50 text-sm">👤 角色</div>
            </div>
            <div className="glass rounded-xl p-4 text-center hover:border-accent/30 transition cursor-pointer" onClick={() => setFilter(AssetType.SCENE)}>
              <div className="text-2xl font-bold text-purple-400">{stats.scenes}</div>
              <div className="text-white/50 text-sm">🏞️ 场景</div>
            </div>
            <div className="glass rounded-xl p-4 text-center hover:border-accent/30 transition cursor-pointer" onClick={() => setFilter(AssetType.PROP)}>
              <div className="text-2xl font-bold text-cyan-400">{stats.props}</div>
              <div className="text-white/50 text-sm">🔧 道具</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 左侧列表 */}
          <div className="flex-1">
            {/* 搜索和筛选 */}
            <div className="flex items-center gap-4 mb-6">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索资产名称或描述..."
                  className="w-full px-5 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
              </div>
              
              {/* 类型筛选 */}
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                {(['ALL', 'ACTOR', 'SCENE', 'PROP'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-3 text-sm font-medium transition ${
                      filter === type 
                        ? 'bg-accent text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {type === 'ALL' ? '全部' : 
                     type === AssetType.ACTOR ? '👤 角色' : 
                     type === AssetType.SCENE ? '🏞️ 场景' : '🔧 道具'}
                  </button>
                ))}
              </div>
              
              {/* 视图切换 */}
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-3 transition ${viewMode === 'grid' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-3 transition ${viewMode === 'list' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 资产网格/列表 */}
            {filteredAssets.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-white/60">没有找到匹配的资产</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <TiltCard
                    key={asset.assetId}
                    tiltMaxAngle={6}
                    glareEnable={true}
                    className={`
                      rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                      ${selectedAsset?.assetId === asset.assetId 
                        ? 'ring-2 ring-accent shadow-[0_0_30px_rgba(229,9,20,0.3)]' 
                        : 'ring-1 ring-white/10 hover:ring-white/30'}
                    `}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    {/* 缩略图 */}
                    <div className={`relative overflow-hidden ${asset.assetType === AssetType.SCENE ? 'aspect-video' : 'aspect-square'}`}>
                      <img
                        src={asset.thumbnailUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      
                      {/* 类型标签 */}
                      <div className={`
                        absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium
                        ${asset.assetType === AssetType.ACTOR ? 'bg-accent/80' : 
                          asset.assetType === AssetType.SCENE ? 'bg-purple-500/80' : 'bg-cyan-500/80'}
                        text-white
                      `}>
                        {asset.assetType === AssetType.ACTOR ? '👤 角色' : 
                         asset.assetType === AssetType.SCENE ? '🏞️ 场景' : '🔧 道具'}
                      </div>
                      
                      {/* 使用次数 */}
                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 text-xs text-white/80">
                        🔄 {asset.usageCount}
                      </div>
                    </div>
                    
                    {/* 信息 */}
                    <div className="p-4 bg-black/60 backdrop-blur-sm">
                      <h3 className="text-white font-medium truncate">{asset.name}</h3>
                      <p className="text-white/50 text-xs mt-1 line-clamp-2">
                        {asset.description || '暂无描述'}
                      </p>
                    </div>
                  </TiltCard>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.assetId}
                    onClick={() => setSelectedAsset(asset)}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                      ${selectedAsset?.assetId === asset.assetId 
                        ? 'bg-accent/10 ring-1 ring-accent' 
                        : 'bg-white/5 hover:bg-white/10 ring-1 ring-white/10'}
                    `}
                  >
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.name}
                      className={`object-cover rounded-lg ${asset.assetType === AssetType.SCENE ? 'w-24 h-16' : 'w-16 h-16'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium">{asset.name}</h3>
                      <p className="text-white/50 text-sm truncate">{asset.description}</p>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${asset.assetType === AssetType.ACTOR ? 'bg-accent/20 text-accent' : 
                        asset.assetType === AssetType.SCENE ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}
                    `}>
                      {asset.assetType === AssetType.ACTOR ? '角色' : asset.assetType === AssetType.SCENE ? '场景' : '道具'}
                    </div>
                    <div className="text-white/40 text-sm">
                      🔄 {asset.usageCount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 右侧详情面板 */}
          <div className={`
            w-80 flex-shrink-0 transition-all duration-300
            ${selectedAsset ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}>
            {selectedAsset && (
              <div className="sticky top-8 glass rounded-2xl p-5 border border-white/10 space-y-5 animate-slide-in-up">
                {/* 关闭按钮 */}
                <div className="flex items-center justify-between">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${selectedAsset.assetType === AssetType.ACTOR ? 'bg-accent/20 text-accent' : 
                      selectedAsset.assetType === AssetType.SCENE ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}
                  `}>
                    {selectedAsset.assetType === AssetType.ACTOR ? '👤 角色' : 
                     selectedAsset.assetType === AssetType.SCENE ? '🏞️ 场景' : '🔧 道具'}
                  </span>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition grid place-items-center"
                  >
                    ✕
                  </button>
                </div>
                
                {/* 大图 */}
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={selectedAsset.thumbnailUrl}
                    alt={selectedAsset.name}
                    className={`w-full object-cover ${selectedAsset.assetType === AssetType.SCENE ? 'aspect-video' : 'aspect-square'}`}
                  />
                </div>
                
                {/* 名称和描述 */}
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedAsset.name}</h2>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">
                    {selectedAsset.description || '这个资产暂无详细描述。'}
                  </p>
                </div>
                
                {/* 统计 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-accent">{selectedAsset.usageCount}</div>
                    <div className="text-white/50 text-xs">被使用次数</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-white">{selectedAssetUsage.length}</div>
                    <div className="text-white/50 text-xs">出现场景</div>
                  </div>
                </div>
                
                {/* 创建者信息 */}
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-purple-500 grid place-items-center text-white font-bold">
                    {selectedAsset.creator.slice(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white/80 text-sm">创建者</div>
                    <div className="text-white/40 text-xs font-mono">
                      {selectedAsset.creator.slice(0, 6)}...{selectedAsset.creator.slice(-4)}
                    </div>
                  </div>
                </div>
                
                {/* 使用历史 */}
                {selectedAssetUsage.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-accent mb-3">使用历史</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedAssetUsage.slice(0, 5).map((usage, index) => (
                        <div key={index} className="p-2 rounded-lg bg-white/5 text-xs">
                          <p className="text-white/80 line-clamp-2">{usage.script}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 操作按钮 */}
                <a
                  href="/theater/demo"
                  className="block w-full py-3 text-center rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition"
                >
                  在剧场中使用 →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
