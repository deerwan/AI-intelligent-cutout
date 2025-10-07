import axios from 'axios';
import { ApiProvider, RemoveBackgroundRequest, RemoveBackgroundResponse } from '@/types';
import { API_ENDPOINTS } from '@/config/providers';

// 辅助函数：将文件转换为 base64
const fileToBase64 = (file: File | Blob | string): Promise<string> => {
  if (typeof file === 'string') return Promise.resolve(file);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 辅助函数：创建通用的响应对象
const createResponse = (blob: Blob): RemoveBackgroundResponse => ({
  resultUrl: URL.createObjectURL(blob),
  resultBlob: blob,
});

// Remove.bg API
const removeBgApi = async (apiKey: string, request: RemoveBackgroundRequest): Promise<RemoveBackgroundResponse> => {
  const formData = new FormData();
  
  if (request.image instanceof File || request.image instanceof Blob) {
    formData.append('image_file', request.image);
  } else {
    formData.append('image_url', request.image);
  }
  
  formData.append('size', request.size || 'auto');

  const response = await axios.post(API_ENDPOINTS.removebg, formData, {
    headers: { 'X-Api-Key': apiKey },
    responseType: 'blob',
  });

  return createResponse(response.data);
};

// Clipdrop API
const clipdropApi = async (apiKey: string, request: RemoveBackgroundRequest): Promise<RemoveBackgroundResponse> => {
  const formData = new FormData();
  
  if (request.image instanceof File || request.image instanceof Blob) {
    formData.append('image_file', request.image);
  }

  const response = await axios.post(API_ENDPOINTS.clipdrop, formData, {
    headers: { 'x-api-key': apiKey },
    responseType: 'blob',
  });

  return createResponse(response.data);
};

// Replicate API
const replicateApi = async (apiKey: string, request: RemoveBackgroundRequest): Promise<RemoveBackgroundResponse> => {
  const base64 = await fileToBase64(request.image);
  const authHeader = { 'Authorization': `Token ${apiKey}` };

  // 创建预测
  const { data: prediction } = await axios.post(
    API_ENDPOINTS.replicate,
    {
      version: 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
      input: { image: base64 },
    },
    { headers: { ...authHeader, 'Content-Type': 'application/json' } }
  );

  // 轮询结果
  let result = prediction;
  while (result.status !== 'succeeded' && result.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { data } = await axios.get(result.urls.get, { headers: authHeader });
    result = data;
  }

  if (result.status === 'failed') {
    throw new Error('Processing failed');
  }

  // 下载结果
  const { data: blob } = await axios.get(result.output, { responseType: 'blob' });
  return createResponse(blob);
};

// Hugging Face API
const huggingfaceApi = async (apiKey: string, request: RemoveBackgroundRequest): Promise<RemoveBackgroundResponse> => {
  const response = await axios.post(
    API_ENDPOINTS.huggingface,
    request.image,
    {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      responseType: 'blob',
    }
  );

  return createResponse(response.data);
};

// API 服务映射
const apiServices: Record<ApiProvider, (apiKey: string, request: RemoveBackgroundRequest) => Promise<RemoveBackgroundResponse>> = {
  removebg: removeBgApi,
  clipdrop: clipdropApi,
  replicate: replicateApi,
  huggingface: huggingfaceApi,
};

// API 服务工厂
class ApiServiceFactory {
  async removeBackground(
    provider: ApiProvider,
    apiKey: string,
    request: RemoveBackgroundRequest
  ): Promise<RemoveBackgroundResponse> {
    const service = apiServices[provider];
    if (!service) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    return service(apiKey, request);
  }
}

export const apiService = new ApiServiceFactory();

