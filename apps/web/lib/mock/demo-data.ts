import { Drama, StoryNode, CandidateFrame, Asset, AssetType, DramaStatus, UserPoints } from '../types';

// ============================================================
// 🎬 赛博侦探：失落的密钥 - 完整 Demo 数据
// ============================================================

export const DEMO_DRAMA: Drama = {
  dramaId: 'demo',
  title: '赛博侦探：失落的密钥',
  description: '在2077年的新东京，你发现了一枚足以颠覆大财团统治的加密芯片。在这场猫鼠游戏中，你的每一个选择都至关重要。',
  genesisCid: 'QmDemoGenesis',
  creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
  targetDuration: 300, // 5分钟
  currentDuration: 0,
  status: DramaStatus.ONGOING,
  createdAt: new Date(),
  coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=600&fit=crop',
  tags: ['赛博朋克', '悬疑', '科幻'],
  participantCount: 2847,
};

// ============================================================
// 🎭 资产库 - 角色、场景、道具
// ============================================================

export const DEMO_ASSETS: Record<string, Asset> = {
  // ========== 角色 ==========
  'actor-k': {
    assetId: 'actor-k',
    assetType: AssetType.ACTOR,
    name: 'K (赛博侦探)',
    description: '前荒坂公司安保主管，如今独立调查员。左眼装有军用级扫描植入物。',
    metadataCid: 'QmActorK',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop',
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-root',
    usageCount: 1205,
    createdAt: new Date(),
  },
  'actor-glitch': {
    assetId: 'actor-glitch',
    assetType: AssetType.ACTOR,
    name: 'Glitch (黑客女王)',
    description: '地下网络的传奇人物，没有她破解不了的系统。真实身份是个谜。',
    metadataCid: 'QmActorGlitch',
    thumbnailUrl: 'https://images.unsplash.com/photo-1525134479668-1bee4c7c642b?w=400&h=400&fit=crop',
    creator: '0x4567890123456789012345678901234567890123' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-2a',
    usageCount: 890,
    createdAt: new Date(),
  },
  'actor-vega': {
    assetId: 'actor-vega',
    assetType: AssetType.ACTOR,
    name: 'Vega (公司杀手)',
    description: '荒坂公司的顶级追踪者，改造程度超过90%，已不再是人类。',
    metadataCid: 'QmActorVega',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-3a',
    usageCount: 567,
    createdAt: new Date(),
  },
  'actor-whisper': {
    assetId: 'actor-whisper',
    assetType: AssetType.ACTOR,
    name: 'Whisper (线人)',
    description: '游走在黑白两道的信息贩子，总是知道比他说的更多。',
    metadataCid: 'QmActorWhisper',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    creator: '0x7890123456789012345678901234567890123456' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-2b',
    usageCount: 345,
    createdAt: new Date(),
  },

  // ========== 场景 ==========
  'scene-neon-street': {
    assetId: 'scene-neon-street',
    assetType: AssetType.SCENE,
    name: '霓虹雨街',
    description: '新东京下城区的标志性街道，永远下着酸雨，霓虹灯永不熄灭。',
    metadataCid: 'QmSceneStreet',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&h=450&fit=crop',
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-root',
    usageCount: 2341,
    createdAt: new Date(),
  },
  'scene-cyber-bar': {
    assetId: 'scene-cyber-bar',
    assetType: AssetType.SCENE,
    name: '赛博酒吧 "黑镜"',
    description: '地下世界的聚集地，最危险的交易都在这里完成。',
    metadataCid: 'QmSceneBar',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=450&fit=crop',
    creator: '0x4567890123456789012345678901234567890123' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-2a',
    usageCount: 1890,
    createdAt: new Date(),
  },
  'scene-rooftop': {
    assetId: 'scene-rooftop',
    assetType: AssetType.SCENE,
    name: '摩天楼天台',
    description: '200层高的企业大厦天台，俯瞰整个新东京，云层在脚下流动。',
    metadataCid: 'QmSceneRooftop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-4',
    usageCount: 456,
    createdAt: new Date(),
  },
  'scene-server-room': {
    assetId: 'scene-server-room',
    assetType: AssetType.SCENE,
    name: '数据中心核心',
    description: '荒坂公司最机密的服务器房间，温度接近零度，蓝光闪烁。',
    metadataCid: 'QmSceneServer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    creator: '0x7890123456789012345678901234567890123456' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-3b',
    usageCount: 234,
    createdAt: new Date(),
  },
  'scene-alley': {
    assetId: 'scene-alley',
    assetType: AssetType.SCENE,
    name: '暗巷',
    description: '霓虹灯照不到的地方，是另一个世界的入口。',
    metadataCid: 'QmSceneAlley',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495573752115-388f615df001?w=800&h=450&fit=crop',
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-2c',
    usageCount: 678,
    createdAt: new Date(),
  },

  // ========== 道具 ==========
  'prop-chip': {
    assetId: 'prop-chip',
    assetType: AssetType.PROP,
    name: '加密芯片',
    description: '拇指大小的量子芯片，内含可以摧毁荒坂帝国的秘密。',
    metadataCid: 'QmPropChip',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=400&fit=crop',
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-root',
    usageCount: 3456,
    createdAt: new Date(),
  },
  'prop-gun': {
    assetId: 'prop-gun',
    assetType: AssetType.PROP,
    name: '智能手枪',
    description: '与神经系统链接的定制武器，永不脱靶。',
    metadataCid: 'QmPropGun',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=400&fit=crop',
    creator: '0x4567890123456789012345678901234567890123' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-3a',
    usageCount: 1234,
    createdAt: new Date(),
  },
  'prop-holo': {
    assetId: 'prop-holo',
    assetType: AssetType.PROP,
    name: '全息投影盘',
    description: '可以投射任何人的完美复制体，骗过大多数扫描系统。',
    metadataCid: 'QmPropHolo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop',
    creator: '0x7890123456789012345678901234567890123456' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-2a',
    usageCount: 567,
    createdAt: new Date(),
  },
  'prop-neural': {
    assetId: 'prop-neural',
    assetType: AssetType.PROP,
    name: '神经接口',
    description: '直连大脑的数据接口，可以在几秒内下载或上传记忆。',
    metadataCid: 'QmPropNeural',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563206767-5b1d972d9fb7?w=400&h=400&fit=crop',
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    originDramaId: 'demo',
    originNodeId: 'node-3b',
    usageCount: 890,
    createdAt: new Date(),
  },
};

// ============================================================
// 📍 故事节点 - 4层深度的分支故事
// ============================================================

export const STORY_NODES: Record<string, StoryNode> = {
  // ========== 第1幕：开场 ==========
  'node-root': {
    nodeId: 'node-root',
    dramaId: 'demo',
    parentNodeIds: [],
    depth: 1,
    confirmedFrame: {
      frameCid: 'QmFrameRoot',
      duration: 5,
      actorIds: ['actor-k'],
      sceneId: 'scene-neon-street',
      propIds: ['prop-chip'],
      script: '酸雨敲打着全息广告牌，K站在霓虹灯下。他低头看着手中微微发光的芯片——这东西刚从一个死人手里滑落。远处，警笛声越来越近。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=450&fit=crop',
      videoUrl: '/images/c769b14d5dce1be8661a0719b23e6fe8.mp4',
    },
    contributor: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    timestamp: new Date(),
    childCount: 3,
    totalVisits: 12847,
  },

  // ========== 第2幕：分支展开 ==========
  // 分支A：寻找黑客
  'node-2a': {
    nodeId: 'node-2a',
    dramaId: 'demo',
    parentNodeIds: ['node-root'],
    depth: 2,
    confirmedFrame: {
      frameCid: 'QmFrame2A',
      duration: 5,
      actorIds: ['actor-k', 'actor-glitch'],
      sceneId: 'scene-cyber-bar',
      propIds: ['prop-chip', 'prop-holo'],
      script: '"黑镜"酒吧内烟雾缭绕。K找到了传说中的Glitch——一个顶着紫色爆炸头的女孩正在调酒。她瞥了一眼芯片："这东西...你知道有多少人在找你吗？"',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=450&fit=crop',
    },
    contributor: '0x1111111111111111111111111111111111111111' as `0x${string}`,
    timestamp: new Date(),
    childCount: 3,
    totalVisits: 8934,
  },

  // 分支B：联系线人
  'node-2b': {
    nodeId: 'node-2b',
    dramaId: 'demo',
    parentNodeIds: ['node-root'],
    depth: 2,
    confirmedFrame: {
      frameCid: 'QmFrame2B',
      duration: 5,
      actorIds: ['actor-k', 'actor-whisper'],
      sceneId: 'scene-alley',
      propIds: ['prop-chip'],
      script: '暗巷深处，Whisper从阴影中走出。"荒坂的猎犬已经出动了，"他压低声音，"芯片里是「普罗米修斯计划」的完整数据。这可以让整个公司倒闭。"',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&h=450&fit=crop',
    },
    contributor: '0x2222222222222222222222222222222222222222' as `0x${string}`,
    timestamp: new Date(),
    childCount: 3,
    totalVisits: 6721,
  },

  // 分支C：丢弃芯片
  'node-2c': {
    nodeId: 'node-2c',
    dramaId: 'demo',
    parentNodeIds: ['node-root'],
    depth: 2,
    confirmedFrame: {
      frameCid: 'QmFrame2C',
      duration: 5,
      actorIds: ['actor-k'],
      sceneId: 'scene-alley',
      propIds: [],
      script: 'K将芯片扔进下水道，转身离开。但三步之后，他停住了——下水道里传来蓝色的光芒，芯片正在自动回溯到他手中。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1495573752115-388f615df001?w=800&h=450&fit=crop',
    },
    contributor: '0x3333333333333333333333333333333333333333' as `0x${string}`,
    timestamp: new Date(),
    childCount: 2,
    totalVisits: 2156,
  },

  // ========== 第3幕：危机升级 ==========
  // 从2A延伸：战斗
  'node-3a-fight': {
    nodeId: 'node-3a-fight',
    dramaId: 'demo',
    parentNodeIds: ['node-2a'],
    depth: 3,
    confirmedFrame: {
      frameCid: 'QmFrame3AFight',
      duration: 5,
      actorIds: ['actor-k', 'actor-glitch', 'actor-vega'],
      sceneId: 'scene-cyber-bar',
      propIds: ['prop-gun'],
      script: '玻璃门爆裂！Vega带着三个改造人冲入酒吧。K翻桌掩护，同时拔出了智能手枪。"Glitch，我们需要一个出口！"子弹横飞，霓虹灯碎片四散。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=450&fit=crop',
    },
    contributor: '0x4444444444444444444444444444444444444444' as `0x${string}`,
    timestamp: new Date(),
    childCount: 2,
    totalVisits: 5678,
  },

  // 从2A延伸：逃跑
  'node-3a-escape': {
    nodeId: 'node-3a-escape',
    dramaId: 'demo',
    parentNodeIds: ['node-2a'],
    depth: 3,
    confirmedFrame: {
      frameCid: 'QmFrame3AEscape',
      duration: 5,
      actorIds: ['actor-k', 'actor-glitch'],
      sceneId: 'scene-alley',
      propIds: ['prop-holo', 'prop-chip'],
      script: 'Glitch启动全息盘，两个假人影朝正门跑去。"走后门！"她拉着K穿过厨房，跳上一辆悬停摩托。身后，枪声响起——假象被识破了。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&h=450&fit=crop',
    },
    contributor: '0x5555555555555555555555555555555555555555' as `0x${string}`,
    timestamp: new Date(),
    childCount: 2,
    totalVisits: 4321,
  },

  // 从2B延伸：深入调查
  'node-3b-investigate': {
    nodeId: 'node-3b-investigate',
    dramaId: 'demo',
    parentNodeIds: ['node-2b'],
    depth: 3,
    confirmedFrame: {
      frameCid: 'QmFrame3BInvestigate',
      duration: 5,
      actorIds: ['actor-k'],
      sceneId: 'scene-server-room',
      propIds: ['prop-chip', 'prop-neural'],
      script: 'K潜入荒坂大厦的数据中心。冰冷的蓝光中，他将神经接口插入后颈——芯片内容直接灌入大脑。真相令人窒息：普罗米修斯计划...是一场对整个下城区的种族清洗。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    },
    contributor: '0x6666666666666666666666666666666666666666' as `0x${string}`,
    timestamp: new Date(),
    childCount: 2,
    totalVisits: 3890,
  },

  // 从2C延伸：量子觉醒
  'node-3c-quantum': {
    nodeId: 'node-3c-quantum',
    dramaId: 'demo',
    parentNodeIds: ['node-2c'],
    depth: 3,
    confirmedFrame: {
      frameCid: 'QmFrame3CQuantum',
      duration: 5,
      actorIds: ['actor-k'],
      sceneId: 'scene-neon-street',
      propIds: ['prop-chip', 'prop-neural'],
      script: '芯片与K的神经系统产生了共鸣。数据流如潮水般涌入他的意识——这枚芯片不是被创造的，而是"觉醒"的。它是荒坂AI研究的意外产物：一个有自我意识的量子智能。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
    },
    contributor: '0x9999999999999999999999999999999999999999' as `0x${string}`,
    timestamp: new Date(),
    childCount: 2,
    totalVisits: 1234,
  },

  // ========== 第4幕：高潮 / 分支合流 ==========
  'node-4-climax': {
    nodeId: 'node-4-climax',
    dramaId: 'demo',
    parentNodeIds: ['node-3a-fight', 'node-3a-escape', 'node-3b-investigate', 'node-3c-quantum'],
    depth: 4,
    confirmedFrame: {
      frameCid: 'QmFrame4Climax',
      duration: 5,
      actorIds: ['actor-k', 'actor-glitch', 'actor-vega'],
      sceneId: 'scene-rooftop',
      propIds: ['prop-chip', 'prop-gun'],
      script: '摩天楼天台，云层在脚下翻涌。K、Glitch和Vega三人对峙。风呼啸而过，全息广告投射在他们身上。"交出芯片，我放你们走。"Vega的机械眼泛着红光。K握紧了手中的枪——但芯片开始自己发光了。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
    },
    contributor: '0x7777777777777777777777777777777777777777' as `0x${string}`,
    timestamp: new Date(),
    childCount: 3,
    totalVisits: 7654,
  },

  // ========== 第5幕：Demo 结局 ==========
  'node-5-ending': {
    nodeId: 'node-5-ending',
    dramaId: 'demo',
    parentNodeIds: ['node-4-climax'],
    depth: 5,
    confirmedFrame: {
      frameCid: 'QmFrame5Ending',
      duration: 5,
      actorIds: ['actor-k'],
      sceneId: 'scene-rooftop',
      propIds: ['prop-chip'],
      script: '芯片炸裂成光芒，数据如流星雨般向天空散去——真相正在向全世界广播。K站在光芒中央，第一次露出了笑容。"游戏，才刚刚开始。"',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=450&fit=crop',
    },
    contributor: '0x8888888888888888888888888888888888888888' as `0x${string}`,
    timestamp: new Date(),
    childCount: 0,
    totalVisits: 6543,
  },

  // 自定义分镜占位节点
  'node-custom': {
    nodeId: 'node-custom',
    dramaId: 'demo',
    parentNodeIds: [],
    depth: 0,
    confirmedFrame: {
      frameCid: 'QmFrameCustom',
      duration: 5,
      actorIds: [],
      sceneId: '',
      propIds: [],
      script: '你的创意在这里展开...',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=450&fit=crop',
    },
    contributor: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    timestamp: new Date(),
    childCount: 0,
    totalVisits: 0,
  },
};

// ============================================================
// 🎲 候选分镜 - 每个节点的分支选项
// ============================================================

export const CANDIDATE_FRAMES: Record<string, CandidateFrame[]> = {
  // 第1幕 -> 第2幕的选项
  'node-root': [
    {
      candidateId: 'cand-1a',
      frameData: {
        frameCid: 'QmCand1A',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-cyber-bar',
        propIds: ['prop-chip'],
        script: '🔍 前往"黑镜"酒吧寻找传说中的黑客Glitch，她是唯一能安全破解芯片的人。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-1b',
      frameData: {
        frameCid: 'QmCand1B',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-alley',
        propIds: ['prop-chip'],
        script: '🕵️ 联系老线人Whisper，他总是知道这城市里发生的一切——包括谁在追杀你。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-1c',
      frameData: {
        frameCid: 'QmCand1C',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-alley',
        propIds: [],
        script: '🚫 这不是你的战争。把芯片丢进下水道，转身离开这场是非。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1495573752115-388f615df001?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
  ],

  // 第2幕A -> 第3幕的选项
  'node-2a': [
    {
      candidateId: 'cand-2a-1',
      frameData: {
        frameCid: 'QmCand2A1',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch', 'actor-vega'],
        sceneId: 'scene-cyber-bar',
        propIds: ['prop-gun'],
        script: '⚔️ 特工破门而入！掀翻桌子当掩体，拔枪迎战。Glitch需要时间破解芯片！',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-2a-2',
      frameData: {
        frameCid: 'QmCand2A2',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch'],
        sceneId: 'scene-alley',
        propIds: ['prop-holo'],
        script: '🏃 使用全息投影制造假象，带着Glitch从后门撤离。跑得快比打得准更重要。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-2a-3',
      frameData: {
        frameCid: 'QmCand2A3',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch'],
        sceneId: 'scene-cyber-bar',
        propIds: ['prop-chip'],
        script: '✨ [自定义分镜] 意外发生了，芯片开始自己发光...',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: true,
    },
  ],

  // 第2幕C -> 第3幕的选项（丢弃芯片后的发展）
  'node-2c': [
    {
      candidateId: 'cand-2c-1',
      frameData: {
        frameCid: 'QmCand2C1',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-alley',
        propIds: ['prop-chip'],
        script: '🔮 芯片似乎有自己的意志。K意识到这不是普通的存储设备，而是某种量子AI。它选择了你。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-2c-2',
      frameData: {
        frameCid: 'QmCand2C2',
        duration: 5,
        actorIds: ['actor-k', 'actor-vega'],
        sceneId: 'scene-alley',
        propIds: ['prop-chip', 'prop-gun'],
        script: '⚠️ 芯片的光芒吸引了注意。Vega的身影出现在巷口："我就知道你丢不掉它。"',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
  ],

  // 第2幕B -> 第3幕的选项
  'node-2b': [
    {
      candidateId: 'cand-2b-1',
      frameData: {
        frameCid: 'QmCand2B1',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-server-room',
        propIds: ['prop-chip', 'prop-neural'],
        script: '🔓 潜入荒坂数据中心，用神经接口直连芯片数据。真相必须被揭露。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-2b-2',
      frameData: {
        frameCid: 'QmCand2B2',
        duration: 5,
        actorIds: ['actor-k', 'actor-whisper'],
        sceneId: 'scene-alley',
        propIds: ['prop-chip'],
        script: '🤝 让Whisper帮你联系地下电台，将数据泄露给媒体，但这意味着你永远不能回头。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-2b-3',
      frameData: {
        frameCid: 'QmCand2B3',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-neon-street',
        propIds: ['prop-chip'],
        script: '💰 直接把芯片卖给出价最高的人。在这个城市，生存比正义更重要。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
  ],

  // 第3幕 -> 第4幕的选项（高潮前的最后选择）
  'node-3a-fight': [
    {
      candidateId: 'cand-3a-fight-1',
      frameData: {
        frameCid: 'QmCand3AFight1',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch', 'actor-vega'],
        sceneId: 'scene-rooftop',
        propIds: ['prop-chip', 'prop-gun'],
        script: '🏢 战斗升级！追逐战蔓延到摩天楼天台，最终的对决即将上演。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-3a-fight-2',
      frameData: {
        frameCid: 'QmCand3AFight2',
        duration: 5,
        actorIds: ['actor-k', 'actor-vega'],
        sceneId: 'scene-cyber-bar',
        propIds: ['prop-gun'],
        script: '🎯 与Vega单挑，一决胜负。改造人vs人类，谁更强？',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
  ],

  'node-3a-escape': [
    {
      candidateId: 'cand-3a-escape-1',
      frameData: {
        frameCid: 'QmCand3AEscape1',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch'],
        sceneId: 'scene-rooftop',
        propIds: ['prop-chip'],
        script: '🚁 逃到摩天楼天台，Glitch召来一架改装飞行器。但追兵也到了。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-3a-escape-2',
      frameData: {
        frameCid: 'QmCand3AEscape2',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch'],
        sceneId: 'scene-server-room',
        propIds: ['prop-chip', 'prop-neural'],
        script: '💻 逃入荒坂大厦的数据中心，用芯片数据作为人质与公司谈判。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
  ],

  'node-3b-investigate': [
    {
      candidateId: 'cand-3b-inv-1',
      frameData: {
        frameCid: 'QmCand3BInv1',
        duration: 5,
        actorIds: ['actor-k', 'actor-vega'],
        sceneId: 'scene-rooftop',
        propIds: ['prop-chip'],
        script: '📡 带着证据登上天台，准备向全城广播真相。但Vega已经在等你了。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-3b-inv-2',
      frameData: {
        frameCid: 'QmCand3BInv2',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-server-room',
        propIds: ['prop-chip', 'prop-neural'],
        script: '🧠 将自己的记忆与芯片数据融合，成为活着的证据。但这可能会毁掉你的大脑。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
  ],

  // 第3幕C -> 第4幕（量子觉醒后的选择）
  'node-3c-quantum': [
    {
      candidateId: 'cand-3c-1',
      frameData: {
        frameCid: 'QmCand3C1',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-rooftop',
        propIds: ['prop-chip'],
        script: '📡 与芯片中的AI达成共识——它愿意向全世界广播真相，但需要到达城市最高点。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-3c-2',
      frameData: {
        frameCid: 'QmCand3C2',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch'],
        sceneId: 'scene-cyber-bar',
        propIds: ['prop-chip', 'prop-neural'],
        script: '🤝 带着这个觉醒的AI去找Glitch。她是唯一能帮助它"完整化"的人。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
  ],

  // 第4幕 -> 第5幕（结局选项）
  'node-4-climax': [
    {
      candidateId: 'cand-4-1',
      frameData: {
        frameCid: 'QmCand41',
        duration: 5,
        actorIds: ['actor-k'],
        sceneId: 'scene-rooftop',
        propIds: ['prop-chip'],
        script: '💥 让芯片释放所有数据，以光速传遍整个网络。真相将无法被掩盖。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-4-2',
      frameData: {
        frameCid: 'QmCand42',
        duration: 5,
        actorIds: ['actor-k', 'actor-vega'],
        sceneId: 'scene-rooftop',
        propIds: ['prop-chip', 'prop-gun'],
        script: '⚡ 与Vega展开最后的对决。胜者将决定这座城市的命运。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: false,
    },
    {
      candidateId: 'cand-4-3',
      frameData: {
        frameCid: 'QmCand43',
        duration: 5,
        actorIds: ['actor-k', 'actor-glitch'],
        sceneId: 'scene-rooftop',
        propIds: ['prop-chip'],
        script: '✨ [自定义分镜] 在这决定性的时刻，你想要创造怎样的转折？',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=450&fit=crop',
      },
      pendingAssets: [],
      isEditable: true,
    },
  ],
};

// ============================================================
// 🎯 节点映射 - 选择 -> 下一节点
// ============================================================

export const CHOICE_TO_NODE: Record<string, string> = {
  // 第1幕选择
  'cand-1a': 'node-2a',
  'cand-1b': 'node-2b',
  'cand-1c': 'node-2c',
  
  // 第2幕A选择
  'cand-2a-1': 'node-3a-fight',
  'cand-2a-2': 'node-3a-escape',
  'cand-2a-3': 'node-custom', // 自定义
  
  // 第2幕B选择
  'cand-2b-1': 'node-3b-investigate',
  'cand-2b-2': 'node-3b-investigate',
  'cand-2b-3': 'node-3b-investigate',
  
  // 第2幕C选择（丢弃芯片分支）
  'cand-2c-1': 'node-3c-quantum',
  'cand-2c-2': 'node-3a-fight',  // 合流到战斗节点
  
  // 第3幕选择 -> 第4幕
  'cand-3a-fight-1': 'node-4-climax',
  'cand-3a-fight-2': 'node-4-climax',
  'cand-3a-escape-1': 'node-4-climax',
  'cand-3a-escape-2': 'node-4-climax',
  'cand-3b-inv-1': 'node-4-climax',
  'cand-3b-inv-2': 'node-4-climax',
  'cand-3c-1': 'node-4-climax',
  'cand-3c-2': 'node-4-climax',
  
  // 第4幕选择 -> 结局
  'cand-4-1': 'node-5-ending',
  'cand-4-2': 'node-5-ending',
  'cand-4-3': 'node-custom',
  
  // 默认继续选项（用于自定义节点后）
  'continue-action': 'node-4-climax',
  'continue-investigate': 'node-4-climax',
  'continue-ending': 'node-5-ending',
  'continue-custom': 'node-custom',
};

// ============================================================
// 👤 用户积分
// ============================================================

export const DEMO_USER_POINTS: UserPoints = {
  userId: '0xDemoUser000000000000000000000000000000' as `0x${string}`,
  balance: 1500,
  dailyFreeRefresh: 8,
  lastResetDate: new Date().toISOString().split('T')[0],
  totalEarned: 2500,
  totalSpent: 1000,
};

// ============================================================
// 🛠 辅助函数
// ============================================================

export function getAssetById(assetId: string): Asset | undefined {
  return Object.values(DEMO_ASSETS).find(a => a.assetId === assetId);
}

export function getAssetsByType(type: AssetType): Asset[] {
  return Object.values(DEMO_ASSETS).filter(a => a.assetType === type);
}

export function getNodeById(nodeId: string): StoryNode | undefined {
  return STORY_NODES[nodeId];
}

export function getCandidatesForNode(nodeId: string): CandidateFrame[] {
  return CANDIDATE_FRAMES[nodeId] || [];
}

export function getNextNodeId(candidateId: string): string | undefined {
  return CHOICE_TO_NODE[candidateId];
}
