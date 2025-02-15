Vue.js 小册

本小册系统性介绍 Vue.js，从基础概念到高级特性，再到最佳实践和性能优化，帮助开发者全面掌握 Vue.js 的开发能力，并应用于实际项目。

1. Vue.js 简介
 • 什么是 Vue.js？
 • Vue.js 的核心思想：声明式 & 组件化
 • Vue.js 发展历程（Vue 2 vs Vue 3）
 • Vue.js 适用于哪些场景？
 • Vue.js 的生态系统（Vue Router、Pinia、Vuex、Nuxt）

2. Vue.js 基础
 • Vue 组件
 • 组件的基本概念
 • 组件的生命周期（setup vs beforeCreate 等）
 • 单文件组件（SFC，.vue 文件）
 • 模板语法
 • 插值语法（{{}}）
 • 指令（v-if、v-for、v-bind、v-model 等）
 • 事件绑定（@click、@input）
 • 响应式数据
 • Vue 3 的 reactive 和 ref
 • Vue 2 的 data 选项和 Object.defineProperty
 • 计算属性 & 侦听器
 • computed vs watch
 • watchEffect 的应用

3. Vue 进阶
 • 父子组件通信
 • props 传递数据
 • $emit 触发事件
 • v-model 的组件双向绑定
 • 兄弟组件通信
 • 事件总线（Event Bus）
 • 状态管理（Pinia、Vuex）
 • 跨层级组件通信
 • provide & inject
 • Vue 3 的 defineExpose
 • 动态组件 & 递归组件
 • 插槽（Slots）
 • 具名插槽
 • 作用域插槽

4. Vue Router（路由管理）
 • Vue Router 的基本概念
 • 动态路由 & 路由参数
 • 路由守卫（beforeEach、beforeEnter）
 • keep-alive 的使用
 • 懒加载路由（import()）

5. Vue 状态管理
 • Pinia（Vue 3 推荐状态管理）
 • 核心概念（store、state、actions）
 • 组合式 API 适配
 • Vuex（Vue 2 经典状态管理）
 • state、mutations、actions、getters
 • Vue 组件自身的状态管理
 • 小型应用是否需要状态管理？

6. Vue 组合式 API
 • 为什么引入组合式 API？
 • setup 的使用方式
 • ref vs reactive
 • computed & watch & watchEffect
 • Vue 3 生命周期钩子（onMounted、onUnmounted）
 • useXXX 组合式函数封装

7. Vue 进阶特性
 • Vue 3 的新特性
 • Teleport 传送门
 • Suspense 处理异步组件
 • 虚拟 DOM 及其优化
 • Vue 3 Diff 算法优化
 • Vue 事件机制
 • 原生事件 vs 自定义事件
 • 事件修饰符（.stop、.prevent）
 • Vue 的指令系统
 • 自定义指令（v-focus 示例）

8. Vue 性能优化
 • 减少不必要的渲染
 • v-if vs v-show
 • key 在 v-for 中的作用
 • 代码分割
 • 路由懒加载
 • 组件动态导入
 • Vue 3 的 defineAsyncComponent
 • 避免不必要的组件更新
 • Vue.memo（Vue 3）
 • shouldComponentUpdate 的实现
 • 事件 & 计算属性优化
 • debounce & throttle
 • computed vs methods vs watch
 • 服务端渲染（SSR）
 • Nuxt.js 的应用场景

9. Vue 生态与扩展
 • Vue + TypeScript
 • 如何在 Vue 3 中使用 TypeScript
 • defineProps 和 defineEmits 的类型定义
 • Vue 与 UI 框架
 • Element Plus
 • Vant 移动端 UI 组件库
 • Vue + GraphQL
 • Vue + WebSocket
 • Vue + Electron / Tauri（桌面应用开发）
 • Vue + PWA（渐进式 Web 应用）

10. Vue 项目实战
 • 实战 1：Vue3 + Vite + Pinia 构建后台管理系统
 • 实战 2：Vue3 + TypeScript + TailwindCSS 开发博客系统
 • 实战 3：Vue3 + Electron 开发桌面应用
 • 实战 4：Vue3 + Nuxt3 搭建 SSR 应用
 • 实战 5：Vue3 + Three.js 构建 3D 可视化项目

总结

本小册系统地构建了 Vue.js 的知识体系，从基础语法到进阶应用，再到生态和项目实战，帮助开发者全面掌握 Vue 技术，打造高效可维护的 Vue 应用。 🚀
