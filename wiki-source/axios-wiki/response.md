# **第四章：Axios 响应处理**

在 Axios 中，**响应数据的处理**是开发过程中至关重要的一环。不同的 API 可能返回不同的数据格式，此外，还需要对 **HTTP 状态码进行分类处理**，包括 **成功状态（2xx）、客户端错误（4xx）、服务器错误（5xx）**。本章将详细介绍如何**正确解析 Axios 响应、处理不同类型的返回数据，并进行错误管理**。

## **1. 处理响应数据**

### **1.1 获取 Axios 响应信息**

Axios 的响应对象包含多个字段：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts/1")
  .then(response => {
    console.log("数据:", response.data);       // 响应数据
    console.log("状态码:", response.status);   // HTTP 状态码
    console.log("响应头:", response.headers); // HTTP 响应头
    console.log("请求配置:", response.config); // 请求配置
  })
  .catch(error => console.error(error));
```

✅ **Axios 响应对象结构**

```json
{
  "data": { ... },       // 服务器返回的数据
  "status": 200,         // HTTP 状态码
  "statusText": "OK",    // 状态描述
  "headers": { ... },    // HTTP 响应头
  "config": { ... },     // 请求的配置
  "request": { ... }     // 请求对象
}
```

| 属性 | 说明 |
|||
| `data` | 服务器返回的数据 |
| `status` | HTTP 状态码（如 `200 OK`, `404 Not Found`） |
| `headers` | 响应头 |
| `config` | 发送请求时的 Axios 配置 |
| `request` | 原始请求对象 |

✅ **使用示例**

```javascript
axios.get("https://api.example.com/data")
  .then(response => {
    if (response.status === 200) {
      console.log("请求成功:", response.data);
    }
  })
  .catch(error => console.error("请求失败:", error));
```

## **2. 处理不同的响应类型**

### **2.1 处理 JSON 数据**

默认情况下，Axios 会**自动解析 JSON 响应**，无需手动 `.json()`：

```javascript
axios.get("https://jsonplaceholder.typicode.com/users")
  .then(response => console.log(response.data)); // data 直接是 JSON 对象
```

### **2.2 处理文本数据**

有些 API 可能返回 **纯文本**，可以通过 `responseType: "text"` 指定：

```javascript
axios.get("https://example.com/textfile", { responseType: "text" })
  .then(response => console.log("文本数据:", response.data));
```

### **2.3 处理 Blob（二进制数据，如文件、图片）**

如果请求返回的是文件（如图片、PDF），可以使用 `responseType: "blob"` 处理：

```javascript
axios.get("https://example.com/image.jpg", { responseType: "blob" })
  .then(response => {
    const url = URL.createObjectURL(response.data);
    document.getElementById("image").src = url;
  });
```

✅ **适用于**

- 下载文件（PDF、Excel）
- 预览图片

## **3. 处理 HTTP 状态码**

### **3.1 常见 HTTP 状态码分类**

| 状态码 | 含义 | 处理方式 |
|--|||
| **2xx** | 请求成功 | 直接处理 `response.data` |
| **3xx** | 重定向 | 处理 `Location` 头或 `window.location.href` |
| **4xx** | 客户端错误 | 提示用户请求错误（如 `404 Not Found`） |
| **5xx** | 服务器错误 | 记录错误日志，提示服务器异常 |

### **3.2 处理 `2xx` 成功状态**

大部分情况下，`2xx` 表示请求成功：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts/1")
  .then(response => {
    if (response.status === 200) {
      console.log("数据:", response.data);
    }
  });
```

### **3.3 处理 `4xx` 客户端错误**

常见的 `4xx` 错误：

- **400 Bad Request**（请求格式错误）
- **401 Unauthorized**（未授权，需要重新登录）
- **403 Forbidden**（禁止访问）
- **404 Not Found**（资源不存在）

**示例：**

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts/9999")
  .catch(error => {
    if (error.response) {
      console.error("请求失败:", error.response.status);
      if (error.response.status === 404) {
        console.warn("资源未找到");
      } else if (error.response.status === 401) {
        alert("请先登录");
      }
    } else {
      console.error("网络错误:", error.message);
    }
  });
```

✅ **建议**

- `401 Unauthorized`：重定向到登录页
- `403 Forbidden`：提示用户权限不足
- `404 Not Found`：显示友好的 404 页面

### **3.4 处理 `5xx` 服务器错误**

常见的 `5xx` 错误：

- **500 Internal Server Error**
- **502 Bad Gateway**
- **503 Service Unavailable**

**示例：**

```javascript
axios.get("https://api.example.com/data")
  .catch(error => {
    if (error.response && error.response.status >= 500) {
      console.error("服务器错误:", error.response.status);
      alert("服务器繁忙，请稍后重试");
    }
  });
```

✅ **建议**

- **记录日志，排查后端错误**
- **友好的错误提示**
- **自动重试（如 503 服务器过载）**

## **4. 统一错误处理（响应拦截器）**

可以使用 **响应拦截器** 统一处理错误，避免每个请求都写 `.catch()` 代码：

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error("网络错误:", error.message);
      return Promise.reject("无法连接服务器");
    }
    
    const { status } = error.response;
    
    if (status === 401) {
      alert("未授权，请重新登录");
      window.location.href = "/login";
    } else if (status === 403) {
      alert("您没有权限执行此操作");
    } else if (status === 404) {
      console.warn("资源未找到");
    } else if (status >= 500) {
      alert("服务器错误，请稍后再试");
    }
    
    return Promise.reject(error);
  }
);
```

✅ **优势**

- **全局错误处理**
- **减少代码重复**
- **自动重定向到登录页**
- **统一错误提示**

## **总结**

1️⃣ **获取响应数据**

- `response.data`（返回数据）
- `response.status`（HTTP 状态码）
- `response.headers`（返回的 HTTP 头）

2️⃣ **处理不同的响应类型**

- **JSON**（默认）
- **纯文本**（`responseType: "text"`）
- **二进制文件（Blob）**（`responseType: "blob"`）

3️⃣ **处理 HTTP 状态码**

- **`2xx`（成功）**：直接解析数据。
- **`4xx`（客户端错误）**：
  - `401`：未授权，跳转登录页。
  - `403`：权限不足，提示用户。
  - `404`：资源不存在，友好提示。
- **`5xx`（服务器错误）**：友好提示 + 记录日志。

4️⃣ **统一错误处理**

- 通过 **响应拦截器** 处理常见错误，减少代码重复。

🚀 **下一章，我们将深入学习 Axios 并发请求、批量请求及高级配置！**
