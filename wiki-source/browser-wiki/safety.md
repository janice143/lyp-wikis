# **第六章：浏览器安全**

随着 Web 应用的普及，浏览器安全成为开发者必须关注的重要领域。常见的安全风险包括 **跨站脚本攻击（XSS）**、**跨站请求伪造（CSRF）**、**同源策略（SOP）限制绕过**，以及 **CORS 机制和 CSP（内容安全策略）** 的正确配置。本章将详细解析这些安全机制，并提供最佳实践，帮助你构建安全的 Web 应用。

---

## **1. 跨站脚本攻击（XSS, Cross-Site Scripting）**

### **1.1 什么是 XSS？**

跨站脚本（XSS）是一种 **注入恶意 JavaScript 代码** 并在用户浏览器中执行的攻击方式。攻击者可以：

- 窃取用户 **Cookies**（会话劫持）。
- 伪造用户输入，进行 **键盘记录** 或 **钓鱼攻击**。
- 通过 DOM 操作 **篡改页面内容**。

### **1.2 XSS 类型**

#### **✅ 反射型 XSS（Reflected XSS）**

- 恶意代码通过 **URL 参数** 传递，并在 HTML 页面中直接返回。
- 需要**诱导用户点击**特定链接才能触发。

**示例**

```html
<script>
  document.write("Welcome, " + location.search.substring(1)); // 直接写入页面
</script>
```

**攻击者诱导 URL**

```
http://example.com/?<script>alert('XSS')</script>
```

#### **✅ 存储型 XSS（Stored XSS）**

- 恶意代码被**存储在数据库**，影响所有访问该页面的用户。
- 典型场景：**留言板、评论区、用户个人信息**。

**示例**
用户在评论框中提交：

```html
<script>document.cookie = document.domain</script>
```

下次有人访问该页面时，恶意脚本会执行。

#### **✅ DOM 型 XSS**

- 通过 JavaScript 操作 **DOM** 直接注入恶意代码，不涉及服务器。

**示例**

```javascript
let userInput = location.hash.substring(1);
document.getElementById("output").innerHTML = userInput; // 直接写入 DOM
```

### **1.3 XSS 防范措施**

✅ **过滤输入**

```javascript
function sanitize(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
```

✅ **使用 `textContent` 代替 `innerHTML`**

```javascript
element.textContent = userInput; // 避免解析 HTML
```

✅ **启用 Content Security Policy（CSP）**

```http
Content-Security-Policy: default-src 'self'
```

- **阻止外部 JavaScript 加载**，减少 XSS 攻击面。

---

## **2. 跨站请求伪造（CSRF, Cross-Site Request Forgery）**

### **2.1 什么是 CSRF？**

跨站请求伪造（CSRF）利用**用户已登录的身份，向服务器发起恶意请求**，通常用于：

- **更改用户密码**
- **盗取用户资金**
- **伪造操作（如点赞、关注）**

### **2.2 CSRF 攻击示例**

用户已登录 `bank.com`，攻击者诱导访问：

```html
<img src="https://bank.com/transfer?amount=1000&to=hacker" />
```

如果 `bank.com` 依赖 **Cookie 认证**，攻击者就能**在用户不知情的情况下转账**。

### **2.3 CSRF 防范措施**

✅ **方法 1：CSRF Token**

- 服务器为每个用户生成一个 **随机 Token**，提交请求时需要携带。

```html
<input type="hidden" name="csrf_token" value="random_token">
```

✅ **方法 2：SameSite Cookie**

- `SameSite` Cookie 允许限制 Cookie 只在**同源请求**时发送：

```http
Set-Cookie: session=abc123; SameSite=Strict
```

✅ **方法 3：Referer / Origin 头检查**

- 服务器检查 `Referer` 或 `Origin` 确保请求来自**合法站点**。

✅ **方法 4：使用 CORS 限制 API 访问**

- 仅允许信任的域名访问后端 API（见下一节 CORS）。

---

## **3. 同源策略（Same-Origin Policy, SOP）**

### **3.1 什么是同源策略？**

同源策略（SOP, Same-Origin Policy）是浏览器的 **安全机制**，用于防止**不同源的网页相互访问数据**，以防止**恶意网站窃取用户信息**。

### **3.2 什么是“同源”？**

必须满足 **协议、域名、端口** 完全相同：

| URL | 是否同源 | 说明 |
|-----|---------|------|
| `https://example.com` | ✅ | 完全相同 |
| `http://example.com` | ❌ | **协议不同**（HTTP vs HTTPS） |
| `https://api.example.com` | ❌ | **子域不同**（example.com vs api.example.com） |
| `https://example.com:8080` | ❌ | **端口不同**（443 vs 8080） |

### **3.3 SOP 影响**

**默认情况下**，以下操作会被 **SOP 限制**：

- **AJAX 跨域请求**
- **读取不同源的 Cookie / LocalStorage**
- **操作不同源的 DOM**

✅ **如何绕过 SOP？**

- **CORS 机制**（服务器允许跨域）
- **JSONP**（仅适用于 GET 请求，已过时）

---

## **4. CORS 机制（跨域资源共享）**

### **4.1 什么是 CORS？**

CORS（Cross-Origin Resource Sharing）允许**服务器声明哪些域名可以访问其资源**，解决浏览器 **跨域限制**。

### **4.2 CORS 头部示例**

服务器返回 `Access-Control-Allow-Origin`：

```http
Access-Control-Allow-Origin: https://trusted-site.com
```

表示**只有 `trusted-site.com` 可以访问该资源**。

---

### **4.3 CORS 预检请求**

对于 **非简单请求**（如 `PUT`、`DELETE`），浏览器会发送 **`OPTIONS` 预检请求**，服务器需要返回：

```http
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Origin: *
```

✅ **避免错误 CORS 配置**

- **不要使用 `Access-Control-Allow-Origin: *` 处理敏感 API**。
- **后端应验证 `Origin` 并只允许特定域名访问**。

---

## **5. Content Security Policy（CSP）**

### **5.1 什么是 CSP？**

CSP（内容安全策略）是**防止 XSS 和数据注入攻击**的浏览器安全机制。

### **5.2 CSP 配置**

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com
```

✅ **CSP 作用**

- **阻止外部 JavaScript 执行**
- **防止 `eval()` 代码执行**
- **限制 iframe 资源加载**

---

## **总结**

1️⃣ **XSS 攻击**：

- **过滤输入**，使用 `textContent` 而非 `innerHTML`。
- **启用 CSP，防止外部脚本执行**。

2️⃣ **CSRF 攻击**：

- **使用 CSRF Token** 进行身份验证。
- **设置 SameSite Cookie 限制跨站请求**。

3️⃣ **同源策略（SOP）**：

- **默认禁止跨域访问，保护用户数据**。

4️⃣ **CORS 机制**：

- **服务器必须配置 `Access-Control-Allow-Origin` 允许跨域**。

5️⃣ **CSP（内容安全策略）**：

- **限制 JavaScript 执行，减少 XSS 攻击面**。

✅ **良好的安全策略可以显著减少 Web 攻击风险！** 🚀
