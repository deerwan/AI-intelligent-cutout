import { useState } from 'react';
import { Download, RefreshCw, Trash2, Eye, EyeOff, Maximize2, RotateCcw } from 'lucide-react';
import { ImageData } from '@/types';

interface ImagePreviewProps {
  image: ImageData;
  onRemove: () => void;
  onReprocess: () => void;
}

type ViewMode = 'single' | 'compare';

// 棋盘格背景样式（用于透明背景显示）
const CHECKERBOARD_STYLE = {
  backgroundImage:
    'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove, onReprocess }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = async () => {
    if (!image.processedUrl) return;

    try {
      const response = await fetch(image.processedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `removed-bg-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const displayUrl = showOriginal ? image.originalUrl : image.processedUrl || image.originalUrl;
  const showCheckerboard = !showOriginal && image.processedUrl;

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-3xl blur-3xl"></div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
        {/* Header */}
        {image.processedUrl && (
          <div className="p-4 sm:p-6 border-b border-white/20 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === 'single'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1 sm:gap-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">单图模式</span>
                    <span className="sm:hidden">单图</span>
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('compare')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === 'compare'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1 sm:gap-2">
                    <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">对比模式</span>
                    <span className="sm:hidden">对比</span>
                  </span>
                </button>
              </div>

              {viewMode === 'single' && (
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-all duration-200 flex items-center gap-1 sm:gap-2"
                >
                  {showOriginal ? (
                    <>
                      <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">查看处理后</span>
                      <span className="sm:hidden">处理后</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">查看原图</span>
                      <span className="sm:hidden">原图</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Image Display */}
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
          {viewMode === 'single' ? (
            // 单图模式
            <div className="relative">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl"
                style={showCheckerboard ? CHECKERBOARD_STYLE : undefined}
              >
                <img
                  src={displayUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] object-contain mx-auto"
                />

                {/* Status Badge */}
                {image.status === 'processing' && (
                  <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 shadow-lg">
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    <span className="hidden sm:inline">处理中...</span>
                    <span className="sm:hidden">处理中</span>
                  </div>
                )}

                {image.status === 'error' && (
                  <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg">
                    <span className="hidden sm:inline">处理失败</span>
                    <span className="sm:hidden">失败</span>
                  </div>
                )}

                {/* Fullscreen button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ) : (
            // 对比模式
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* 原图 */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <span className="inline-block bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg">
                    原图
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-200">
                  <img
                    src={image.originalUrl}
                    alt="原图"
                    className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain mx-auto"
                  />
                </div>
              </div>

              {/* 处理后 */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg">
                    处理后
                  </span>
                </div>
                <div
                  className="rounded-2xl overflow-hidden shadow-xl border border-blue-200"
                  style={CHECKERBOARD_STYLE}
                >
                  <img
                    src={image.processedUrl || image.originalUrl}
                    alt="处理后"
                    className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-6 border-t border-white/20 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
              <span>{new Date(image.createdAt).toLocaleString('zh-CN')}</span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={onReprocess}
                disabled={image.status === 'processing'}
                className="px-3 sm:px-4 py-2 bg-gray-100/80 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-200/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 backdrop-blur-sm"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">重新处理</span>
                <span className="sm:hidden">重处理</span>
              </button>

              {image.processedUrl && (
                <button
                  onClick={handleDownload}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">下载</span>
                  <span className="sm:hidden">下载</span>
                </button>
              )}

              <button
                onClick={onRemove}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">删除</span>
                <span className="sm:hidden">删除</span>
              </button>
            </div>
          </div>

          {image.error && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50/80 border border-red-200 rounded-xl">
              <p className="text-xs sm:text-sm text-red-700">{image.error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-xl transition-all duration-200"
            >
              <Maximize2 className="w-4 h-4 sm:w-6 sm:h-6 rotate-45" />
            </button>
            <img
              src={displayUrl}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain rounded-2xl"
              style={showCheckerboard ? CHECKERBOARD_STYLE : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};
