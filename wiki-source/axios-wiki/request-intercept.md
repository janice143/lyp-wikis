# **第六章：Axios 与请求拦截器**

请求拦截器（Request Interceptors）是 Axios 提供的一种强大功能，可以在请求发送**之前**对请求进行预处理，比如：

- **自动附加身份认证 Token**
- **统一设置请求头**
- **处理请求参数**
- **日志记录**
- **请求节流**

使用请求拦截器，可以避免在每个请求中手动添加相同的配置，使代码更加**简洁、可维护**。

## **1. 使用请求拦截器**

### **1.1 基本使用**

Axios 允许使用 `axios.interceptors.request.use()` 注册一个**全局请求拦截器**，该拦截器会在 **每个请求发送之前执行**。

**示例：给每个请求添加 `Authorization` 头**

```javascript
import axios from "axios";

axios.interceptors.request.use(
  config => {
    console.log("拦截请求:", config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.get("https://jsonplaceholder.typicode.com/posts/1")
  .then(response => console.log("响应数据:", response.data))
  .catch(error => console.error("请求失败:", error));
```

✅ **作用**

- `config` 是请求的**配置对象**
- 可以**修改请求配置**（如添加 `headers`）
- 任何 `return config` 之外的异常都会进入 `error` 回调

### **1.2 统一附加身份认证 Token（JWT）**

在**需要身份验证的 API**（如后端 RESTful API）中，我们通常需要在请求头中添加 `Authorization` 令牌（JWT）。

**示例：在所有请求中添加 `Authorization` 头**

```javascript
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token"); // 从 localStorage 读取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```

✅ **作用**

- **自动携带 Token**，避免在每个请求中重复添加
- **确保用户身份验证**，适用于所有需要认证的 API

### **1.3 处理请求参数**

有时候，我们需要**统一转换请求数据**，比如：

- 发送表单时，将 `JSON` 转换为 `x-www-form-urlencoded`
- 统一格式化请求参数

**示例：自动转换 `POST` 请求数据**

```javascript
import qs from "qs"; // 安装 qs: npm install qs

axios.interceptors.request.use(
  config => {
    if (config.method === "post" && config.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      config.data = qs.stringify(config.data); // 转换数据格式
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.post("https://api.example.com/login", { username: "admin", password: "123456" }, {
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
})
.then(response => console.log("登录成功:", response.data))
.catch(error => console.error("请求失败:", error));
```

✅ **作用**

- 统一转换 `POST` 请求的数据格式
- 避免每次都手动 `qs.stringify()`

## **2. 请求拦截器的常见场景**

### **2.1 自动附加 Token**

我们通常会在 `localStorage` 或 `sessionStorage` 中存储用户的 JWT Token：

```javascript
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

✅ **适用于**

- 需要用户登录的 API
- 需要 **OAuth 认证** 的 API

### **2.2 记录请求日志**

可以在拦截器中**打印所有请求信息**，用于调试：

```javascript
axios.interceptors.request.use(config => {
  console.log(`发送请求: ${config.method.toUpperCase()} ${config.url}`, config);
  return config;
});
```

✅ **适用于**

- 调试 API 请求
- 记录 API 日志，方便排查错误

### **2.3 统一添加公共请求参数**

例如，在所有请求中自动添加 `lang=zh-CN` 参数：

```javascript
axios.interceptors.request.use(config => {
  if (!config.params) {
    config.params = {};
  }
  config.params.lang = "zh-CN"; // 默认请求语言
  return config;
});
```

✅ **适用于**

- 需要**统一添加某个参数**（如语言 `lang`、API 版本 `v=1.0`）

### **2.4 限制请求频率（防止短时间内重复请求）**

如果用户在短时间内重复点击按钮，我们可以**节流请求**，避免浪费资源：

```javascript
let isRequesting = false;

axios.interceptors.request.use(config => {
  if (isRequesting) {
    return Promise.reject("请求过快，请稍后再试");
  }
  isRequesting = true;
  setTimeout(() => isRequesting = false, 1000); // 1秒内不能重复请求
  return config;
});
```

✅ **适用于**

- 防止用户短时间内连续点击按钮，造成重复请求
- 避免 API 短时间内被滥用

### **2.5 处理超时自动重试**

有时请求可能会超时，我们可以**自动重试**：

```javascript
axios.interceptors.request.use(
  async config => {
    let retries = 3; // 设置最大重试次数
    while (retries--) {
      try {
        return await axios(config);
      } catch (error) {
        if (retries === 0) throw error;
      }
    }
  },
  error => Promise.reject(error)
);
```

✅ **适用于**

- **请求失败后自动重试**，提高请求成功率
- **网络不稳定时的请求优化**

## **3. 解除请求拦截器**

有些情况下，我们可能需要**移除某个拦截器**：

```javascript
const myInterceptor = axios.interceptors.request.use(config => {
  console.log("拦截请求:", config);
  return config;
});

// 取消拦截器
axios.interceptors.request.eject(myInterceptor);
```

✅ **适用于**

- 只想拦截**特定 API 请求**
- 运行时需要**动态移除拦截**

## **总结**

### **✅ Axios 请求拦截器的作用**

1️⃣ **自动附加 Token**（适用于需要身份认证的 API）  
2️⃣ **统一处理请求参数**（转换 JSON、格式化参数）  
3️⃣ **记录日志**（打印请求信息，方便调试）  
4️⃣ **添加公共请求参数**（如 `lang=zh-CN`）  
5️⃣ **限制请求频率**（防止重复提交，优化用户体验）  
6️⃣ **超时自动重试**（提高请求成功率）  

### **✅ 最佳实践**

- **避免在业务代码中重复写 Token 逻辑，使用拦截器全局处理**
- **拦截器应当简洁高效，不要执行复杂逻辑**
- **尽可能减少副作用，避免不必要的全局修改**

🚀 **在下一章，我们将深入学习 Axios 响应拦截器，处理响应数据、错误处理、自动重试等！**
