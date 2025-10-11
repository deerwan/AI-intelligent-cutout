import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Cloud, Sparkles, Link, X, Check } from 'lucide-react';
import { DEFAULT_CONFIG } from '@/config/providers';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onUrlSelect?: (url: string) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onUrlSelect, disabled }) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': DEFAULT_CONFIG.acceptedExtensions,
    },
    maxSize: DEFAULT_CONFIG.maxFileSize,
    multiple: false,
    disabled,
  });

  // URL验证和处理
  const validateImageUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      // 基本URL格式验证
      new URL(url);
      
      // 检查是否为图片URL
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext => 
        url.toLowerCase().includes(ext)
      );
      
      if (!hasImageExtension && !url.includes('data:image')) {
        // 尝试加载图片验证
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
      }
      
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleUrlSubmit = useCallback(async () => {
    if (!imageUrl.trim()) {
      setUrlError('请输入图片URL');
      return;
    }

    setIsValidatingUrl(true);
    setUrlError('');

    try {
      const isValid = await validateImageUrl(imageUrl);
      if (isValid) {
        onUrlSelect?.(imageUrl);
      } else {
        setUrlError('无效的图片URL，请检查链接是否正确');
      }
    } catch (error) {
      setUrlError('图片加载失败，请检查网络连接');
    } finally {
      setIsValidatingUrl(false);
    }
  }, [imageUrl, validateImageUrl, onUrlSelect]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (urlError) setUrlError('');
  }, [urlError]);

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-3xl blur-3xl"></div>

      <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
        {/* Mode Toggle */}
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setUploadMode('file')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                uploadMode === 'file'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                本地文件
              </span>
            </button>
            <button
              onClick={() => setUploadMode('url')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                uploadMode === 'url'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                网络图片
              </span>
            </button>
          </div>
        </div>

        {/* Upload Content */}
        {uploadMode === 'file' ? (
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-3xl p-8 sm:p-12 lg:p-16 text-center cursor-pointer transition-all duration-300
              ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50/80 scale-[1.02]'
                  : disabled
                  ? 'border-gray-300 bg-gray-50/50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 hover:scale-[1.01]'
              }
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Icon */}
            <div className="relative">
              <div className={`
                w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isDragActive
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 scale-110'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }
              `}>
                {isDragActive ? (
                  <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
                ) : (
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
                )}
              </div>
              {!disabled && !isDragActive && (
                <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white animate-pulse" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {disabled ? '请先配置API密钥' : isDragActive ? '放开以上传' : '上传图片开始抠图'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
                {disabled
                  ? '配置API密钥后即可开始使用AI抠图功能'
                  : '拖拽图片到这里，或点击选择图片文件'
                }
              </p>

              {/* File info */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                  <span>JPG, PNG, WEBP</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                  <span>最大 {DEFAULT_CONFIG.maxFileSize / 1024 / 1024}MB</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                  <span>AI智能处理</span>
                </div>
              </div>
            </div>

            {/* Upload button */}
            {!disabled && !isDragActive && (
              <button
                type="button"
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">选择图片文件</span>
                </span>
              </button>
            )}

            {/* Drag active state */}
            {isDragActive && (
              <div className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-100 rounded-xl border border-blue-200">
                <p className="text-blue-700 font-medium text-sm sm:text-base">松开鼠标完成上传</p>
              </div>
            )}
          </div>
        </div>
        ) : (
          /* URL Input Mode */
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              {/* Icon */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Link className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white animate-pulse" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 sm:space-y-3 w-full max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
                  {disabled ? '请先配置API密钥' : '输入图片URL'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  {disabled
                    ? '配置API密钥后即可开始使用AI抠图功能'
                    : '粘贴图片链接，支持JPG、PNG、WEBP等格式'
                  }
                </p>

                {/* URL Input */}
                {!disabled && (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all duration-200 bg-white/80"
                        disabled={isValidatingUrl}
                      />
                      {imageUrl && !isValidatingUrl && (
                        <button
                          onClick={() => setImageUrl('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>

                    {/* Error Message */}
                    {urlError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700">{urlError}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleUrlSubmit}
                      disabled={!imageUrl.trim() || isValidatingUrl}
                      className="w-full group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isValidatingUrl ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm sm:text-base">验证中...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm sm:text-base">确认图片</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                )}

                {/* URL info */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                    <span>支持HTTPS链接</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                    <span>自动验证图片</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                    <span>AI智能处理</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
