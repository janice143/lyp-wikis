# Vuex 状态管理（适用于 Vue 2）

### Vuex 的核心概念

Vuex 是 Vue 的官方状态管理库，用于集中式管理组件间共享的状态。

#### 四大核心元素

- `state`：用于存放应用的状态数据（全局状态）
- `getters`：基于 state 的派生状态，具有缓存功能
- `mutations`：唯一能修改 state 的方法，必须是同步函数
- `actions`：提交 mutation，可包含异步操作

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    doubleCount: state => state.count * 2
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    asyncIncrement({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  }
})
```

### 使用模块化管理状态

当应用变复杂时，可通过 `modules` 将状态按功能模块拆分：

```js
const moduleA = {
  state: { count: 1 },
  mutations: { increment(state) { state.count++ } },
  getters: { double(state) { return state.count * 2 } }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA
  }
})
```

访问方式：

```js
store.state.a.count
store.getters['a/double']
```

### map 辅助函数的使用

Vuex 提供多个辅助函数，简化状态映射到组件：

```js
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount'])
  },
  methods: {
    ...mapActions(['asyncIncrement']),
    ...mapMutations(['increment'])
  }
}
```

### Vuex 与组件间的配合

Vuex 提供统一的状态源，使组件间共享状态更加清晰。

- 父子组件无需通过 props 层层传递数据
- 兄弟组件间可以通过 Vuex 管理共享数据

```html
<!-- 使用 mapState -->
<p>{{ count }}</p>
<button @click="increment">+</button>
```

Vuex 让状态更新具有可追踪性，通过 mutation 记录所有变更来源，利于调试。

### Vuex 与本地缓存结合

Vuex 状态默认存储在内存中，刷新页面会丢失。可通过结合 `localStorage` 或 `sessionStorage` 实现状态持久化。

#### 示例：保存登录状态

```js
const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    clearToken(state) {
      state.token = ''
      localStorage.removeItem('token')
    }
  }
})
```

也可使用插件如 `vuex-persistedstate` 自动同步 Vuex 状态至本地存储。

```bash
npm install vuex-persistedstate
```

```js
import createPersistedState from 'vuex-persistedstate'

const store = new Vuex.Store({
  plugins: [createPersistedState()]
})
```

---

Vuex 是大型应用中不可或缺的状态管理工具。通过合理使用模块化结构、辅助函数和本地存储策略，可以构建可维护、高可控的前端状态体系。
