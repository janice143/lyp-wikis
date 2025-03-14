### **Chrome Extension 高级功能开发**

Chrome Extension 不仅可以扩展浏览器功能，还能执行高级操作，如 **拦截网络请求、自动化网页交互、管理 Cookies、修改书签与历史记录、增强页面 UI、身份认证** 等。本文介绍这些高级功能的实现方法。

## **1. 捕获与修改网页请求**

Chrome 提供 `chrome.webRequest` API 来拦截和修改网络请求，可用于 **广告拦截、隐私保护、修改请求头等**。

> **注意**：在 Manifest V3 中，`webRequestBlocking` 被 `declarativeNetRequest` 替代，仅限企业扩展继续使用。

### **1.1 `chrome.webRequest` 拦截请求**

在 `manifest.json` 里声明权限：

```json
{
  "permissions": ["webRequest", "webRequestBlocking", "webRequestFilter", "<all_urls>"]
}
```

示例：拦截所有请求并打印 URL：

```javascript
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        console.log("拦截请求:", details.url);
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
```

### **1.2 修改请求 Headers**

可以在请求发送前修改 Headers，如 **添加 Token**：

```javascript
chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        details.requestHeaders.push({
            name: "Authorization",
            value: "Bearer YOUR_ACCESS_TOKEN"
        });
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["https://api.example.com/*"] },
    ["blocking", "requestHeaders"]
);
```

## **2. 自动化浏览器操作**

`chrome.scripting.executeScript` 允许插件 **在网页上执行 JavaScript 代码**，用于 **模拟点击、输入等交互**。

### **2.1 插入 JavaScript 并修改页面**

```javascript
chrome.scripting.executeScript({
    target: { allFrames: true },
    function: () => document.body.style.backgroundColor = "lightblue"
});
```

### **2.2 自动填写表单**

```javascript
chrome.scripting.executeScript({
    target: { allFrames: true },
    function: () => {
        document.querySelector("input[name='username']").value = "test_user";
        document.querySelector("input[name='password']").value = "password123";
    }
});
```

### **2.3 模拟点击**

```javascript
chrome.scripting.executeScript({
    target: { allFrames: true },
    function: () => {
        document.querySelector("button#submit").click();
    }
});
```

## **3. Cookies 与会话管理**

`chrome.cookies` API 允许插件 **读取、修改和删除 Cookies**。

### **3.1 读取 Cookies**

```javascript
chrome.cookies.getAll({ domain: "example.com" }, (cookies) => {
    console.log("Cookies:", cookies);
});
```

### **3.2 设置 Cookies**

```javascript
chrome.cookies.set({
    url: "https://example.com",
    name: "user_token",
    value: "abcd1234",
    expirationDate: Math.floor(Date.now() / 1000) + 3600
});
```

### **3.3 删除 Cookies**

```javascript
chrome.cookies.remove({ url: "https://example.com", name: "user_token" });
```

## **4. 书签与历史管理**

插件可以通过 `chrome.bookmarks` 和 `chrome.history` API 读取、添加或删除书签和历史记录。

### **4.1 书签管理**

#### **获取所有书签**

```javascript
chrome.bookmarks.getTree((bookmarks) => {
    console.log("书签:", bookmarks);
});
```

#### **添加书签**

```javascript
chrome.bookmarks.create({
    title: "My Bookmark",
    url: "https://example.com"
});
```

#### **删除书签**

```javascript
chrome.bookmarks.remove("BOOKMARK_ID");
```

### **4.2 历史管理**

#### **获取最近访问记录**

```javascript
chrome.history.search({ text: "", maxResults: 10 }, (historyItems) => {
    console.log("历史记录:", historyItems);
});
```

#### **删除历史记录**

```javascript
chrome.history.deleteUrl({ url: "https://example.com" });
```

## **5. 页面 UI 增强**

插件可以通过 `content_scripts` 注入 **自定义按钮、修改 CSS、增加功能控件**。

### **5.1 在网页上插入按钮**

```javascript
let button = document.createElement("button");
button.innerText = "点击我";
button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
document.body.appendChild(button);
```

### **5.2 修改网页 CSS**

```javascript
let style = document.createElement("style");
style.innerHTML = "body { font-size: 18px; color: red; }";
document.head.appendChild(style);
```

## **6. 身份认证**

某些插件需要访问用户账户，如 **Google API、GitHub API**，需要使用 OAuth 进行身份验证。

### **6.1 OAuth 认证流程**

**步骤**

1. **申请 OAuth 客户端 ID**（Google、GitHub 等）
2. **在 `manifest.json` 声明 OAuth 权限**
3. **在后台脚本发起认证**
4. **用户授权后获取 Access Token**

### **6.2 Google OAuth 认证**

**声明权限**

```json
{
  "oauth2": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "scopes": ["https://www.googleapis.com/auth/userinfo.profile"]
  }
}
```

**示例：打开 Google 认证**

```javascript
chrome.identity.getAuthToken({ interactive: true }, (token) => {
    console.log("OAuth 令牌:", token);
});
```

### **6.3 访问 Google API**

```javascript
fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
    headers: { Authorization: `Bearer ${token}` }
})
.then(response => response.json())
.then(user => console.log("用户信息:", user));
```

## **7. 总结**

| 功能 | API | 说明 |
|------|-----|------|
| **捕获网页请求** | `chrome.webRequest` | 修改 HTTP 请求 Headers |
| **自动化浏览器** | `chrome.scripting.executeScript` | 填写表单、模拟点击 |
| **Cookies 管理** | `chrome.cookies` | 读取、修改、删除 Cookies |
| **书签管理** | `chrome.bookmarks` | 获取、添加、删除书签 |
| **历史记录管理** | `chrome.history` | 获取、删除浏览记录 |
| **页面 UI 增强** | DOM 操作 | 插入按钮、修改 CSS |
| **身份认证** | `chrome.identity.getAuthToken` | OAuth 访问 Google API |

这些功能可以让 Chrome Extension 拥有更丰富的交互能力。你可以根据实际需求，组合不同 API，开发出强大且实用的插件！🚀
