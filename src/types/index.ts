// API Provider 类型
export type ApiProvider = 'removebg' | 'clipdrop' | 'replicate' | 'huggingface';

// 图片处理状态
export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

// API 提供商信息
export interface ProviderInfo {
  id: ApiProvider;
  name: string;
  description: string;
  freeQuota: string;
  pricing: string;
  docUrl: string;
  signupUrl: string;
  requiresApiKey: boolean;
}

// 图片数据接口
export interface ImageData {
  id: string;
  originalFile: File;
  originalUrl: string;
  processedUrl?: string;
  status: ProcessingStatus;
  error?: string;
  createdAt: number;
}

// 移除背景请求参数
export interface RemoveBackgroundRequest {
  image: File | Blob | string;
  size?: 'auto' | 'preview' | 'full';
  format?: 'png' | 'jpg' | 'webp';
}

// 移除背景响应
export interface RemoveBackgroundResponse {
  resultUrl: string;
  resultBlob?: Blob;
}

