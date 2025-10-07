#!/bin/bash
# Vercel 部署脚本

echo "🚀 开始部署到 Vercel..."

# 检查 vercel CLI 是否安装
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI 未安装，正在安装..."
    npm install -g vercel
fi

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建完成！"

# 部署
echo "📤 部署到 Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
else
    echo "❌ 部署失败！"
    exit 1
fi

