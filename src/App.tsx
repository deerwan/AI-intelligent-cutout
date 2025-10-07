import { useCallback, useState } from 'react';
import { Settings, Wand2, BookOpen } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ApiSettings } from '@/components/ApiSettings';
import { DocsModal } from '@/components/DocsModal';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { apiService } from '@/services/api';
import { ImageData } from '@/types';
import { API_PROVIDERS } from '@/config/providers';

function App() {
  const {
    apiConfigs,
    currentProvider,
    showApiSettings,
    setShowApiSettings,
    currentImage,
    setCurrentImage,
    updateCurrentImage,
    autoProcess,
    setAutoProcess,
  } = useStore();

  const [showDocs, setShowDocs] = useState(false);

  const currentProviderInfo = API_PROVIDERS.find((p) => p.id === currentProvider);
  const hasApiKey = apiConfigs[currentProvider].length > 0;

  const processImage = useCallback(
    async (file: File, isReprocess = false) => {
      const apiKey = apiConfigs[currentProvider];
      
      if (!apiKey) {
        alert('请先配置API密钥');
        setShowApiSettings(true);
        return;
      }

      if (isReprocess) {
        updateCurrentImage({ status: 'processing', error: undefined });
      } else {
        const newImage: ImageData = {
          id: Date.now().toString(),
          originalFile: file,
          originalUrl: URL.createObjectURL(file),
          status: 'processing',
          createdAt: Date.now(),
        };
        setCurrentImage(newImage);
      }

      try {
        const result = await apiService.removeBackground(currentProvider, apiKey, {
          image: file,
          size: 'auto',
        });

        updateCurrentImage({
          status: 'success',
          processedUrl: result.resultUrl,
        });
      } catch (error: unknown) {
        console.error('Processing error:', error);
        let errorMessage = '处理失败，请检查API密钥或稍后重试';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { errors?: Array<{ title?: string }> } } };
          if (axiosError.response?.data?.errors?.[0]?.title) {
            errorMessage = axiosError.response.data.errors[0].title;
          }
        }
        updateCurrentImage({
          status: 'error',
          error: errorMessage,
        });
      }
    },
    [apiConfigs, currentProvider, setCurrentImage, updateCurrentImage, setShowApiSettings]
  );

  const handleImageSelect = useCallback(
    (file: File) => {
      if (autoProcess) {
        processImage(file);
      } else {
        const newImage: ImageData = {
          id: Date.now().toString(),
          originalFile: file,
          originalUrl: URL.createObjectURL(file),
          status: 'idle',
          createdAt: Date.now(),
        };
        setCurrentImage(newImage);
      }
    },
    [autoProcess, processImage, setCurrentImage]
  );

  const handleProcess = useCallback(() => {
    if (currentImage) {
      processImage(currentImage.originalFile, currentImage.status !== 'idle');
    }
  }, [currentImage, processImage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">AI智能抠图</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDocs(true)}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5"
                title="使用文档"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden md:inline text-sm">文档</span>
              </button>
              <button
                onClick={() => setShowApiSettings(true)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 ${
                  hasApiKey
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-yellow-400 text-white hover:bg-yellow-500'
                }`}
                title={hasApiKey ? 'API已配置' : '配置API'}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">{hasApiKey ? 'API已配置' : '配置API'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Current Provider Info & Settings */}
        {hasApiKey && currentProviderInfo && (
          <div className="mb-4 flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                当前服务：<span className="font-medium text-gray-900">{currentProviderInfo.name}</span>
              </span>
              <span className="text-gray-300">|</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-600">自动处理</span>
                <button
                  onClick={() => setAutoProcess(!autoProcess)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    autoProcess ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoProcess ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>
            <button
              onClick={() => setShowApiSettings(true)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              切换
            </button>
          </div>
        )}

        {/* Image Processing Area */}
        <div>
          {!currentImage ? (
            <ImageUploader onImageSelect={handleImageSelect} disabled={!hasApiKey} />
          ) : (
            <>
              <ImagePreview
                image={currentImage}
                onRemove={() => setCurrentImage(null)}
                onReprocess={() => handleProcess()}
              />
              
              {/* Manual Process Button */}
              {currentImage.status === 'idle' ? (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleProcess}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    开始抠图
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    点击按钮开始处理，或开启自动模式
                  </p>
                </div>
              ) : currentImage.status !== 'processing' && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setCurrentImage(null)}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    处理新图片
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>所有图片处理均在客户端完成，隐私安全</p>
        </div>
      </footer>

      {/* Modals */}
      {showApiSettings && <ApiSettings />}
      {showDocs && <DocsModal onClose={() => setShowDocs(false)} />}
    </div>
  );
}

export default App;

