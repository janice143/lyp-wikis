# Vue 2 中的数据管理

### 数据响应式原理

Vue 2 的响应式系统基于 `Object.defineProperty` 实现，通过拦截对象属性的读写操作，实现数据变更驱动视图更新。

核心原理简化如下：

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log('访问', key)
      return val
    },
    set(newVal) {
      console.log('设置', key, '为', newVal)
      val = newVal
    }
  })
}
```

Vue 会在初始化阶段对 `data` 中的所有属性递归设置 getter 和 setter，从而实现响应式。

#### 响应式的限制

- **对象新增属性**：Vue 无法侦测新增属性，如：`obj.newProp = 123` 不会触发视图更新。
- **数组变更**：Vue 能侦测数组方法（push/pop/slice/splice 等），但无法侦测数组索引赋值，如 `arr[0] = 1`。

### `data`, `methods`, `computed` 的区别与使用

| 属性       | 说明                   | 是否缓存 | 场景                          |
|------------|------------------------|----------|-------------------------------|
| `data`     | 响应式状态数据         | 无       | 应用的核心状态数据           |
| `methods`  | 事件或逻辑函数         | 无       | 响应用户操作、处理行为        |
| `computed` | 计算属性，依赖响应式数据 | 有       | 基于现有数据派生的属性        |

#### 示例对比

```js
computed: {
  reversedText() {
    return this.text.split('').reverse().join('')
  }
},
methods: {
  reverseText() {
    return this.text.split('').reverse().join('')
  }
}
```

区别：computed 会缓存值，只有依赖 `text` 变化时才会重新计算；methods 每次调用都会执行函数逻辑。

### 表单双向绑定：`v-model` 实现机制

`v-model` 实现本质是 `:value` + `@input` 的语法糖：

```html
<input v-model="text">
```

等价于：

```html
<input :value="text" @input="text = $event.target.value">
```

对于组件中的 `v-model`，会自动解析为 `value` 属性和 `input` 事件绑定：

```js
Vue.component('custom-input', {
  props: ['value'],
  template: '<input :value="value" @input="$emit(\'input\', $event.target.value)">'
})
```

### `$set` 和 `$delete` 的使用场景

由于 Vue 无法侦测对象新增属性和删除属性，因此需要使用 `$set` 和 `$delete` 来触发视图更新：

```js
// 为响应式对象添加新属性
this.$set(this.obj, 'newKey', 'value')

// 删除属性并触发更新
this.$delete(this.obj, 'oldKey')
```

这两个方法本质调用了 `Vue.set` 和 `Vue.delete`，用于确保数据变更能被 Vue 监听。

---

Vue 2 的数据管理围绕响应式系统展开，理解其实现机制与局限性，有助于更合理地组织状态逻辑、优化性能，并避免一些常见陷阱。
