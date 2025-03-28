# Vue 2 与样式处理

Vue 2 提供了强大的样式控制机制，既支持组件级封装，也支持动态样式绑定和动画过渡。同时，通过生态中丰富的 UI 组件库，开发者可以快速构建美观的界面。

### 组件级样式与作用域样式（`scoped`）

Vue 支持在 `.vue` 单文件组件中直接书写样式。使用 `scoped` 属性可将样式限制在当前组件内，避免污染全局。

```vue
<template>
  <div class="box">Hello</div>
</template>

<style scoped>
.box {
  color: red;
}
</style>
```

编译时会自动添加数据属性进行作用域隔离：如 `.box[data-v-xxxx]`。

### 动态样式绑定：`v-bind:class`, `v-bind:style`

#### 动态 class 绑定

```html
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
```

支持字符串、对象、数组等形式：

```html
<div :class="[activeClass, errorClass]">
```

#### 动态 style 绑定

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

支持绑定对象或计算属性返回值。

### 过渡与动画

Vue 提供内置组件 `<transition>` 和 `<transition-group>`，用于为元素或组件添加进入/离开动画。

#### `<transition>` 基本用法

```html
<transition name="fade">
  <p v-if="show">淡入淡出</p>
</transition>
```

CSS：

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
```

#### `<transition-group>` 用于列表

```html
<transition-group name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</transition-group>
```

#### JS 钩子函数

```js
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @leave="leave">
</transition>
```

适用于：

- 更复杂的动画逻辑
- 使用第三方动画库（如 anime.js）

### 使用第三方 UI 框架（如 Element UI、iView）

#### 安装 Element UI

```bash
npm install element-ui --save
```

#### 引入方式

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
```

使用组件：

```html
<el-button type="primary">主要按钮</el-button>
```

#### 推荐 UI 框架

| 框架       | 特点                       |
|------------|----------------------------|
| Element UI | 企业后台常用，成熟稳定     |
| iView      | 轻量、样式现代             |
| Vuetify    | Material Design 风格       |
| Mint UI    | 移动端优化                 |

---

Vue 2 的样式处理体系覆盖了从组件隔离、样式绑定到动画控制与 UI 框架集成的各个方面，为构建高质量用户界面提供了灵活的解决方案。
