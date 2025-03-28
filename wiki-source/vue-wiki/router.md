# Vue 2 路由系统（Vue Router）

### Vue Router 安装与配置

Vue Router 是 Vue.js 官方提供的路由解决方案，用于构建单页应用的前端路由逻辑。

安装方式：

```bash
npm install vue-router@3
```

基本配置：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import About from './components/About.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

### 基本用法

#### `router-view` 与 `router-link`

- `<router-view>`：路由匹配的组件渲染出口。
- `<router-link>`：用于声明式跳转。

```html
<router-link to="/about">关于</router-link>
<router-view></router-view>
```

#### 编程式导航

通过代码进行页面跳转：

```js
this.$router.push('/about')
this.$router.replace('/home')
this.$router.go(-1) // 返回上一个历史记录
```

### 路由参数与嵌套路由

#### 路由参数

定义：

```js
{ path: '/user/:id', component: User }
```

使用：

```html
<router-link :to="'/user/' + userId">查看用户</router-link>
```

在组件内获取：

```js
this.$route.params.id
```

#### 嵌套路由

配置：

```js
{
  path: '/parent',
  component: Parent,
  children: [
    { path: 'child', component: Child }
  ]
}
```

模板：

```html
<router-view></router-view> <!-- 用于渲染子路由 -->
```

### 命名路由与命名视图

#### 命名路由

```js
{ path: '/profile', name: 'userProfile', component: Profile }
```

跳转方式：

```js
this.$router.push({ name: 'userProfile' })
```

#### 命名视图

```js
{
  path: '/layout',
  components: {
    default: Main,
    sidebar: Sidebar
  }
}
```

模板中：

```html
<router-view></router-view>
<router-view name="sidebar"></router-view>
```

### 导航守卫

Vue Router 提供三类导航守卫，用于在路由切换前后执行逻辑。

#### 全局守卫

```js
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})
```

#### 路由独享守卫

```js
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from, next) => {
    // 权限判断
    next()
  }
}
```

#### 组件内守卫

```js
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 组件实例可用时执行
    })
  },
  beforeRouteUpdate(to, from, next) {
    next()
  },
  beforeRouteLeave(to, from, next) {
    next()
  }
}
```

### 动态路由匹配与懒加载

#### 动态匹配

支持通配符和正则：

```js
{ path: '/user/:id(\\d+)', component: User }
```

#### 路由懒加载

按需加载组件，优化性能：

```js
const Foo = () => import('./components/Foo.vue')
```

或在路由配置中：

```js
{
  path: '/foo',
  component: () => import('./components/Foo.vue')
}
```

---

Vue Router 提供完整的路由解决方案，支持从简单的页面跳转到复杂的权限控制、懒加载与嵌套结构，是构建 SPA 应用不可或缺的工具。
