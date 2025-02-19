# **第七章：Axios 与响应拦截器**

在使用 Axios 进行 HTTP 请求时，后端返回的响应数据可能包含 **状态码、错误信息、数据结构** 等，通常需要进行**统一处理**。  
**响应拦截器（Response Interceptors）** 允许我们在数据到达 `.then()` 或 `.catch()` 之前，对其进行**预处理、格式化、错误捕获**等操作。

## **1. 使用响应拦截器**

### **1.1 基本使用**

Axios 提供 `axios.interceptors.response.use()` 方法，在响应到达 `.then()` 之前拦截并处理。

```javascript
axios.interceptors.response.use(
  response => {
    console.log("拦截到响应:", response);
    return response; // 必须返回响应，否则调用链会中断
  },
  error => {
    console.error("请求失败:", error);
    return Promise.reject(error); // 继续抛出错误，进入 `.catch()`
  }
);
```

✅ **作用**

- **`response` 回调**：处理成功的响应
- **`error` 回调**：处理失败的请求（如 404、500）

### **1.2 统一格式化响应数据**

后端返回的数据结构可能不一致，我们可以在拦截器里**格式化数据**，让业务代码更简单：

```javascript
axios.interceptors.response.use(
  response => {
    return response.data; // 直接返回 `data`，业务代码无需 `response.data`
  },
  error => {
    return Promise.reject(error);
  }
);
```

✅ **前后对比**
**❌ 不使用拦截器**

```javascript
axios.get("/api/user")
  .then(response => console.log(response.data)) // 需要手动 `.data`
  .catch(error => console.error(error));
```

**✅ 使用拦截器**

```javascript
axios.get("/api/user")
  .then(data => console.log(data)) // 直接返回 `data`
  .catch(error => console.error(error));
```

🚀 **简化业务代码，让数据更易读！**

## **2. 错误响应的统一处理**

### **2.1 处理不同的 HTTP 状态码**

后端返回的 **4xx/5xx** 状态码通常代表请求失败，需要在拦截器里**集中处理**：

```javascript
axios.interceptors.response.use(
  response => response.data,
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
    } else if (error.request) {
      alert("请求失败，可能是网络问题");
    } else {
      console.error("请求错误:", error.message);
    }

    return Promise.reject(error);
  }
);
```

✅ **作用**

- **401：未授权，跳转登录页**
- **403：权限不足，提示用户**
- **404：资源不存在，弹出提示**
- **500+：服务器错误，友好提示**
- **网络错误：检测 `error.request`，提示用户检查网络**

### **2.2 统一错误日志**

在拦截器中**记录错误日志**，方便调试：

```javascript
axios.interceptors.response.use(
  response => response.data,
  error => {
    console.error("请求错误:", {
      url: error.config.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);
```

✅ **作用**

- **每个请求失败都会自动记录错误**
- **适用于 API 监控或错误分析**

## **3. 响应拦截器的常见场景**

### **3.1 在响应数据到达前修改格式**

有些后端返回的数据结构层级较深，例如：

```json
{
  "code": 200,
  "msg": "success",
  "data": { "id": 1, "name": "张三" }
}
```

我们可以用拦截器 **提取 `data`**，让代码更简洁：

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

✅ **优势**

- **返回的数据直接是业务需要的格式**
- **避免业务代码里 `response.data.data` 的嵌套问题**

### **3.2 处理请求超时**

如果请求超时，我们可以在拦截器里**捕获超时错误**：

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.code === "ECONNABORTED") {
      alert("请求超时，请稍后重试");
    }
    return Promise.reject(error);
  }
);
```

✅ **适用于**

- **后端响应慢，避免用户长时间等待**
- **配合自动重试机制，提升体验**

### **3.3 失败请求自动重试**

对于**不稳定的网络**，可以**自动重试请求**：

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (!config || !config.retry) return Promise.reject(error);

    config.retry -= 1; // 递减重试次数
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒后重试
    return axios(config);
  }
);

// 设置全局请求重试次数
axios.defaults.retry = 3;
```

✅ **适用于**

- **API 不稳定，防止偶尔的请求失败**
- **提升用户体验，减少失败请求率**

## **4. 解除响应拦截器**

如果某个拦截器不再需要，可以手动移除：

```javascript
const myInterceptor = axios.interceptors.response.use(response => response);
axios.interceptors.response.eject(myInterceptor);
```

✅ **适用于**

- **临时性拦截，不影响全局行为**

## **总结**

### **✅ 响应拦截器的作用**

1️⃣ **格式化响应数据**

- 直接返回 `data`，简化业务代码
- 过滤无关信息，提升数据可读性

2️⃣ **统一错误处理**

- 处理 **401（未授权）、403（权限不足）、404（资源不存在）、500（服务器错误）**
- 网络错误提示，避免 API 失败影响用户体验

3️⃣ **自动重试**

- 适用于**不稳定的网络**
- 防止偶尔的请求失败

4️⃣ **请求超时处理**

- 检测 **ECONNABORTED**
- 提示用户 **“请求超时，请稍后重试”**

🚀 **在下一章，我们将学习 Axios 的高级配置，包括全局配置、自定义实例等！**
