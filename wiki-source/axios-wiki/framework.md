# **第十章：Axios 与前端框架集成**

在现代 Web 开发中，前端框架（如 **React、Vue、Angular**）通常需要与后端 API 交互。**Axios** 作为强大的 HTTP 客户端，在这些框架中被广泛使用。本章将介绍 **如何在 React、Vue 和 Angular 中集成 Axios**，并提供最佳实践。

---

## **1. React 中使用 Axios**

### **1.1 在 React 组件中使用 Axios**

在 React 组件中，可以使用 **`useEffect()` Hook** 来在组件挂载时发送请求：

```javascript
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("请求失败:", error));
  }, []);

  return (
    <div>
      <h2>用户列表</h2>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
};

export default UserList;
```

✅ **特点**

- `useEffect()` 在组件挂载时执行 **GET 请求**
- `useState()` 存储返回的数据并更新 UI
- `catch()` 处理错误，避免页面崩溃

---

### **1.2 使用 `useEffect()` 监听依赖**

如果请求数据**依赖于某个状态**，可以在 `useEffect()` 中监听变化：

```javascript
const [userId, setUserId] = useState(1);
useEffect(() => {
  axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then(response => setUser(response.data))
    .catch(error => console.error("请求失败:", error));
}, [userId]); // 当 userId 变化时，重新请求数据
```

✅ **适用于**

- **监听 URL 参数变化**
- **分页或筛选数据**

---

### **1.3 取消请求（防止内存泄漏）**

如果组件卸载时请求仍在进行，可能导致 **内存泄漏**，可以使用 `AbortController` 取消请求：

```javascript
useEffect(() => {
  const controller = new AbortController();
  
  axios.get("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
    .then(response => setUsers(response.data))
    .catch(error => {
      if (error.name !== "AbortError") {
        console.error("请求失败:", error);
      }
    });

  return () => controller.abort(); // 组件卸载时取消请求
}, []);
```

✅ **适用于**

- **组件切换时取消未完成请求**
- **防止用户快速操作导致重复请求**

---

## **2. Vue 中使用 Axios**

### **2.1 在 Vue 组件中使用 Axios**

在 Vue 组件的 **`mounted()` 生命周期钩子** 中发起请求：

```javascript
<template>
  <div>
    <h2>用户列表</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return { users: [] };
  },
  mounted() {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(response => this.users = response.data)
      .catch(error => console.error("请求失败:", error));
  }
};
</script>
```

✅ **特点**

- `mounted()` **在组件加载后发起请求**
- `data()` 存储 API 返回的数据
- `catch()` 捕获错误，防止 UI 崩溃

---

### **2.2 Vue 3 组合式 API（Composition API）**

Vue 3 推荐使用 `setup()` 结合 `onMounted()` 进行请求：

```javascript
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const users = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        users.value = response.data;
      } catch (error) {
        console.error("请求失败:", error);
      }
    });

    return { users };
  }
};
```

✅ **适用于**

- **Vue 3 组合式 API**
- **更清晰的代码结构**

---

### **2.3 Vuex 中使用 Axios**

如果全局状态管理 **Vuex** 需要请求数据，可以在 `actions` 里调用 Axios：

```javascript
import axios from "axios";

export default {
  state: {
    users: []
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    }
  },
  actions: {
    fetchUsers({ commit }) {
      axios.get("https://jsonplaceholder.typicode.com/users")
        .then(response => commit("SET_USERS", response.data))
        .catch(error => console.error("请求失败:", error));
    }
  }
};
```

✅ **适用于**

- **Vuex 全局状态管理**
- **多个组件共享数据**

---

## **3. Angular 中使用 Axios**

Angular **官方推荐使用 `HttpClientModule`** 进行 HTTP 请求，但我们仍然可以使用 Axios。

### **3.1 安装 Axios 并导入**

首先安装 Axios：

```bash
npm install axios
```

然后在 `app.module.ts` 中引入：

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import axios from "axios";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [{ provide: "axios", useValue: axios }],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

### **3.2 在组件中使用 Axios**

```typescript
import { Component, OnInit } from "@angular/core";
import axios from "axios";

@Component({
  selector: "app-user-list",
  template: `
    <h2>用户列表</h2>
    <ul>
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  ngOnInit() {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(response => this.users = response.data)
      .catch(error => console.error("请求失败:", error));
  }
}
```

✅ **适用于**

- **需要手动控制请求行为**
- **不想使用 Angular `HttpClientModule`**

---

### **3.3 Axios 与 Angular `HttpClient` 对比**

| 功能 | `Axios` | `HttpClient`（推荐） |
|------|---------|----------------|
| 基于 | `Promise` | `Observable` |
| 自动 JSON 解析 | ✅ | ✅ |
| 请求拦截器 | ✅（内置） | ✅（拦截器） |
| 取消请求 | ✅（`AbortController`） | ✅（`unsubscribe()`） |
| 适用于 | **前端 + Node.js** | **Angular 项目** |

🚀 **Angular 推荐使用 `HttpClientModule`，Axios 适用于需要在前后端共用的场景！**

---

## **总结**

### **✅ React**

- **使用 `useEffect()` 发送请求**
- **使用 `AbortController` 取消请求，防止内存泄漏**
- **适用于 `useState()` 或 `useReducer()` 处理 API 数据**

### **✅ Vue**

- **Vue 2：在 `mounted()` 中调用 Axios**
- **Vue 3：使用 `setup()` + `onMounted()`**
- **Vuex：在 `actions` 里调用 Axios，管理全局状态**

### **✅ Angular**

- **可以使用 `HttpClientModule`（推荐）**
- **Axios 适用于需要 `Promise` 处理的场景**
- **可用 `AbortController` 取消请求**

🚀 **下一章，我们将学习 Axios 的最佳实践，提高代码质量和可维护性！**
