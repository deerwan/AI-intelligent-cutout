import { useCallback, useState, useEffect } from 'react';
import { Settings, Wand2, BookOpen, Sparkles, Shield, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ApiSettings } from '@/components/ApiSettings';
import { DocsModal } from '@/components/DocsModal';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { apiService } from '@/services/api';
import { ImageData } from '@/types';
import { API_PROVIDERS } from '@/config/providers';
import { FaviconService, PROVIDER_DOMAINS } from '@/services/favicon';

function App() {
  const {
    apiConfigs,
    currentProvider,
    showApiSettings,
    setShowApiSettings,
    currentImage,
    setCurrentImage,
    updateCurrentImage,
  } = useStore();

  const [showDocs, setShowDocs] = useState(false);

  // 预加载favicon
  useEffect(() => {
    const domains = Object.values(PROVIDER_DOMAINS);
    FaviconService.preloadAllFavicons(domains);
  }, []);

  // Provider图标组件
  const ProviderIcon: React.FC<{ providerId: string }> = ({ providerId }) => {
    const domain = PROVIDER_DOMAINS[providerId];
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [showFallback, setShowFallback] = useState(false);

    if (!domain) {
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white text-lg">
          🔧
        </div>
      );
    }

    const faviconUrl = FaviconService.getFaviconUrl(domain, currentServiceIndex);

    // 如果是真实favicon URL，使用img标签
    if (faviconUrl.startsWith('http') && !showFallback) {
      return (
        <img
          src={faviconUrl}
          alt={`${providerId} favicon`}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
          onError={() => {
            // 尝试下一个服务
            const nextIndex = currentServiceIndex + 1;
            if (nextIndex < 4) { // 最多尝试4个服务
              setCurrentServiceIndex(nextIndex);
            } else {
              // 所有服务都失败，显示fallback
              setShowFallback(true);
            }
          }}
        />
      );
    }

    // 显示fallback emoji
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg">
        {FaviconService.getFallbackEmoji(domain)}
      </div>
    );
  };

  const currentProviderInfo = API_PROVIDERS.find((p) => p.id === currentProvider);
  const hasApiKey = apiConfigs[currentProvider].length > 0;

  const processImage = useCallback(
    async (file: File | null, imageUrl?: string, isReprocess = false) => {
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
          originalUrl: imageUrl || (file ? URL.createObjectURL(file) : ''),
          status: 'processing',
          createdAt: Date.now(),
        };
        setCurrentImage(newImage);
      }

      try {
        let imageData: File;
        
        if (file) {
          // 本地文件模式
          imageData = file;
        } else if (imageUrl) {
          // URL模式 - 将URL转换为File
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          imageData = new File([blob], 'image.jpg', { type: blob.type });
        } else {
          throw new Error('没有可处理的图片数据');
        }

        const result = await apiService.removeBackground(currentProvider, apiKey, {
          image: imageData,
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
      const newImage: ImageData = {
        id: Date.now().toString(),
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        status: 'idle',
        createdAt: Date.now(),
      };
      setCurrentImage(newImage);
    },
    [setCurrentImage]
  );

  // URL处理函数
  const handleUrlSelect = useCallback(
    async (url: string) => {
      try {
        // 创建ImageData对象，使用URL作为originalUrl
        const newImage: ImageData = {
          id: Date.now().toString(),
          originalFile: null, // URL模式没有本地文件
          originalUrl: url,
          status: 'idle',
          createdAt: Date.now(),
        };
        setCurrentImage(newImage);
      } catch (error) {
        console.error('URL处理失败:', error);
        alert('图片URL处理失败，请检查链接是否正确');
      }
    },
    [setCurrentImage]
  );

  const handleProcess = useCallback(() => {
    if (currentImage) {
      processImage(currentImage.originalFile, currentImage.originalUrl, currentImage.status !== 'idle');
    }
  }, [currentImage, processImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wand2 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  AI智能抠图
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">让AI为你的图片移除背景</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowDocs(true)}
                className="group p-2 sm:px-4 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 flex items-center gap-1 sm:gap-2 backdrop-blur-sm"
                title="使用文档"
              >
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-sm font-medium">文档</span>
              </button>
              <button
                onClick={() => setShowApiSettings(true)}
                className={`p-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 backdrop-blur-sm ${
                  hasApiKey
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
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

      {/* Hero Section */}
      {!currentImage && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">AI驱动的背景移除工具</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 sm:mb-4">
                智能抠图
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
                上传图片，AI自动识别主体并移除背景，支持多种格式，处理速度快，效果专业
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 px-4">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">快速处理</span>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">隐私安全</span>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
                  <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">AI智能</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Current Provider Info & Settings */}
        {hasApiKey && currentProviderInfo && (
          <div className="mb-6 sm:mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <ProviderIcon providerId={currentProvider} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{currentProviderInfo.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{currentProviderInfo.description}</p>
                </div>
              </div>

              <button
                onClick={() => setShowApiSettings(true)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                切换服务
              </button>
            </div>
          </div>
        )}

        {/* Image Processing Area */}
        <div className="relative">
          {!currentImage ? (
            <ImageUploader onImageSelect={handleImageSelect} onUrlSelect={handleUrlSelect} disabled={!hasApiKey} />
          ) : (
            <>
              <ImagePreview
                image={currentImage}
                onRemove={() => setCurrentImage(null)}
                onReprocess={() => handleProcess()}
              />
              
              {/* Manual Process Button */}
              {currentImage.status === 'idle' ? (
                <div className="mt-6 sm:mt-8 text-center">
                  <button
                    onClick={handleProcess}
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                      <span className="text-sm sm:text-base">开始抠图</span>
                    </span>
                  </button>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 px-4">
                    点击按钮开始AI抠图处理
                  </p>
                </div>
              ) : currentImage.status !== 'processing' && (
                <div className="mt-6 sm:mt-8 text-center">
                  <button
                    onClick={() => setCurrentImage(null)}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="text-sm sm:text-base">处理新图片</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 py-6 sm:py-8 border-t border-white/20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <p className="text-xs sm:text-sm font-medium text-gray-700">所有图片处理均在客户端完成，隐私安全</p>
          </div>
          <p className="text-xs text-gray-500">Made with ❤️ by deerwan</p>
        </div>
      </footer>

      {/* Modals */}
      {showApiSettings && <ApiSettings />}
      {showDocs && <DocsModal onClose={() => setShowDocs(false)} />}
    </div>
  );
}

export default App;

