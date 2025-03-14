### **Chrome Extension 的通信机制**

Chrome Extension 由多个独立的组件（如 Background Service Worker、Content Script、Popup 等）组成。这些组件运行在不同的环境下，通常需要相互通信来共享数据、触发操作。本文将介绍 **插件内部通信（Runtime Messaging）、Content Script 与 Background 交互、Native Messaging** 等通信方式。

## **1. Runtime Messaging（插件内部通信）**

Chrome 提供了 `chrome.runtime.sendMessage` 和 `chrome.runtime.onMessage` 来实现插件内部通信，适用于 **Popup 与 Background、Options Page 与 Background** 之间的消息传递。

### **1.1 `chrome.runtime.sendMessage`**

`chrome.runtime.sendMessage` 用于发送消息，适用于一次性请求和响应模式。

**示例：Popup 发送消息给 Background**
`popup.js`

```javascript
document.getElementById("sendMessage").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getData" }, (response) => {
        console.log("后台返回的数据:", response.data);
    });
});
```

**示例：Background 监听消息**
`background.js`

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getData") {
        sendResponse({ data: "这是后台返回的数据" });
    }
});
```

> **注意**：如果 `sendResponse` 需要异步操作，需要加上 `return true`：

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchData") {
        fetch("https://api.example.com/data")
            .then(response => response.json())
            .then(data => sendResponse({ data }))
            .catch(error => sendResponse({ error }));

        return true;  // 保持连接直到 sendResponse 被调用
    }
});
```

## **2. Content Script 与 Background 交互**

由于 **Content Script 不能直接访问 Background**，需要通过 `chrome.tabs.sendMessage` 进行通信。

### **2.1 `chrome.tabs.sendMessage`**

用于从 Background 发送消息给 Content Script。

**示例：Background 向 Content Script 发送消息**

```javascript
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "highlightText" });
});
```

**示例：Content Script 监听消息**

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "highlightText") {
        document.body.style.backgroundColor = "yellow";
    }
});
```

### **2.2 `chrome.runtime.connect`（长连接）**

如果需要 **持续通信**，可以使用 `chrome.runtime.connect`。

**示例：Background 监听长连接**

```javascript
chrome.runtime.onConnect.addListener((port) => {
    console.log("收到连接:", port.name);
    
    port.onMessage.addListener((msg) => {
        console.log("收到消息:", msg);
        port.postMessage({ response: "后台的响应" });
    });
});
```

**示例：Popup 连接 Background**

```javascript
let port = chrome.runtime.connect({ name: "popup-background" });

port.postMessage({ action: "fetchStatus" });

port.onMessage.addListener((msg) => {
    console.log("收到后台响应:", msg.response);
});
```

## **3. Native Messaging（与本地应用通信）**

如果插件需要与 **本地应用** 进行数据交换（如调用 Python、Node.js 或 C++ 应用），可以使用 `chrome.runtime.connectNative` 进行通信。

### **3.1 `chrome.runtime.connectNative`**

此方法用于连接本地应用，并进行数据交换。

**示例：Background 连接本地应用**

```javascript
let port = chrome.runtime.connectNative("com.example.native_app");

port.onMessage.addListener((msg) => {
    console.log("收到本地应用的消息:", msg);
});

port.postMessage({ action: "getData" });
```

### **3.2 本地应用的注册**

本地应用需要注册 `manifest.json`，并在 `Native Messaging Hosts` 目录中创建配置文件：

- **Windows**：`HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\com.example.native_app`
- **Mac/Linux**：`~/.config/google-chrome/NativeMessagingHosts/com.example.native_app.json`

**示例：本地应用的 `manifest.json`**

```json
{
  "name": "com.example.native_app",
  "description": "Native App Example",
  "path": "/usr/local/bin/native_app",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://your-extension-id/"]
}
```

### **3.3 本地应用的 Python 代码**

本地应用可以是 Python 脚本：

```python
import sys
import json

def send_message(message):
    message_str = json.dumps(message)
    sys.stdout.write(message_str)
    sys.stdout.flush()

if __name__ == "__main__":
    data = sys.stdin.read()
    received_msg = json.loads(data)
    print("收到 Chrome 插件的消息:", received_msg)
    
    response = {"status": "ok", "data": "来自本地应用的响应"}
    send_message(response)
```

## **4. 总结**

- **`chrome.runtime.sendMessage`**：适用于 **一次性消息**，Popup、Options Page、Background 之间通信。
- **`chrome.tabs.sendMessage`**：用于 **Background 和 Content Script 通信**，支持向网页注入内容。
- **`chrome.runtime.connect`**：用于 **长期连接**，适用于持续传输数据。
- **`chrome.runtime.connectNative`**：用于 **插件和本地应用通信**，例如调用 Python、Node.js 程序。

理解这些通信机制，可以让你的 Chrome 插件更加灵活、强大！🚀
