# 部署脚本使用指南

本目录包含各平台的快速部署脚本。

## 📋 可用脚本

| 脚本 | 平台 | 说明 |
|------|------|------|
| `deploy-cloudflare.sh` | Cloudflare Pages | 全球 CDN，无限流量 |
| `deploy-vercel.sh` | Vercel | 零配置，自动部署 |
| `deploy-edgeone.sh` | 腾讯云 Edge One | 国内访问最快 |
| `deploy-aliyun.sh` | 阿里云 OSS | 需要配置环境变量 |

## 🚀 使用方法

### 1. Cloudflare Pages

```bash
# 给脚本执行权限
chmod +x scripts/deploy-cloudflare.sh

# 首次使用需要登录
wrangler login

# 部署
./scripts/deploy-cloudflare.sh
```

### 2. Vercel

```bash
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

### 3. 腾讯云 Edge One

```bash
chmod +x scripts/deploy-edgeone.sh
./scripts/deploy-edgeone.sh
```

### 4. 阿里云 OSS

```bash
# 设置环境变量
export ALIYUN_OSS_BUCKET=your-bucket-name

# 配置 ossutil（首次使用）
ossutil config

# 部署
chmod +x scripts/deploy-aliyun.sh
./scripts/deploy-aliyun.sh
```

## 💡 提示

- 所有脚本都会自动运行 `npm run build`
- 部署前确保已安装相应的 CLI 工具
- 首次部署可能需要登录验证

## 📚 更多信息

查看详细部署文档：
- [多平台部署指南](../DEPLOYMENT_PLATFORMS.md)
- [Cloudflare 快速指南](../CLOUDFLARE_DEPLOY_GUIDE.md)

