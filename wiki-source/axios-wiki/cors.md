# **第九章：Axios 与跨域请求（CORS）**

在使用 Axios 进行 API 请求时，可能会遇到 **跨域请求（CORS）问题**。如果后端服务器未正确配置 CORS 规则，浏览器会拒绝请求。本章将介绍 **CORS 的概念、常见问题、解决方案**，并提供 **Axios 处理跨域的最佳实践**。

## **1. 跨域请求概念**

### **1.1 什么是 CORS？**

CORS（Cross-Origin Resource Sharing，跨源资源共享）是一种浏览器**安全策略**，用于限制网页从**不同源**获取资源，以防止恶意网站窃取用户数据。

**同源策略（Same-Origin Policy）** 规定：
**协议、域名、端口必须一致**，否则浏览器会拦截请求。

| 请求来源 | 目标服务器 | 是否跨域 |
|-||--|
| `https://example.com` | `https://example.com/api` | ❌ 不跨域 |
| `https://example.com` | `https://api.example.com` | ✅ 跨域 |
| `http://example.com` | `https://example.com` | ✅ 跨域（协议不同） |
| `https://example.com:3000` | `https://example.com:8080` | ✅ 跨域（端口不同） |

### **1.2 CORS 机制**

当浏览器检测到跨域请求时，它会向服务器发送 **预检请求（Preflight Request）**：

- **`OPTIONS` 预检请求**
- 服务器必须返回 **`Access-Control-Allow-Origin` 头**
- 浏览器决定是否允许访问

✅ **示例：后端允许所有来源**

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## **2. 解决跨域问题**

### **2.1 服务器端配置 CORS**

最佳解决方案是让**后端服务器**支持跨域，正确返回 CORS 头。

✅ **Node.js（Express）**

```javascript
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // 允许所有跨域请求
app.use(express.json());

app.get("/api/data", (req, res) => {
  res.json({ message: "跨域请求成功！" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

✅ **Java（Spring Boot）**

```java
@CrossOrigin(origins = "*")
@RestController
public class ApiController {
    @GetMapping("/api/data")
    public ResponseEntity<String> getData() {
        return ResponseEntity.ok("跨域请求成功！");
    }
}
```

✅ **Nginx 配置**

```nginx
location /api/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET, POST, OPTIONS;
    add_header Access-Control-Allow-Headers Content-Type, Authorization;
}
```

### **2.2 使用代理解决跨域**

如果无法修改后端代码，可以在**前端开发环境**使用 **代理服务器**，使请求看起来是同源的。

✅ **方法 1：Vue / React 开发环境（配置 Webpack 代理）**
在 `vue.config.js` 或 `webpack.config.js` 中添加：

```javascript
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://api.example.com", // 目标服务器
        changeOrigin: true,
        pathRewrite: { "^/api": "" }
      }
    }
  }
};
```

这样，前端代码可以直接使用：

```javascript
axios.get("/api/data") // 实际会请求 `https://api.example.com/data`
  .then(response => console.log(response.data));
```

✅ **方法 2：Node.js 代理服务器**

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const app = express();

app.use("/api", createProxyMiddleware({
  target: "https://api.example.com",
  changeOrigin: true
}));

app.listen(3000, () => console.log("Proxy server running on port 3000"));
```

前端可以请求 `http://localhost:3000/api`，代理服务器会转发到 `https://api.example.com/api`，避免跨域问题。

### **2.3 Axios 配置请求头**

如果服务器已经支持 CORS，但仍然报错，可能是**请求头不匹配**，可以手动添加 `headers`：

```javascript
axios.get("https://api.example.com/data", {
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  }
})
.then(response => console.log("数据:", response.data))
.catch(error => console.error("请求失败:", error));
```

✅ **常见问题**

- **服务器未返回 `Access-Control-Allow-Headers`** → 需要后端允许 `Authorization`
- **`OPTIONS` 预检失败** → 服务器需要支持 `OPTIONS` 请求

## **3. 跨域配置示例**

### **3.1 服务器端返回 `Access-Control-Allow-Origin`**

后端服务器需要正确返回 **CORS 头**：

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### **3.2 Axios 配置跨域请求**

前端 Axios 需要正确配置 **`withCredentials`** 选项，确保发送 Cookies：

```javascript
axios.get("https://api.example.com/data", { withCredentials: true })
  .then(response => console.log("数据:", response.data))
  .catch(error => console.error("请求失败:", error));
```

✅ **适用于**

- **服务器需要身份验证（Cookies）**
- **后端已配置 `Access-Control-Allow-Credentials: true`**

### **3.3 使用 JSONP 作为跨域解决方案（已过时）**

JSONP（JSON with Padding）是早期的跨域方案，适用于 **GET 请求**：

```html
<script>
  function handleData(data) {
    console.log("JSONP 响应:", data);
  }
</script>
<script src="https://api.example.com/data?callback=handleData"></script>
```

✅ **缺点**

- **只能用于 `GET` 请求**
- **安全性较低**
- **现代 API 已不推荐**

## **总结**

### **✅ CORS 概念**

- **浏览器限制跨域请求，必须由服务器允许**
- **同源：协议、域名、端口必须相同**
- **跨域：不同域名/端口/协议的请求**

### **✅ 解决跨域问题**

1️⃣ **后端正确配置 CORS**

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

2️⃣ **前端使用代理**

- **Vue/React** 开发时使用 Webpack 代理
- **Node.js 代理服务器** 转发请求

3️⃣ **Axios 头部配置**

- 手动添加 `Content-Type`
- 需要 Cookies 时启用 `withCredentials: true`

4️⃣ **JSONP**

- 仅适用于 `GET` 请求（**已过时**）

🚀 **在下一章，我们将学习 Axios 的全局配置与自定义实例，让请求管理更加高效！**
