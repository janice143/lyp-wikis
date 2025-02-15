# **第八章：错误处理与重试机制**

在使用 Axios 进行网络请求时，错误是不可避免的。错误可能来自：

- **网络错误**（如断网、服务器崩溃）
- **请求超时**（后端响应过慢）
- **HTTP 响应错误**（如 `404 Not Found`、`500 Internal Server Error`）
- **取消请求**（如用户切换页面时取消请求）

本章将介绍如何**捕获错误、区分错误类型、实现请求重试**，并**处理超时与请求取消**，提高 Axios 的健壮性。

---

## **1. 请求错误处理**

### **1.1 捕获不同类型的错误**

Axios 的 `.catch()` 可以捕获所有请求错误，但我们需要**区分不同的错误类型**：

```javascript
axios.get("https://jsonplaceholder.typicode.com/invalid-url")
  .then(response => console.log("数据:", response.data))
  .catch(error => {
    if (error.response) {
      // 服务器返回错误响应
      console.error("HTTP 错误:", error.response.status);
    } else if (error.request) {
      // 请求已发送，但未收到响应
      console.error("请求未收到响应:", error.request);
    } else {
      // 其他错误（如代码错误）
      console.error("请求设置错误:", error.message);
    }
  });
```

✅ **错误类型**

| 错误类型 | 说明 | 解决方案 |
|----------|------|---------|
| `error.response` | 服务器返回 **4xx/5xx** 错误 | 统一错误提示 |
| `error.request` | 请求已发出，但未收到响应 | 检查网络或服务器状态 |
| `error.message` | 代码错误，如 URL 拼写错误 | 修正代码逻辑 |

---

### **1.2 使用 `axios.isAxiosError()`**

Axios 提供了 `axios.isAxiosError()` 方法，确保错误是由 Axios 触发的：

```javascript
axios.get("https://api.example.com/data")
  .catch(error => {
    if (axios.isAxiosError(error)) {
      console.error("Axios 错误:", error.message);
    } else {
      console.error("未知错误:", error);
    }
  });
```

✅ **适用于**

- **区分 Axios 错误与其他代码错误**
- **避免误判非 Axios 相关的异常**

---

## **2. 重试请求机制**

### **2.1 失败自动重试**

网络可能偶尔波动，我们可以**在失败后自动重试请求**：

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

✅ **特点**

- **支持最大重试次数**
- **每次失败后等待 `delay` 毫秒**
- **如果重试仍然失败，抛出错误**

---

### **2.2 使用 `axios-retry` 实现自动重试**

可以使用 `axios-retry` 库简化重试逻辑：

```bash
npm install axios-retry
```

**示例：**

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

✅ **优点**

- **支持按状态码判断是否重试**
- **支持指数级延迟（避免频繁请求）**
- **适用于 API 服务偶尔不稳定的情况**

---

## **3. 处理超时与取消请求**

### **3.1 设置请求超时**

默认情况下，Axios **不会超时**，如果后端响应过慢，可能导致用户一直等待。我们可以设置 `timeout` 参数：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts", { timeout: 5000 }) // 5秒超时
  .then(response => console.log("数据:", response.data))
  .catch(error => {
    if (error.code === "ECONNABORTED") {
      console.error("请求超时");
    } else {
      console.error("请求失败:", error);
    }
  });
```

✅ **适用于**

- **限制请求时间，避免长时间等待**
- **防止无响应的 API 影响用户体验**

---

### **3.2 取消请求（如用户切换页面）**

如果用户切换页面，我们可以**取消正在进行的请求**，避免不必要的网络消耗。

#### **✅ 使用 `AbortController`（推荐）**

Axios 现在支持 `AbortController` 来取消请求：

```javascript
const controller = new AbortController();

axios.get("https://jsonplaceholder.typicode.com/posts", { signal: controller.signal })
  .then(response => console.log("数据:", response.data))
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log("请求被取消:", error.message);
    }
  });

// 取消请求
setTimeout(() => {
  controller.abort();
  console.log("请求已取消");
}, 2000);
```

✅ **适用于**

- **用户离开页面时取消未完成请求**
- **防止短时间内重复请求（如搜索防抖）**

---

### **3.3 旧版 `CancelToken`（已废弃）**

Axios 旧版使用 `CancelToken` 来取消请求：

```javascript
const source = axios.CancelToken.source();

axios.get("https://jsonplaceholder.typicode.com/posts", { cancelToken: source.token })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log("请求被取消:", error.message);
    }
  });

setTimeout(() => {
  source.cancel("用户离开页面，取消请求");
}, 2000);
```

✅ **已废弃，建议使用 `AbortController`**。

---

## **总结**

### **✅ Axios 错误处理**

1️⃣ **区分不同错误类型**

- `error.response`（服务器错误，如 `404 Not Found`）
- `error.request`（网络错误）
- `error.message`（Axios 内部错误）

2️⃣ **失败请求自动重试**

- 使用 `async/await` 进行手动重试
- 使用 `axios-retry` 进行自动重试

3️⃣ **请求超时**

- 设置 `timeout` 限制请求时间
- `error.code === "ECONNABORTED"` 处理超时错误

4️⃣ **取消请求**

- **推荐：`AbortController`**
- **避免用户切换页面时仍在发送无效请求**

🚀 **下一章，我们将学习 Axios 的全局配置与实例化，让 Axios 更加灵活高效！**
