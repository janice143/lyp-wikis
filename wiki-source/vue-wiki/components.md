# Vue 2 组件系统

### 组件的基本概念

组件是 Vue 应用构建的核心单位，用于封装可复用的 UI 结构与逻辑。每个组件本质上就是一个拥有自己选项的 Vue 实例。

通过组件，我们可以将页面拆解为多个模块，提升代码的可维护性与复用性。

### 注册组件

#### 全局注册

使用 `Vue.component` 注册后，组件可在任意模板中使用：

```js
Vue.component('my-component', {
  template: '<div>我是全局组件</div>'
})
```

#### 局部注册

在父组件的 `components` 选项中注册，仅在当前组件作用域内可用：

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

### 组件通信

#### props

用于父组件向子组件传递数据：

```js
Vue.component('child', {
  props: ['message'],
  template: '<p>{{ message }}</p>'
})
```

```html
<child message="来自父组件的数据"></child>
```

#### $emit

用于子组件向父组件发送事件：

```js
Vue.component('child', {
  template: '<button @click="send">发送</button>',
  methods: {
    send() {
      this.$emit('custom-event', 'hello')
    }
  }
})
```

```html
<child @custom-event="handleMsg"></child>
```

#### `.sync` 修饰符（语法糖）

它是 `:prop` 与 `@update:prop` 的语法糖，用于简化双向绑定：

```html
<child :visible.sync="isVisible"></child>
```

等价于：

```html
<child :visible="isVisible" @update:visible="val => isVisible = val"></child>
```

### 插槽（Slot）

#### 默认插槽

```js
Vue.component('child', {
  template: '<div><slot></slot></div>'
})
```

```html
<child>这是父组件的内容</child>
```

#### 具名插槽

```html
<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
  </div>
</template>
```

```html
<child>
  <template v-slot:header>
    <h1>标题部分</h1>
  </template>
  正文内容
</child>
```

#### 作用域插槽（scoped slots）

```html
<child v-slot="slotProps">
  <span>{{ slotProps.text }}</span>
</child>
```

```js
Vue.component('child', {
  template: `
    <div>
      <slot :text="'来自子组件的数据'"></slot>
    </div>
  `
})
```

### 动态组件与异步组件

#### 动态组件 `<component :is="...">`

根据变量动态渲染组件：

```html
<component :is="currentComponent"></component>
```

```js
data() {
  return {
    currentComponent: 'component-a'
  }
}
```

#### 异步组件

```js
Vue.component('async-example', () => import('./MyComponent.vue'))
```

或使用工厂函数：

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(() => {
    resolve({
      template: '<div>异步加载的组件</div>'
    })
  }, 1000)
})
```

这种方式适合按需加载组件，减少初始加载体积。

---

Vue 2 的组件系统是其核心亮点之一，掌握组件的定义、注册、通信与插槽机制，将大大提升开发效率与项目结构的清晰度。
