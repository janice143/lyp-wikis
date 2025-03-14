# **Chrome Extension 发布与更新指南**

Chrome Extension 开发完成后，需要发布到 **Chrome Web Store** 或 **企业内部使用**。本文将介绍 **插件打包、上传、审核机制、版本更新、私有发布** 等关键步骤，确保插件顺利上线。

## **1. 如何打包 Chrome Extension**

在发布之前，需要 **打包插件** 以便提交到 Chrome Web Store。

### **1.1 打包步骤**

1. 确保插件目录结构完整，并包含 `manifest.json`。
2. **删除无关文件**（如 `node_modules`、测试代码）。
3. 打开 Chrome，进入 `chrome://extensions/`。
4. 开启 **开发者模式**。
5. 点击 **打包扩展程序**（Pack Extension）。
6. 选择插件目录，点击 **“打包”**，生成：
   - `.crx` 文件（扩展程序文件）
   - `.pem` 文件（私钥文件）

> **注意**：请妥善保存 `.pem`，更新插件时需要使用。

## **2. 上传到 Chrome Web Store**

Chrome Web Store 是 Chrome 官方插件市场，用户可以直接下载插件。

### **2.1 创建开发者账号**

1. 访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole)。
2. 使用 Google 账号登录。
3. 支付 **开发者注册费（$5 USD）**，解锁上传权限。

### **2.2 提交插件**

1. 在 Chrome Web Store **开发者控制台** 点击 **添加新项目**。
2. 上传 `.zip` 格式的插件包（插件目录打包成 `.zip`）。
3. 填写插件信息：
   - **名称**（Name）
   - **描述**（Description）
   - **类别**（Category）
   - **语言**（Languages）

4. 上传 **截图和图标**
   - 最小尺寸：1280x800
   - 插件图标：128x128（或更大）

5. **填写隐私政策**
   - 若插件涉及用户数据（如存储、网络请求），需要提供 **隐私政策链接**。

6. **选择发布范围**
   - **公开发布**（所有用户可见）
   - **受限发布**（特定用户可访问）
   - **私有发布**（仅团队成员可用）

7. **提交审核**，等待 Google 审核（通常需 1-3 天）。

## **3. 审核机制与常见拒绝原因**

Google 会审核插件，确保符合 **隐私、安全、政策要求**。常见拒绝原因包括：

| **拒绝原因** | **解决方案** |
|-------------|-------------|
| **未提供隐私政策** | 在 `manifest.json` 添加 `privacy_policy_url` |
| **权限过多** | 只申请 **最少的权限**，避免 `tabs` |
| **违规 API** | 不要使用 `chrome.webRequestBlocking`（V3 已废弃） |
| **远程代码执行** | 禁止 `eval()`，避免从外部服务器加载 JS |
| **无效图标或截图** | 确保图像清晰，符合 Chrome Store 要求 |

> **解决方案**：
>
> - 在 `manifest.json` **减少权限**：
>
> ```json
> {
>   "permissions": ["storage", "activeTab"]
> }
> ```
>
> - **避免远程代码执行**，确保 `content_security_policy` 规则正确：
>
> ```json
> {
>   "content_security_policy": {
>     "extension_pages": "script-src 'self'; object-src 'self'"
>   }
> }
> ```

## **4. 版本更新**

插件更新时，可以 **监听更新事件**，或手动推送新版本。

### **4.1 `chrome.runtime.onUpdateAvailable` 监听更新**

当 Chrome 发现新版本时，插件可以提示用户更新：

```javascript
chrome.runtime.onUpdateAvailable.addListener((details) => {
    console.log("检测到新版本:", details.version);
    alert("新版本可用，请更新插件");
});
```

### **4.2 手动推送新版本**

1. 在 `manifest.json` **增加版本号**：

   ```json
   {
     "version": "1.1.0"
   }
   ```

2. 打包 `.zip`，上传到 Chrome Web Store。
3. 提交审核，等待 Google **自动推送更新**。

> **注意**：Chrome 会在 **24 小时内自动更新插件**。

## **5. 私有发布与企业内部使用**

如果插件仅供 **企业内部使用**，可选择 **组织发布** 或 **本地安装**。

### **5.1 组织发布（Google Workspace）**

适用于 **企业、团队**，管理员可批量分发插件：

1. **创建 Google Workspace 账号**（[管理控制台](https://admin.google.com)）。
2. 在 **Google Admin** 面板中，配置插件 **仅对组织成员可用**。

### **5.2 通过 CRX 文件本地安装**

如果不希望通过 Chrome Web Store 发布，可以手动安装 **CRX 文件**。

#### **方法 1：开发者模式手动安装**

1. 打开 `chrome://extensions/`。
2. 启用 **开发者模式**。
3. 点击 **加载已解压的扩展程序**，选择插件目录。

#### **方法 2：使用 CRX 本地安装**

1. 使用 Chrome 自带工具打包 `.crx`：

   ```bash
   chrome.exe --pack-extension=/path/to/extension
   ```

2. **分发 `.crx` 文件**，用户手动安装：
   - 下载 `.crx`
   - 拖拽到 `chrome://extensions/`

> **注意**：Chrome 89+ 版本不允许直接安装 CRX，推荐使用 **企业策略** 或 `group policies` 进行安装。

## **6. 总结**

| **步骤** | **说明** |
|----------|---------|
| **插件打包** | 在 `chrome://extensions/` 打包 `.crx` |
| **上传到 Chrome Web Store** | 需要开发者账号，支付 $5 USD |
| **审核机制** | 确保权限最小化，避免远程代码执行 |
| **插件更新** | `chrome.runtime.onUpdateAvailable` 监听，或手动上传新版本 |
| **私有发布** | 组织发布（Google Admin），或使用 `.crx` 本地安装 |

遵循这些步骤，你可以 **成功发布、更新、维护** Chrome Extension，让插件顺利上线！🚀
