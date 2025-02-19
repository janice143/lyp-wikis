# **第二章：Axios 安装与配置**

在使用 Axios 进行 HTTP 请求之前，我们需要先**安装 Axios 并进行基础配置**。Axios 支持 **浏览器端（如 React、Vue）** 和 **Node.js 服务器端**，可以设置 **默认全局配置、创建实例、添加拦截器** 来增强其功能。本章将介绍如何正确安装和配置 Axios，使其更加高效和灵活。

## **1. 安装 Axios**

### **1.1 在浏览器环境安装**

在前端项目（如 React、Vue、Angular）中，可以使用 npm 或 yarn 进行安装：

```bash
# 使用 npm 安装
npm install axios

# 或使用 yarn 安装
yarn add axios
```

安装完成后，可以在 **JavaScript / TypeScript 文件** 中导入：

```javascript
import axios from "axios";
```

✅ **浏览器兼容性**  
Axios 兼容所有现代浏览器（Chrome、Firefox、Edge、Safari），并支持 IE11+。

### **1.2 在 Node.js 服务器端安装**

Axios 也可以在 **Node.js 服务器端** 使用，安装方式与前端相同：

```bash
npm install axios
```

在 Node.js 代码中导入：

```javascript
const axios = require("axios");

axios.get("https://jsonplaceholder.typicode.com/posts")
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

✅ **Axios 在 Node.js 中的优势**

- **支持 HTTP/HTTPS 请求**
- **默认 JSON 解析**
- **自动处理 Cookies**
- **适用于后端 API 请求**

## **2. 配置 Axios**

Axios 提供了 **全局默认配置**，可以预设请求的 `baseURL`、`headers`、`timeout` 等参数，避免每次请求都手动设置。

### **2.1 配置全局默认值**

可以使用 `axios.defaults` 来设置 Axios **全局默认配置**：

```javascript
import axios from "axios";

// 配置全局默认值
axios.defaults.baseURL = "https://api.example.com";
axios.defaults.timeout = 5000; // 5 秒超时
axios.defaults.headers.common["Authorization"] = "Bearer token";
axios.defaults.headers.post["Content-Type"] = "application/json";
```

**解释：**

- `baseURL`：所有请求的默认基础 URL，避免重复书写 `https://api.example.com`
- `timeout`：超时时间（单位：ms），超过时间请求会自动取消
- `headers.common`：所有请求默认带上 `Authorization` 头部
- `headers.post`：指定 `POST` 请求的 `Content-Type`（默认 `application/json`）

### **2.2 创建 Axios 实例**

如果不同 API 需要不同的配置，建议使用 **Axios 实例**，避免污染全局配置。

```javascript
const apiClient = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000, // 10 秒超时
  headers: {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  }
});

// 使用实例发送请求
apiClient.get("/users")
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

✅ **优势**

- **避免修改全局 `axios.defaults`**
- **适用于不同 API（如 REST API、GraphQL）**
- **可独立配置拦截器，增强灵活性**

## **3. 配置 Axios 请求与响应拦截器**

### **3.1 请求拦截器**

请求拦截器可以在**请求发送前**进行**修改**，如：

- **添加认证 Token**
- **处理请求数据**
- **日志记录**

```javascript
axios.interceptors.request.use(
  config => {
    console.log("请求发送前:", config);
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```

✅ **拦截器的作用**

- **确保所有请求都携带 `Authorization` 头**
- **在请求前统一修改 `config`**
- **日志记录和调试**

### **3.2 响应拦截器**

响应拦截器可以：

- **统一处理返回的数据**
- **自动解析 JSON**
- **处理错误信息**

```javascript
axios.interceptors.response.use(
  response => {
    console.log("响应成功:", response);
    return response.data; // 直接返回 data，避免每次都 `response.data`
  },
  error => {
    console.error("请求失败:", error);
    if (error.response && error.response.status === 401) {
      alert("未授权，请重新登录");
    }
    return Promise.reject(error);
  }
);
```

✅ **拦截器的作用**

- **简化 `.then(res => res.data)` 的写法**
- **自动处理 401（未授权）错误**
- **统一错误提示**

## **4. 取消请求（可选）**

有时候需要 **取消未完成的请求**，避免浪费带宽。Axios 提供 `CancelToken` 机制来取消请求。

```javascript
const cancelToken = axios.CancelToken;
const source = cancelToken.source();

// 发起请求
axios.get("https://api.example.com/data", {
  cancelToken: source.token
})
.then(response => console.log(response.data))
.catch(error => {
  if (axios.isCancel(error)) {
    console.log("请求被取消:", error.message);
  } else {
    console.error(error);
  }
});

// 取消请求
source.cancel("手动取消请求");
```

✅ **适用场景**

- **用户切换页面时取消未完成的请求**
- **防止短时间内的重复请求（如搜索框输入）**

## **总结**

1️⃣ **安装 Axios**

- 在前端使用 `npm install axios`。
- 在 Node.js 服务器端使用 `require("axios")`。

2️⃣ **全局默认配置**

- 设置 `baseURL`、`timeout`、`headers` 等全局默认值。
- 适用于所有请求，减少代码重复。

3️⃣ **创建 Axios 实例**

- 避免全局污染，适用于不同 API 配置。

4️⃣ **使用拦截器**

- **请求拦截器**：在请求发送前修改请求，如添加 `Authorization`。
- **响应拦截器**：在返回数据前处理，如**自动解析 JSON**、**统一错误提示**。

5️⃣ **请求取消**

- 适用于页面切换、搜索框防抖等场景，避免不必要的请求。

✅ **下一章，我们将学习 Axios 的基础用法，包括 GET、POST、PUT、DELETE 请求！** 🚀
