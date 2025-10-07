# 架构设计文档

## 概述

本项目是一个纯前端AI抠图应用，采用现代化的技术栈和模块化的架构设计，同时预留了后端接口，方便未来扩展。

## 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                        用户界面层                          │
│              (React Components + Tailwind CSS)          │
├─────────────────────────────────────────────────────────┤
│                        状态管理层                          │
│                    (Zustand Store)                      │
├─────────────────────────────────────────────────────────┤
│                        服务层                             │
│                (API Service Factory)                    │
├─────────────────────────────────────────────────────────┤
│                      API适配器层                          │
│        (Remove.bg | Clipdrop | Replicate | HF)         │
├─────────────────────────────────────────────────────────┤
│                     第三方API服务                         │
│            (直接调用 或 通过后端代理)                      │
└─────────────────────────────────────────────────────────┘
```

## 目录结构详解

```
src/
├── components/              # UI组件层
│   ├── ApiSettings.tsx      # API配置面板
│   ├── ImageUploader.tsx    # 图片上传组件
│   └── ImagePreview.tsx     # 图片预览和操作
│
├── services/               # 服务层
│   └── api.ts              # API服务工厂和适配器
│       ├── BaseApiService              # 基础服务类（预留后端接口）
│       ├── RemoveBgService             # Remove.bg适配器
│       ├── ClipdropService             # Clipdrop适配器
│       ├── ReplicateService            # Replicate适配器
│       ├── HuggingFaceService          # Hugging Face适配器
│       └── ApiServiceFactory           # 服务工厂
│
├── store/                  # 状态管理层
│   └── useStore.ts         # Zustand store
│       ├── State: apiConfigs, currentProvider, images
│       └── Actions: setApiKey, addImage, updateImage...
│
├── types/                  # 类型定义层
│   └── index.ts            # TypeScript类型
│       ├── ApiProvider     # API提供商类型
│       ├── ApiConfig       # API配置接口
│       ├── ImageData       # 图片数据接口
│       └── ...             # 其他类型定义
│
├── config/                 # 配置层
│   └── providers.ts        # API提供商配置
│       ├── API_PROVIDERS   # 提供商信息列表
│       ├── API_ENDPOINTS   # API端点配置
│       └── DEFAULT_CONFIG  # 默认配置
│
├── App.tsx                 # 主应用组件
├── main.tsx                # 应用入口
└── index.css               # 全局样式
```

## 核心模块设计

### 1. 服务层 (Service Layer)

#### 设计模式：工厂模式 + 策略模式

```typescript
// 基础服务类（预留后端接口）
class BaseApiService {
  protected axiosInstance: AxiosInstance;
  
  // 当前：直接调用第三方API
  // 未来：可切换到后端
  protected async callBackend<T>(endpoint: string, data: any): Promise<T> {
    // 实现后端调用逻辑
  }
}

// 服务工厂
class ApiServiceFactory {
  private services: Record<ApiProvider, ServiceInterface>;
  
  async removeBackground(provider, apiKey, request) {
    return this.services[provider].removeBackground(apiKey, request);
  }
}
```

#### 扩展性设计

添加新的API提供商只需：

1. 创建新的服务类继承 `BaseApiService`
2. 实现 `removeBackground` 方法
3. 注册到工厂中

```typescript
class NewProviderService extends BaseApiService {
  async removeBackground(apiKey: string, request: RemoveBackgroundRequest) {
    // 实现逻辑
  }
}
```

### 2. 状态管理层 (State Management)

#### 技术选择：Zustand

选择理由：
- 轻量级（~1KB）
- 简单直观的API
- 内置持久化支持
- TypeScript友好

#### 状态结构

```typescript
interface AppState {
  // API配置（持久化）
  apiConfigs: Record<ApiProvider, string>;
  currentProvider: ApiProvider;
  
  // 图片数据（会话级）
  images: ImageData[];
  currentImage: ImageData | null;
  
  // UI状态（会话级）
  showApiSettings: boolean;
  
  // Actions
  setApiKey: (provider, apiKey) => void;
  addImage: (image) => void;
  updateImage: (id, updates) => void;
  // ...
}
```

#### 持久化策略

```typescript
persist(
  storeConfig,
  {
    name: 'ai-image-remover-storage',
    partialize: (state) => ({
      // 只持久化API配置
      apiConfigs: state.apiConfigs,
      currentProvider: state.currentProvider,
    }),
  }
)
```

### 3. 类型系统 (Type System)

#### 完整的类型定义

```typescript
// API提供商
type ApiProvider = 'removebg' | 'clipdrop' | 'replicate' | 'huggingface';

// 图片处理状态
type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

// 图片数据
interface ImageData {
  id: string;
  originalFile: File;
  originalUrl: string;
  processedUrl?: string;
  status: ProcessingStatus;
  error?: string;
  createdAt: number;
}

// API响应（预留后端）
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 数据流

### 图片处理流程

```
用户上传图片
    ↓
ImageUploader 接收文件
    ↓
App.tsx 调用 processImage
    ↓
创建 ImageData 并添加到 store
    ↓
调用 apiService.removeBackground
    ↓
[当前] 直接调用第三方API
[未来] 可选择调用后端API
    ↓
更新 ImageData 状态 (processing/success/error)
    ↓
ImagePreview 展示结果
```

### 状态更新流程

```
用户操作
    ↓
组件调用 store action
    ↓
Store 更新状态
    ↓
组件重新渲染
    ↓
[如果涉及API配置] 持久化到 localStorage
```

## 接口设计

### 前后端分离架构（预留）

#### 当前实现（纯前端）

```typescript
// 直接调用第三方API
const result = await axios.post(API_ENDPOINTS.removebg, formData, {
  headers: { 'X-Api-Key': apiKey }
});
```

#### 未来实现（后端代理）

```typescript
// 方案1: 通过后端代理
class RemoveBgService extends BaseApiService {
  async removeBackground(apiKey, request) {
    return this.callBackend('/api/remove-bg', {
      provider: 'removebg',
      apiKey,
      ...request
    });
  }
}

// 方案2: 混合模式（用户可选）
async removeBackground(apiKey, request) {
  if (USE_BACKEND) {
    return this.callBackend(...);
  } else {
    return this.callDirectly(...);
  }
}
```

#### 后端API规范（建议）

```typescript
// POST /api/remove-bg
interface RemoveBackgroundRequest {
  provider: ApiProvider;
  apiKey?: string;  // 可选，可以在后端配置
  image: string;    // base64 或 URL
  options?: {
    size?: string;
    format?: string;
  };
}

interface RemoveBackgroundResponse {
  success: boolean;
  data?: {
    resultUrl: string;
    processingTime?: number;
  };
  error?: string;
}
```

## 组件设计

### 组件树结构

```
App
├── Header
│   ├── Logo
│   ├── ApiSettingsButton
│   └── DocsButton
│
├── Main
│   ├── ProviderInfo (conditional)
│   ├── ImageUploader (if no image)
│   └── ImagePreview (if has image)
│       ├── ImageDisplay
│       ├── ComparisonToggle
│       └── ActionButtons
│
├── Footer
│
└── ApiSettings (modal)
    ├── Header
    ├── Instructions
    ├── ProviderCards[]
    │   ├── ProviderInfo
    │   ├── SelectButton
    │   └── ApiKeyInput
    └── Footer (actions)
```

### 组件通信

```typescript
// 父子通信：Props
<ImageUploader onImageSelect={handleImageSelect} />

// 全局状态：Zustand
const { apiConfigs, setApiKey } = useStore();

// 事件通信：Callbacks
const handleDownload = async () => { ... }
```

## 安全性设计

### API密钥管理

1. **存储**：浏览器 localStorage（加密存储可选）
2. **传输**：HTTPS + 直接发送到API服务商
3. **显示**：输入框使用 `type="password"`
4. **最佳实践**：
   - 不在代码中硬编码
   - 不提交到版本控制
   - 定期更换密钥

### 数据隐私

1. **图片处理**：
   - 不上传到我们的服务器
   - 直接发送到API服务商
   - 遵守各服务商隐私政策

2. **本地存储**：
   - 只存储API配置
   - 不持久化图片数据
   - 用户可随时清除

## 性能优化

### 1. 图片处理

```typescript
// 使用 URL.createObjectURL 而非 base64
const url = URL.createObjectURL(file);

// 组件卸载时清理
useEffect(() => {
  return () => URL.revokeObjectURL(url);
}, [url]);
```

### 2. 状态管理

```typescript
// 使用 selector 避免不必要的重渲染
const apiKey = useStore(state => state.apiConfigs[state.currentProvider]);
```

### 3. 组件优化

```typescript
// 使用 React.memo 缓存组件
export const ImagePreview = React.memo<ImagePreviewProps>(({ ... }) => {
  // ...
});

// 使用 useCallback 缓存函数
const handleImageSelect = useCallback((file: File) => {
  processImage(file);
}, [processImage]);
```

## 错误处理

### 分层错误处理

```typescript
// 1. API层
try {
  const result = await axios.post(...);
} catch (error) {
  throw new ApiError(error);
}

// 2. Service层
try {
  return await service.removeBackground(...);
} catch (error) {
  console.error('Service error:', error);
  throw error;
}

// 3. 组件层
try {
  await processImage(file);
} catch (error) {
  updateImage(id, { 
    status: 'error', 
    error: error.message 
  });
}
```

### 用户友好的错误提示

```typescript
// 解析错误并显示友好信息
error: error.response?.data?.errors?.[0]?.title 
  || error.message 
  || '处理失败，请检查API密钥或稍后重试'
```

## 测试策略

### 单元测试（建议）

```typescript
// services/api.test.ts
describe('ApiServiceFactory', () => {
  it('should remove background using Remove.bg', async () => {
    // ...
  });
});

// store/useStore.test.ts
describe('useStore', () => {
  it('should update API key', () => {
    // ...
  });
});
```

### 集成测试（建议）

```typescript
// App.test.tsx
describe('App', () => {
  it('should upload and process image', async () => {
    // ...
  });
});
```

## 部署

### 静态部署

支持部署到任何静态托管服务：

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: `npm run build && gh-pages -d dist`
- **Cloudflare Pages**: 连接仓库自动部署

### 环境变量（可选）

```bash
# 构建时注入API密钥（不推荐生产环境）
VITE_REMOVEBG_API_KEY=xxx npm run build
```

## 未来扩展

### 1. 后端服务

```
后端功能：
├── API密钥管理（避免暴露给前端）
├── 请求代理和缓存
├── 用户认证和授权
├── 使用量统计和限制
└── 批量处理队列
```

### 2. 高级功能

- 批量处理
- 自定义背景替换
- 图片编辑工具
- 处理历史记录
- 用户账户系统

### 3. 性能优化

- Service Worker缓存
- 图片压缩
- WebAssembly加速
- 本地模型推理（TensorFlow.js）

## 最佳实践

### 1. 代码组织

- 单一职责原则
- 模块化设计
- 清晰的命名
- 完整的类型定义

### 2. 状态管理

- 最小化全局状态
- 合理划分状态范围
- 避免冗余数据

### 3. 组件设计

- 组件复用
- Props类型定义
- 合理的组件拆分
- 性能优化

## 总结

本项目采用现代化的前端架构，具有：

- ✅ 清晰的分层架构
- ✅ 完整的类型系统
- ✅ 良好的扩展性
- ✅ 预留后端接口
- ✅ 规范的代码组织

为未来的功能扩展和后端集成提供了坚实的基础。

