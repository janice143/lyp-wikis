### **Chrome Extension 基础**

Chrome Extension（谷歌浏览器插件）是基于 Web 技术构建的浏览器增强程序，能够扩展浏览器功能、修改网页内容或提供更高效的工作流。本章介绍 Chrome Extension 的基础知识，包括插件的目录结构、`manifest.json` 配置以及插件的生命周期管理。

## **1. 插件目录结构**

一个 Chrome 插件的目录通常包含以下文件和目录：

```plaintext
my-extension/
│── manifest.json        # 插件的元数据和权限声明
│── background.js        # 后台脚本（可选）
│── content.js           # 内容脚本（可选）
│── popup.html           # 弹出页（可选）
│── popup.js             # 弹出页逻辑（可选）
│── options.html         # 设置页（可选）
│── icons/               # 图标文件（可选）
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
```

### **1.1 必要文件**

#### **`manifest.json`**

- 这是插件的核心文件，包含插件的基本信息、权限、背景脚本等配置。
- 例如：

  ```json
  {
    "manifest_version": 3,
    "name": "My Extension",
    "version": "1.0",
    "description": "A simple Chrome extension",
    "permissions": ["storage", "activeTab"],
    "action": {
      "default_popup": "popup.html",
      "default_icon": "icons/icon48.png"
    }
  }
  ```

### **1.2 可选文件**

- **`background.js`**（后台脚本）：运行在浏览器后台，用于监听事件。
- **`content.js`**（内容脚本）：嵌入到网页中，操作 DOM。
- **`popup.html`**（弹出页）：点击浏览器工具栏图标时显示的界面。
- **`options.html`**（设置页）：用户可在扩展管理界面打开的配置页面。

## **2. Manifest 文件**

### **2.1 `manifest.json` 基本配置**

`manifest.json` 是 Chrome Extension 必须包含的配置文件，定义插件的功能、权限和元数据。

### **2.2 `manifest_version` 说明**

- **`manifest_version: 2`**（已淘汰）：采用 `background.js` 作为持久后台。
- **`manifest_version: 3`**（推荐）：改为 `service_worker`，更节能、更安全。

例如：

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0"
}
```

### **2.3 `permissions` 权限配置**

插件可以申请不同权限，例如：

```json
{
  "permissions": ["storage", "tabs", "activeTab"]
}
```

- `storage`：允许存储数据。
- `tabs`：访问所有标签页的信息。
- `activeTab`：访问当前活跃的标签页。

**Manifest V3 需要显式声明主机权限：**

```json
{
  "host_permissions": ["https://*.example.com/*"]
}
```

## **3. 插件的生命周期**

Chrome 插件的生命周期包括 **安装、更新、运行和卸载**。

### **3.1 插件安装**

当用户安装插件时，`chrome.runtime.onInstalled` 事件会触发：

```javascript
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("插件已安装");
  }
});
```

### **3.2 插件更新**

如果插件版本升级，也会触发 `onInstalled`：

```javascript
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "update") {
    console.log("插件已更新");
  }
});
```

### **3.3 插件卸载**

插件卸载时，可以引导用户反馈：

```javascript
chrome.runtime.setUninstallURL("https://example.com/feedback");
```

## **4. 总结**

- Chrome Extension 由 `manifest.json`、后台脚本、内容脚本、UI 文件等组成。
- `manifest.json` 定义插件的基本信息、权限、主机访问等。
- 插件的生命周期包括安装、更新和卸载，`chrome.runtime.onInstalled` 用于监听事件。

下一步，我们可以尝试编写一个简单的 Chrome 插件，例如一个自动化任务管理器或者网页内容增强工具。
