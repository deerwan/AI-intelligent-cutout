import { useState } from 'react';
import { X, Key, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { API_PROVIDERS } from '@/config/providers';
import { ApiProvider } from '@/types';

export const ApiSettings: React.FC = () => {
  const { apiConfigs, currentProvider, setApiKey, setCurrentProvider, setShowApiSettings } = useStore();
  const [tempKeys, setTempKeys] = useState(apiConfigs);

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            <h2 className="text-lg font-semibold">API配置</h2>
          </div>
          <button
            onClick={() => setShowApiSettings(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="text-sm text-gray-600 mb-4">
            至少配置一个API密钥才能使用抠图功能。API密钥会安全地保存在您的浏览器本地存储中。
          </p>

          {/* Provider Cards */}
          <div className="space-y-3">
            {API_PROVIDERS.map((provider) => {
              const isSelected = currentProvider === provider.id;
              const hasKey = tempKeys[provider.id].length > 0;

              return (
                <div
                  key={provider.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{provider.name}</h3>
                        {hasKey && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            已配置
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
                      
                      <div className="flex gap-4 text-sm mb-2">
                        <div>
                          <span className="font-medium text-gray-700">免费：</span>
                          <span className="text-gray-600">{provider.freeQuota}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">付费：</span>
                          <span className="text-gray-600">{provider.pricing}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 text-xs">
                        <a
                          href={provider.signupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          注册 <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={provider.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          文档 <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentProvider(provider.id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? '当前' : '选择'}
                    </button>
                  </div>

                  {/* API Key Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API密钥
                    </label>
                    <input
                      type="password"
                      value={tempKeys[provider.id]}
                      onChange={(e) => updateTempKey(provider.id, e.target.value)}
                      placeholder={`输入 ${provider.name} API Key`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={() => setShowApiSettings(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
