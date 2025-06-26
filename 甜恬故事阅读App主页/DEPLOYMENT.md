# 甜恬故事 - Vercel 部署指南

## 项目概述

甜恬故事是一个基于React + TypeScript + Tailwind CSS的移动端阅读应用，采用iPhone 375×812设计规格，提供沉浸式的中文阅读体验。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式系统**: Tailwind CSS v4 + 自定义CSS变量
- **UI组件**: Radix UI + Lucide React图标
- **部署平台**: Vercel

## 部署前准备

### 1. 环境要求

- Node.js >= 18
- npm >= 8 或 yarn >= 1.22
- Git

### 2. 项目配置检查

确保以下文件配置正确：

- ✅ `package.json` - 构建脚本和依赖
- ✅ `vercel.json` - Vercel部署配置
- ✅ `vite.config.ts` - Vite构建配置
- ✅ `.gitignore` - Git忽略文件
- ✅ `tsconfig.json` - TypeScript配置

## 部署方法

### 方法一：GitHub自动部署 (推荐)

1. **创建GitHub仓库**
   ```bash
   # 在GitHub上创建新仓库 sweet-story-app
   git init
   git add .
   git commit -m "feat: 初始化甜恬故事阅读应用"
   git branch -M main
   git remote add origin https://github.com/your-username/sweet-story-app.git
   git push -u origin main
   ```

2. **连接Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 点击 "New Project"
   - 选择 `sweet-story-app` 仓库
   - Vercel会自动检测为Vite项目

3. **部署配置**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **点击Deploy完成部署**

### 方法二：Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

## 环境变量配置

如果需要配置环境变量，在Vercel控制台中设置：

```env
# 示例环境变量
VITE_APP_NAME=甜恬故事
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.sweet-story.com
```

## 构建优化

### 性能优化配置

项目已包含以下优化：

1. **代码分割**: Vendor和UI组件分离
2. **图片优化**: 使用Unsplash CDN
3. **CSS优化**: Tailwind CSS purge
4. **PWA支持**: Service Worker配置

### 构建产物

```
dist/
├── index.html          # 主HTML文件
├── assets/            # 静态资源
│   ├── index-[hash].js # 主应用代码
│   ├── vendor-[hash].js # 第三方库
│   └── index-[hash].css # 样式文件
└── manifest.json      # PWA配置
```

## 部署验证

部署成功后，验证以下功能：

- ✅ 应用正常加载
- ✅ 移动端适配 (375×812)
- ✅ 书籍卡片显示正确
- ✅ 筛选功能正常
- ✅ 路由切换正常
- ✅ 搜索功能正常
- ✅ 用户登录功能
- ✅ PWA功能

## 域名配置

### 自定义域名

1. 在Vercel控制台进入项目设置
2. 点击 "Domains"
3. 添加自定义域名
4. 配置DNS记录指向Vercel

### SSL证书

Vercel自动为所有域名提供免费SSL证书。

## 监控和分析

### Vercel Analytics

- 自动启用Web Vitals监控
- 查看页面性能指标
- 监控用户访问数据

### 错误追踪

建议集成错误监控服务：
- Sentry
- LogRocket
- Vercel Analytics

## 常见问题

### 1. 构建失败

```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 2. 路由404问题

确保`vercel.json`中配置了SPA路由重写：
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### 3. 样式不生效

检查Tailwind CSS配置和CSS导入顺序。

## 更新部署

### 自动部署

推送到main分支会自动触发部署：
```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

### 手动部署

```bash
vercel --prod
```

## 回滚版本

在Vercel控制台的Deployments页面可以一键回滚到任意历史版本。

## 性能指标

目标性能指标：
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

## 联系支持

如有部署问题，可以：
1. 查看Vercel官方文档
2. 检查构建日志
3. 联系技术支持

---

**甜恬故事团队**  
版本: 1.0.0  
更新时间: 2024年12月