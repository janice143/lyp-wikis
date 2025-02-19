# **第十一章：优化与性能**

在实际开发中，频繁的 API 请求会导致**性能下降、服务器压力增加、用户体验变差**。Axios 提供了多种优化方案来提高前端请求的效率，包括**防止重复请求、数据缓存、懒加载、请求优化**等。本章将介绍 **如何优化 Axios 请求，提高应用性能和用户体验**。

## **1. 防止重复请求**

### **1.1 防止同一请求重复发送**

在某些场景下，可能会**多次点击按钮**触发相同请求，或在**短时间内重复发送相同的 API 请求**。可以使用 `Map` 记录请求状态，在请求完成前避免重复请求。

#### **✅ 方案 1：手动记录请求**

```javascript
const pendingRequests = new Map();

axios.interceptors.request.use(config => {
  const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.params || config.data)}`;
  if (pendingRequests.has(requestKey)) {
    return Promise.reject("请求重复");
  }
  pendingRequests.set(requestKey, true);
  return config;
});

axios.interceptors.response.use(
  response => {
    const requestKey = `${response.config.method}-${response.config.url}-${JSON.stringify(response.config.params || response.config.data)}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  error => {
    pendingRequests.clear(); // 遇到错误时清除
    return Promise.reject(error);
  }
);
```

✅ **适用于**

- **防止短时间内重复请求**
- **避免表单提交多次**
- **提升服务器性能**

### **1.2 结合 `lodash` 进行请求节流**

`lodash.throttle()` 可以**限制请求频率**，防止短时间内多次触发相同请求：

```javascript
import axios from "axios";
import throttle from "lodash/throttle";

const fetchUserData = throttle(() => {
  axios.get("https://jsonplaceholder.typicode.com/users")
    .then(response => console.log("用户数据:", response.data))
    .catch(error => console.error("请求失败:", error));
}, 2000); // 限制 2 秒内只执行一次请求

fetchUserData();
fetchUserData(); // 这个请求会被忽略
```

✅ **适用于**

- **搜索框防抖**
- **防止短时间内多次提交请求**

## **2. 懒加载与数据缓存**

### **2.1 使用缓存优化请求**

如果数据**不会频繁变化**，可以**缓存 API 结果**，减少重复请求，提高加载速度。

#### **✅ 方案 1：存储到 `sessionStorage`**

```javascript
async function fetchWithCache(url) {
  const cacheKey = `cache_${url}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    console.log("使用缓存数据");
    return JSON.parse(cachedData);
  }

  try {
    const response = await axios.get(url);
    sessionStorage.setItem(cacheKey, JSON.stringify(response.data)); // 存入缓存
    return response.data;
  } catch (error) {
    console.error("请求失败:", error);
  }
}

fetchWithCache("https://jsonplaceholder.typicode.com/users").then(data => console.log(data));
```

✅ **适用于**

- **列表页数据**
- **用户信息（如个人资料）**

### **2.2 `axios-cache-adapter` 自动缓存**

可以使用 `axios-cache-adapter` 自动缓存请求：

```bash
npm install axios-cache-adapter
```

```javascript
import { setupCache } from "axios-cache-adapter";

const cache = setupCache({
  maxAge: 15 * 60 * 1000 // 缓存 15 分钟
});

const api = axios.create({
  adapter: cache.adapter
});

api.get("https://jsonplaceholder.typicode.com/users")
  .then(response => console.log("缓存数据:", response.data));
```

✅ **适用于**

- **长时间不变的 API（如国家列表、静态资源）**
- **减少不必要的网络请求**

## **3. 代码分割与请求优化**

### **3.1 按需加载请求**

**避免一次性加载大量数据**，而是**按需加载**：

```javascript
const loadUserData = async (page) => {
  const response = await axios.get("https://jsonplaceholder.typicode.com/users", {
    params: { page }
  });
  return response.data;
};

// 只有在用户翻页时才加载新数据
document.getElementById("nextPage").addEventListener("click", () => {
  loadUserData(2).then(data => console.log("加载新数据:", data));
});
```

✅ **适用于**

- **分页加载**
- **滚动加载（如无限滚动列表）**

### **3.2 合并多个请求**

如果 API **允许批量获取数据**，可以**合并多个请求**，减少 HTTP 请求数量：

```javascript
axios.get("https://jsonplaceholder.typicode.com/posts?_limit=10")
  .then(response => console.log("合并请求数据:", response.data));
```

✅ **适用于**

- **获取多个数据项**
- **减少请求次数，提高性能**

### **3.3 预加载数据**

如果某个页面会访问某个 API，可以**提前加载数据**：

```javascript
const preloadData = axios.get("https://jsonplaceholder.typicode.com/users");

// 进入页面时使用已经请求的数据
async function loadPage() {
  const response = await preloadData;
  console.log("预加载数据:", response.data);
}

document.getElementById("loadPage").addEventListener("click", loadPage);
```

✅ **适用于**

- **用户即将访问的页面**
- **提高页面响应速度**

## **总结**

### **✅ 防止重复请求**

1️⃣ **手动记录请求状态**（避免相同请求重复发送）  
2️⃣ **`lodash.throttle()` 限制请求频率**（如防止按钮连点）  

### **✅ 懒加载与缓存**

3️⃣ **使用 `sessionStorage` 缓存数据**（减少 API 请求次数）  
4️⃣ **`axios-cache-adapter` 自动缓存 API 数据**（适用于静态数据）  

### **✅ 请求优化**

5️⃣ **按需加载数据**（避免一次性加载大量数据）  
6️⃣ **合并多个请求**（减少 HTTP 请求数量）  
7️⃣ **预加载数据**（提升页面加载速度）  

🚀 **下一章，我们将学习 Axios 的最佳实践，包括统一错误处理、日志记录、封装 API 请求等技巧！**
