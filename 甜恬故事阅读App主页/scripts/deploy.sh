#!/bin/bash

# 甜恬故事 - Vercel快速部署脚本
# 作者: 甜恬故事团队
# 版本: 1.0.0

set -e

echo "🍭 甜恬故事 - Vercel部署脚本"
echo "=================================="

# 检查Node.js版本
NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查npm版本
NPM_VERSION=$(npm -v)
echo "✅ npm 版本: $NPM_VERSION"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 类型检查
echo "🔍 执行TypeScript类型检查..."
npm run type-check

# 构建项目
echo "🏗️ 构建生产版本..."
npm run build

# 检查构建产物
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📊 构建产物大小:"
    du -sh dist/
else
    echo "❌ 构建失败！"
    exit 1
fi

# 检查Git状态
if [ -d ".git" ]; then
    echo "📚 检查Git状态..."
    
    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  检测到未提交的更改，是否继续部署? (y/n)"
        read -r answer
        if [ "$answer" != "y" ]; then
            echo "❌ 部署已取消"
            exit 1
        fi
    fi
    
    # 显示当前分支
    CURRENT_BRANCH=$(git branch --show-current)
    echo "🌿 当前分支: $CURRENT_BRANCH"
else
    echo "⚠️  未检测到Git仓库"
fi

# 检查是否安装了Vercel CLI
if command -v vercel &> /dev/null; then
    echo "🚀 检测到Vercel CLI，开始部署..."
    
    # 部署到Vercel
    vercel --prod
    
    echo "🎉 部署完成！"
    echo "📱 你的甜恬故事应用已成功部署到Vercel"
    
else
    echo "📋 Vercel CLI未安装，请选择部署方式："
    echo "1. 安装Vercel CLI并部署"
    echo "2. 查看GitHub部署说明"
    echo "3. 退出"
    
    read -r choice
    case $choice in
        1)
            echo "📥 安装Vercel CLI..."
            npm install -g vercel
            echo "🚀 开始部署..."
            vercel --prod
            ;;
        2)
            echo "📖 GitHub部署步骤："
            echo "1. 将代码推送到GitHub仓库"
            echo "2. 访问 https://vercel.com"
            echo "3. 选择GitHub仓库进行部署"
            echo "4. 查看 DEPLOYMENT.md 获取详细说明"
            ;;
        3)
            echo "👋 退出部署脚本"
            exit 0
            ;;
        *)
            echo "❌ 无效选择"
            exit 1
            ;;
    esac
fi

# 显示有用的链接
echo ""
echo "🔗 有用的链接:"
echo "📚 部署文档: ./DEPLOYMENT.md"
echo "🌐 Vercel控制台: https://vercel.com/dashboard"
echo "📖 项目文档: ./README.md"
echo ""
echo "🎊 感谢使用甜恬故事！"