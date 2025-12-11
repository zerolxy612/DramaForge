# 漫剧共创平台 - 系统设计文档

> 版本: v0.1.0  
> 最后更新: 2024-12-08

## 一、产品概述

### 1.1 核心玩法
- 以**分镜镜头**为互动单位（默认5秒）
- 用户从**3个分支选项**中选择推进剧情
- 支持**刷新分镜**（每日10次免费，之后消耗积分）
- **10%概率**触发可自定义分镜模式
- 分镜涉及的**演员/场景/道具**自动上链注册，社区共享

### 1.2 经济系统
- **积分获取**: 生成分镜、观看广告
- **积分消耗**: 刷新分镜、跳过广告
- **空投激励**: 测试网通过后，根据交互记录空投奖励

---

## 二、核心数据模型

### 2.1 剧集 (Drama)
```typescript
interface Drama {
  dramaId: string;
  title: string;
  description: string;
  genesisCid: string;        // 初始设定 IPFS CID
  creator: address;
  targetDuration: number;    // 目标时长（秒），如 7200 = 120分钟
  currentDuration: number;   // 当前累计时长
  status: 'ongoing' | 'completed';
  createdAt: timestamp;
}
```

### 2.2 故事节点 (StoryNode)
```typescript
interface StoryNode {
  nodeId: string;
  dramaId: string;
  parentNodeIds: string[];   // 支持 DAG，允许多父节点（分支合流）
  depth: number;             // 离根节点的距离
  
  // 该节点确认的分镜
  confirmedFrame: {
    frameCid: string;        // 分镜内容 IPFS CID
    duration: number;        // 时长（秒）
    actorIds: string[];      // 使用的演员资产
    sceneId: string;         // 使用的场景资产
    propIds: string[];       // 使用的道具资产
    script: string;          // 分镜脚本描述
  };
  
  contributor: address;      // 确认该节点的用户
  timestamp: timestamp;
  
  // 分支统计
  childCount: number;        // 子节点数量
  totalVisits: number;       // 访问次数
}
```

### 2.3 资产 (Asset)
```typescript
interface Asset {
  assetId: string;
  assetType: 'ACTOR' | 'SCENE' | 'PROP';
  
  // 元数据
  name: string;
  metadataCid: string;       // 详细信息 IPFS CID
  thumbnailCid: string;      // 缩略图
  
  // 归属
  creator: address;          // 首次落地该资产的用户
  originDramaId: string;     // 首次出现的剧集
  originNodeId: string;      // 首次出现的节点
  
  // 统计
  usageCount: number;        // 被使用次数
  createdAt: timestamp;
}
```

### 2.4 分支 (Branch)
```typescript
interface Branch {
  branchId: string;
  dramaId: string;
  
  // 分支路径
  nodePath: string[];        // 从根到当前的节点ID列表
  currentNodeId: string;     // 当前最新节点
  
  // 温度系统
  temperature: number;       // 0-100，用于判断活跃度
  participantCount: number;
  lastActiveAt: timestamp;
  
  // 状态
  status: 'active' | 'frozen' | 'merged';
  mergedIntoBranchId?: string;
}
```

### 2.5 用户积分 (UserPoints) - 链下
```typescript
interface UserPoints {
  userId: address;
  balance: number;
  
  // 每日限制
  dailyFreeRefresh: number;  // 剩余免费刷新次数
  lastResetDate: date;
  
  // 统计
  totalEarned: number;
  totalSpent: number;
}
```

---

## 三、上链策略（Solana）

### 3.1 必须上链 ✅
| 数据 | Program/标准 | 理由 |
|------|-------------|------|
| 资产注册 | Metaplex NFT | 归属权、可复用、潜在交易价值 |
| 故事节点 | story_node Program | 贡献证明、叙事链完整性 |
| 剧集元信息 | drama_hub Program | 唯一标识、状态管理 |
| 平台积分 | SPL Token (DRAP) | 可交易、空投基础 |

### 3.2 链下 + 快照 🟡
| 数据 | 存储 | 理由 |
|------|------|------|
| 积分余额快照 | 数据库 + 定期 snapshot | 便于统计分析 |
| 资产使用次数 | AssetUsage PDA | 链上统计，实时更新 |

### 3.3 纯链下 ❌
| 数据 | 存储 | 理由 |
|------|------|------|
| 候选分镜 | 临时缓存 | 用户确认前的临时状态 |
| 分镜媒体 | Arweave / Shadow Drive | 永久存储，链下引用 |
| 免费刷新次数 | Redis | UX限制，非核心价值 |
| 行为日志 | 日志系统 | 分析用途 |

---

## 四、智能合约架构（Solana / Anchor）

> ⚠️ 本项目使用 **Solana** 区块链，合约使用 **Rust + Anchor** 框架开发

### 4.1 Program 架构图

```
┌─────────────────────────────────────────────────────┐
│                drama_hub (Program)                   │
│  剧集管理                                            │
│  • create_drama                                      │
│  • update_duration                                   │
│  • complete_drama                                    │
└─────────────────────────────────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│   story_node         │    │   asset_registry     │
│   故事节点 Program    │    │   资产 (Metaplex NFT)│
│   • confirm_node     │    │   • register_asset   │
│   • record_visit     │    │   • record_usage     │
└──────────────────────┘    └──────────────────────┘
          │                           │
          └───────────┬───────────────┘
                      ▼
          ┌─────────────────────────────┐
          │      drama_token (SPL)       │
          │      平台积分代币             │
          │  • mint_reward               │
          │  • burn_spend                │
          └─────────────────────────────┘
```

### 4.2 项目结构

```
programs/
├── drama-hub/                    # 剧集管理 Program
│   ├── src/
│   │   ├── lib.rs               # 入口
│   │   ├── state.rs             # 账户状态
│   │   ├── instructions/        # 指令
│   │   │   ├── mod.rs
│   │   │   ├── create_drama.rs
│   │   │   ├── update_duration.rs
│   │   │   └── complete_drama.rs
│   │   └── error.rs             # 错误码
│   └── Cargo.toml
│
├── story-node/                   # 故事节点 Program
│   ├── src/
│   │   ├── lib.rs
│   │   ├── state.rs
│   │   ├── instructions/
│   │   │   ├── mod.rs
│   │   │   ├── confirm_node.rs
│   │   │   └── record_visit.rs
│   │   └── error.rs
│   └── Cargo.toml
│
└── drama-token/                  # SPL Token Program (积分)
    └── ... (使用标准 SPL Token)
```

### 4.3 账户状态定义

#### Drama 账户
```rust
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Drama {
    /// 创建者公钥
    pub creator: Pubkey,
    /// 剧集标题 (最大64字节)
    pub title: String,
    /// 初始设定 URI (Arweave/IPFS)
    pub genesis_uri: String,
    /// 目标时长（秒）
    pub target_duration: u64,
    /// 当前累计时长
    pub current_duration: u64,
    /// 状态: 0=进行中, 1=已完成
    pub status: u8,
    /// 节点计数
    pub node_count: u64,
    /// 创建时间戳
    pub created_at: i64,
    /// PDA bump
    pub bump: u8,
}

impl Drama {
    pub const MAX_TITLE_LEN: usize = 64;
    pub const MAX_URI_LEN: usize = 200;
    
    pub const SPACE: usize = 8  // discriminator
        + 32                     // creator
        + 4 + Self::MAX_TITLE_LEN  // title
        + 4 + Self::MAX_URI_LEN    // genesis_uri
        + 8                      // target_duration
        + 8                      // current_duration
        + 1                      // status
        + 8                      // node_count
        + 8                      // created_at
        + 1;                     // bump
}
```

#### StoryNode 账户
```rust
#[account]
pub struct StoryNode {
    /// 所属剧集
    pub drama: Pubkey,
    /// 父节点 (最多支持3个，用于DAG合流)
    pub parent_nodes: Vec<Pubkey>,
    /// 贡献者
    pub contributor: Pubkey,
    /// 分镜内容 URI
    pub frame_uri: String,
    /// 使用的资产 Mint 地址列表
    pub asset_mints: Vec<Pubkey>,
    /// 分镜时长（秒）
    pub duration: u16,
    /// 节点深度
    pub depth: u16,
    /// 访问次数
    pub visit_count: u64,
    /// 子节点数量
    pub child_count: u16,
    /// 创建时间戳
    pub timestamp: i64,
    /// PDA bump
    pub bump: u8,
}

impl StoryNode {
    pub const MAX_PARENTS: usize = 3;
    pub const MAX_ASSETS: usize = 10;
    pub const MAX_URI_LEN: usize = 200;
    
    pub const SPACE: usize = 8  // discriminator
        + 32                     // drama
        + 4 + (32 * Self::MAX_PARENTS)  // parent_nodes
        + 32                     // contributor
        + 4 + Self::MAX_URI_LEN  // frame_uri
        + 4 + (32 * Self::MAX_ASSETS)   // asset_mints
        + 2                      // duration
        + 2                      // depth
        + 8                      // visit_count
        + 2                      // child_count
        + 8                      // timestamp
        + 1;                     // bump
}
```

#### Asset 账户 (基于 Metaplex)
```rust
// 资产使用 Metaplex NFT 标准
// 额外信息存储在 on-chain metadata 的 attributes 中

// Asset 类型枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AssetType {
    Actor = 0,   // 角色
    Scene = 1,   // 场景
    Prop = 2,    // 道具
}

// 资产使用统计账户 (独立 PDA)
#[account]
pub struct AssetUsage {
    /// 资产 Mint 地址
    pub mint: Pubkey,
    /// 资产类型
    pub asset_type: AssetType,
    /// 创建者
    pub creator: Pubkey,
    /// 首次出现的剧集
    pub origin_drama: Pubkey,
    /// 使用次数
    pub usage_count: u64,
    /// 创建时间
    pub created_at: i64,
    /// bump
    pub bump: u8,
}
```

### 4.4 核心指令

#### create_drama
```rust
#[derive(Accounts)]
#[instruction(title: String, genesis_uri: String, target_duration: u64)]
pub struct CreateDrama<'info> {
    #[account(
        init,
        payer = creator,
        space = Drama::SPACE,
        seeds = [b"drama", creator.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub drama: Account<'info, Drama>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn create_drama(
    ctx: Context<CreateDrama>,
    title: String,
    genesis_uri: String,
    target_duration: u64,
) -> Result<()> {
    let drama = &mut ctx.accounts.drama;
    drama.creator = ctx.accounts.creator.key();
    drama.title = title;
    drama.genesis_uri = genesis_uri;
    drama.target_duration = target_duration;
    drama.current_duration = 0;
    drama.status = 0; // ongoing
    drama.node_count = 0;
    drama.created_at = Clock::get()?.unix_timestamp;
    drama.bump = ctx.bumps.drama;
    
    emit!(DramaCreated {
        drama: drama.key(),
        creator: drama.creator,
        title: drama.title.clone(),
        target_duration,
    });
    
    Ok(())
}
```

#### confirm_node
```rust
#[derive(Accounts)]
pub struct ConfirmNode<'info> {
    #[account(
        init,
        payer = contributor,
        space = StoryNode::SPACE,
        seeds = [
            b"node",
            drama.key().as_ref(),
            &drama.node_count.to_le_bytes()
        ],
        bump
    )]
    pub node: Account<'info, StoryNode>,
    
    #[account(mut)]
    pub drama: Account<'info, Drama>,
    
    #[account(mut)]
    pub contributor: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn confirm_node(
    ctx: Context<ConfirmNode>,
    parent_nodes: Vec<Pubkey>,
    frame_uri: String,
    asset_mints: Vec<Pubkey>,
    duration: u16,
) -> Result<()> {
    let drama = &mut ctx.accounts.drama;
    let node = &mut ctx.accounts.node;
    
    // 计算深度
    let depth = if parent_nodes.is_empty() { 0 } else { 
        // TODO: 从父节点获取最大深度 + 1
        1 
    };
    
    node.drama = drama.key();
    node.parent_nodes = parent_nodes;
    node.contributor = ctx.accounts.contributor.key();
    node.frame_uri = frame_uri;
    node.asset_mints = asset_mints;
    node.duration = duration;
    node.depth = depth;
    node.visit_count = 0;
    node.child_count = 0;
    node.timestamp = Clock::get()?.unix_timestamp;
    node.bump = ctx.bumps.node;
    
    // 更新剧集
    drama.current_duration += duration as u64;
    drama.node_count += 1;
    
    // 检查是否完成
    if drama.current_duration >= drama.target_duration {
        drama.status = 1; // completed
    }
    
    emit!(NodeConfirmed {
        node: node.key(),
        drama: drama.key(),
        contributor: node.contributor,
        duration,
    });
    
    Ok(())
}
```

### 4.5 SPL Token 积分设计

```rust
// 代币信息
Token Name: DRAMA Points
Symbol: DRAP
Decimals: 6
Total Supply: 无上限 (可增发)

// 积分规则
+10 DRAP  - 确认分镜节点
+5  DRAP  - 创建新资产
+2  DRAP  - 观看广告

-5  DRAP  - 刷新分镜（超出免费次数）
-3  DRAP  - 跳过广告
-10 DRAP  - 自定义分镜生成
```

### 4.6 事件定义

```rust
#[event]
pub struct DramaCreated {
    pub drama: Pubkey,
    pub creator: Pubkey,
    pub title: String,
    pub target_duration: u64,
}

#[event]
pub struct NodeConfirmed {
    pub node: Pubkey,
    pub drama: Pubkey,
    pub contributor: Pubkey,
    pub duration: u16,
}

#[event]
pub struct AssetRegistered {
    pub mint: Pubkey,
    pub asset_type: AssetType,
    pub creator: Pubkey,
    pub origin_drama: Pubkey,
}

#[event]
pub struct DramaCompleted {
    pub drama: Pubkey,
    pub final_duration: u64,
}
```

---

## 五、分支机制设计

### 5.1 分支结构：DAG（有向无环图）
- 允许分支**合流**，避免无限膨胀
- 不同选择可能汇聚到同一个剧情节点

### 5.2 分支温度系统
```
温度 = 0.4 × 参与人数权重 + 0.4 × 活跃度权重 + 0.2 × 质量评分
```

| 温度区间 | 状态 | 效果 |
|----------|------|------|
| 🔥 >80° | 热门 | 高亮显示，优先推荐 |
| 🌡️ 30-80° | 正常 | 正常展示 |
| ❄️ <30° | 冷门 | 提示"即将冻结" |
| 🧊 0° | 冻结 | 7天无人推进后冻结，可付费复活 |

### 5.3 分支跳转规则
- **免费跳转**: 热门节点（>50人访问过）
- **付费跳转**: 冷门节点，消耗积分
- **不可跳转**: 冻结分支（需先复活）

### 5.4 完成条件
- 第一条分支达到目标时长 = **正典结局**
- 其他分支可继续推进 = **平行宇宙结局**
- 探索冷门分支有机会发现**隐藏结局**

---

## 六、前端页面结构

### 6.1 核心页面

```
/                       # 首页（当前宣传页）
/theater/:dramaId       # 剧场页 - 主互动界面
/studio/:dramaId        # 创作台 - 自定义分镜
/assets                 # 资产库 - 浏览社区资产
/profile                # 个人中心
/drama/:dramaId/tree    # 故事树 - 可视化分支
```

### 6.2 剧场页核心组件

```
┌─────────────────────────────────────────────────────┐
│                    Theater Page                      │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐    │
│  │            FramePlayer                       │    │
│  │         当前分镜播放器 (5秒视频)              │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │            BranchSelector                    │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐               │    │
│  │  │ 选项1 │  │ 选项2 │  │ 选项3 │               │    │
│  │  └──────┘  └──────┘  └──────┘               │    │
│  │                                              │    │
│  │  [🔄 刷新 8/10]  [✨ 自定义模式触发!]          │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────┐    │
│  │   AssetPreview    │  │    ProgressBar       │    │
│  │ 角色/场景/道具预览 │  │   12:30 / 120:00     │    │
│  └──────────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 6.3 自定义分镜面板

```
┌─────────────────────────────────────────────────────┐
│              CustomFrameEditor                       │
├─────────────────────────────────────────────────────┤
│  角色选择: [@男主 ✓] [@女主 ✓] [@丧尸A] [+搜索]     │
│  场景选择: [废弃医院走廊 ✓] [病房] [+搜索]          │
│  道具选择: [铁棍] [手电筒] [+搜索]                  │
│                                                      │
│  分镜脚本:                                           │
│  ┌─────────────────────────────────────────────┐    │
│  │ 远景镜头，男主拉着女主慌张地往逃生通道跑...    │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  [预览生成效果]              [确认生成 - 消耗10积分] │
└─────────────────────────────────────────────────────┘
```

---

## 七、API 设计

### 7.1 核心接口

```typescript
// 获取候选分镜
POST /api/drama/:dramaId/generate-frames
Body: { parentNodeId: string }
Response: { 
  frames: CandidateFrame[],  // 3个候选
  customModeTriggered: boolean  // 是否触发自定义模式
}

// 刷新候选分镜
POST /api/drama/:dramaId/refresh-frames
Body: { parentNodeId: string }
Response: { 
  frames: CandidateFrame[],
  remainingFreeRefresh: number,
  pointsSpent: number
}

// 确认分镜（触发上链）
POST /api/drama/:dramaId/confirm-frame
Body: { 
  parentNodeId: string,
  selectedFrame: FrameData,
  signature: string  // 用户签名
}
Response: { 
  nodeId: string,
  txHash: string,
  newAssets: Asset[]  // 新注册的资产
}

// 自定义分镜生成
POST /api/drama/:dramaId/custom-frame
Body: {
  parentNodeId: string,
  actorIds: string[],
  sceneId: string,
  propIds: string[],
  script: string
}
Response: { frame: CandidateFrame }
```

### 7.2 资产接口

```typescript
// 获取资产列表
GET /api/assets?type=ACTOR&page=1&limit=20
Response: { assets: Asset[], total: number }

// 搜索资产
GET /api/assets/search?q=丧尸&type=ACTOR
Response: { assets: Asset[] }

// 获取资产详情
GET /api/assets/:assetId
Response: { asset: Asset, usageHistory: NodeReference[] }
```

---

## 八、开发阶段规划

---

### 📅 整体时间线概览

| 阶段 | 周期 | 目标 | 里程碑 |
|------|------|------|--------|
| Phase 1: MVP | Week 1-4 | 核心循环验证 | 内部可玩Demo |
| Phase 2: Alpha | Week 5-7 | 功能完善 | 小范围内测 |
| Phase 3: Beta | Week 8-10 | 社区化 | 公开测试 |
| Phase 4: Launch | Week 11-12 | 经济化 | 主网上线 |

---

### 🚀 Phase 1: MVP (Week 1-4) - 核心循环验证

**目标**：验证「选择分镜 → 生成 → 上链」核心玩法

#### Week 1: 基础架构 ✅ (已完成大部分)
| 任务 | 负责 | 状态 | 说明 |
|------|------|------|------|
| 系统设计文档 | 全栈 | ✅ 完成 | 数据模型、API设计 |
| 合约接口定义 | 合约 | ✅ 完成 | IDramaHub/IStoryNode/IAsset |
| 合约基础实现 | 合约 | ✅ 完成 | 三个核心合约 |
| 前端类型定义 | 前端 | ✅ 完成 | TypeScript类型 |
| 状态管理 Store | 前端 | ✅ 完成 | Zustand stores |
| 剧场页面骨架 | 前端 | ✅ 完成 | 基础组件结构 |

#### Week 2: 合约 + 后端 API
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 合约单元测试 | 合约 | 2天 | 关键路径测试覆盖 |
| 测试网部署 | 合约 | 0.5天 | Sepolia/Base Goerli |
| 后端项目初始化 | 后端 | 0.5天 | Express/Nest + PostgreSQL |
| AI分镜生成接口 | 后端 | 2天 | 对接自动化流 |
| 积分系统 CRUD | 后端 | 1天 | 基础积分增减 |
| IPFS上传服务 | 后端 | 1天 | Pinata/NFT.Storage |

#### Week 3: 前端功能联调
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 钱包连接完善 | 前端 | 1天 | 登录状态、签名 |
| 分镜生成流程 | 前端 | 2天 | 调用API→展示候选 |
| 分支选择交互 | 前端 | 1天 | 选择→确认→上链 |
| 刷新机制 | 前端 | 1天 | 免费次数+积分扣除 |
| 进度展示 | 前端 | 0.5天 | 剧集时长进度 |
| 基础错误处理 | 前端 | 0.5天 | Toast、Loading态 |

#### Week 4: MVP联调 + Demo准备
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 全链路联调 | 全栈 | 2天 | 前端→后端→合约 |
| 创建Demo剧集 | 产品 | 1天 | 准备初始内容 |
| Bug修复 | 全栈 | 2天 | 关键问题修复 |
| 内部演示 | 全栈 | - | MVP里程碑 |

**Phase 1 交付物**：
- ✅ 可运行的单剧场Demo
- ✅ 3分支选择→生成核心循环
- ✅ 基础积分系统（链下）
- ✅ 测试网合约部署

---

### 🔧 Phase 2: Alpha (Week 5-7) - 功能完善

**目标**：补全核心功能，准备内测

#### Week 5: 自定义分镜 + 资产系统
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 10%概率触发逻辑 | 后端 | 0.5天 | 随机数生成 |
| 自定义分镜API | 后端 | 1.5天 | 接收资产ID+脚本 |
| 自定义编辑器完善 | 前端 | 2天 | 资产选择器UI |
| 资产注册上链 | 合约 | 1天 | 测试+优化gas |
| 资产库页面 | 前端 | 2天 | 列表+搜索+筛选 |

#### Week 6: 故事树 + 分支系统
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 故事树数据结构 | 后端 | 1天 | 树状查询API |
| 故事树可视化 | 前端 | 2天 | D3.js/React Flow |
| 分支温度计算 | 后端 | 1天 | 活跃度算法 |
| 分支跳转功能 | 前端 | 1天 | 热门节点免费跳 |
| 节点详情页 | 前端 | 1天 | 查看历史分镜 |

#### Week 7: 用户中心 + 内测准备
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 个人中心页面 | 前端 | 1.5天 | 积分、贡献、资产 |
| 贡献统计API | 后端 | 1天 | 节点数、资产数 |
| 积分获取渠道 | 后端 | 1天 | 生成分镜奖励 |
| UI/UX优化 | 前端 | 1.5天 | 动画、响应式 |
| Alpha测试 | 全栈 | 1天 | 内部小范围测试 |

**Phase 2 交付物**：
- ✅ 完整的自定义分镜功能
- ✅ 社区资产库
- ✅ 故事树可视化
- ✅ 用户中心
- ✅ 可内测的Alpha版本

---

### 🌐 Phase 3: Beta (Week 8-10) - 社区化

**目标**：支持多剧场、优化体验、公开测试

#### Week 8: 多剧场 + 发现页
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 剧集列表页 | 前端 | 1.5天 | 热门、最新、参与中 |
| 创建剧集流程 | 前端 | 1.5天 | 表单→上链 |
| 剧集详情页 | 前端 | 1天 | 封面、介绍、参与者 |
| 推荐算法 | 后端 | 1天 | 简单的热度排序 |
| 搜索功能 | 后端 | 1天 | 剧集+资产全文搜索 |

#### Week 9: 社交功能 + 广告系统
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 评论系统 | 后端 | 1.5天 | 节点评论 |
| 评论UI | 前端 | 1天 | 评论列表+发布 |
| 广告SDK集成 | 前端 | 1.5天 | 激励视频 |
| 看广告得积分 | 后端 | 1天 | 防作弊+积分发放 |
| 分享功能 | 前端 | 1天 | 社交分享卡片 |

#### Week 10: 性能优化 + Beta准备
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 前端性能优化 | 前端 | 1.5天 | 懒加载、缓存 |
| API性能优化 | 后端 | 1.5天 | 索引、缓存 |
| 合约gas优化 | 合约 | 1天 | 批量操作优化 |
| 安全审计准备 | 合约 | 1天 | 自查+文档 |
| Beta公测启动 | 全栈 | - | 公测里程碑 |

**Phase 3 交付物**：
- ✅ 多剧场系统
- ✅ 广告积分获取
- ✅ 社交功能
- ✅ 性能优化完成
- ✅ 公开Beta版本

---

### 💰 Phase 4: Launch (Week 11-12) - 经济化

**目标**：上线经济系统，准备主网

#### Week 11: 积分快照 + 空投
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| Merkle快照合约 | 合约 | 1.5天 | 积分快照上链 |
| 快照生成脚本 | 后端 | 1天 | 定期生成Merkle树 |
| 空投领取页面 | 前端 | 1.5天 | 查询资格+领取 |
| 空投合约测试 | 合约 | 1天 | 测试网验证 |
| 经济模型微调 | 产品 | - | 基于Beta数据调整 |

#### Week 12: 主网部署 + 上线
| 任务 | 负责 | 工时 | 说明 |
|------|------|------|------|
| 安全审计 | 外部 | - | 合约审计（可并行）|
| 主网部署 | 合约 | 1天 | 主网合约部署 |
| 数据迁移 | 后端 | 1天 | 测试网→主网映射 |
| 上线检查 | 全栈 | 1天 | 最终验证 |
| 正式上线 | 全栈 | - | 🚀 Launch! |

**Phase 4 交付物**：
- ✅ 链上积分快照
- ✅ 空投机制
- ✅ 主网合约
- ✅ 正式上线

---

### 📊 资源需求估算

| 角色 | 人数 | 工作内容 |
|------|------|----------|
| 前端工程师 | 1-2 | React/Next.js 页面开发 |
| 后端工程师 | 1 | API开发、AI对接 |
| 合约工程师 | 1 | Solidity合约开发 |
| 产品/设计 | 1 | UI设计、产品决策 |

**并行开发建议**：
- Week 2-3: 合约测试 & 后端API & 前端开发 **可并行**
- Week 5-6: 资产系统 & 故事树 **可并行**
- Week 11: 快照合约 & 前端页面 **可并行**

---

### ⚠️ 风险点 & 应对

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| AI生成质量不稳定 | 用户体验差 | 预设高质量模板兜底 |
| Gas费用过高 | 用户流失 | 选择L2/批量操作优化 |
| 合约安全问题 | 资金风险 | 简化逻辑+外部审计 |
| 分支爆炸增长 | 存储成本 | 冷门分支冻结机制 |
| 用户增长慢 | 内容稀缺 | 官方账号持续生产 |

---

### 🎯 关键里程碑

```
Week 4  ────●──── MVP Demo（内部可玩）
             │
Week 7  ────●──── Alpha（小范围内测）
             │
Week 10 ────●──── Beta（公开测试）
             │
Week 12 ────●──── Launch（主网上线）
```

---

## 九、技术栈

### 区块链：Solana

> ⚠️ 我们选择 Solana 作为主链，使用 Rust + Anchor 开发智能合约

| 组件 | 技术选型 | 说明 |
|------|----------|------|
| 链 | Solana (Mainnet-beta / Devnet) | 高TPS、低Gas |
| 合约语言 | Rust + Anchor | Solana标准框架 |
| Token标准 | SPL Token | 平台积分代币 |
| NFT标准 | Metaplex | 资产NFT |
| 存储 | Arweave / Shadow Drive | 链上永久存储 |

### 前端
| 组件 | 技术选型 | 说明 |
|------|----------|------|
| 框架 | Next.js 14 (App Router) | React全栈框架 |
| 样式 | TailwindCSS | 原子化CSS |
| 钱包 | @solana/wallet-adapter | Phantom/Solflare等 |
| 链交互 | @solana/web3.js + @coral-xyz/anchor | Solana SDK |
| 动画 | Framer Motion | 交互动画 |
| 状态管理 | Zustand | 轻量状态管理 |

### 后端
| 组件 | 技术选型 | 说明 |
|------|----------|------|
| 服务端 | Node.js (Express/Nest) | API服务 |
| 数据库 | PostgreSQL | 主数据库 |
| 缓存 | Redis | 积分、会话缓存 |
| 存储 | Arweave / IPFS | 媒体文件 |

### AI工作流
| 组件 | 技术选型 | 说明 |
|------|----------|------|
| 剧本生成 | LLM (GPT/Claude) | 分镜脚本生成 |
| 图像生成 | Stable Diffusion / ComfyUI | 分镜图生成 |
| 语音合成 | TTS | 配音（可选）|

---

## 十、Solana 合约架构

### 10.1 Program 结构

```
programs/
├── drama_hub/              # 剧集管理 Program
│   ├── src/
│   │   ├── lib.rs
│   │   ├── state.rs        # 账户状态定义
│   │   ├── instructions/   # 指令处理
│   │   │   ├── create_drama.rs
│   │   │   ├── update_progress.rs
│   │   │   └── complete_drama.rs
│   │   └── error.rs        # 错误定义
│   └── Cargo.toml
│
├── story_node/             # 故事节点 Program
│   ├── src/
│   │   ├── lib.rs
│   │   ├── state.rs
│   │   └── instructions/
│   │       ├── confirm_node.rs
│   │       └── record_visit.rs
│   └── Cargo.toml
│
└── asset_registry/         # 资产注册 Program (Metaplex NFT)
    ├── src/
    │   ├── lib.rs
    │   ├── state.rs
    │   └── instructions/
    │       ├── register_asset.rs
    │       └── record_usage.rs
    └── Cargo.toml
```

### 10.2 账户状态设计

```rust
// Drama 账户
#[account]
pub struct Drama {
    pub creator: Pubkey,           // 创建者
    pub title: String,             // 标题 (max 64)
    pub genesis_uri: String,       // 初始设定 URI (max 200)
    pub target_duration: u64,      // 目标时长（秒）
    pub current_duration: u64,     // 当前时长
    pub status: DramaStatus,       // 状态
    pub created_at: i64,           // 创建时间
    pub bump: u8,                  // PDA bump
}

// StoryNode 账户
#[account]
pub struct StoryNode {
    pub drama: Pubkey,             // 所属剧集
    pub parent_nodes: Vec<Pubkey>, // 父节点 (支持DAG)
    pub contributor: Pubkey,       // 贡献者
    pub frame_uri: String,         // 分镜内容 URI
    pub asset_mints: Vec<Pubkey>,  // 使用的资产 Mint
    pub duration: u16,             // 时长（秒）
    pub depth: u16,                // 深度
    pub timestamp: i64,            // 时间戳
    pub bump: u8,
}

// Asset 元数据 (通过 Metaplex NFT 存储)
// 使用 Metaplex 标准，额外属性存在 attributes 中
```

### 10.3 SPL Token 设计（平台积分）

```rust
// 积分代币
Token Name: DRAMA Points (DRAP)
Decimals: 6
Mint Authority: Platform PDA

// 积分获取
- 确认分镜节点: +10 DRAP
- 创建新资产: +5 DRAP
- 观看广告: +2 DRAP

// 积分消耗
- 刷新分镜（超出免费次数）: -5 DRAP
- 跳过广告: -3 DRAP
- 自定义分镜生成: -10 DRAP
```

### 10.4 关键指令

```rust
// drama_hub
pub fn create_drama(ctx, title, genesis_uri, target_duration) -> Result<()>
pub fn update_duration(ctx, added_duration) -> Result<()>
pub fn complete_drama(ctx) -> Result<()>

// story_node
pub fn confirm_node(ctx, frame_uri, asset_mints, duration) -> Result<()>
pub fn record_visit(ctx) -> Result<()>

// asset_registry (基于 Metaplex)
pub fn register_asset(ctx, metadata_uri, asset_type) -> Result<()>
pub fn record_usage(ctx, node_pubkey) -> Result<()>
```

---

## 十一、前端钱包集成（Solana）

### 11.1 支持的钱包

| 钱包 | 优先级 | 说明 |
|------|--------|------|
| Phantom | P0 | Solana最主流钱包 |
| Solflare | P1 | 第二大钱包 |
| Backpack | P1 | xNFT生态 |
| Glow | P2 | 移动端友好 |

### 11.2 钱包适配器配置

```typescript
// providers.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const network = WalletAdapterNetwork.Devnet; // 或 Mainnet
const endpoint = clusterApiUrl(network);

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new BackpackWalletAdapter(),
];
```

### 11.3 登录流程

```
1. 用户点击连接钱包
2. 选择钱包（Phantom等）
3. 钱包授权连接
4. 前端请求后端获取 nonce
5. 用户签名 nonce 消息
6. 后端验证签名
7. 返回 JWT Token
8. 登录完成，获取用户积分等数据
```

