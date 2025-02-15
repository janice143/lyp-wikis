# **第三章：Axios 请求方法**

在 Web 开发中，常见的 HTTP 请求方法包括 **GET、POST、PUT、DELETE**，它们用于不同的 API 交互需求。Axios 提供了简洁的 API 来发送这些请求，并支持 **查询参数、请求体、请求头、请求超时、请求取消** 等功能。本章将详细介绍 Axios 的各种请求方式及其进阶用法。

---

## **1. 发送 GET 请求**

### **1.1 基本 GET 请求**

GET 请求通常用于**获取数据**，例如：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts")
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

✅ **特点**

- **不带请求体**
- **适用于获取资源**
- **可携带查询参数**

---

### **1.2 传递查询参数**

在 GET 请求中，可以通过 **`params` 选项** 传递查询参数：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts", {
  params: {
    userId: 1,
    _limit: 5
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

等价于请求：

```
https://jsonplaceholder.typicode.com/posts?userId=1&_limit=5
```

✅ **另一种方式：手动拼接 URL**

```javascript
axios.get(`https://jsonplaceholder.typicode.com/posts?userId=1&_limit=5`);
```

✅ **最佳实践**

- **推荐使用 `params` 选项**，Axios 会自动编码参数，避免手动拼接错误。

---

### **1.3 传递请求头**

如果 API 需要特定的请求头（如 `Authorization`），可以使用 `headers`：

```javascript
axios.get("https://api.example.com/data", {
  headers: {
    Authorization: "Bearer token"
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

✅ **适用于**

- 需要身份认证的 API（如 `Authorization`）。
- 需要自定义 `Accept` 类型的请求。

---

## **2. 发送 POST 请求**

### **2.1 基本 POST 请求**

POST 请求用于 **向服务器提交数据**，通常用于创建资源：

```javascript
axios.post("https://jsonplaceholder.typicode.com/posts", {
  title: "New Post",
  body: "This is a new post",
  userId: 1
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

✅ **特点**

- **适用于数据提交**
- **可以携带请求体**
- **默认 `Content-Type: application/json`**

---

### **2.2 发送表单数据**

有些 API 需要 **`application/x-www-form-urlencoded`** 格式：

```javascript
const formData = new URLSearchParams();
formData.append("username", "admin");
formData.append("password", "123456");

axios.post("https://api.example.com/login", formData, {
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

✅ **区别**

- `application/json`：直接发送 JSON（适用于大部分 API）。
- `application/x-www-form-urlencoded`：适用于传统表单提交（如登录）。

---

## **3. 发送 PUT 和 DELETE 请求**

### **3.1 发送 PUT 请求**

PUT 请求用于 **更新资源**，需要提供 **完整数据**：

```javascript
axios.put("https://jsonplaceholder.typicode.com/posts/1", {
  title: "Updated Post",
  body: "This post has been updated",
  userId: 1
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

✅ **特点**

- **适用于更新数据**
- **需要提供完整数据**

---

### **3.2 发送 DELETE 请求**

DELETE 请求用于 **删除资源**：

```javascript
axios.delete("https://jsonplaceholder.typicode.com/posts/1")
  .then(response => console.log("Deleted successfully"))
  .catch(error => console.error(error));
```

✅ **特点**

- **不需要请求体**
- **只需要资源 ID**

---

## **4. 请求取消与超时设置**

### **4.1 取消请求**

在某些场景下，我们可能需要**取消未完成的请求**，例如：

- **用户切换页面时，取消未完成的请求**
- **防止短时间内重复请求（如搜索框防抖）**

#### **✅ 使用 `CancelToken` 取消请求**

```javascript
const cancelToken = axios.CancelToken;
const source = cancelToken.source();

axios.get("https://jsonplaceholder.typicode.com/posts", {
  cancelToken: source.token
})
.then(response => console.log(response.data))
.catch(error => {
  if (axios.isCancel(error)) {
    console.log("请求已取消:", error.message);
  } else {
    console.error(error);
  }
});

// 取消请求
source.cancel("用户取消了请求");
```

✅ **适用场景**

- **用户切换页面时**，防止加载无用数据。
- **搜索框请求防抖**，避免重复请求。

---

### **4.2 请求超时**

如果请求时间过长，可以使用 `timeout` 选项：

```javascript
axios.get("https://api.example.com/data", {
  timeout: 5000 // 5 秒超时
})
.then(response => console.log(response.data))
.catch(error => {
  if (error.code === "ECONNABORTED") {
    console.error("请求超时");
  } else {
    console.error(error);
  }
});
```

✅ **特点**

- **默认无超时限制**
- **适用于慢速 API，防止页面卡顿**

---

## **总结**

✅ **GET 请求**

- 通过 `params` 传递查询参数。
- 适用于获取数据（如 `axios.get(url, { params })`）。

✅ **POST 请求**

- 适用于数据提交，默认 `Content-Type: application/json`。
- 需要 `application/x-www-form-urlencoded` 时使用 `URLSearchParams`。

✅ **PUT & DELETE 请求**

- `PUT` 适用于**更新数据**，**需要提供完整对象**。
- `DELETE` 适用于**删除资源**，**不需要请求体**。

✅ **请求控制**

- **取消请求**：使用 `CancelToken`，适用于**页面切换或防抖**场景。
- **超时控制**：设置 `timeout`，防止 API 过长的响应时间影响用户体验。

🚀 **在下一章，我们将深入解析 Axios 的高级用法，包括拦截器、并发请求、错误处理等！**
