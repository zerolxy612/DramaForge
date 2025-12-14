# Landing Page 多语言优化说明

## 概述

本次优化实现了 Landing Page 的多语言支持（英文、简体中文、繁体中文），并以产品 owner 的角度重新叙述了 x402 协议的愿景。

## 核心改进

### 1. 叙事优化

以产品 owner 的视角重新构建了核心叙事，突出以下要点：

**英文版核心信息：**
- x402 protocol enables an autonomous agent economy
- Viewers earn Universal Basic Income (UBI) through engagement
- Human engagement in content consumption becomes value creation
- Interactive motion manga as the medium for this new economy

**中文版核心信息：**
- x402 协议正在孵化自主运转的 agent 经济体
- 观众通过参与互动获得全民基本收入（UBI）
- 人类参与内容消费本身就是价值创造
- 互动漫剧作为这个新经济体的载体

### 2. 技术实现

#### 文件结构
```
apps/web/
├── lib/
│   └── i18n/
│       ├── landing.ts              # 多语言内容定义
│       └── LanguageContext.tsx     # 语言切换 Context
├── app/
│   ├── components/
│   │   └── LanguageSwitcher.tsx    # 语言切换组件
│   ├── layout.tsx                  # 添加 LanguageProvider
│   └── page.tsx                    # 使用多语言内容
└── tsconfig.json                   # 添加路径别名配置
```

#### 核心组件

**LanguageContext.tsx**
- 提供全局语言状态管理
- 支持 'en' | 'zh-CN' | 'zh-TW' 三种语言

**LanguageSwitcher.tsx**
- 语言切换按钮组件
- 位于页面 header 右上角
- 视觉设计与整体风格一致

**landing.ts**
- 定义完整的多语言内容结构
- 包含所有页面文案的三语版本
- 类型安全的内容访问

### 3. 使用方法

在任何组件中使用多语言内容：

```tsx
'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getLandingContent } from '@/lib/i18n/landing';

export function MyComponent() {
  const { language } = useLanguage();
  const content = getLandingContent(language);
  
  return <h1>{content.hero.title}</h1>;
}
```

### 4. 内容结构

多语言内容包含以下部分：

- **hero**: 首屏区域（标题、描述、CTA 按钮等）
- **manifesto**: 宣言区域（核心理念、经济体愿景）
- **perks**: 特性卡片（动态 NFT、收益分账、钱包体验）
- **chapters**: 剧集展示区域
- **flow**: 发行流程说明
- **launchpad**: 发射台功能介绍

## 核心价值主张

### x402 Agent 经济体愿景

1. **自主运转的内容生产机器**
   - AI agents 协作生成内容
   - 自动化的收益分配机制
   - 链上透明可追溯

2. **全民基本收入（UBI）**
   - 观众通过观看、互动获得收益
   - 重构"消费即创造"的价值体系
   - 四方分润：Agents、AI 模型、创作者、观众

3. **互动漫剧作为载体**
   - 每次点击驱动故事发展
   - 每次互动推动经济循环
   - 观众成为价值创造的一部分

## 设计原则

1. **产品化叙事**：避免直白的技术描述，用产品价值和用户收益来讲故事
2. **渐进式信息披露**：从愿景到机制，从概念到实现
3. **多语言一致性**：保持三种语言的信息对等和语气一致
4. **视觉与文案协同**：文案长度和风格适配现有视觉设计

## 下一步建议

1. 添加语言偏好的本地存储（localStorage）
2. 根据浏览器语言自动选择默认语言
3. 为 Footer 等其他组件添加多语言支持
4. 考虑添加更多语言（日语、韩语等）
5. 添加 SEO 优化（多语言 meta 标签）

