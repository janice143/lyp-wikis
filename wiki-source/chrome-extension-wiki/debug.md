# **Chrome Extension 调试与测试指南**

开发 Chrome Extension 时，调试和测试至关重要。良好的调试技巧和自动化测试方法可以 **快速定位问题**，提高开发效率。本文将介绍 **Chrome 开发者工具调试插件、错误捕获、功能测试、自动化测试** 等核心调试技巧。

---

## **1. Chrome 开发者工具调试插件**

Chrome 内置了强大的 **开发者工具（DevTools）**，可以调试 **Popup、Background、Content Script**，包括 **Console、Network、Sources 等**。

### **1.1 在 Chrome 中加载插件**

1. 打开 `chrome://extensions/`
2. 开启 **开发者模式**
3. 点击 **“加载已解压的扩展程序”**
4. 选择插件的 `manifest.json` 所在目录

### **1.2 调试不同组件**

| 组件 | 调试方法 |
|------|--------|
| **Popup** | 在 Popup 界面打开 DevTools（右键 → 检查） |
| **Background Service Worker** | `chrome://extensions/` → 找到插件 → Service Worker → "Inspect" |
| **Content Script** | 在目标网页打开 DevTools → Console |

---

## **2. 查看 Console、Network 和 Background 日志**

### **2.1 在 Console 查看日志**

在 `console.log()` 中输出调试信息：

```javascript
console.log("插件启动...");
```

在 DevTools **Console** 选项卡中，可以查看日志输出。

### **2.2 在 Network 查看请求**

如果插件使用 `fetch()` 请求 API：

```javascript
fetch("https://api.example.com/data")
    .then(response => response.json())
    .then(data => console.log("API 数据:", data));
```

可以在 **Network** 选项卡中查看请求是否成功、是否有 CORS 限制等。

### **2.3 调试 Background Service Worker**

在 `chrome://extensions/` 中：

- 找到插件
- 点击 **Service Worker** 的 `Inspect`
- 在 Console 查看后台日志

---

## **3. 使用 `chrome.runtime.lastError` 捕获错误**

`chrome.runtime.lastError` 是 **插件 API 调用失败时**，返回的错误对象。

### **3.1 捕获 API 调用错误**

```javascript
chrome.storage.sync.get("key", (result) => {
    if (chrome.runtime.lastError) {
        console.error("存储读取失败:", chrome.runtime.lastError);
    } else {
        console.log("存储数据:", result);
    }
});
```

### **3.2 捕获消息传递错误**

如果目标未监听消息，可能会导致错误：

```javascript
chrome.runtime.sendMessage({ action: "test" }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("消息发送失败:", chrome.runtime.lastError);
    } else {
        console.log("响应:", response);
    }
});
```

---

## **4. 测试插件功能**

测试插件时，需要检查 **资源路径、消息传递、API 调用**。

### **4.1 使用 `chrome.extension.getURL` 测试资源路径**

插件可能会加载本地资源，例如图片、HTML 页面：

```javascript
let imageUrl = chrome.runtime.getURL("icons/icon48.png");
console.log("图片地址:", imageUrl);
```

可以在 Console 中检查 URL 是否正确。

### **4.2 模拟消息传递**

#### **手动发送消息**

在 DevTools Console 中：

```javascript
chrome.runtime.sendMessage({ action: "test" }, (response) => {
    console.log("响应:", response);
});
```

然后在 `background.js` 监听：

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "test") {
        sendResponse({ message: "收到消息" });
    }
});
```

#### **手动触发事件**

可以手动调用 API 来测试事件监听器：

```javascript
chrome.runtime.onInstalled.dispatch({ reason: "install" });
```

---

## **5. 自动化测试**

自动化测试可以确保插件的核心功能 **在更新后仍然有效**。两种常用的测试工具：

1. **Puppeteer**（无头 Chrome，适合端到端测试）
2. **Selenium**（适用于 UI 自动化测试）

---

### **5.1 Puppeteer 进行端到端测试**

Puppeteer 是 Google 官方的 **无头 Chrome 控制库**，可用于 **模拟用户操作、点击按钮、检查插件行为**。

#### **安装 Puppeteer**

```bash
npm install puppeteer
```

#### **测试 Popup 界面**

```javascript
const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // 运行 UI
    const page = await browser.newPage();

    // 加载插件
    await page.goto("chrome://extensions/");
    
    // 打开 Popup 页面
    await page.click("#your-popup-button");
    
    // 获取 Popup 的文本内容
    const text = await page.$eval("h2", el => el.innerText);
    console.log("Popup 标题:", text);

    await browser.close();
})();
```

---

### **5.2 Selenium 进行 UI 测试**

Selenium 适用于 **插件的 UI 自动化测试**，如 **测试按钮、表单交互**。

#### **安装 Selenium**

```bash
pip install selenium
```

#### **示例：打开插件并点击按钮**

```python
from selenium import webdriver

# 配置 Chrome Driver
options = webdriver.ChromeOptions()
options.add_argument("--load-extension=/path/to/extension")

driver = webdriver.Chrome(options=options)

# 打开插件的 Popup 页面
driver.get("chrome://extensions/")

# 点击按钮
button = driver.find_element("id", "changeColor")
button.click()

print("测试成功")
driver.quit()
```

---

## **6. 总结**

| **调试技巧** | **方法** |
|--------------|---------|
| **Console 日志** | `console.log()` 输出信息 |
| **Network 请求** | DevTools Network 监控 API 请求 |
| **捕获错误** | `chrome.runtime.lastError` |
| **测试资源路径** | `chrome.runtime.getURL()` |
| **消息传递测试** | `chrome.runtime.sendMessage()` |
| **自动化测试** | Puppeteer / Selenium |

使用这些技巧，你可以高效地调试和测试 Chrome Extension，确保插件的稳定性和用户体验！🚀
