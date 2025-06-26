# 🍭 甜恬故事 - 中文阅读应用

一个专为中文阅读优化的移动端应用，采用现代Web技术构建，提供沉浸式的阅读体验。

## ✨ 特性

- 📱 **移动优先**: iPhone 375×812 原生设计体验
- 🎨 **现代UI**: iOS风格设计，支持深色模式
- 📚 **多种内容**: 小说、知识、听书、广播剧等
- 🔍 **智能搜索**: 实时搜索书籍和作者
- 🏷️ **分类筛选**: 多维度内容分类系统
- 👤 **用户系统**: 登录、阅读历史、书签管理
- 🔄 **云端同步**: 跨设备数据同步
- ⚡ **性能优化**: 快速加载，流畅交互

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式系统**: Tailwind CSS v4
- **UI组件**: Radix UI + Lucide React
- **状态管理**: React Hooks
- **部署平台**: Vercel

## 📱 界面预览

应用采用375×812像素的移动端设计：

- **首页**: 分类标签 + 书籍卡片网格
- **筛选页**: 左右分栏的分类选择界面
- **阅读页**: 全屏沉浸式阅读体验
- **用户中心**: 个人信息和阅读数据
- **搜索**: 实时搜索和筛选功能

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 8

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/sweet-story-app.git
cd sweet-story-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中打开 http://localhost:3000
```

### 构建项目

```bash
# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📦 部署

### 一键部署到Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/sweet-story-app)

### 手动部署

#### 方法一：使用部署脚本 (推荐)

```bash
# 执行一键部署脚本
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### 方法二：GitHub自动部署

1. 推送代码到GitHub仓库
2. 在[Vercel](https://vercel.com)中导入项目
3. 自动检测配置并部署

#### 方法三：Vercel CLI

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel --prod
```

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📂 项目结构

```
sweet-story-app/
├── App.tsx                 # 主应用组件
├── components/             # 组件目录
│   ├── mobile/            # 移动端组件
│   ├── ui/                # UI基础组件 (shadcn/ui)
│   ├── figma/             # Figma相关组件
│   └── services/          # 服务层组件
├── styles/
│   └── globals.css        # 全局样式和Tailwind配置
├── public/                # 静态资源
├── scripts/               # 构建脚本
└── README.md             # 项目文档
```

## 🎨 设计系统

应用采用统一的设计系统：

- **色彩**: iOS风格的色彩变量
- **字体**: San Francisco Pro Display
- **圆角**: 统一的圆角规范
- **间距**: 基于8px网格的间距系统
- **动画**: 微妙的iOS风格过渡动画

## 📋 功能模块

### 核心功能

- [x] 书籍浏览和分类
- [x] 实时搜索功能
- [x] 分类筛选系统
- [x] 用户登录注册
- [x] 阅读历史记录
- [x] 书签管理
- [x] 响应式设计

### 计划功能

- [ ] 书籍评论系统
- [ ] 社交分享功能
- [ ] 离线阅读支持
- [ ] 多语言支持
- [ ] 阅读统计分析

## 🔧 开发指南

### 代码规范

项目使用ESLint和TypeScript进行代码质量控制：

```bash
# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 样式开发

使用Tailwind CSS v4进行样式开发：

- 优先使用Tailwind工具类
- 自定义样式写在`globals.css`中
- 使用CSS变量进行主题配置

### 组件开发

- 组件放在`components/`目录下
- 移动端专用组件放在`components/mobile/`
- 使用TypeScript进行类型定义
- 遵循React Hooks最佳实践

## 🐛 问题反馈

如果你发现了问题或有改进建议：

1. 查看[已知问题](https://github.com/your-username/sweet-story-app/issues)
2. 创建[新Issue](https://github.com/your-username/sweet-story-app/issues/new)
3. 提供详细的问题描述和复现步骤

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情。

## 👥 团队

**甜恜故事团队**

- 产品设计: 专注用户体验
- 前端开发: 现代Web技术
- 后端开发: 云端服务支持

## 🙏 鸣谢

- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍UI组件
- [Lucide](https://lucide.dev/) - 图标库
- [Vercel](https://vercel.com/) - 部署平台
- [Unsplash](https://unsplash.com/) - 图片资源

---

**⭐ 如果这个项目对你有帮助，请给它一个星星！**

**🔗 在线体验**: [https://sweet-story-app.vercel.app](https://sweet-story-app.vercel.app)