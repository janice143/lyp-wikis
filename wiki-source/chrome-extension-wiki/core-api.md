### **Chrome Extension 核心组件与 API**

在 Chrome Extension 开发中，核心组件和 API 决定了插件的功能和交互方式。本文将详细介绍 **后台脚本（Background Service Worker）、内容脚本（Content Scripts）、弹出页面（Popup）、选项页（Options Page）** 以及插件的 **权限管理和 API 交互**。

## **1. Background Service Worker（后台脚本）**

### **1.1 什么是后台脚本？**

后台脚本（Background Script）用于管理插件的生命周期，监听事件，如：

- 插件安装、更新
- 消息通信
- 网络请求拦截
- 处理长时间运行的任务

**Manifest V3 中，后台脚本被替换为 Service Worker**，需要在 `manifest.json` 中声明：

```json
{
  "background": {
    "service_worker": "background.js"
  }
}
```

### **1.2 事件驱动模型**

后台脚本不会一直运行，而是 **事件驱动** 的。例如：

```javascript
chrome.runtime.onInstalled.addListener(() => {
    console.log("插件已安装");
});
```

事件触发时，后台脚本会被激活，执行任务后再进入休眠状态。

### **1.3 `chrome.runtime` 和 `chrome.storage`**

- `chrome.runtime`：用于插件内部通信
- `chrome.storage`：用于存储数据

示例：存储和读取用户设置：

```javascript
chrome.storage.sync.set({ theme: "dark" }, () => {
    console.log("主题已存储");
});

chrome.storage.sync.get(["theme"], (result) => {
    console.log("当前主题:", result.theme);
});
```

## **2. Content Scripts（内容脚本）**

### **2.1 内容脚本的作用**

内容脚本运行在网页的上下文中，可以修改 **DOM**，但无法直接访问 `chrome` API。

### **2.2 在页面 DOM 中操作**

内容脚本可以直接修改网页：

```javascript
document.body.style.backgroundColor = "lightblue";
```

### **2.3 `chrome.scripting.executeScript` 的使用**

在 Manifest V3 中，需要用 `chrome.scripting.executeScript` 来动态注入内容脚本：

```javascript
chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
        document.body.style.backgroundColor = "lightblue";
    }
});
```

**声明权限**

```json
{
  "permissions": ["scripting"],
  "host_permissions": ["<all_urls>"]
}
```

## **3. Popup（弹出页面）**

### **3.1 定义 `popup.html`**

`popup.html` 是用户点击插件图标时显示的 UI 界面：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Popup</title>
    <script src="popup.js"></script>
</head>
<body>
    <h2>我的插件</h2>
    <button id="changeColor">修改背景色</button>
</body>
</html>
```

### **3.2 `popup.js` 与 `popup.html` 交互**

```javascript
document.getElementById("changeColor").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => document.body.style.backgroundColor = "lightblue"
        });
    });
});
```

### **3.3 使用 `chrome.runtime.sendMessage` 进行通信**

`popup.js` 可以通过 `chrome.runtime.sendMessage` 发送消息到后台脚本：

```javascript
chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    console.log("收到后台数据:", response);
});
```

后台脚本响应：

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchData") {
        sendResponse({ data: "后台数据" });
    }
});
```

## **4. Options Page（选项页）**

### **4.1 选项页的用途**

选项页用于 **存储和修改用户设置**，可在 `manifest.json` 中声明：

```json
{
  "options_page": "options.html"
}
```

### **4.2 `chrome.storage` 存储用户设置**

`options.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <script src="options.js"></script>
</head>
<body>
    <label>主题:
        <select id="theme">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
        </select>
    </label>
    <button id="save">保存</button>
</body>
</html>
```

`options.js`：

```javascript
document.getElementById("save").addEventListener("click", () => {
    let theme = document.getElementById("theme").value;
    chrome.storage.sync.set({ theme: theme }, () => {
        console.log("主题已保存:", theme);
    });
});
```

## **5. Permissions（权限管理）**

### **5.1 常见权限**

`manifest.json` 中 `permissions` 字段用于申请权限：

```json
{
  "permissions": ["tabs", "storage", "notifications"]
}
```

- `tabs`：管理浏览器标签页
- `storage`：存储数据
- `notifications`：发送桌面通知

### **5.2 精细化权限管理**

Manifest V3 要求 **更细粒度的权限声明**，如 `host_permissions` 限定域名：

```json
{
  "host_permissions": ["https://example.com/*"]
}
```

## **6. Chrome API 交互**

### **6.1 `chrome.tabs` 操作浏览器标签页**

获取当前标签页：

```javascript
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("当前标签页:", tabs[0]);
});
```

### **6.2 `chrome.runtime` 进行插件内部通信**

插件不同部分（如 `popup.js` 和 `background.js`）可以通过 `chrome.runtime.sendMessage` 进行通信。

### **6.3 `chrome.storage` 存储数据**

```javascript
chrome.storage.sync.set({ key: "value" }, () => {
    console.log("数据已存储");
});
```

### **6.4 `chrome.notifications` 发送桌面通知**

```javascript
chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "通知标题",
    message: "这是一个桌面通知"
});
```

## **7. 总结**

在本章中，我们学习了：

- **后台脚本** 监听事件并进行插件通信
- **内容脚本** 操作 DOM，但无法直接访问 `chrome` API
- **弹出页面** 提供 UI 交互，并可与后台通信
- **选项页** 允许用户存储和修改插件设置
- **权限管理** 需要在 `manifest.json` 中声明
- **Chrome API** 允许插件操作标签页、存储数据、发送通知等

通过掌握这些核心组件和 API，你可以构建更强大、灵活的 Chrome 插件！🚀
