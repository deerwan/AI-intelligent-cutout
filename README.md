# AI智能抠图

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/deerwan/AI-intelligent-cutout?style=social)](https://github.com/deerwan/AI-intelligent-cutout/stargazers)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

🎨 一个功能强大的AI抠图工具，支持多平台API，纯前端实现，隐私安全

[快速开始](#-快速开始) • [部署](#-部署) • [API配置](#-api配置) • [文档](#-文档)

</div>

---

## ✨ 特性

- 🎨 **智能抠图** - AI精准识别主体与背景
- 🔌 **多平台支持** - Remove.bg、Clipdrop、Replicate、Hugging Face
- 🔒 **隐私安全** - 纯前端，图片不经过服务器
- 📱 **响应式设计** - 完美适配所有设备
- 🚀 **易部署** - 支持12+平台一键部署

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/deerwan/AI-intelligent-cutout.git
cd AI-intelligent-cutout

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

**环境要求**: Node.js 16+

## 🔑 API配置

支持4个AI平台，至少配置一个即可使用：

| 平台 | 免费额度 | 推荐 |
|------|---------|------|
| [Remove.bg](https://www.remove.bg/users/sign_up) | 50张/月 | ⭐⭐⭐⭐⭐ 最佳 |
| [Hugging Face](https://huggingface.co/join) | 免费 | ⭐⭐⭐ 推荐 |
| [Clipdrop](https://clipdrop.co/apis) | 有限 | ⭐⭐⭐⭐ |
| [Replicate](https://replicate.com/signin) | 新用户 | ⭐⭐⭐⭐ |

**使用步骤**: 注册 → 获取API密钥 → 应用中配置 → 开始使用

详细教程: [API配置指南](docs/API_GUIDE.md)

## 🛠 技术栈

React 18 • TypeScript • Vite • Tailwind CSS • Zustand • Axios

## 🚀 部署

支持**12+平台**一键部署，国内外均可！

### 快速部署

```bash
# 构建
npm run build

# 选择平台（推荐）
./scripts/deploy-cloudflare.sh  # Cloudflare（无限流量）
./scripts/deploy-vercel.sh      # Vercel（零配置）
./scripts/deploy-edgeone.sh     # 腾讯云（国内最快）

# 或通过Git连接，自动部署
```

### 支持的平台

**🇨🇳 国内**: 腾讯云 Edge One、阿里云 OSS、七牛云、又拍云  
**🌍 国际**: Cloudflare Pages、Vercel、Netlify、AWS、Azure、Firebase、Render、GitHub Pages

**详细指南**: [完整部署文档](DEPLOYMENT_PLATFORMS.md) • [部署脚本](scripts/)

## 📚 文档

- [API配置指南](docs/API_GUIDE.md) - 获取和配置API密钥
- [完整部署指南](DEPLOYMENT_PLATFORMS.md) - 12+平台部署教程
- [快速上手](docs/QUICK_START.md) - 快速入门
- [架构设计](docs/ARCHITECTURE.md) - 技术架构

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🙏 致谢

Remove.bg • Stability AI • Replicate • Hugging Face

---

<div align="center">

**[⭐ Star](https://github.com/deerwan/AI-intelligent-cutout)** • **[🐛 Issues](https://github.com/deerwan/AI-intelligent-cutout/issues)** • **[📖 文档](DEPLOYMENT_PLATFORMS.md)**

Made with ❤️ by [deerwan](https://github.com/deerwan)

</div>
