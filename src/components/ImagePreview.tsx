import { useState } from 'react';
import { Download, RefreshCw, Trash2 } from 'lucide-react';
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
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* View Mode Toggle */}
      {image.processedUrl && (
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'single'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              单图
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'compare'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              对比
            </button>
          </div>
          
          {viewMode === 'single' && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showOriginal ? '查看处理后' : '查看原图'}
            </button>
          )}
        </div>
      )}

      {/* Image Display */}
      <div className="p-6 bg-gray-50">
        {viewMode === 'single' ? (
          // 单图模式
          <div className="relative">
            <div
              className="relative rounded-lg overflow-hidden"
              style={showCheckerboard ? CHECKERBOARD_STYLE : undefined}
            >
              <img
                src={displayUrl}
                alt="Preview"
                className="w-full h-auto max-h-[500px] object-contain mx-auto"
              />

              {/* Status Badge */}
              {image.status === 'processing' && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  处理中...
                </div>
              )}

              {image.status === 'error' && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  处理失败
                </div>
              )}
            </div>
          </div>
        ) : (
          // 对比模式
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 原图 */}
            <div>
              <div className="text-center mb-2">
                <span className="inline-block bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                  原图
                </span>
              </div>
              <div className="rounded-lg overflow-hidden bg-white border border-gray-200">
                <img
                  src={image.originalUrl}
                  alt="原图"
                  className="w-full h-auto max-h-[400px] object-contain mx-auto"
                />
              </div>
            </div>

            {/* 处理后 */}
            <div>
              <div className="text-center mb-2">
                <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  处理后
                </span>
              </div>
              <div
                className="rounded-lg overflow-hidden border border-primary-300"
                style={CHECKERBOARD_STYLE}
              >
                <img
                  src={image.processedUrl || image.originalUrl}
                  alt="处理后"
                  className="w-full h-auto max-h-[400px] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {new Date(image.createdAt).toLocaleString('zh-CN')}
          </p>

          <div className="flex gap-2">
            <button
              onClick={onReprocess}
              disabled={image.status === 'processing'}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              重新处理
            </button>

            {image.processedUrl && (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                下载
              </button>
            )}

            <button
              onClick={onRemove}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
        
        {image.error && (
          <p className="text-sm text-red-600 mt-2">{image.error}</p>
        )}
      </div>
    </div>
  );
};
