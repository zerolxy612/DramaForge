# DramaForge Landing Page

## 🎨 设计特色

这是一个超级炫酷的Web3 AIGC短剧平台Landing Page，采用**黑白红配色**方案，充满张力的视觉设计，完美适配Web端和移动端。

### 核心视觉元素

1. **旋转卡片堆叠效果** (Rotating Card Stack)
   - 3D透视变换
   - 鼠标悬停时卡片展开
   - 流畅的动画过渡
   - 支持点击交互

2. **粒子背景动画** (Particle Background)
   - Canvas绘制的动态粒子系统
   - 粒子间连线效果
   - 红色主题色粒子
   - 性能优化的动画循环

3. **扫描线效果** (Scan Line)
   - 赛博朋克风格扫描线
   - 红色光晕扫描动画
   - 应用于关键卡片和CTA区域

4. **滚动揭示动画** (Scroll Reveal)
   - 元素进入视口时淡入上移
   - 支持延迟动画
   - 流畅的过渡效果

## 🎯 技术栈

- **Next.js 14** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统
- **Wagmi + RainbowKit** - Web3钱包连接
- **Canvas API** - 粒子动画

## 🚀 核心组件

### 1. RotatingCardStack
3D旋转卡片堆叠组件，支持：
- 多层卡片堆叠
- 3D透视效果
- 悬停展开动画
- 点击激活状态

### 2. ParticleBackground
粒子背景动画组件：
- 50个动态粒子
- 粒子间距离连线
- 边界环绕效果
- 响应式Canvas

### 3. ScrollReveal
滚动触发动画组件：
- IntersectionObserver API
- 可配置延迟
- 淡入上移效果

### 4. Footer
页脚组件：
- 品牌信息
- 导航链接
- 社交媒体链接
- 响应式布局

## 🎨 配色方案

```css
--accent: #e50914      /* 主红色 */
--dusk: #0b0c12        /* 深色背景 */
--carbon: #0a0b10      /* 碳黑色 */
--steel: #1b1d24       /* 钢灰色 */
--ash: #d9d9de         /* 灰白色 */
```

## ✨ 动画效果

### CSS动画
- `gradientShift` - 渐变背景移动
- `shimmer` - 闪光效果
- `float` - 浮动动画
- `pulseGlow` - 脉冲光晕
- `scan` - 扫描线
- `glitch` - 故障效果
- `particle-float` - 粒子浮动

### 交互动画
- 卡片悬停3D变换
- 按钮悬停缩放
- 边框颜色过渡
- 阴影强度变化

## 📱 响应式设计

### 断点
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 适配策略
- 移动端简化3D效果
- 网格布局自适应
- 字体大小响应式
- 触摸友好的交互

## 🎭 页面结构

1. **Hero Section**
   - 标题和描述
   - CTA按钮
   - 3D旋转卡片展示
   - 统计数据展示

2. **Features Section**
   - 三大核心特性
   - 卡片式布局
   - 悬停效果

3. **Chapters Section**
   - 章节展示
   - 图片卡片
   - 悬停放大效果

4. **Flow & Launchpad Section**
   - 发行流程说明
   - 一键开播功能
   - 扫描线效果

5. **Footer**
   - 品牌信息
   - 导航链接
   - 社交媒体

## 🔧 开发指南

### 启动项目
```bash
cd apps/web
pnpm dev
```

### 构建项目
```bash
pnpm build
```

### 添加新组件
组件放置在 `apps/web/app/components/` 目录下

### 修改样式
全局样式在 `apps/web/app/globals.css`
Tailwind配置在 `apps/web/tailwind.config.ts`

## 🎨 设计灵感

- 赛博朋克美学
- 漫画/动漫风格
- Web3原生设计
- 动态交互体验

## 📝 待优化项

- [ ] 添加更多微交互
- [ ] 优化移动端性能
- [ ] 添加暗黑/明亮模式切换
- [ ] 集成真实的Web3功能
- [ ] 添加更多动画变体

