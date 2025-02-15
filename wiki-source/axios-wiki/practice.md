# **第十三章：最佳实践与常见问题**

在使用 Axios 进行 API 请求时，良好的代码规范和优化策略可以**提高代码可维护性、提升用户体验、减少错误**。本章将介绍 **Axios 最佳实践，包括请求重试、超时设置、接口数据规范化、环境变量管理 API 地址**，并列出**常见问题与解决方案**。

---

## **1. 请求重试与超时设置**

### **1.1 设置请求超时**

如果 API 响应过慢，用户可能会一直等待，影响体验。可以使用 `timeout` 设置请求超时：

```javascript
axios.defaults.timeout = 5000; // 5秒超时
```

如果请求超时，会触发 `ECONNABORTED` 错误：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts", { timeout: 5000 })
  .catch(error => {
    if (error.code === "ECONNABORTED") {
      console.error("请求超时");
    }
  });
```

✅ **适用于**

- **后端接口不稳定，避免无限等待**
- **用户体验优化，超时后提供反馈**

---

### **1.2 请求失败自动重试**

如果 API **偶尔失败**（如服务器过载、网络抖动），可以**自动重试请求**：

```javascript
async function retryRequest(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.warn(`请求失败，重试次数 ${i + 1}/${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay)); // 等待 `delay` 毫秒
    }
  }
  throw new Error("请求失败，已达到最大重试次数");
}

retryRequest("https://jsonplaceholder.typicode.com/posts/1")
  .then(data => console.log("请求成功:", data))
  .catch(error => console.error(error.message));
```

✅ **适用于**

- **服务器不稳定，需要自动重试**
- **请求超时后重新尝试**

---

### **1.3 使用 `axios-retry` 进行自动重试**

可以使用 `axios-retry` 库简化自动重试逻辑：

```bash
npm install axios-retry
```

```javascript
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 3, // 最多重试 3 次
  retryDelay: (retryCount) => retryCount * 1000, // 每次重试延迟增加
  retryCondition: (error) => error.response?.status >= 500 // 仅重试 5xx 错误
});

axios.get("https://jsonplaceholder.typicode.com/posts/1")
  .then(response => console.log("请求成功:", response.data))
  .catch(error => console.error("请求失败:", error.message));
```

✅ **适用于**

- **API 服务偶尔不稳定**
- **希望减少手写重试逻辑**

---

## **2. 接口数据规范化**

### **2.1 统一 API 响应格式**

如果 API 返回数据格式不统一，前端代码可能会变得冗余。可以在 **响应拦截器** 里**规范化返回数据**：

```javascript
axios.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 200) {
      return response.data.data; // 只返回 `data`
    }
    return Promise.reject(response.data.msg); // 业务错误
  },
  error => Promise.reject(error)
);
```

✅ **适用于**

- **减少代码中 `response.data.data` 的嵌套**
- **统一处理后端 API 结构**

---

### **2.2 处理错误状态**

如果服务器返回 `4xx / 5xx` 错误，前端可以**拦截错误**，进行**友好提示**：

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        alert("未授权，请重新登录");
        window.location.href = "/login"; // 例如跳转到登录页
      } else if (status === 403) {
        alert("您没有权限访问此资源");
      } else if (status === 404) {
        alert("资源未找到");
      } else if (status >= 500) {
        alert("服务器内部错误，请稍后再试");
      }
    } else {
      alert("请求失败，可能是网络问题");
    }
    return Promise.reject(error);
  }
);
```

✅ **适用于**

- **避免每个 API 调用都需要写错误处理**
- **提供友好的错误提示**

---

## **3. 使用环境变量管理 API URL**

### **3.1 为什么使用环境变量？**

在不同的环境（开发/测试/生产）下，API 地址通常不同。可以使用 **环境变量** 管理 API URL，避免手动修改代码。

### **3.2 在 `.env` 文件中定义 API 地址**

在前端项目根目录下创建 `.env` 文件：

```ini
# 开发环境
VITE_API_BASE_URL=https://dev-api.example.com

# 生产环境
VITE_API_BASE_URL=https://api.example.com
```

### **3.3 在 Axios 中读取环境变量**

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 适用于 Vite
  timeout: 5000
});

api.get("/users")
  .then(response => console.log("用户数据:", response.data));
```

✅ **适用于**

- **避免硬编码 API 地址**
- **一键切换开发 / 生产环境**

---

## **4. 常见问题与解决方案**

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| **请求失败 (`ECONNABORTED`)** | 网络超时 | 设置 `timeout` 限制请求时间 |
| **401 未授权** | Token 过期 | 在拦截器中处理，跳转登录页 |
| **CORS 跨域问题** | 服务器未允许跨域 | 后端配置 `Access-Control-Allow-Origin` |
| **请求重复发送** | 用户多次点击 | 使用 `lodash.throttle()` 或 `pendingRequests` 记录请求 |
| **API 地址切换麻烦** | API URL 硬编码 | 使用 `.env` 进行环境变量管理 |
| **响应格式不统一** | 不同 API 返回结构不同 | 在 **拦截器** 里规范化数据 |

---

## **总结**

### **✅ 请求优化**

1️⃣ **设置 `timeout` 限制请求时间**  
2️⃣ **使用 `axios-retry` 进行自动重试**  

### **✅ 统一 API 响应格式**

3️⃣ **在拦截器里格式化数据**（减少 `response.data.data` 代码）  
4️⃣ **在拦截器里处理 `4xx/5xx` 错误**（减少重复错误处理逻辑）  

### **✅ 使用环境变量**

5️⃣ **使用 `.env` 管理 API 地址，方便环境切换**  

### **✅ 解决常见问题**

6️⃣ **CORS 问题：后端配置 `Access-Control-Allow-Origin`**  
7️⃣ **请求重复发送：使用 `throttle()` 进行节流**  

🚀 **下一章，我们将学习 Axios 进阶技巧，包括创建自定义实例、拦截器优化、封装 API 请求等！**
`
