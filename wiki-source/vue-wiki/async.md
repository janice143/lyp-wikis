# Vue 2 与异步处理

Vue 2 并未内置异步处理机制，但与现代异步 API（如 `axios` 和 `fetch`）结合非常灵活。本章介绍 Vue 2 中异步请求的常见实践、生命周期调用、状态管理与错误处理方式。

### 与后端 API 交互（axios、fetch）

推荐使用 `axios` 库，支持 Promise、拦截器、自动转换 JSON 等功能。

#### 安装 axios

```bash
npm install axios
```

#### 基础用法

```js
import axios from 'axios'

export default {
  data() {
    return { user: null }
  },
  created() {
    axios.get('/api/user/123')
      .then(res => {
        this.user = res.data
      })
      .catch(err => {
        console.error('请求失败', err)
      })
  }
}
```

也可以使用原生 `fetch`：

```js
fetch('/api/user/123')
  .then(res => res.json())
  .then(data => this.user = data)
```

### 在生命周期中调用异步方法

异步请求应放在组件生命周期钩子中，常见于 `created` 或 `mounted`：

- `created`：组件实例已创建，数据准备阶段
- `mounted`：DOM 挂载完成，可操作 DOM 相关数据

```js
created() {
  this.fetchData()
},
methods: {
  async fetchData() {
    try {
      const res = await axios.get('/api/data')
      this.items = res.data
    } catch (e) {
      this.error = '加载失败'
    }
  }
}
```

### 管理异步状态与加载状态

引入 `loading` 与 `error` 状态变量，可以改善用户体验。

```js
data() {
  return {
    isLoading: false,
    error: null,
    data: null
  }
},
methods: {
  async loadData() {
    this.isLoading = true
    this.error = null
    try {
      const res = await axios.get('/api/items')
      this.data = res.data
    } catch (e) {
      this.error = '网络错误'
    } finally {
      this.isLoading = false
    }
  }
}
```

模板中：

```html
<div v-if="isLoading">加载中...</div>
<div v-else-if="error">{{ error }}</div>
<ul v-else>
  <li v-for="item in data" :key="item.id">{{ item.name }}</li>
</ul>
```

### 错误处理与提示组件封装

将错误提示组件化有助于复用与样式统一：

```vue
<template>
  <div v-if="message" class="error">{{ message }}</div>
</template>

<script>
export default {
  props: ['message']
}
</script>
```

在父组件中使用：

```html
<ErrorMessage :message="error" />
```

此外也可引入第三方通知库，如：

- Element UI 的 `$message`
- vant 的 `Toast`
- sweetalert2

---

Vue 2 与异步操作结合紧密，通过 axios/fetch、生命周期钩子、状态管理与组件封装，可以灵活应对真实项目中复杂的异步交互需求。
