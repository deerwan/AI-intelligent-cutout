# AI智能抠图 - 专业的背景移除工具

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/deerwan/AI-intelligent-cutout?style=social)](https://github.com/deerwan/AI-intelligent-cutout/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/deerwan/AI-intelligent-cutout?style=social)](https://github.com/deerwan/AI-intelligent-cutout/network/members)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6.svg)

一个功能强大、界面美观的AI抠图工具，支持多个AI平台API，纯前端实现，数据安全可靠。

[快速开始](#快速开始) • [API配置](#api配置) • [技术栈](#技术栈) • [文档](#文档) • [在线演示](#)

</div>

---

## ✨ 功能特性

- 🎨 **智能抠图** - 使用先进的AI算法，精准识别主体与背景
- 🔌 **多平台支持** - 支持Remove.bg、Clipdrop、Replicate、Hugging Face等多个AI平台
- 💰 **灵活选择** - 提供免费和付费API选项，满足不同需求
- 🔒 **隐私安全** - 纯前端实现，图片不上传到我们的服务器
- 📱 **完美响应式** - 全面优化，完美适配手机、平板、电脑等所有设备
- 🎪 **现代UI** - 美观的界面设计，流畅的用户体验

## 📸 项目预览

> 即将添加截图展示

## 🚀 快速开始

### 在线体验

🌐 **[在线演示](https://github.com/deerwan/AI-intelligent-cutout)** - 部署后即可访问

### 环境要求

- Node.js 16.x 或更高版本
- npm / yarn / pnpm

### 安装与运行

```bash
# 1. 克隆项目
git clone https://github.com/deerwan/AI-intelligent-cutout.git
cd AI-intelligent-cutout

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 打开浏览器访问 http://localhost:5173
```

### 构建生产版本

```bash
npm run build
# 构建完成后，文件将输出到 dist 目录
```

## 🔑 API配置

本应用支持多个AI抠图平台，您需要至少配置一个API密钥才能使用。

### 支持的平台

| 平台 | 免费额度 | 付费价格 | 推荐指数 |
|------|---------|---------|---------|
| **Remove.bg** | 每月50张 | $0.09-0.20/张 | ⭐⭐⭐⭐⭐ |
| **Clipdrop** | 有限免费 | 按使用量 | ⭐⭐⭐⭐ |
| **Replicate** | 新用户免费 | $0.0001/秒 | ⭐⭐⭐⭐ |
| **Hugging Face** | 免费 | 免费 | ⭐⭐⭐ |

### 快速配置

1. 选择一个平台并注册账号获取API密钥：
   - [Remove.bg](https://www.remove.bg/users/sign_up) - 推荐，质量最高
   - [Clipdrop](https://clipdrop.co/apis) - Stability AI出品
   - [Replicate](https://replicate.com/signin) - 开源模型
   - [Hugging Face](https://huggingface.co/join) - 完全免费

2. 在应用中点击右上角"配置API"，输入API密钥
3. 开始使用！

**详细教程**: 查看 [docs/API_GUIDE.md](docs/API_GUIDE.md) 了解完整的API配置指南。

## 🛠 技术栈

- **React 18** + **TypeScript** - 现代化的UI开发
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理
- **Axios** - HTTP客户端

## 📁 项目结构

```
ai2/
├── src/
│   ├── components/          # React组件
│   ├── services/           # API服务层
│   ├── store/              # 状态管理
│   ├── types/              # TypeScript类型
│   ├── config/             # 配置文件
│   └── App.tsx             # 主应用
├── docs/                   # 详细文档
├── public/                 # 静态资源
└── README.md               # 项目说明
```

## 📚 文档

- [API配置指南](docs/API_GUIDE.md) - 详细的API配置教程
- [快速上手](docs/QUICK_START.md) - 快速入门指南
- [架构设计](docs/ARCHITECTURE.md) - 技术架构说明
- [响应式设计](docs/RESPONSIVE.md) - 响应式实现细节
- [部署指南](DEPLOY.md) - 部署到各种平台
- [贡献指南](CONTRIBUTING.md) - 如何为项目做贡献

## 📝 使用说明

1. **配置API** - 点击右上角"配置API"，输入API密钥
2. **上传图片** - 拖拽或点击上传区域选择图片
3. **自动处理** - AI自动处理图片，移除背景
4. **下载结果** - 点击下载按钮保存结果

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Remove.bg](https://www.remove.bg/) - 提供优质的背景移除API
- [Stability AI](https://stability.ai/) - Clipdrop API
- [Replicate](https://replicate.com/) - 开源模型托管平台
- [Hugging Face](https://huggingface.co/) - AI模型社区

## ⭐ Star History

如果这个项目对你有帮助，请给它一个⭐️！

[![Star History Chart](https://api.star-history.com/svg?repos=deerwan/AI-intelligent-cutout&type=Date)](https://star-history.com/#deerwan/AI-intelligent-cutout&Date)

---

<div align="center">

**[⭐ 给个 Star](https://github.com/deerwan/AI-intelligent-cutout)** | **[🐛 报告问题](https://github.com/deerwan/AI-intelligent-cutout/issues)** | **[💡 功能建议](https://github.com/deerwan/AI-intelligent-cutout/issues)**

Made with ❤️ by [deerwan](https://github.com/deerwan)

[⬆ 回到顶部](#ai智能抠图---专业的背景移除工具)

</div>
