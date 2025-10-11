import { useState, useEffect } from 'react';
import { X, Key, ExternalLink, CheckCircle2, Sparkles, Shield, Zap, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { API_PROVIDERS } from '@/config/providers';
import { ApiProvider } from '@/types';
import { FaviconService, PROVIDER_DOMAINS } from '@/services/favicon';

export const ApiSettings: React.FC = () => {
  const { apiConfigs, currentProvider, setApiKey, setCurrentProvider, setShowApiSettings } = useStore();
  const [tempKeys, setTempKeys] = useState(apiConfigs);

  // 预加载favicon
  useEffect(() => {
    const domains = Object.values(PROVIDER_DOMAINS);
    FaviconService.preloadAllFavicons(domains);
  }, []);

  const handleSave = () => {
    (Object.entries(tempKeys) as [ApiProvider, string][]).forEach(([provider, key]) => {
      if (key !== apiConfigs[provider]) {
        setApiKey(provider, key);
      }
    });
    setShowApiSettings(false);
  };

  const updateTempKey = (provider: ApiProvider, value: string) => {
    setTempKeys(prev => ({ ...prev, [provider]: value }));
  };

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'removebg': return 'from-blue-500 to-indigo-600';
      case 'clipdrop': return 'from-purple-500 to-pink-600';
      case 'replicate': return 'from-green-500 to-emerald-600';
      case 'huggingface': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const ProviderIcon: React.FC<{ providerId: string }> = ({ providerId }) => {
    const domain = PROVIDER_DOMAINS[providerId];
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [showFallback, setShowFallback] = useState(false);
    
    if (!domain) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center text-white text-lg">
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
          className="w-8 h-8 rounded-lg"
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
      <div className={`w-8 h-8 bg-gradient-to-br ${getProviderColor(providerId)} rounded-lg flex items-center justify-center text-white text-lg`}>
        {FaviconService.getFallbackEmoji(domain)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Key className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">API配置</h2>
              <p className="text-blue-100 text-xs sm:text-sm">配置AI服务提供商密钥</p>
            </div>
          </div>
          <button
            onClick={() => setShowApiSettings(false)}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            aria-label="关闭"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50/80 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">隐私安全</h3>
                <p className="text-xs sm:text-sm text-blue-700">
                  API密钥会安全地保存在您的浏览器本地存储中，不会上传到任何服务器。至少配置一个API密钥才能使用抠图功能。
                </p>
              </div>
            </div>
          </div>

          {/* Provider Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {API_PROVIDERS.map((provider) => {
              const isSelected = currentProvider === provider.id;
              const hasKey = tempKeys[provider.id].length > 0;

              return (
                <div
                  key={provider.id}
                  className={`relative border-2 rounded-xl p-4 sm:p-6 transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 shadow-lg'
                      : 'border-gray-200 bg-white/60 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Provider Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <ProviderIcon providerId={provider.id} />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                          <span className="truncate">{provider.name}</span>
                          {hasKey && (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex-shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="hidden sm:inline">已配置</span>
                              <span className="sm:hidden">✓</span>
                            </span>
                          )}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{provider.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentProvider(provider.id)}
                      className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? '当前' : '选择'}
                    </button>
                  </div>

                  {/* Provider Info */}
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">免费额度：</span>
                      <span className="text-gray-600">{provider.freeQuota}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      <span className="font-medium text-gray-700">付费方案：</span>
                      <span className="text-gray-600">{provider.pricing}</span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <a
                      href={provider.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200"
                    >
                      注册 <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={provider.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200"
                    >
                      文档 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* API Key Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      API密钥
                    </label>
                    <input
                      type="password"
                      value={tempKeys[provider.id]}
                      onChange={(e) => updateTempKey(provider.id, e.target.value)}
                      placeholder={`输入 ${provider.name} API Key`}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm transition-all duration-200 bg-white/80"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 p-3 sm:p-4 bg-gradient-to-r from-gray-50/50 to-blue-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 flex-shrink-0 rounded-b-3xl">
          <button
            onClick={() => setShowApiSettings(false)}
            className="px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            确认
          </button>
        </div>
      </div>
    </div>
  );
};
