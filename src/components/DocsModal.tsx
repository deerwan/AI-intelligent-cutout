import { useState } from 'react';
import { X, ExternalLink, Download, Key, Upload, Eye, Sparkles, Shield, Zap, BookOpen, CheckCircle2, Star } from 'lucide-react';
import { FaviconService, PROVIDER_DOMAINS } from '@/services/favicon';

interface DocsModalProps {
  onClose: () => void;
}

// Provider图标组件
const ProviderIcon: React.FC<{ providerId: string; size?: 'sm' | 'md' | 'lg' }> = ({ providerId, size = 'md' }) => {
  const domain = PROVIDER_DOMAINS[providerId];
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  if (!domain) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center text-white text-lg`}>
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
        className={`${sizeClasses[size]} rounded-lg`}
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
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center text-white text-lg`}>
      {FaviconService.getFallbackEmoji(domain)}
    </div>
  );
};

export const DocsModal: React.FC<DocsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-3 lg:p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-6xl w-full max-h-[98vh] sm:max-h-[95vh] lg:max-h-[90vh] overflow-hidden border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 sm:p-4 lg:p-6 flex items-center justify-between gap-2 sm:gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">使用文档</h2>
              <p className="text-blue-100 text-xs sm:text-sm">快速上手AI智能抠图</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-xl transition-all duration-200 flex-shrink-0"
            aria-label="关闭"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[calc(98vh-120px)] sm:max-h-[calc(95vh-140px)] lg:max-h-[calc(90vh-120px)]">
          {/* 快速开始 */}
          <section className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">1</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">快速开始</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">欢迎使用AI智能抠图！</h4>
                  <p className="text-blue-700 text-sm sm:text-base">
                    本应用支持多个AI平台，让您轻松移除图片背景。只需上传图片，AI会自动识别主体并移除背景，支持多种格式，处理速度快，效果专业。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 配置API */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">配置API密钥</h3>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <Key className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">第一步：选择API平台</h4>
                    <p className="text-gray-600 mb-4">推荐以下平台（选择其中一个）：</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <ProviderIcon providerId="huggingface" size="md" />
                        <div>
                          <h5 className="font-semibold text-gray-900">Hugging Face</h5>
                          <p className="text-sm text-gray-600 mb-2">完全免费（推荐新手）</p>
                          <a href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium">
                            注册 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <ProviderIcon providerId="removebg" size="md" />
                        <div>
                          <h5 className="font-semibold text-gray-900">Remove.bg</h5>
                          <p className="text-sm text-gray-600 mb-2">每月50张免费（质量最好）</p>
                          <a href="https://www.remove.bg/users/sign_up" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            注册 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">第二步：获取API密钥</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                      <ProviderIcon providerId="huggingface" size="sm" />
                      Hugging Face
                    </h5>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-2">
                      <li>访问 <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Settings → Access Tokens</a></li>
                      <li>点击"New token"，选择"read"权限</li>
                      <li>复制生成的token</li>
                    </ol>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                      <ProviderIcon providerId="removebg" size="sm" />
                      Remove.bg
                    </h5>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-2">
                      <li>访问 <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">API页面</a></li>
                      <li>在Dashboard中复制API Key</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">第三步：在应用中配置</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-2">
                  <li>点击右上角"配置API"按钮</li>
                  <li>选择您注册的平台</li>
                  <li>粘贴API密钥</li>
                  <li>点击"保存配置"</li>
                </ol>
              </div>
            </div>
          </section>

          {/* 使用步骤 */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">使用步骤</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 bg-white/80 border border-gray-200 rounded-2xl p-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">上传图片</h4>
                  <p className="text-sm text-gray-600">拖拽图片到上传区域，或点击选择图片。支持JPG、PNG、WEBP格式，最大10MB。</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/80 border border-gray-200 rounded-2xl p-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI处理</h4>
                  <p className="text-sm text-gray-600">AI会自动识别主体并移除背景，通常只需3-10秒。</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/80 border border-gray-200 rounded-2xl p-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">查看结果</h4>
                  <p className="text-sm text-gray-600">点击"查看原图"对比效果，使用放大功能查看细节。</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/80 border border-gray-200 rounded-2xl p-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">下载保存</h4>
                  <p className="text-sm text-gray-600">满意后点击"下载"按钮保存处理后的图片（PNG格式，保留透明背景）。</p>
                </div>
              </div>
            </div>
          </section>

          {/* 常见问题 */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">?</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">常见问题</h3>
            </div>
            
            <div className="space-y-4">
              <details className="bg-white/80 border border-gray-200 rounded-2xl group">
                <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50/80 text-sm sm:text-base flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-open:bg-blue-200 transition-colors">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  为什么需要配置API密钥？
                </summary>
                <div className="px-6 pb-6 text-sm text-gray-600">
                  <p>本应用是纯前端应用，图片处理需要调用第三方AI平台的API。配置API密钥后，图片会直接从您的浏览器发送到对应的AI平台处理，不会经过我们的服务器，确保隐私安全。</p>
                </div>
              </details>

              <details className="bg-white/80 border border-gray-200 rounded-2xl group">
                <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50/80 text-sm sm:text-base flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-open:bg-green-200 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  API密钥安全吗？
                </summary>
                <div className="px-6 pb-6 text-sm text-gray-600">
                  <p>API密钥只保存在您的浏览器本地存储中，不会上传到任何服务器。只在调用API时直接发送给对应的AI平台。您可以随时在设置中修改或删除。</p>
                </div>
              </details>

              <details className="bg-white/80 border border-gray-200 rounded-2xl group">
                <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50/80 text-sm sm:text-base flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-open:bg-yellow-200 transition-colors">
                    <Zap className="w-4 h-4 text-yellow-600" />
                  </div>
                  处理失败怎么办？
                </summary>
                <div className="px-6 pb-6 text-sm text-gray-600">
                  <p className="mb-3">常见原因和解决方法：</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>API密钥错误：请检查密钥是否正确</li>
                    <li>超出免费额度：切换到其他API平台</li>
                    <li>图片格式不支持：使用JPG、PNG、WEBP格式</li>
                    <li>图片过大：压缩到10MB以内</li>
                  </ul>
                </div>
              </details>

              <details className="bg-white/80 border border-gray-200 rounded-2xl group">
                <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50/80 text-sm sm:text-base flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-open:bg-purple-200 transition-colors">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  如何获得最佳效果？
                </summary>
                <div className="px-6 pb-6 text-sm text-gray-600">
                  <p className="mb-3">建议：</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>使用主体清晰的图片</li>
                    <li>避免复杂的背景</li>
                    <li>确保主体与背景有足够对比度</li>
                    <li>使用Remove.bg或Clipdrop获得最佳质量</li>
                  </ul>
                </div>
              </details>
            </div>
          </section>

          {/* 更多资源 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">更多资源</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://github.com/deerwan/AI-intelligent-cutout"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-white/80 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-200">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base">GitHub仓库</h4>
                  <p className="text-sm text-gray-600">查看源码和完整文档</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 bg-white/80 border border-gray-200 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base">使用技巧</h4>
                  <p className="text-sm text-gray-600">查看README获取更多信息</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-gray-50/50 to-blue-50/50 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <p className="text-xs sm:text-sm font-medium text-gray-700">所有图片处理均在客户端完成，隐私安全</p>
          </div>
          <p className="text-xs text-gray-500">
            遇到问题？请查看完整的 <a href="https://github.com/deerwan/AI-intelligent-cutout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">项目文档</a>
          </p>
        </div>
      </div>
    </div>
  );
};

