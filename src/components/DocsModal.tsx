import { X, ExternalLink, Download, Key, Upload, Eye } from 'lucide-react';

interface DocsModalProps {
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 sm:p-5 md:p-6 flex items-center justify-between gap-3 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">使用文档</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="关闭"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-120px)]">
          {/* 快速开始 */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">1</span>
              快速开始
            </h3>
            <div className="space-y-3 sm:space-y-4 pl-0 sm:pl-10">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-r-lg">
                <p className="text-sm sm:text-base text-blue-900">
                  欢迎使用AI智能抠图！本应用支持多个AI平台，让您轻松移除图片背景。
                </p>
              </div>
            </div>
          </section>

          {/* 配置API */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">2</span>
              配置API密钥
            </h3>
            <div className="space-y-3 sm:space-y-4 pl-0 sm:pl-10">
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">第一步：选择API平台</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">推荐以下平台（选择其中一个）：</p>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold flex-shrink-0">•</span>
                        <div>
                          <strong className="text-gray-900">Hugging Face</strong>
                          <span className="text-gray-600"> - 完全免费（推荐新手）</span>
                          <a href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 ml-2 inline-flex items-center gap-1">
                            注册 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                        <div>
                          <strong className="text-gray-900">Remove.bg</strong>
                          <span className="text-gray-600"> - 每月50张免费（质量最好）</span>
                          <a href="https://www.remove.bg/users/sign_up" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 ml-2 inline-flex items-center gap-1">
                            注册 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">第二步：获取API密钥</h4>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p><strong className="text-gray-900">Hugging Face:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    <li>访问 <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Settings → Access Tokens</a></li>
                    <li>点击"New token"，选择"read"权限</li>
                    <li>复制生成的token</li>
                  </ol>
                  <p className="pt-2"><strong className="text-gray-900">Remove.bg:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    <li>访问 <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">API页面</a></li>
                    <li>在Dashboard中复制API Key</li>
                  </ol>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">第三步：在应用中配置</h4>
                <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-600 pl-2">
                  <li>点击右上角"配置API"按钮</li>
                  <li>选择您注册的平台</li>
                  <li>粘贴API密钥</li>
                  <li>点击"保存配置"</li>
                </ol>
              </div>
            </div>
          </section>

          {/* 使用步骤 */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">3</span>
              使用步骤
            </h3>
            <div className="space-y-3 pl-0 sm:pl-10">
              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <Upload className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">上传图片</h4>
                  <p className="text-xs sm:text-sm text-gray-600">拖拽图片到上传区域，或点击选择图片。支持JPG、PNG、WEBP格式，最大10MB。</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">AI处理</h4>
                  <p className="text-xs sm:text-sm text-gray-600">AI会自动识别主体并移除背景，通常只需3-10秒。</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <Eye className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">查看结果</h4>
                  <p className="text-xs sm:text-sm text-gray-600">点击"查看原图"对比效果，使用放大功能查看细节。</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <Download className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">下载保存</h4>
                  <p className="text-xs sm:text-sm text-gray-600">满意后点击"下载"按钮保存处理后的图片（PNG格式，保留透明背景）。</p>
                </div>
              </div>
            </div>
          </section>

          {/* 常见问题 */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">?</span>
              常见问题
            </h3>
            <div className="space-y-3 pl-0 sm:pl-10">
              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-3 sm:p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 text-sm sm:text-base">
                  为什么需要配置API密钥？
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600">
                  <p>本应用是纯前端应用，图片处理需要调用第三方AI平台的API。配置API密钥后，图片会直接从您的浏览器发送到对应的AI平台处理，不会经过我们的服务器，确保隐私安全。</p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-3 sm:p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 text-sm sm:text-base">
                  API密钥安全吗？
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600">
                  <p>API密钥只保存在您的浏览器本地存储中，不会上传到任何服务器。只在调用API时直接发送给对应的AI平台。您可以随时在设置中修改或删除。</p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-3 sm:p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 text-sm sm:text-base">
                  处理失败怎么办？
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600">
                  <p className="mb-2">常见原因和解决方法：</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>API密钥错误：请检查密钥是否正确</li>
                    <li>超出免费额度：切换到其他API平台</li>
                    <li>图片格式不支持：使用JPG、PNG、WEBP格式</li>
                    <li>图片过大：压缩到10MB以内</li>
                  </ul>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-3 sm:p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 text-sm sm:text-base">
                  如何获得最佳效果？
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600">
                  <p className="mb-2">建议：</p>
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
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">📚</span>
              更多资源
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-10">
              <a
                href="https://github.com/deerwan/AI-intelligent-cutout"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">GitHub仓库</h4>
                  <p className="text-xs text-gray-600">查看源码和完整文档</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
                <div className="w-5 h-5 text-gray-400 flex items-center justify-center">💡</div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">使用技巧</h4>
                  <p className="text-xs text-gray-600">查看README获取更多信息</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            遇到问题？请查看完整的 <a href="https://github.com/deerwan/AI-intelligent-cutout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">项目文档</a>
          </p>
        </div>
      </div>
    </div>
  );
};

