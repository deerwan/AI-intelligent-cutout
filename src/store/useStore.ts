import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageData, ApiProvider } from '@/types';

interface AppState {
  // API配置
  apiConfigs: Record<ApiProvider, string>;
  currentProvider: ApiProvider;
  
  // 图片处理 - 简化为单图片模式
  currentImage: ImageData | null;
  
  // UI状态
  showApiSettings: boolean;
  autoProcess: boolean;
  
  // Actions
  setApiKey: (provider: ApiProvider, apiKey: string) => void;
  setCurrentProvider: (provider: ApiProvider) => void;
  setCurrentImage: (image: ImageData | null) => void;
  updateCurrentImage: (updates: Partial<ImageData>) => void;
  setShowApiSettings: (show: boolean) => void;
  setAutoProcess: (auto: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      apiConfigs: {
        removebg: '',
        clipdrop: '',
        replicate: '',
        huggingface: '',
      },
      currentProvider: 'removebg',
      currentImage: null,
      showApiSettings: false,
      autoProcess: false,

      // Actions
      setApiKey: (provider, apiKey) =>
        set((state) => ({
          apiConfigs: { ...state.apiConfigs, [provider]: apiKey },
        })),

      setCurrentProvider: (provider) =>
        set({ currentProvider: provider }),

      setCurrentImage: (image) =>
        set({ currentImage: image }),

      updateCurrentImage: (updates) =>
        set((state) => ({
          currentImage: state.currentImage
            ? { ...state.currentImage, ...updates }
            : null,
        })),

      setShowApiSettings: (show) =>
        set({ showApiSettings: show }),

      setAutoProcess: (auto) =>
        set({ autoProcess: auto }),
    }),
    {
      name: 'ai-image-remover-storage',
      partialize: (state) => ({
        apiConfigs: state.apiConfigs,
        currentProvider: state.currentProvider,
        autoProcess: state.autoProcess,
      }),
    }
  )
);

