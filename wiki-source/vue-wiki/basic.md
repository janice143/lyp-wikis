# Vue 2 基础语法

### Vue 实例与生命周期

Vue 通过 `new Vue()` 创建实例，每个 Vue 应用都是由根实例开始的：

```js
new Vue({
  el: '#app',
  data: {
    message: 'Hello World'
  }
})
```

生命周期钩子函数是 Vue 提供的钩子，在组件创建、挂载、更新和销毁过程中执行：

| 生命周期钩子 | 触发时机 |
|--------------|----------|
| created      | 实例已创建，数据已设置，但 DOM 未挂载 |
| mounted      | DOM 挂载完成，可进行 DOM 操作 |
| updated      | 数据变更后视图更新完成 |
| destroyed    | 实例销毁时调用，可做清理工作 |

### 模板语法

#### 插值表达式 `{{}}`

```html
<p>{{ message }}</p>
```

用于在模板中输出变量，支持简单表达式计算。

#### 指令系统

- `v-bind`: 绑定属性

  ```html
  <img v-bind:src="imageUrl">
  ```

- `v-model`: 实现双向绑定，常用于表单控件

  ```html
  <input v-model="inputText">
  ```

- `v-if`, `v-else-if`, `v-else`: 条件渲染

  ```html
  <p v-if="visible">可见</p>
  ```

- `v-for`: 列表渲染

  ```html
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  ```

- `v-on`: 绑定事件监听器

  ```html
  <button v-on:click="doSomething">点击</button>
  ```

### 计算属性与侦听器

#### computed

用于从现有数据派生出新的属性，具备缓存特性，只有依赖变化才会重新计算。

```js
computed: {
  reversedMessage() {
    return this.message.split('').reverse().join('')
  }
}
```

#### watch

监听数据变化，适用于异步或开销大的操作，支持深度监听：

```js
watch: {
  userInfo: {
    handler(newVal, oldVal) {
      console.log('变化了', newVal)
    },
    deep: true
  }
}
```

### 事件处理

#### v-on 绑定与修饰符

```html
<button v-on:click.prevent="submitForm">提交</button>
```

`.prevent` 是事件修饰符，表示调用 `event.preventDefault()`，Vue 提供 `.stop`, `.once`, `.capture` 等修饰符。

#### 方法与事件参数

```html
<button @click="say('Hi')">Say Hi</button>
```

```js
methods: {
  say(msg) {
    alert(msg)
  }
}
```

以上是 Vue 2 的基础语法，掌握这些内容可以帮助开发者快速构建交互式网页应用。
