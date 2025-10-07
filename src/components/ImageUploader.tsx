import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { DEFAULT_CONFIG } from '@/config/providers';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
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

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : disabled
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-8 h-8 text-primary-600" />
            ) : (
              <ImageIcon className="w-8 h-8 text-primary-600" />
            )}
          </div>
          
          <div>
            <p className="text-base font-medium text-gray-900 mb-1">
              {disabled ? '请先配置API密钥' : isDragActive ? '放开以上传' : '点击或拖拽图片到这里'}
            </p>
            <p className="text-sm text-gray-500">
              支持 JPG、PNG、WEBP 格式，最大 {DEFAULT_CONFIG.maxFileSize / 1024 / 1024}MB
            </p>
          </div>
          
          {!disabled && !isDragActive && (
            <button
              type="button"
              className="mt-2 px-5 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              选择图片
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
