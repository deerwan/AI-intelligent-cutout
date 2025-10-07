# API详细使用指南

本指南详细介绍如何获取和使用各个AI抠图平台的API。

## 目录

- [Remove.bg API](#removebg-api)
- [Clipdrop API](#clipdrop-api)
- [Replicate API](#replicate-api)
- [Hugging Face API](#hugging-face-api)
- [API对比](#api对比)
- [常见问题](#常见问题)

---

## Remove.bg API

### 概述

Remove.bg 是最受欢迎的背景移除服务，提供高质量的AI抠图效果。

### 获取API密钥

#### 1. 注册账号

访问：https://www.remove.bg/users/sign_up

- 可使用邮箱或Google账号注册
- 验证邮箱后即可使用

#### 2. 获取API Key

1. 登录后访问：https://www.remove.bg/api
2. 点击 "Get API Key" 或前往Dashboard
3. 在API部分复制您的API Key

### 免费与付费方案

#### 免费方案

- **额度**：每月50张图片
- **质量**：预览质量（0.25 megapixel，约625x400px）
- **速率限制**：每分钟50次请求
- **适用场景**：个人使用、小规模项目、测试

#### 付费方案

**Pay as you go（按需付费）**
- 预览质量：$0.09/张
- 高清质量：$0.20/张（25 megapixel）
- 超高清质量：$0.90/张（100 megapixel）

**订阅套餐**
| 套餐 | 价格 | 图片数量 | 质量 |
|------|------|---------|------|
| Starter | $9/月 | 40张 | 高清 |
| Professional | $29/月 | 150张 | 高清 |
| Enterprise | 定制 | 定制 | 定制 |

### API使用示例

```bash
curl -X POST https://api.remove.bg/v1.0/removebg \
  -H "X-Api-Key: YOUR_API_KEY" \
  -F "image_file=@/path/to/image.jpg" \
  -F "size=auto"
```

### 配置参数

- `size`: 输出尺寸
  - `preview`: 预览质量（免费）
  - `full`: 完整质量（付费）
  - `auto`: 自动选择（根据账户类型）
- `format`: 输出格式（png, jpg, zip）
- `type`: 检测类型（auto, person, product, car）

### 文档链接

- 官方文档：https://www.remove.bg/api
- API参考：https://www.remove.bg/api#operations

---

## Clipdrop API

### 概述

Clipdrop 由 Stability AI 提供，是Stable Diffusion背后的公司，提供多种AI图像处理API。

### 获取API密钥

#### 1. 注册账号

访问：https://clipdrop.co/apis

- 使用邮箱注册
- 或使用Google账号登录

#### 2. 创建API Key

1. 登录后进入Dashboard
2. 点击 "Create API Key"
3. 复制生成的API密钥

### 定价方案

Clipdrop采用按使用量计费的模式：

**Remove Background API**
- 查看最新定价：https://clipdrop.co/pricing
- 通常提供新用户免费额度
- 按API调用次数计费

### API使用示例

```bash
curl -X POST https://clipdrop-api.co/remove-background/v1 \
  -H "x-api-key: YOUR_API_KEY" \
  -F "image_file=@/path/to/image.jpg"
```

### 特点

- ✅ 高质量输出
- ✅ 支持多种图像格式
- ✅ Stability AI技术支持
- ✅ 快速响应

### 文档链接

- 官方文档：https://clipdrop.co/apis/docs/remove-background
- API参考：https://clipdrop.co/apis/docs

---

## Replicate API

### 概述

Replicate 是一个运行开源机器学习模型的平台，可以使用社区最先进的抠图模型。

### 获取API Token

#### 1. 注册账号

访问：https://replicate.com/signin

- 支持GitHub登录
- 或使用邮箱注册

#### 2. 创建API Token

1. 访问：https://replicate.com/account/api-tokens
2. 点击 "Create token"
3. 给token命名（如：my-app）
4. 复制生成的token

### 推荐模型

#### RMBG-1.4（推荐）

- 模型页面：https://replicate.com/lucataco/remove-bg
- 版本：`fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003`
- 特点：开源、高质量、快速

### 定价方案

**新用户**
- 免费试用额度（$10）
- 足够处理数千张图片

**按使用计费**
- 按运行时间收费
- 约 $0.0001/秒
- 典型图片处理约2-5秒

**示例成本**
- 处理1张图片：约 $0.0003-0.0005
- 处理1000张图片：约 $0.30-0.50

### API使用示例

```bash
# 1. 创建预测
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
    "input": {
      "image": "https://example.com/image.jpg"
    }
  }'

# 2. 获取结果
curl https://api.replicate.com/v1/predictions/{prediction_id} \
  -H "Authorization: Token YOUR_API_TOKEN"
```

### 特点

- ✅ 开源模型
- ✅ 性价比极高
- ✅ 支持多种模型
- ✅ 透明定价
- ⚠️ 异步处理（需轮询结果）

### 文档链接

- 官方文档：https://replicate.com/docs
- API参考：https://replicate.com/docs/reference/http

---

## Hugging Face API

### 概述

Hugging Face 是最大的AI模型社区，提供免费的推理API，适合测试和小规模使用。

### 获取API Token

#### 1. 注册账号

访问：https://huggingface.co/join

- 使用邮箱注册
- 或使用Google/GitHub登录

#### 2. 创建Access Token

1. 访问：https://huggingface.co/settings/tokens
2. 点击 "New token"
3. 选择 "read" 权限
4. 复制生成的token

### 推荐模型

#### RMBG-1.4

- 模型页面：https://huggingface.co/briaai/RMBG-1.4
- 开发者：BRIA AI
- 特点：完全开源、免费使用

### 定价方案

**完全免费！**
- ✅ 无需付费
- ✅ 适合测试和开发
- ⚠️ 有速率限制
- ⚠️ 可能需要排队

**速率限制**
- 免费用户：约每小时1000次请求
- 对于大规模使用，建议使用付费服务或自部署

### API使用示例

```bash
curl https://api-inference.huggingface.co/models/briaai/RMBG-1.4 \
  -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --data-binary "@image.jpg"
```

### 特点

- ✅ 完全免费
- ✅ 开源模型
- ✅ 无需信用卡
- ✅ 适合学习和测试
- ⚠️ 响应速度可能较慢
- ⚠️ 有使用限制

### 高级选项：自部署

如果需要更好的性能，可以：

1. 下载模型到本地
2. 使用Hugging Face Transformers库
3. 自己部署推理服务

```python
from transformers import pipeline

pipe = pipeline("image-segmentation", model="briaai/RMBG-1.4")
result = pipe("image.jpg")
```

### 文档链接

- 官方文档：https://huggingface.co/docs/api-inference
- 模型页面：https://huggingface.co/briaai/RMBG-1.4

---

## API对比

### 快速对比表

| 特性 | Remove.bg | Clipdrop | Replicate | Hugging Face |
|------|-----------|----------|-----------|--------------|
| 免费额度 | 50张/月 | 有限额度 | $10试用 | 无限（有速率限制） |
| 图片质量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 处理速度 | 极快 | 极快 | 快 | 中等 |
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 价格 | 中等 | 中等 | 便宜 | 免费 |
| 适用场景 | 商业项目 | 商业项目 | 开发测试 | 学习测试 |

### 使用建议

#### 场景1：个人学习/测试

**推荐：Hugging Face**
- 完全免费
- 无需信用卡
- 适合快速验证想法

#### 场景2：小型项目（<100张/月）

**推荐：Remove.bg 免费版**
- 50张/月足够使用
- 质量优秀
- 稳定可靠

#### 场景3：中等规模项目（100-1000张/月）

**推荐：Replicate**
- 性价比最高
- 约$0.3-0.5处理1000张
- 开源模型透明

#### 场景4：大型商业项目（>1000张/月）

**推荐：Remove.bg 或 Clipdrop 订阅**
- 质量最佳
- 速度最快
- 专业技术支持

#### 场景5：预算有限但量大

**推荐：Replicate + Hugging Face 组合**
- Replicate处理重要图片
- Hugging Face处理次要图片
- 混合使用降低成本

---

## 常见问题

### Q1: 哪个API最推荐？

**A:** 取决于你的需求：
- **最佳质量**：Remove.bg 或 Clipdrop
- **最佳性价比**：Replicate
- **完全免费**：Hugging Face

### Q2: API密钥安全吗？

**A:** 
- 本应用将API密钥保存在浏览器本地存储
- 不会上传到任何服务器
- 只在调用API时直接发送给对应的服务商
- 建议定期更换API密钥

### Q3: 可以同时配置多个API吗？

**A:** 
- 可以！建议配置多个API作为备份
- 在API配置面板中可以随时切换
- 不同API可用于不同场景

### Q4: 为什么处理失败？

**常见原因：**
1. API密钥错误或过期
2. 超出免费额度
3. 图片格式或大小不支持
4. 网络连接问题
5. API服务暂时不可用

**解决方法：**
1. 检查API密钥是否正确
2. 查看API提供商的使用额度
3. 尝试切换到其他API
4. 检查图片是否符合要求

### Q5: 免费额度用完了怎么办？

**选项：**
1. 等待下月额度刷新（Remove.bg）
2. 切换到其他免费API（Hugging Face）
3. 购买付费套餐
4. 使用多个账号（不推荐）

### Q6: 如何提高处理质量？

**建议：**
1. 使用高质量原图（分辨率足够）
2. 主体与背景对比明显
3. 避免复杂背景
4. 使用Remove.bg或Clipdrop的付费服务
5. 对比不同API的效果

### Q7: 可以批量处理吗？

**当前版本：**
- 支持单张图片处理
- 可以手动重复处理多张

**未来计划：**
- 批量上传和处理
- 需要后端支持

### Q8: API调用有次数限制吗？

**限制详情：**
- **Remove.bg**：免费50张/月，速率50次/分钟
- **Clipdrop**：根据付费计划
- **Replicate**：按使用量计费，无硬性限制
- **Hugging Face**：约1000次/小时（免费）

### Q9: 处理的图片会被保存吗？

**A:** 
- 本应用不保存任何图片
- 图片直接发送到API服务商处理
- 各服务商的隐私政策：
  - **Remove.bg**: 不存储处理后的图片
  - **Clipdrop**: 遵守GDPR
  - **Replicate**: 短期缓存后删除
  - **Hugging Face**: 不存储数据

### Q10: 如何联系技术支持？

**API服务商支持：**
- Remove.bg: support@remove.bg
- Clipdrop: https://clipdrop.co/support
- Replicate: team@replicate.com
- Hugging Face: https://huggingface.co/support

**本应用支持：**
- 提交GitHub Issue
- 发送邮件到项目维护者

---

## 附录：完整代码示例

### JavaScript/TypeScript 示例

```typescript
// Remove.bg
async function removeBgWithRemoveBg(imageFile: File, apiKey: string) {
  const formData = new FormData();
  formData.append('image_file', imageFile);
  formData.append('size', 'auto');

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
    },
    body: formData,
  });

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

// Clipdrop
async function removeBgWithClipdrop(imageFile: File, apiKey: string) {
  const formData = new FormData();
  formData.append('image_file', imageFile);

  const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
    },
    body: formData,
  });

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
```

### Python 示例

```python
import requests

# Remove.bg
def remove_bg_removebg(image_path, api_key):
    response = requests.post(
        'https://api.remove.bg/v1.0/removebg',
        files={'image_file': open(image_path, 'rb')},
        data={'size': 'auto'},
        headers={'X-Api-Key': api_key},
    )
    
    if response.status_code == requests.codes.ok:
        with open('output.png', 'wb') as out:
            out.write(response.content)
    else:
        print("Error:", response.status_code, response.text)

# Hugging Face
def remove_bg_huggingface(image_path, token):
    with open(image_path, 'rb') as f:
        data = f.read()
    
    response = requests.post(
        'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
        headers={'Authorization': f'Bearer {token}'},
        data=data
    )
    
    if response.status_code == 200:
        with open('output.png', 'wb') as out:
            out.write(response.content)
```

---

## 更新日志

### 2024-10-06

- 初始版本发布
- 支持4个主流AI抠图平台
- 详细的API使用说明

---

**祝你使用愉快！如有问题，欢迎反馈。** 🎉

