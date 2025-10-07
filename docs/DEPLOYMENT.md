# 部署指南

本指南介绍如何将AI智能抠图应用部署到各种平台。

## 📦 构建生产版本

### 本地构建

```bash
# 安装依赖
npm install

# 构建
npm run build

# 预览构建结果
npm run preview
```

构建完成后，所有文件会输出到 `dist` 目录。

### 构建优化

项目已配置：
- ✅ Tree-shaking（移除未使用代码）
- ✅ 代码压缩
- ✅ CSS优化
- ✅ 资源哈希命名（便于缓存）

## 🚀 部署到静态托管平台

### 1. Vercel（推荐）

#### 方式一：通过Vercel CLI

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

#### 方式二：通过GitHub连接

1. 将代码推送到GitHub
2. 访问 https://vercel.com
3. 点击 "Import Project"
4. 选择你的仓库
5. Vercel会自动检测配置并部署

**配置（自动检测）：**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### 2. Netlify

#### 方式一：通过Netlify CLI

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化
netlify init

# 部署
netlify deploy --prod
```

#### 方式二：拖拽部署

1. 构建项目：`npm run build`
2. 访问 https://app.netlify.com/drop
3. 将 `dist` 文件夹拖拽到页面

#### 方式三：通过Git连接

1. 将代码推送到GitHub/GitLab
2. 在Netlify中连接仓库
3. 配置构建设置：
   - Build Command: `npm run build`
   - Publish Directory: `dist`

**netlify.toml 配置（可选）：**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

```bash
# 安装gh-pages
npm install -D gh-pages

# 添加部署脚本到package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# 部署
npm run deploy
```

**注意：** 如果仓库不在根路径，需要配置base（已配置）：

```typescript
// vite.config.ts
export default defineConfig({
  base: '/AI-intelligent-cutout/',
  // ...
})
```

### 4. Cloudflare Pages

#### 通过Dashboard部署

1. 访问 https://pages.cloudflare.com/
2. 连接GitHub账号
3. 选择仓库
4. 配置：
   - Build Command: `npm run build`
   - Build Output Directory: `dist`

#### 通过Wrangler CLI

```bash
# 安装Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages publish dist
```

### 5. 阿里云OSS / 腾讯云COS

#### 使用工具上传

```bash
# 构建
npm run build

# 上传dist目录到OSS/COS
# 使用各平台的CLI工具或控制台
```

**配置CDN加速：**
- 开启HTTPS
- 配置缓存规则
- 设置CORS（如果需要）

## 🌐 配置自定义域名

### Vercel

1. 进入项目Settings → Domains
2. 添加你的域名
3. 配置DNS记录（CNAME或A记录）

### Netlify

1. Site Settings → Domain Management
2. Add Custom Domain
3. 配置DNS记录

### Cloudflare Pages

1. 项目设置 → Custom Domains
2. 添加域名
3. 自动配置DNS（如果使用Cloudflare DNS）

## 🔒 HTTPS配置

所有推荐的平台都自动提供免费HTTPS证书：
- ✅ Vercel: 自动配置Let's Encrypt
- ✅ Netlify: 自动配置Let's Encrypt
- ✅ Cloudflare: 自动配置
- ✅ GitHub Pages: 支持HTTPS

## ⚙️ 环境变量配置

虽然应用主要在前端运行，但你可以在构建时注入环境变量。

### Vercel

在项目Settings → Environment Variables添加：

```
VITE_APP_NAME=AI智能抠图
```

### Netlify

在Site Settings → Build & Deploy → Environment添加环境变量。

### 本地.env文件

```bash
# .env.production
VITE_APP_NAME=AI智能抠图
VITE_APP_VERSION=1.0.0
```

**使用环境变量：**

```typescript
// 在代码中使用
const appName = import.meta.env.VITE_APP_NAME;
```

## 📊 性能优化

### 1. 启用压缩

大多数平台自动启用Gzip/Brotli压缩。

### 2. 配置缓存

**Vercel vercel.json：**

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Netlify _headers：**

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### 3. 代码分割

项目已使用Vite的自动代码分割。

## 🔍 SEO优化

### 添加meta标签

已在 `index.html` 中配置基础SEO。

### 生成sitemap（可选）

```bash
npm install -D vite-plugin-sitemap

# vite.config.ts
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://your-domain.com',
    }),
  ],
})
```

## 📈 监控和分析

### 添加Google Analytics

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 添加Vercel Analytics

```bash
npm install @vercel/analytics

# src/main.tsx
import { inject } from '@vercel/analytics';
inject();
```

## 🐛 故障排除

### 构建失败

**问题：** Node.js版本不匹配

**解决：** 在平台设置中指定Node版本

```json
// package.json
{
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 路由404错误

**问题：** 直接访问路径返回404

**解决：** 配置SPA重定向（大多数平台自动处理）

### 资源加载失败

**问题：** 静态资源404

**解决：** 检查 `vite.config.ts` 中的 `base` 配置

## 📦 Docker部署（高级）

### Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 构建和运行

```bash
# 构建镜像
docker build -t ai-image-remover .

# 运行容器
docker run -p 8080:80 ai-image-remover
```

## 📋 部署检查清单

部署前确认：

- [ ] 所有依赖已安装
- [ ] 构建命令正确
- [ ] 输出目录正确
- [ ] 环境变量已配置（如需要）
- [ ] Node版本要求已指定
- [ ] API密钥不在代码中（使用前端配置）
- [ ] HTTPS已启用
- [ ] 自定义域名已配置（如需要）
- [ ] 测试所有功能
- [ ] 检查控制台无错误

## 🎉 部署成功！

现在你的应用已经上线了！

**下一步：**
- 分享链接给用户
- 监控性能和错误
- 收集用户反馈
- 持续优化和更新

---

需要帮助？查看 [README](../README.md) 或提交Issue。

