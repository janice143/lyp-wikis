# **第二章：从 URL 到页面呈现**

当用户在浏览器中输入 **URL（Uniform Resource Locator）** 并按下回车后，浏览器会经历 **DNS 解析、TCP 连接、HTTP 请求、页面渲染** 等多个阶段，最终将网页呈现在用户面前。本章将详细解析整个流程，包括 **缓存优化、协议优化、网络连接建立** 等关键点。

---

## **1. 用户输入 URL**

浏览器的首要任务是解析用户输入的内容，并决定如何处理：

- **直接输入 URL**（如 `https://www.example.com`）➡ 进行 DNS 解析并发起网络请求。
- **输入搜索关键词**（如 `JavaScript tutorial`）➡ 触发默认搜索引擎（如 Google）。
- **输入部分 URL**（如 `example.com`）➡ 补全 `https://example.com/` 并发起请求。

---

## **2. URL 解析**

浏览器解析 URL，提取其中的 **协议、主机名、路径**：

```
https://www.example.com:443/path/to/page?query=123#section
```

| 组件 | 说明 |
|------|------|
| `https://` | **协议（Scheme）**，指明使用 HTTPS 进行安全连接 |
| `www.example.com` | **主机名（Hostname）**，即服务器域名 |
| `:443` | **端口号（Port）**，HTTPS 默认 443，HTTP 默认 80 |
| `/path/to/page` | **路径（Path）**，服务器上的资源位置 |
| `?query=123` | **查询参数（Query String）**，用于传递 GET 参数 |
| `#section` | **片段标识符（Fragment）**，用于跳转页面内特定位置 |

如果 URL 省略协议，如 `example.com`，浏览器会自动补全 `https://`（如果 HSTS 可用）。

---

## **3. 浏览器检查缓存**

在向服务器发送请求前，浏览器会先**检查本地缓存**，如果缓存可用，则直接返回页面，提高加载速度。

### **3.1 强缓存（Expires、Cache-Control）**

- **Expires**（HTTP/1.0）：指明缓存到期时间，例如：

  ```
  Expires: Wed, 21 Oct 2025 07:28:00 GMT
  ```

- **Cache-Control**（HTTP/1.1）：更灵活的缓存策略：

  ```
  Cache-Control: max-age=3600, public
  ```

  - `max-age=3600`：缓存 3600 秒
  - `public`：所有用户共享缓存
  - `private`：仅当前用户可用缓存
  - `no-cache`：需要与服务器重新验证
  - `no-store`：不缓存数据

### **3.2 协商缓存（ETag、Last-Modified）**

如果强缓存失效，浏览器会使用 **协商缓存**：

- **ETag（实体标签）**：

  ```
  ETag: "34a64df551429fcc55e4dc2b4114f3c8"
  ```

  服务器检查 ETag 是否变更，决定是否返回 304 Not Modified。
- **Last-Modified（最后修改时间）**：

  ```
  Last-Modified: Tue, 20 Oct 2023 10:00:00 GMT
  ```

  如果内容未变更，服务器返回 304 状态码，避免重复下载。

✅ **缓存优化策略**：

- 静态资源（如图片、CSS）**使用强缓存**，减少请求次数。
- 动态内容（如 HTML）**使用协商缓存**，保证最新内容。

---

## **4. DNS 解析**

如果缓存不可用，浏览器会发起 **DNS 解析**，将域名转换为 **IP 地址**。

### **4.1 DNS 解析过程**

DNS 解析分为两种方式：

1. **递归解析**（本地 DNS 服务器代用户查询）
2. **迭代解析**（逐级查询根服务器、顶级域名服务器）

**解析流程**：

1. **检查本地缓存**（浏览器、操作系统）。
2. **查询本地 DNS 服务器**（ISP 提供）。
3. **如果未命中，则查询根 DNS 服务器**（返回 `.com` 的地址）。
4. **查询顶级域名（TLD）服务器**（返回 `example.com` 的地址）。
5. **查询权威 DNS 服务器**（返回最终的 IP 地址）。

### **4.2 DNS 解析优化**

- **DNS 预解析（DNS Prefetch）**：
  - 提前解析常访问的域名，减少延迟：

    ```html
    <link rel="dns-prefetch" href="//example.com">
    ```

- **CDN（内容分发网络）**：
  - CDN 服务器分布全球，减少物理距离，提高加载速度。

---

## **5. TCP 连接**

获得 IP 地址后，浏览器与服务器建立 **TCP 连接**。

### **5.1 TCP 三次握手**

1. **客户端** ➝ 服务器：`SYN`（请求连接）。
2. **服务器** ➝ 客户端：`SYN-ACK`（确认请求）。
3. **客户端** ➝ 服务器：`ACK`（确认连接）。

🔹 **优化策略**：

- **TCP Fast Open**：减少握手时间，提高速度。
- **HTTP/2 连接复用**：减少重复握手，提高并发性。

### **5.2 HTTPS 的 TLS 连接**

如果使用 HTTPS，TCP 连接后还需要 **TLS 握手**：

1. **客户端发送 ClientHello**（支持的加密算法）。
2. **服务器发送 ServerHello**（确认加密算法）。
3. **交换密钥，完成加密通道建立**。

✅ **TLS 1.3 优化**：

- **减少握手次数**，加快安全连接速度。

---

## **6. HTTP 请求和响应**

成功建立连接后，浏览器向服务器发送 **HTTP 请求**，服务器返回 **HTTP 响应**。

### **6.1 HTTP 请求结构**

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

| 组件 | 说明 |
|------|------|
| **方法** | `GET`（获取数据）、`POST`（提交数据）、`PUT`（更新数据）等 |
| **Headers** | `User-Agent`（客户端信息）、`Accept`（请求类型） |
| **Body** | 仅 `POST/PUT` 请求包含请求体 |

---

### **6.2 HTTP 响应结构**

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 3423
```

| 组件 | 说明 |
|------|------|
| **状态码** | `200 OK`（成功）、`301 Moved`（重定向）、`404 Not Found`（未找到） |
| **Headers** | `Content-Type`（返回类型）、`Set-Cookie`（设置 Cookie） |
| **Body** | HTML / JSON / 文件数据 |

---

## **7. HTTP/2 与 HTTP/3 优化**

- **HTTP/2**
  - **多路复用（Multiplexing）**：多个请求复用同一 TCP 连接。
  - **头部压缩（Header Compression）**：减少重复数据传输。

- **HTTP/3**
  - **基于 QUIC（UDP）**，避免 TCP 慢启动问题。
  - **更快的 TLS 连接建立**。

---

## **总结**

用户输入 URL 后，浏览器经历：
1️⃣ **检查缓存**（减少请求）  
2️⃣ **DNS 解析**（解析域名为 IP）  
3️⃣ **TCP + TLS 连接**（建立安全通道）  
4️⃣ **HTTP 请求 & 响应**（获取网页内容）  
5️⃣ **浏览器解析 HTML、CSS、JS**（呈现页面）  

在下一章，我们将深入 **浏览器的渲染机制**，解析 **HTML 如何变成可视化页面！** 🚀
