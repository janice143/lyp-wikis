# **第一章：引言**

## **1.1 什么是 Axios？**

### **1.1.1 Axios 简介**

Axios 是一个基于 **Promise** 的 **HTTP 客户端库**，用于在 **浏览器** 和 **Node.js 服务器端** 发送 **HTTP 请求**。它提供了比 **原生 Fetch API** 更强大的功能，如：

- **请求和响应拦截器**
- **自动 JSON 解析**
- **超时控制**
- **取消请求**
- **跨浏览器兼容性**
- **更友好的错误处理**

Axios 适用于各种 Web 应用场景，包括：

- **前端页面向后端 API 发送数据**
- **获取远程资源（如 JSON 数据）**
- **与 GraphQL、REST API 交互**
- **处理跨域请求**

---

### **1.1.2 Axios vs Fetch：对比**

JavaScript 另一种发送 HTTP 请求的方式是 **Fetch API**，但 Axios 具有一些 Fetch API 不具备的优势。

| 特性 | Axios | Fetch API |
|------|-------|----------|
| **基于 Promise** | ✅ | ✅ |
| **默认自动 JSON 解析** | ✅ | ❌（需手动 `.json()` 解析） |
| **支持请求 & 响应拦截器** | ✅ | ❌ |
| **自动转换请求数据** | ✅ | ❌（需手动转换 `JSON.stringify(data)`) |
| **取消请求** | ✅（`CancelToken`） | ❌ |
| **超时控制** | ✅（`timeout`） | ❌（需手动 `AbortController`） |
| **错误处理** | ✅（更清晰的错误信息） | ❌（需要手动解析 `response.ok`） |
| **兼容性** | ✅（支持老旧浏览器） | ❌（IE 不支持） |

✅ **为什么选择 Axios？**

- 更易用，**默认 JSON 解析**，无需手动 `.json()`
- 提供 **拦截器**，可对请求和响应进行**统一处理**
- **更好的错误处理**，Fetch 仅在网络失败时抛出错误，Axios 任何 HTTP 状态异常都会抛错
- **支持请求取消（CancelToken）**，Fetch 需要 `AbortController`
- **跨浏览器兼容性更强**，支持 IE

---

## **1.2 Axios 的核心特性**

Axios 提供了一些 **核心功能**，使其在 HTTP 请求管理方面更加强大和灵活。

### **1.2.1 基于 Promise 的异步请求**

Axios 使用 **Promise** 处理异步 HTTP 请求：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts")
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

- `axios.get()` 返回 **Promise**
- 使用 `.then()` 处理**成功响应**
- 使用 `.catch()` 处理**错误**

---

### **1.2.2 请求和响应拦截器**

拦截器（Interceptors）是 Axios **最强大**的特性之一，它允许你在请求或响应被 `then/catch` 处理之前，**对其进行修改或拦截**。

#### **✅ 请求拦截器**

在请求发送前 **修改请求**（如添加 `Authorization` 头部）：

```javascript
axios.interceptors.request.use(config => {
  config.headers.Authorization = "Bearer token";
  return config;
});
```

#### **✅ 响应拦截器**

在请求响应后 **统一处理数据或错误**：

```javascript
axios.interceptors.response.use(response => {
  console.log("请求成功:", response);
  return response.data;
}, error => {
  console.error("请求失败:", error);
  return Promise.reject(error);
});
```

---

### **1.2.3 客户端支持与跨平台支持**

Axios **支持多种运行环境**：

- **浏览器环境**：适用于 React、Vue、Angular 等前端框架。
- **Node.js 服务器端**：可用于后端 API 请求（基于 `http` 模块）。

#### **✅ Axios 在浏览器端**

```javascript
axios.get("/user")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

- 适用于 **前端应用**，如 **React/Vue** 向后端请求数据。

#### **✅ Axios 在 Node.js 服务器端**

```javascript
const axios = require("axios");

axios.get("https://api.example.com/data")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

- 在 **Node.js 服务器端** 直接请求 API，无需 `fetch()`。

---

## **总结**

1️⃣ **Axios 是基于 Promise 的 HTTP 请求库**，比 `fetch()` 更强大。  
2️⃣ **Axios 具备更强的功能**：

- 自动 JSON 解析
- 请求和响应拦截器
- 支持取消请求、超时控制  
3️⃣ **Axios 可用于前端和 Node.js 服务器端**，是更灵活的 HTTP 客户端。

✅ 在下一章，我们将学习 **如何安装 Axios 并进行基础配置！** 🚀
