# 部署指南

本项目支持 **12+ 平台**部署。

## 🎯 快速选择

| 你的需求 | 推荐平台 | 部署方式 |
|---------|---------|---------|
| **国内用户** | 腾讯云 Edge One | `./scripts/deploy-edgeone.sh` |
| **全球用户** | Cloudflare Pages | `./scripts/deploy-cloudflare.sh` |
| **零配置** | Vercel | `./scripts/deploy-vercel.sh` |
| **完全免费** | Cloudflare Pages | 无限流量 |

不确定？往下看详细对比 ⬇️

---

## 📊 平台对比

| 平台 | 地区 | 速度 | 免费额度 | CDN | 自定义域名 | 推荐度 |
|------|------|------|---------|-----|-----------|--------|
| **Cloudflare Pages** | 🌍 全球 | ⚡⚡⚡⚡⚡ | 无限 | ✅ 全球 | ✅ | ⭐⭐⭐⭐⭐ |
| **Vercel** | 🌍 全球 | ⚡⚡⚡⚡⚡ | 100GB/月 | ✅ 全球 | ✅ | ⭐⭐⭐⭐⭐ |
| **Netlify** | 🌍 全球 | ⚡⚡⚡⚡ | 100GB/月 | ✅ 全球 | ✅ | ⭐⭐⭐⭐⭐ |
| **腾讯云 Edge One** | 🇨🇳 国内 | ⚡⚡⚡⚡⚡ | 10GB/月 | ✅ 中国 | ✅ | ⭐⭐⭐⭐⭐ |
| **阿里云 OSS+CDN** | 🇨🇳 国内 | ⚡⚡⚡⚡ | 付费 | ✅ 中国 | ✅ | ⭐⭐⭐⭐ |
| **AWS Amplify** | 🌍 全球 | ⚡⚡⚡⚡ | 5GB/月 | ✅ 全球 | ✅ | ⭐⭐⭐⭐ |
| **GitHub Pages** | 🌍 全球 | ⚡⚡⚡ | 1GB | ❌ | ✅ | ⭐⭐⭐ |
| **Render** | 🌍 全球 | ⚡⚡⚡ | 100GB/月 | ✅ | ✅ | ⭐⭐⭐⭐ |

---

## 🇨🇳 国内平台（国内访问速度快）

### 1. 腾讯云 Edge One（推荐）

**优势**：
- ✅ 国内访问速度极快
- ✅ 全站加速 + 边缘函数
- ✅ 免费 10GB 流量/月
- ✅ 企业级 DDoS 防护

#### 部署步骤：

**方式一：通过控制台上传（最简单）**

```bash
# 1. 构建项目
npm run build

# 2. 登录腾讯云 Edge One 控制台
# https://console.cloud.tencent.com/edgeone

# 3. 创建站点
# - 选择"静态网站托管"
# - 填写域名（或使用测试域名）

# 4. 上传文件
# - 进入"文件管理"
# - 上传整个 dist 目录
# - 设置 index.html 为默认文档

# 5. 配置 SPA 路由
# - 在"错误页面"中配置：
#   404 错误 → 重定向到 /index.html
```

**方式二：通过 CLI 部署**

```bash
# 1. 安装腾讯云 CLI
npm install -g @tencent/cloudbase-cli

# 2. 登录
tcb login

# 3. 初始化
tcb init

# 4. 部署
npm run build
tcb hosting deploy dist -e your-env-id
```

**配置 SPA 路由：**

在 Edge One 控制台添加重写规则：
```
源路径：/*
目标路径：/index.html
状态码：200
```

---

### 2. 阿里云 OSS + CDN

**优势**：
- ✅ 国内访问稳定
- ✅ 与阿里云生态集成好
- ✅ 按量付费，成本可控

#### 部署步骤：

```bash
# 1. 安装阿里云 CLI
npm install -g @alicloud/cli

# 2. 配置密钥
aliyun configure

# 3. 创建 OSS Bucket（通过控制台）
# https://oss.console.aliyun.com/

# 4. 使用 ossutil 上传
npm run build

# 上传文件
ossutil cp -r dist/ oss://your-bucket-name/ --update

# 5. 配置静态网站
# - 在 OSS 控制台启用"静态网站托管"
# - 设置默认首页：index.html
# - 设置 404 页面：index.html（支持 SPA）

# 6. 配置 CDN（可选但推荐）
# - 在 CDN 控制台添加加速域名
# - 源站类型：OSS域名
# - 回源 HOST：OSS Bucket 域名
```

**自动部署脚本：**

创建 `deploy-aliyun.sh`：

```bash
#!/bin/bash
npm run build
ossutil cp -r dist/ oss://your-bucket-name/ --update --recursive
echo "部署完成！"
```

---

### 3. 七牛云存储

**优势**：
- ✅ 免费额度较大（10GB 存储 + 10GB 流量）
- ✅ CDN 速度快

#### 部署步骤：

```bash
# 1. 安装 qshell
# 下载：https://developer.qiniu.com/kodo/tools/qshell

# 2. 配置账号
qshell account set <AccessKey> <SecretKey> <Name>

# 3. 创建存储空间（通过控制台）
# https://portal.qiniu.com/

# 4. 上传文件
npm run build
qshell qupload2 --src-dir=./dist --bucket=your-bucket-name --overwrite

# 5. 配置 SPA
# 在七牛云控制台 → 空间设置 → 404 页面
# 设置为：index.html
```

---

### 4. 又拍云 CDN

**优势**：
- ✅ 国内节点多
- ✅ 价格便宜

#### 部署步骤：

```bash
# 1. 注册并创建云存储服务
# https://console.upyun.com/

# 2. 使用 upx 工具
npm install -g upx

# 3. 登录
upx login

# 4. 部署
npm run build
upx sync dist/ /
```

---

## 🌍 国际平台（全球访问优化）

### 5. Cloudflare Pages（推荐）

详见 [CLOUDFLARE_DEPLOY_GUIDE.md](CLOUDFLARE_DEPLOY_GUIDE.md)

**快速部署：**
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist
```

---

### 6. Vercel（推荐）

**优势**：
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN

#### 部署步骤：

```bash
# 方式一：CLI 部署
npm install -g vercel
vercel

# 方式二：Git 集成
# 1. 访问 https://vercel.com/
# 2. 导入 GitHub 仓库
# 3. 自动检测为 Vite 项目
# 4. 点击 Deploy
```

**配置文件**（可选）：

创建 `vercel.json`：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "cleanUrls": true,
  "trailingSlash": false
}
```

---

### 7. Netlify

**优势**：
- ✅ 一键部署
- ✅ 表单处理、函数支持
- ✅ 免费 HTTPS

#### 部署步骤：

```bash
# 方式一：拖拽部署
# 1. 访问 https://app.netlify.com/drop
# 2. npm run build
# 3. 拖拽 dist 文件夹

# 方式二：CLI 部署
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**配置文件**（已包含）：

`public/_redirects`：
```
/* /index.html 200
```

---

### 8. AWS Amplify

**优势**：
- ✅ 与 AWS 生态集成
- ✅ 全球 CloudFront CDN

#### 部署步骤：

```bash
# 1. 安装 Amplify CLI
npm install -g @aws-amplify/cli

# 2. 配置
amplify configure

# 3. 初始化
amplify init

# 4. 添加托管
amplify add hosting

# 5. 发布
amplify publish
```

**或通过控制台：**
1. 访问 AWS Amplify Console
2. 连接 Git 仓库
3. 配置构建：
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

---

### 9. Azure Static Web Apps

**优势**：
- ✅ 与 Azure 服务集成
- ✅ 免费 SSL

#### 部署步骤：

```bash
# 1. 安装 Azure CLI
# 下载：https://aka.ms/azure-cli

# 2. 登录
az login

# 3. 通过 VS Code 扩展部署
# 或通过 Azure Portal 连接 Git 仓库
```

---

### 10. Render

**优势**：
- ✅ 简单易用
- ✅ 自动 HTTPS
- ✅ 全球 CDN

#### 部署步骤：

```bash
# 通过 Web 界面：
# 1. 访问 https://render.com/
# 2. New → Static Site
# 3. 连接 Git 仓库
# 4. 配置：
#    Build Command: npm run build
#    Publish Directory: dist
```

创建 `render.yaml`（可选）：
```yaml
services:
  - type: web
    name: ai-cutout
    env: static
    buildCommand: npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

### 11. Firebase Hosting

**优势**：
- ✅ Google 全球 CDN
- ✅ 与 Firebase 服务集成

#### 部署步骤：

```bash
# 1. 安装 Firebase CLI
npm install -g firebase-tools

# 2. 登录
firebase login

# 3. 初始化
firebase init hosting

# 选择配置：
# - Public directory: dist
# - Single-page app: Yes
# - GitHub Actions: No（可选）

# 4. 部署
npm run build
firebase deploy
```

`firebase.json`：
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### 12. GitHub Pages

详见 [DEPLOYMENT.md](DEPLOYMENT.md)

**注意**：需要设置 base 路径

```bash
VITE_BASE_PATH=/AI-intelligent-cutout/ npm run build
```

---

## 🚀 自动化部署

### GitHub Actions 示例

创建 `.github/workflows/deploy-multi-platform.yml`：

```yaml
name: Multi-Platform Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      # 部署到 Cloudflare Pages
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ai-cutout
          directory: dist
          
      # 部署到 Vercel
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

---

## 📋 部署检查清单

无论使用哪个平台，部署前确认：

- [ ] ✅ 运行 `npm run build` 成功
- [ ] ✅ `dist` 目录包含所有文件
- [ ] ✅ `dist/_redirects` 存在（Cloudflare/Netlify）
- [ ] ✅ 根据平台配置正确的 base 路径
- [ ] ✅ 配置 SPA 路由支持（避免 404）
- [ ] ✅ 设置正确的环境变量（如需要）

---

## 🎯 平台选择建议

### 国内用户（主要面向中国用户）
1. **首选**：腾讯云 Edge One - 速度最快，免费额度足够
2. **备选**：阿里云 OSS + CDN - 稳定可靠
3. **个人项目**：七牛云 - 免费额度大

### 国际用户（面向全球用户）
1. **首选**：Cloudflare Pages - 无限流量，全球 CDN
2. **备选**：Vercel - 开发体验好
3. **企业级**：AWS Amplify - 可扩展性强

### 个人开发者
1. **最简单**：Vercel / Netlify - 零配置
2. **最便宜**：GitHub Pages（免费）
3. **最灵活**：Cloudflare Pages

---

## 🔧 常见问题

### Q1: 如何选择平台？

根据你的需求：
- **国内访问**：Edge One / 阿里云
- **全球访问**：Cloudflare / Vercel
- **零成本**：Cloudflare Pages / Vercel / Netlify
- **最简单**：Vercel

### Q2: 可以同时部署到多个平台吗？

可以！通过 GitHub Actions 自动部署到多个平台，提高可用性。

### Q3: 如何处理不同平台的 base 路径？

使用环境变量：
```bash
# 大部分平台（根路径）
npm run build

# GitHub Pages（子路径）
VITE_BASE_PATH=/repo-name/ npm run build
```

### Q4: 国内平台需要备案吗？

- **使用平台提供的域名**：不需要
- **绑定自己的域名**：需要 ICP 备案

---

## 📞 技术支持

- 查看 [完整部署文档](DEPLOYMENT.md)
- 查看 [Cloudflare 快速指南](CLOUDFLARE_DEPLOY_GUIDE.md)
- 提交 [GitHub Issue](https://github.com/deerwan/AI-intelligent-cutout/issues)

---

**选择你喜欢的平台，立即部署！🚀**

