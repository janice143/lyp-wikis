# Vue 2 的性能优化

在构建大型单页应用时，性能是开发者不可忽视的重要议题。Vue 2 提供了多种优化机制，从渲染层到构建层提升应用的响应速度与可维护性。

### 使用 `v-show` 替代 `v-if` 的场景

`v-if` 是“真正”的条件渲染，会在条件为 `false` 时销毁 DOM 元素；`v-show` 则是通过 CSS `display: none` 控制显示。

- 使用场景：频繁切换显示状态时，应使用 `v-show`，避免频繁销毁和重建 DOM。

```html
<!-- 更推荐用于频繁切换的情况 -->
<p v-show="isVisible">我可能会频繁显示/隐藏</p>
```

### `keep-alive` 缓存组件

`<keep-alive>` 是 Vue 提供的内置组件，用于缓存被包裹的动态组件，避免重复渲染。

```html
<keep-alive>
  <component :is="currentView"></component>
</keep-alive>
```

适用于：

- 页面标签页切换场景
- 表单输入缓存、避免数据丢失

支持 `include`、`exclude`、`max` 属性进行精细控制。

### 异步组件与懒加载

按需加载组件可以减少首次加载体积，提高页面打开速度。

```js
Vue.component('AsyncComponent', () => import('./components/MyComponent.vue'))
```

结合路由懒加载：

```js
const Foo = () => import('./components/Foo.vue')
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### 使用 `key` 提高列表渲染效率

在使用 `v-for` 渲染列表时，建议为每个元素指定唯一 `key`：

```html
<li v-for="item in list" :key="item.id">{{ item.name }}</li>
```

这样 Vue 能更高效地复用元素，避免不必要的 DOM 操作。

### 长列表优化（虚拟滚动方案）

当列表数据量大时（如超过数千条），应避免一次性渲染所有数据。

推荐使用虚拟滚动技术（virtual scrolling），只渲染可视区域内的 DOM：

- 第三方库：`vue-virtual-scroller`, `vue-virtual-scroll-list`

示例：

```bash
npm install vue-virtual-scroller
```

```js
import { RecycleScroller } from 'vue-virtual-scroller'
```

```html
<RecycleScroller :items="items" :item-size="50">
  <template v-slot="{ item }">
    <div class="item">{{ item.text }}</div>
  </template>
</RecycleScroller>
```

### 打包优化与按需加载

- 使用 **Tree Shaking**（移除未使用代码）
- 使用 Webpack/Vite 分包策略：
  - `splitChunks`
  - `dynamic import()` 动态加载模块

#### Babel 插件/按需引入

结合 `babel-plugin-import` 可实现 UI 框架的组件级引入：

```js
plugins: [
  ['import', {
    libraryName: 'element-ui',
    libraryDirectory: 'lib',
    style: true
  }]
]
```

---

通过合理使用 Vue 2 提供的性能优化手段，可以有效提升页面响应速度、用户体验和系统可维护性，尤其适用于中大型项目的性能瓶颈场景。
