'use client';

import { useState, useEffect } from 'react';
import { ParticleBackground } from '@/app/components/ParticleBackground';
import { TiltCard } from '@/app/components/TiltCard';

// Mock 剧集数据
const MOCK_DRAMAS = [
  {
    id: 'demo',
    title: '赛博侦探：失落的密钥',
    description: '在2077年的新东京，你发现了一枚足以颠覆大财团统治的加密芯片。',
    coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop',
    creator: '0x1234...5678',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    status: 'ongoing',
    progress: 45,
    targetDuration: 300,
    currentDuration: 135,
    participants: 2847,
    nodes: 156,
    tags: ['赛博朋克', '悬疑', '科幻'],
    isHot: true,
  },
  {
    id: 'drama-2',
    title: '末日求生：最后的希望',
    description: '丧尸病毒爆发后的第100天，你和幸存者团队发现了一个神秘的地下避难所。',
    coverImage: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=600&h=400&fit=crop',
    creator: '0xabcd...ef12',
    creatorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    status: 'ongoing',
    progress: 72,
    targetDuration: 600,
    currentDuration: 432,
    participants: 1523,
    nodes: 89,
    tags: ['末日', '生存', '恐怖'],
    isHot: true,
  },
  {
    id: 'drama-3',
    title: '星际迷航：未知边界',
    description: '2350年，人类首次接收到来自仙女座星系的信号。作为先遣队队长，你将揭开宇宙的秘密。',
    coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop',
    creator: '0x9876...4321',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    status: 'ongoing',
    progress: 28,
    targetDuration: 900,
    currentDuration: 252,
    participants: 892,
    nodes: 45,
    tags: ['科幻', '太空', '探索'],
    isHot: false,
  },
  {
    id: 'drama-4',
    title: '古墓迷踪：法老的诅咒',
    description: '1923年，埃及帝王谷。你的考古队发现了一座从未被记载的古墓，而守墓人正在苏醒。',
    coverImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&h=400&fit=crop',
    creator: '0x5555...6666',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: 'completed',
    progress: 100,
    targetDuration: 480,
    currentDuration: 480,
    participants: 3421,
    nodes: 234,
    tags: ['冒险', '历史', '悬疑'],
    isHot: false,
  },
  {
    id: 'drama-5',
    title: '魔法学院：禁忌之书',
    description: '作为魔法学院的新生，你偶然发现了图书馆深处的禁忌魔法书，古老的黑暗力量正在觉醒。',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop',
    creator: '0x7777...8888',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'ongoing',
    progress: 15,
    targetDuration: 720,
    currentDuration: 108,
    participants: 567,
    nodes: 23,
    tags: ['奇幻', '魔法', '学院'],
    isHot: false,
  },
  {
    id: 'drama-6',
    title: '都市怪谈：午夜出租车',
    description: '每天午夜12点，一辆神秘的出租车会在城市的某个角落出现。上车的人，再也没有回来过。',
    coverImage: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&h=400&fit=crop',
    creator: '0x3333...4444',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: 'ongoing',
    progress: 58,
    targetDuration: 360,
    currentDuration: 209,
    participants: 1234,
    nodes: 67,
    tags: ['恐怖', '都市', '悬疑'],
    isHot: true,
  },
];

type FilterType = 'all' | 'ongoing' | 'completed' | 'my';
type SortType = 'hot' | 'new' | 'progress';

export default function DramasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrama, setSelectedDrama] = useState<typeof MOCK_DRAMAS[0] | null>(null);
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);
  
  // 过滤和排序
  const filteredDramas = MOCK_DRAMAS
    .filter(drama => {
      if (filter === 'ongoing') return drama.status === 'ongoing';
      if (filter === 'completed') return drama.status === 'completed';
      if (filter === 'my') return drama.id === 'demo'; // 模拟参与的剧集
      return true;
    })
    .filter(drama => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return drama.title.toLowerCase().includes(query) || 
             drama.description.toLowerCase().includes(query) ||
             drama.tags.some(tag => tag.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (sort === 'hot') return b.participants - a.participants;
      if (sort === 'progress') return b.progress - a.progress;
      return 0; // 'new' 暂时不变
    });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">正在加载剧集...</p>
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
                <span>🎭</span> 剧集广场
              </h1>
              <p className="text-white/60 mt-1">
                发现精彩故事，参与共创，留下你的印记
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="/profile"
                className="px-5 py-2.5 rounded-full border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/30 transition"
              >
                👤 个人中心
              </a>
              <button
                className="px-6 py-2.5 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition flex items-center gap-2"
              >
                <span>✨</span> 创建剧集
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 筛选栏 */}
      <div className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* 搜索 */}
            <div className="flex-1 min-w-[200px] relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索剧集名称、描述或标签..."
                className="w-full px-5 py-2.5 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
            </div>
            
            {/* 状态筛选 */}
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              {[
                { id: 'all', label: '全部' },
                { id: 'ongoing', label: '进行中' },
                { id: 'completed', label: '已完结' },
                { id: 'my', label: '我参与的' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as FilterType)}
                  className={`px-4 py-2.5 text-sm font-medium transition ${
                    filter === item.id 
                      ? 'bg-accent text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* 排序 */}
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm">排序：</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-accent/50"
              >
                <option value="hot">🔥 最热门</option>
                <option value="new">🆕 最新</option>
                <option value="progress">📈 进度最高</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredDramas.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🎬</div>
            <p className="text-white/60">没有找到匹配的剧集</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDramas.map((drama) => (
              <TiltCard
                key={drama.id}
                tiltMaxAngle={5}
                glareEnable={true}
                className={`
                  rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                  ${drama.isHot ? 'ring-2 ring-accent/50' : 'ring-1 ring-white/10'}
                  hover:ring-accent/70 hover:shadow-[0_0_40px_rgba(229,9,20,0.2)]
                `}
                onClick={() => setSelectedDrama(drama)}
              >
                {/* 封面 */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={drama.coverImage}
                    alt={drama.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  
                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  {/* 标签 */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {drama.isHot && (
                      <span className="px-2 py-1 rounded-full text-xs bg-accent text-white font-medium">
                        🔥 热门
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      drama.status === 'completed' 
                        ? 'bg-green-500/80 text-white' 
                        : 'bg-white/20 text-white/80'
                    }`}>
                      {drama.status === 'completed' ? '✓ 已完结' : '进行中'}
                    </span>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div 
                      className={`h-full transition-all ${
                        drama.status === 'completed' ? 'bg-green-500' : 'bg-accent'
                      }`}
                      style={{ width: `${drama.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* 信息 */}
                <div className="p-5 bg-black/60 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {drama.title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4">
                    {drama.description}
                  </p>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {drama.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 统计 */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-white/50">
                      <span>👥 {drama.participants.toLocaleString()}</span>
                      <span>🌿 {drama.nodes}</span>
                    </div>
                    <div className="text-white/40">
                      {Math.floor(drama.currentDuration / 60)}:{String(drama.currentDuration % 60).padStart(2, '0')} / {Math.floor(drama.targetDuration / 60)}分钟
                    </div>
                  </div>
                  
                  {/* 创建者 */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <img src={drama.creatorAvatar} alt="" className="h-6 w-6 rounded-full" />
                    <span className="text-white/50 text-xs">{drama.creator}</span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
      
      {/* 剧集详情弹窗 */}
      {selectedDrama && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedDrama(null)}
        >
          <div 
            className="glass rounded-2xl max-w-2xl w-full overflow-hidden border border-white/20 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 封面 */}
            <div className="aspect-video relative">
              <img
                src={selectedDrama.coverImage}
                alt={selectedDrama.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedDrama(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition grid place-items-center"
              >
                ✕
              </button>
              
              {/* 标题区 */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  {selectedDrama.isHot && (
                    <span className="px-2 py-1 rounded-full text-xs bg-accent text-white font-medium">
                      🔥 热门
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedDrama.status === 'completed' 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-white/20 text-white/80'
                  }`}>
                    {selectedDrama.status === 'completed' ? '✓ 已完结' : '进行中'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedDrama.title}</h2>
              </div>
            </div>
            
            {/* 内容 */}
            <div className="p-6 space-y-6">
              <p className="text-white/70 leading-relaxed">{selectedDrama.description}</p>
              
              {/* 进度 */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">剧情进度</span>
                  <span className="text-white">{selectedDrama.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      selectedDrama.status === 'completed' ? 'bg-green-500' : 'bg-accent'
                    }`}
                    style={{ width: `${selectedDrama.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>{Math.floor(selectedDrama.currentDuration / 60)}分{selectedDrama.currentDuration % 60}秒</span>
                  <span>目标 {Math.floor(selectedDrama.targetDuration / 60)}分钟</span>
                </div>
              </div>
              
              {/* 统计 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-accent">{selectedDrama.participants.toLocaleString()}</div>
                  <div className="text-white/50 text-xs mt-1">参与者</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedDrama.nodes}</div>
                  <div className="text-white/50 text-xs mt-1">故事节点</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedDrama.tags.length}</div>
                  <div className="text-white/50 text-xs mt-1">故事标签</div>
                </div>
              </div>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {selectedDrama.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* 创建者 */}
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <img src={selectedDrama.creatorAvatar} alt="" className="h-12 w-12 rounded-full" />
                <div>
                  <div className="text-white/80 font-medium">创建者</div>
                  <div className="text-white/40 text-sm font-mono">{selectedDrama.creator}</div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-4">
                <a
                  href={`/theater/${selectedDrama.id}`}
                  className="flex-1 py-3 text-center rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition"
                >
                  🎬 进入剧场
                </a>
                <a
                  href={`/drama/${selectedDrama.id}/tree`}
                  className="flex-1 py-3 text-center rounded-xl border border-white/20 text-white/80 hover:bg-white/5 transition"
                >
                  🌳 查看故事树
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 返回按钮 */}
      <a
        href="/"
        className="fixed bottom-8 left-8 z-20 px-6 py-3 rounded-full glass border border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 transition shadow-lg"
      >
        ← 返回首页
      </a>
    </div>
  );
}

