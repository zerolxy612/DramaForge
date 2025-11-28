export type Language = 'en' | 'zh-CN' | 'zh-TW';

export interface LandingContent {
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    description: string;
    manifestoTitle: string;
    manifestoBody: string;
    cta: {
      play: string;
      whitepaper: string;
      agentNode: string;
    };
    chips: string[];
    stats: {
      chapters: string;
      collectors: string;
      agents: string;
      split: string;
    };
  };
  manifesto: {
    sectionTag: string;
    title: string;
    paragraphs: string[];
    chips: string[];
    dashboard: {
      title: string;
      stats: {
        ubi: string;
        split: string;
        agents: string;
        cycles: string;
      };
      cards: {
        interaction: {
          title: string;
          body: string;
        };
        revenue: {
          title: string;
          body: string;
        };
      };
    };
  };
  perks: {
    dynamic: {
      accent: string;
      title: string;
      body: string;
    };
    revenue: {
      accent: string;
      title: string;
      body: string;
    };
    wallet: {
      accent: string;
      title: string;
      body: string;
    };
  };
  chapters: {
    tag: string;
    title: string;
    browseAll: string;
  };
  flow: {
    tag: string;
    title: string;
    steps: string[];
    features: {
      zk: string;
      multichain: string;
    };
  };
  launchpad: {
    tag: string;
    title: string;
    steps: string[];
    cta: {
      connect: string;
      mint: string;
    };
  };
}

export const landingContent: Record<Language, LandingContent> = {
  'en': {
    hero: {
      tagline: 'Interactive Drama OS · x402 Protocol',
      title: 'Interactive Motion Manga',
      subtitle: 'Agent Economy · Powered by AIGC',
      description: 'AI-generated interactive dramas with on-chain revenue sharing. Watch, interact, and earn—your wallet is your player. Seamless experience across mobile and web.',
      manifestoTitle: 'The x402 Manifesto',
      manifestoBody: 'x402 protocol is building an autonomous agent economy. As AI agents collaborate to create content, viewers earn Universal Basic Income (UBI) from the value they help create through engagement.',
      cta: {
        play: 'Start Watching',
        whitepaper: 'Read Whitepaper',
        agentNode: 'Join Agent Network',
      },
      chips: ['On-chain Chapters', 'Agent Co-creation', 'Viewer UBI'],
      stats: {
        chapters: 'Chapters minted',
        collectors: 'Collectors',
        agents: 'Agent nodes',
        split: 'Avg. split',
      },
    },
    manifesto: {
      sectionTag: 'Manifesto',
      title: 'The x402 Agent Economy · Interactive Drama Manifesto',
      paragraphs: [
        'x402 protocol enables an autonomous agent economy—a self-sustaining content production machine powered by AI collaboration.',
        'This new economy generates continuous revenue streams. Viewers earn UBI as they watch, with all revenue distributed transparently on-chain.',
        'We\'re rebuilding the value system: human engagement in content consumption becomes value creation. Every interaction, co-creation, and comment generates rewards.',
        'Interactive motion manga is our medium—every click drives the next frame of story and the next cycle of the economy.',
      ],
      chips: ['Agent Economy', 'AI Co-production', 'Viewer UBI', 'Interactive Drama'],
      dashboard: {
        title: 'Agent economy dashboard',
        stats: {
          ubi: 'UBI / viewer',
          split: 'Revenue split',
          agents: 'Live agents',
          cycles: 'Cycles / day',
        },
        cards: {
          interaction: {
            title: 'Engagement = Mining',
            body: 'Watch, comment, vote—all interactions are recorded on-chain. Agents use these signals to generate new story branches, with revenue flowing automatically.',
          },
          revenue: {
            title: 'Fans-First Revenue',
            body: 'Four-way split: Agents, AI models, creators, and viewers. All revenue flows are traceable on-chain.',
          },
        },
      },
    },
    perks: {
      dynamic: {
        accent: 'Dynamic NFT chapters',
        title: 'On-chain Dynamic Episodes',
        body: 'Every episode is an upgradable NFT. Story branches and endings are written on-chain, permanently verifiable.',
      },
      revenue: {
        accent: 'Revenue splits',
        title: 'Agent Revenue Sharing',
        body: 'Watch, interact, remix—all activities earn revenue. Automatic splits between AI models, creators, and viewers.',
      },
      wallet: {
        accent: 'Wallet-native UX',
        title: 'Your Wallet is Your Player',
        body: 'No login required. Connect wallet to play. Progress syncs across devices. Gasless airdrops and ending cards.',
      },
    },
    chapters: {
      tag: 'Chapter rail',
      title: 'Black, White & Red · Start Watching',
      browseAll: 'Browse All →',
    },
    flow: {
      tag: 'Flow',
      title: 'Web3 × AIGC × Agent · Production Pipeline',
      steps: [
        'AIGC generates storyboards → verified and recorded by x402 protocol',
        'Agents collaborate to create multiple endings, viewers vote on branches',
        'Each ending can be minted, traded, and earn revenue; remixing enabled',
        'Cross-wallet progress sync, mobile and web support',
      ],
      features: {
        zk: 'zero knowledge proofs',
        multichain: 'L2 / sidechain',
      },
    },
    launchpad: {
      tag: 'Launchpad',
      title: 'One-Click Launch / Mint / Revenue Share',
      steps: [
        'Connect wallet, auto-generate screening room',
        'Upload or generate storyboards, AI soundtrack & subtitles',
        'Set revenue splits, fans claim instantly',
        'Issue collectible cards & unlock hidden endings',
      ],
      cta: {
        connect: 'Connect Wallet',
        mint: 'Start Minting',
      },
    },
  },
  'zh-CN': {
    hero: {
      tagline: '互动漫剧操作系统 · x402 协议',
      title: '互动漫剧',
      subtitle: 'Agent 经济体 · AIGC 驱动',
      description: 'AI 生成的互动短剧，链上收益自动分账。边看边赚，钱包即播放器。移动端与 Web 端无缝体验。',
      manifestoTitle: 'x402 宣言',
      manifestoBody: 'x402 协议正在构建自主运转的 agent 经济体。当 AI agents 协作创造内容时，观众通过参与互动获得全民基本收入（UBI），分享他们帮助创造的价值。',
      cta: {
        play: '立即观看',
        whitepaper: '查看白皮书',
        agentNode: '加入 Agent 网络',
      },
      chips: ['链上剧集', 'Agent 共创', '观众 UBI'],
      stats: {
        chapters: '已铸造剧集',
        collectors: '收藏者',
        agents: 'Agent 节点',
        split: '平均分成',
      },
    },
    manifesto: {
      sectionTag: '宣言',
      title: 'x402 Agent 经济体 · 互动漫剧宣言',
      paragraphs: [
        'x402 协议正在孵化自主运转的 agent 经济体——由 AI 协作驱动的内容生产机器。',
        '这个全新的经济体持续创造收入流。观众边看边获得 UBI，所有收益按链上规则透明分配。',
        '我们正在重构价值体系：人类参与内容消费本身就是价值创造。每一次互动、共创、评论都能获得回报。',
        '互动漫剧是我们的载体——你的每一次点击都在驱动下一帧故事、下一个经济循环。',
      ],
      chips: ['Agent 经济体', 'AI 协作生产', '观众 UBI', '互动漫剧'],
      dashboard: {
        title: 'Agent 经济体仪表盘',
        stats: {
          ubi: 'UBI / 观众',
          split: '收益分成',
          agents: '活跃 agents',
          cycles: '循环 / 天',
        },
        cards: {
          interaction: {
            title: '互动 = 挖矿',
            body: '观看、评论、投票——所有互动都被记录在链上。Agents 根据这些信号生成新的故事分支，收益自动流转。',
          },
          revenue: {
            title: '粉丝优先分润',
            body: '四方拆分：Agents、AI 模型、创作者、观众。所有收益流向链上可追溯。',
          },
        },
      },
    },
    perks: {
      dynamic: {
        accent: '动态 NFT 剧集',
        title: '链上动态剧集',
        body: '每一集都是可更新的 NFT，剧情分支、结局追加都写入链上，永久可验证。',
      },
      revenue: {
        accent: '收益分账',
        title: 'Agent 收益分账',
        body: '观看、互动、二创都能被计入收益，模型、创作者与观众自动拆分收益。',
      },
      wallet: {
        accent: '钱包原生体验',
        title: '钱包即播放器',
        body: '无需登录，钱包直连播放。跨端同步进度，Gasless 领取空投与结局卡。',
      },
    },
    chapters: {
      tag: '剧集列表',
      title: '黑白红张力 · 立即开播',
      browseAll: '浏览全部 →',
    },
    flow: {
      tag: '流程',
      title: 'Web3 × AIGC × Agent · 发行流水线',
      steps: [
        'AIGC 生成分镜 → 由 x402 协议验证并上链',
        'Agent 协作生成多结局，观众投票选择分支',
        '每个结局可被铸造、交易、分润；可继续二创',
        '跨钱包播放进度同步，支持移动端 / Web 双端',
      ],
      features: {
        zk: '零知识证明',
        multichain: 'L2 / 侧链',
      },
    },
    launchpad: {
      tag: '发射台',
      title: '一键开播 / 铸造 / 分润',
      steps: [
        '连接钱包，自动生成放映室',
        '上传或生成分镜，AI 配乐与字幕',
        '设置收益拆分，粉丝即时领取',
        '发行收藏卡 & 解锁隐藏结局',
      ],
      cta: {
        connect: '连接钱包',
        mint: '开始铸造',
      },
    },
  },
  'zh-TW': {
    hero: {
      tagline: '互動漫劇作業系統 · x402 協議',
      title: '互動漫劇',
      subtitle: 'Agent 經濟體 · AIGC 驅動',
      description: 'AI 生成的互動短劇，鏈上收益自動分帳。邊看邊賺，錢包即播放器。移動端與 Web 端無縫體驗。',
      manifestoTitle: 'x402 宣言',
      manifestoBody: 'x402 協議正在構建自主運轉的 agent 經濟體。當 AI agents 協作創造內容時，觀眾通過參與互動獲得全民基本收入（UBI），分享他們幫助創造的價值。',
      cta: {
        play: '立即觀看',
        whitepaper: '查看白皮書',
        agentNode: '加入 Agent 網路',
      },
      chips: ['鏈上劇集', 'Agent 共創', '觀眾 UBI'],
      stats: {
        chapters: '已鑄造劇集',
        collectors: '收藏者',
        agents: 'Agent 節點',
        split: '平均分成',
      },
    },
    manifesto: {
      sectionTag: '宣言',
      title: 'x402 Agent 經濟體 · 互動漫劇宣言',
      paragraphs: [
        'x402 協議正在孵化自主運轉的 agent 經濟體——由 AI 協作驅動的內容生產機器。',
        '這個全新的經濟體持續創造收入流。觀眾邊看邊獲得 UBI，所有收益按鏈上規則透明分配。',
        '我們正在重構價值體系：人類參與內容消費本身就是價值創造。每一次互動、共創、評論都能獲得回報。',
        '互動漫劇是我們的載體——你的每一次點擊都在驅動下一幀故事、下一個經濟循環。',
      ],
      chips: ['Agent 經濟體', 'AI 協作生產', '觀眾 UBI', '互動漫劇'],
      dashboard: {
        title: 'Agent 經濟體儀表板',
        stats: {
          ubi: 'UBI / 觀眾',
          split: '收益分成',
          agents: '活躍 agents',
          cycles: '循環 / 天',
        },
        cards: {
          interaction: {
            title: '互動 = 挖礦',
            body: '觀看、評論、投票——所有互動都被記錄在鏈上。Agents 根據這些信號生成新的故事分支，收益自動流轉。',
          },
          revenue: {
            title: '粉絲優先分潤',
            body: '四方拆分：Agents、AI 模型、創作者、觀眾。所有收益流向鏈上可追溯。',
          },
        },
      },
    },
    perks: {
      dynamic: {
        accent: '動態 NFT 劇集',
        title: '鏈上動態劇集',
        body: '每一集都是可更新的 NFT，劇情分支、結局追加都寫入鏈上，永久可驗證。',
      },
      revenue: {
        accent: '收益分帳',
        title: 'Agent 收益分帳',
        body: '觀看、互動、二創都能被計入收益，模型、創作者與觀眾自動拆分收益。',
      },
      wallet: {
        accent: '錢包原生體驗',
        title: '錢包即播放器',
        body: '無需登錄，錢包直連播放。跨端同步進度，Gasless 領取空投與結局卡。',
      },
    },
    chapters: {
      tag: '劇集列表',
      title: '黑白紅張力 · 立即開播',
      browseAll: '瀏覽全部 →',
    },
    flow: {
      tag: '流程',
      title: 'Web3 × AIGC × Agent · 發行流水線',
      steps: [
        'AIGC 生成分鏡 → 由 x402 協議驗證並上鏈',
        'Agent 協作生成多結局，觀眾投票選擇分支',
        '每個結局可被鑄造、交易、分潤；可繼續二創',
        '跨錢包播放進度同步，支援移動端 / Web 雙端',
      ],
      features: {
        zk: '零知識證明',
        multichain: 'L2 / 側鏈',
      },
    },
    launchpad: {
      tag: '發射台',
      title: '一鍵開播 / 鑄造 / 分潤',
      steps: [
        '連接錢包，自動生成放映室',
        '上傳或生成分鏡，AI 配樂與字幕',
        '設置收益拆分，粉絲即時領取',
        '發行收藏卡 & 解鎖隱藏結局',
      ],
      cta: {
        connect: '連接錢包',
        mint: '開始鑄造',
      },
    },
  },
};

export function getLandingContent(lang: Language = 'en'): LandingContent {
  return landingContent[lang];
}
