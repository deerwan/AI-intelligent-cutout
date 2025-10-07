#!/bin/bash
# Cloudflare Pages 部署脚本

echo "🚀 开始部署到 Cloudflare Pages..."

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  wrangler 未安装，正在安装..."
    npm install -g wrangler
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
echo "📤 部署到 Cloudflare Pages..."
wrangler pages deploy dist --project-name=ai-cutout

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问 Cloudflare Pages 控制台查看域名"
else
    echo "❌ 部署失败！"
    echo "💡 请先登录：wrangler login"
    exit 1
fi

