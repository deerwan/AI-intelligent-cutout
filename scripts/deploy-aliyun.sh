#!/bin/bash
# 阿里云 OSS 部署脚本

echo "🚀 开始部署到阿里云 OSS..."

# 检查配置
if [ -z "$ALIYUN_OSS_BUCKET" ]; then
    echo "❌ 请设置环境变量 ALIYUN_OSS_BUCKET"
    echo "   export ALIYUN_OSS_BUCKET=your-bucket-name"
    exit 1
fi

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建完成！"

# 检查 ossutil 是否安装
if ! command -v ossutil &> /dev/null; then
    echo "❌ ossutil 未安装"
    echo "请访问：https://help.aliyun.com/document_detail/120075.html"
    exit 1
fi

# 上传文件
echo "📤 上传文件到 OSS..."
ossutil cp -r dist/ oss://$ALIYUN_OSS_BUCKET/ --update --recursive

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问你的 OSS Bucket 域名查看"
else
    echo "❌ 部署失败！"
    exit 1
fi

