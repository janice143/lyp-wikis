# **第五章：Axios 与异步操作**

在现代 Web 开发中，前端经常需要与后端 API 进行异步交互，例如：

- **获取用户数据**
- **发送表单**
- **并发请求多个 API**
- **按顺序或并发执行多个请求**

Axios 提供了基于 **Promise** 的异步处理机制，并支持 `async/await` 语法，简化代码结构。同时，Axios 还提供了 **`axios.all()` 和 `axios.spread()`** 来处理多个请求并发。

## **1. 异步请求与 Promise**

### **1.1 使用 `then()` 和 `catch()`**

Axios 的 API 基于 **Promise**，我们可以使用 `.then()` 和 `.catch()` 进行异步处理：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts/1")
  .then(response => {
    console.log("数据:", response.data);
  })
  .catch(error => {
    console.error("请求失败:", error);
  });
```

✅ **特点**

- `then()` 处理成功响应
- `catch()` 处理错误（如 `404 Not Found` 或 `500 Internal Server Error`）
- 代码结构清晰，适用于**单个请求**

### **1.2 使用 `async/await` 语法**

为了避免回调嵌套（回调地狱），我们可以使用 `async/await`，使代码更加直观：

```javascript
async function fetchPost() {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
    console.log("数据:", response.data);
  } catch (error) {
    console.error("请求失败:", error);
  }
}

fetchPost();
```

✅ **优点**

- **语法更加简洁**
- **代码逻辑更清晰**
- **可以和 `try/catch` 结合，统一处理错误**

### **1.3 在 `async/await` 里处理多个请求**

如果有多个请求，可以使用 `await` 逐个处理：

```javascript
async function fetchMultipleData() {
  try {
    const user = await axios.get("https://jsonplaceholder.typicode.com/users/1");
    const posts = await axios.get("https://jsonplaceholder.typicode.com/posts?userId=1");

    console.log("用户:", user.data);
    console.log("用户的帖子:", posts.data);
  } catch (error) {
    console.error("请求失败:", error);
  }
}

fetchMultipleData();
```

✅ **适用于**

- 需要**按顺序执行**多个请求（如：获取用户信息 → 获取该用户的文章）
- 依赖前一个请求的数据进行后续请求

## **2. 并发请求处理**

在某些情况下，我们可能需要**同时发送多个请求**，例如：

- **获取多个 API 数据**
- **批量请求**
- **提高请求效率**

Axios 提供了 `axios.all()` 和 `axios.spread()` 来并发执行多个请求。

### **2.1 使用 `axios.all()`**

`axios.all()` 允许同时发送多个请求，所有请求完成后才会进入 `then()` 处理：

```javascript
axios.all([
  axios.get("https://jsonplaceholder.typicode.com/users/1"),
  axios.get("https://jsonplaceholder.typicode.com/posts?userId=1")
])
.then(axios.spread((userRes, postsRes) => {
  console.log("用户信息:", userRes.data);
  console.log("用户的帖子:", postsRes.data);
}))
.catch(error => console.error("请求失败:", error));
```

✅ **原理**

- `axios.all([请求1, 请求2])` 并发执行多个请求
- `axios.spread()` 用于拆分响应，分别处理多个请求结果

### **2.2 使用 `Promise.all()` 代替 `axios.all()`**

Axios 的 `axios.all()` 其实是对 `Promise.all()` 的封装，我们也可以直接使用 `Promise.all()`：

```javascript
async function fetchMultipleData() {
  try {
    const [userRes, postsRes] = await Promise.all([
      axios.get("https://jsonplaceholder.typicode.com/users/1"),
      axios.get("https://jsonplaceholder.typicode.com/posts?userId=1")
    ]);

    console.log("用户信息:", userRes.data);
    console.log("用户的帖子:", postsRes.data);
  } catch (error) {
    console.error("请求失败:", error);
  }
}

fetchMultipleData();
```

✅ **对比**

| 方式 | 适用场景 |
||--|
| `axios.all()` + `axios.spread()` | 适用于 Axios 专用，代码更清晰 |
| `Promise.all()` | 适用于所有异步请求（不仅限于 Axios） |

### **2.3 控制并发请求数量**

如果一次性发送**大量请求**，可能会导致服务器崩溃或超时。我们可以使用 `Promise.allSettled()` 来确保所有请求都执行完：

```javascript
async function fetchDataWithLimit() {
  const urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3"
  ];

  const requests = urls.map(url => axios.get(url));

  const results = await Promise.allSettled(requests);
  results.forEach(result => {
    if (result.status === "fulfilled") {
      console.log("成功:", result.value.data);
    } else {
      console.error("失败:", result.reason);
    }
  });
}

fetchDataWithLimit();
```

✅ **适用于**

- **批量请求 API**
- **确保即使部分请求失败，也不会影响其他请求**

### **2.4 控制请求间隔（限流）**

如果 API 服务器限制**每秒请求次数**，可以使用 `setTimeout()` 控制请求间隔：

```javascript
async function fetchWithThrottle(urls, delay = 1000) {
  for (const url of urls) {
    try {
      const response = await axios.get(url);
      console.log("数据:", response.data);
    } catch (error) {
      console.error("请求失败:", error);
    }
    await new Promise(resolve => setTimeout(resolve, delay)); // 设定间隔
  }
}

const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3"
];

fetchWithThrottle(urls, 2000); // 每 2 秒请求一次
```

✅ **适用于**

- **API 限流场景**
- **爬虫或数据抓取**

## **总结**

### **✅ 异步请求**

- `then()/catch()` 处理异步请求
- `async/await` 让代码更清晰

### **✅ 并发请求**

- `axios.all()` 适用于多个请求同时执行
- `Promise.all()` 更通用，适用于非 Axios 请求
- `Promise.allSettled()` 适用于**部分请求失败的情况**
- **使用 `setTimeout()` 控制请求间隔，防止 API 过载**

🚀 **在下一章，我们将深入学习 Axios 的拦截器，如何增强 Axios 的功能！**
