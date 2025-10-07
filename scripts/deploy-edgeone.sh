#!/bin/bash
# 腾讯云 Edge One 部署脚本

echo "🚀 开始部署到腾讯云 Edge One..."

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建完成！"
echo ""
echo "📋 下一步操作："
echo "1. 登录腾讯云 Edge One 控制台：https://console.cloud.tencent.com/edgeone"
echo "2. 进入你的站点 → 文件管理"
echo "3. 上传 dist 目录下的所有文件"
echo "4. 配置 SPA 路由："
echo "   - 错误页面配置：404 → 重定向到 /index.html"
echo ""
echo "或使用腾讯云 CLI（需先安装并配置）："
echo "  tcb hosting deploy dist -e your-env-id"

