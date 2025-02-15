# **第十二章：Axios 与安全性**

在前端开发中，**数据安全** 是非常重要的，特别是在使用 Axios 进行 HTTP 请求时，我们需要**防止数据泄露、确保用户身份认证、加密敏感信息**。本章将介绍 **如何加密请求数据、使用 JWT 进行身份认证、确保 API 请求的安全性**。

---

## **1. 请求数据加密**

### **1.1 为什么需要加密数据？**

在网络请求中，**敏感数据**（如密码、银行卡号、用户身份信息）如果直接发送，可能会被拦截或篡改。因此，常见的安全措施包括：

- **使用 HTTPS** 进行传输加密
- **在请求前对数据进行加密**
- **避免明文传输敏感信息**

---

### **1.2 使用 HTTPS 进行安全传输**

**HTTPS（超文本传输安全协议）** 使用 **SSL/TLS** 加密数据，防止**中间人攻击（MITM）**：

- **确保 API 服务器使用 HTTPS**
- **禁止使用 HTTP 请求传输敏感数据**
- **浏览器会拒绝从 HTTPS 页面向 HTTP 发送请求（混合内容问题）**

🚀 **最佳实践**

```javascript
axios.defaults.baseURL = "https://secure-api.example.com";
```

✅ **确保所有请求都使用 HTTPS 传输**

---

### **1.3 在请求中加密敏感数据**

如果后端需要**加密传输数据**，可以使用 **AES / RSA 加密** 保护数据。

#### **✅ 使用 CryptoJS 进行 AES 加密**

```bash
npm install crypto-js
```

```javascript
import CryptoJS from "crypto-js";

// 加密函数
function encryptData(data, secretKey) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

const secretKey = "my-secret-key"; // 后端和前端约定的密钥
const encryptedData = encryptData({ password: "123456" }, secretKey);

axios.post("https://api.example.com/login", { data: encryptedData })
  .then(response => console.log("登录成功:", response.data))
  .catch(error => console.error("请求失败:", error));
```

✅ **适用于**

- **防止密码明文传输**
- **保证数据的安全性**

---

## **2. 认证与授权**

### **2.1 使用 JWT 进行身份认证**

**JWT（JSON Web Token）** 是前端最常用的身份认证方式。用户登录后，服务器返回一个 **Token**，前端在后续请求中携带 Token，服务器验证后返回数据。

✅ **JWT 认证流程**

1. **用户登录**
2. **服务器返回 JWT Token**
3. **前端存储 Token（`localStorage` / `sessionStorage` / `cookie`）**
4. **每次请求 API 时，携带 Token 进行身份认证**
5. **服务器校验 Token，返回数据**

---

### **2.2 在 Axios 请求中自动附加 Token**

#### **✅ 存储 Token**

```javascript
localStorage.setItem("token", "your-jwt-token");
```

#### **✅ 在请求头中添加 Token**

```javascript
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

✅ **适用于**

- **API 需要身份验证**
- **用户操作需要鉴权**

---

### **2.3 处理 Token 过期**

JWT Token 可能会过期，服务器通常返回 **401 Unauthorized**。可以在 **响应拦截器** 里处理：

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      alert("登录状态已过期，请重新登录");
      window.location.href = "/login"; // 重定向到登录页
    }
    return Promise.reject(error);
  }
);
```

✅ **适用于**

- **自动处理 Token 失效**
- **避免每个 API 请求都需要检查 Token**

---

## **3. 防止 CSRF（跨站请求伪造）**

### **3.1 什么是 CSRF？**

CSRF（Cross-Site Request Forgery）攻击，指的是**攻击者伪造用户请求，执行未授权的操作**。

✅ **常见的 CSRF 保护措施**

- **后端验证 `Referer` 头**
- **前端请求时携带 CSRF Token**
- **后端校验 CSRF Token**

---

### **3.2 在请求中携带 CSRF Token**

CSRF Token 通常存储在 **Cookie**，前端需要在请求时携带：

```javascript
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-CSRF-Token"] = getCsrfToken(); // 从 Cookie 读取 Token
```

✅ **适用于**

- **表单提交**
- **需要防止 CSRF 攻击的 API**

---

## **4. 保护 API 免受 XSS 攻击**

### **4.1 什么是 XSS？**

XSS（跨站脚本攻击）指的是**恶意用户在输入框中插入 JavaScript 代码，导致代码被执行**。

🚀 **示例：恶意代码**

```html
<input type="text" value="<script>alert('XSS 攻击');</script>">
```

🚀 **后端应该返回**

```json
{"message": "&lt;script&gt;alert('XSS 攻击');&lt;/script&gt;"}
```

---

### **4.2 在前端过滤用户输入**

在提交数据之前，**对输入进行 HTML 转义**：

```javascript
function sanitizeInput(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const safeData = sanitizeInput("<script>alert('XSS');</script>");
console.log(safeData); // &lt;script&gt;alert('XSS');&lt;/script&gt;
```

✅ **适用于**

- **用户输入的文本**
- **富文本编辑器中的内容**

---

## **总结**

### **✅ 请求加密**

1️⃣ **使用 HTTPS 传输数据**（避免明文传输）  
2️⃣ **使用 AES 加密敏感数据**（防止拦截）  

### **✅ 认证与授权**

3️⃣ **JWT 认证：前端存储 Token 并在请求头中携带**  
4️⃣ **Token 过期自动处理（拦截器返回 401 重定向登录页）**  

### **✅ CSRF 与 XSS 保护**

5️⃣ **在请求头中携带 CSRF Token**  
6️⃣ **防止 XSS 攻击：对用户输入进行 HTML 转义**  

🚀 **在下一章，我们将学习 Axios 的最佳实践，包括封装 API 请求、日志管理、全局错误处理等技巧！**
