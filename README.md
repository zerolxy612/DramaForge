# DramaForge - Web3 AIGC 短剧共创平台

基于 **Solana** 区块链的 AIGC 短剧互动平台，用户通过选择分镜推进剧情，所有内容和资产上链注册。

## 🚀 技术栈

### 区块链
| 组件 | 技术 | 说明 |
|------|------|------|
| 链 | Solana | 高 TPS、低 Gas |
| 合约语言 | Rust + Anchor | Solana 标准框架 |
| Token | SPL Token (DRAP) | 平台积分代币 |
| NFT | Metaplex | 资产 NFT |

### 前端
| 组件 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | React 全栈框架 |
| 样式 | TailwindCSS | 原子化 CSS |
| 钱包 | @solana/wallet-adapter | Phantom/Solflare 等 |
| 状态管理 | Zustand | 轻量状态管理 |

## 📁 项目结构

```
drama/
├── apps/
│   └── web/                    # Next.js 前端应用
│       ├── app/                # App Router 页面
│       ├── lib/
│       │   ├── solana.ts       # Solana 配置
│       │   └── stores/         # Zustand 状态管理
│       └── package.json
│
├── programs/                   # Solana Programs (智能合约)
│   ├── drama-hub/              # 剧集管理
│   ├── story-node/             # 故事节点
│   ├── asset-registry/         # 资产注册
│   └── drama-token/            # 平台积分代币
│
├── docs/
│   └── SYSTEM_DESIGN.md        # 系统设计文档
│
├── Anchor.toml                 # Anchor 配置
├── Cargo.toml                  # Rust workspace 配置
└── pnpm-workspace.yaml
```

## 🛠 快速开始

### 前置条件

```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# 安装 Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install 0.30.1
avm use 0.30.1

# 安装 pnpm
npm install -g pnpm
```

### 安装依赖

```bash
# 安装前端依赖
pnpm install

# 构建 Solana Programs
anchor build
```

### 运行开发环境

```bash
# 启动本地 Solana 验证器
solana-test-validator

# 部署到本地网络
anchor deploy

# 启动前端开发服务器
pnpm dev
```

### 前端环境变量

在 `apps/web/` 目录创建 `.env.local`：

```env
# Solana 网络: devnet, mainnet-beta, 或 localnet
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# 自定义 RPC（可选，推荐使用 QuickNode/Helius）
NEXT_PUBLIC_SOLANA_RPC_URL=

# 程序 ID（部署后更新为真实地址）
NEXT_PUBLIC_DRAMA_HUB_PROGRAM_ID=xxx
NEXT_PUBLIC_STORY_NODE_PROGRAM_ID=xxx
NEXT_PUBLIC_ASSET_REGISTRY_PROGRAM_ID=xxx
NEXT_PUBLIC_DRAMA_TOKEN_PROGRAM_ID=xxx
```

## 📜 Solana Programs

### drama-hub (剧集管理)
- `create_drama` - 创建新剧集
- `update_duration` - 更新剧集时长
- `complete_drama` - 完成剧集

### story-node (故事节点)
- `confirm_node` - 确认故事节点（选择分支上链）
- `record_visit` - 记录节点访问

### asset-registry (资产注册)
- `register_asset` - 注册新资产（角色/场景/道具）
- `record_usage` - 记录资产使用

### drama-token (积分代币)
- `initialize_token` - 初始化 DRAP 代币
- `mint_reward` - 奖励积分（+10 确认分镜，+5 创建资产，+2 观看广告）
- `burn_spend` - 消耗积分（-5 刷新分镜，-10 自定义分镜）

## 🎮 核心玩法

1. **选择分镜** - 每次展示 3 个分支选项，选择推进剧情
2. **刷新分镜** - 每日 10 次免费，超出消耗 DRAP
3. **自定义分镜** - 10% 概率触发，可选择资产和脚本生成
4. **资产共享** - 创建的角色/场景/道具自动上链，社区可复用

## 📖 文档

- [系统设计文档](./docs/SYSTEM_DESIGN.md) - 详细的技术架构和数据模型
- [白皮书](./apps/web/app/whitepaper/page.tsx) - 项目白皮书页面

## 🔗 支持的钱包

- Phantom（推荐）
- Solflare
- Backpack

## 📄 License

MIT
