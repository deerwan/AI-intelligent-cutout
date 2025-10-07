import { ProviderInfo } from '@/types';

// API提供商配置信息
export const API_PROVIDERS: ProviderInfo[] = [
  {
    id: 'removebg',
    name: 'Remove.bg',
    description: '专业的背景移除服务，质量高，速度快',
    freeQuota: '每月50张免费（预览质量）',
    pricing: '高清图片：$0.09-0.20/张',
    docUrl: 'https://www.remove.bg/api',
    signupUrl: 'https://www.remove.bg/users/sign_up',
    requiresApiKey: true,
  },
  {
    id: 'clipdrop',
    name: 'Clipdrop API',
    description: 'Stability AI提供，效果优秀',
    freeQuota: '有限免费额度（需查看最新政策）',
    pricing: '按使用量计费',
    docUrl: 'https://clipdrop.co/apis/docs/remove-background',
    signupUrl: 'https://clipdrop.co/apis',
    requiresApiKey: true,
  },
  {
    id: 'replicate',
    name: 'Replicate (RMBG-1.4)',
    description: '运行开源RMBG-1.4模型，效果好',
    freeQuota: '新用户有免费额度',
    pricing: '按运行时间计费，约$0.0001/秒',
    docUrl: 'https://replicate.com/docs',
    signupUrl: 'https://replicate.com/signin',
    requiresApiKey: true,
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: '免费推理API，使用开源模型',
    freeQuota: '免费（有速率限制）',
    pricing: '免费使用',
    docUrl: 'https://huggingface.co/docs/api-inference',
    signupUrl: 'https://huggingface.co/join',
    requiresApiKey: true,
  },
];

// API端点配置
export const API_ENDPOINTS = {
  removebg: 'https://api.remove.bg/v1.0/removebg',
  clipdrop: 'https://clipdrop-api.co/remove-background/v1',
  replicate: 'https://api.replicate.com/v1/predictions',
  huggingface: 'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
};

// 默认配置
export const DEFAULT_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
};

