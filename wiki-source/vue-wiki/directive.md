# Vue 2 中的自定义指令与过滤器

### 注册自定义指令

Vue 允许我们注册自定义指令（`directive`），对 DOM 元素进行底层操作。可以是全局注册或组件内局部注册。

#### 全局注册指令

```js
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})
```

#### 局部注册指令

```js
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  }
}
```

#### 指令钩子函数

| 钩子     | 调用时机                             |
|----------|--------------------------------------|
| `bind`   | 指令绑定到元素时                     |
| `inserted` | 元素插入父节点时（常用于操作 DOM）   |
| `update` | 所在组件更新时（不一定值已变化）     |
| `unbind` | 指令解绑时                           |

```js
Vue.directive('highlight', {
  bind(el, binding) {
    el.style.backgroundColor = binding.value
  },
  update(el, binding) {
    el.style.backgroundColor = binding.value
  }
})
```

使用：

```html
<p v-highlight="'yellow'">高亮文本</p>
```

### 实用指令场景示例

#### 自动聚焦

```js
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})
```

```html
<input v-focus>
```

#### 点击外部关闭元素

```js
Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})
```

```html
<div v-click-outside="closeDialog">点击外部关闭</div>
```

### 过滤器（filters）

Vue 2 提供过滤器，用于模板中对输出数据做格式化处理。

#### 全局过滤器

```js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

使用：

```html
<p>{{ name | capitalize }}</p>
```

#### 局部过滤器

```js
export default {
  filters: {
    uppercase(value) {
      return value.toUpperCase()
    }
  }
}
```

```html
<p>{{ title | uppercase }}</p>
```

### 常用过滤器示例

#### 日期格式化

```js
Vue.filter('formatDate', function (value) {
  const date = new Date(value)
  return date.toLocaleDateString()
})
```

#### 数字格式化

```js
Vue.filter('currency', function (value) {
  return '$' + parseFloat(value).toFixed(2)
})
```

#### 字符串截断

```js
Vue.filter('truncate', function (value, length = 10) {
  return value.length > length ? value.slice(0, length) + '...' : value
})
```

---

自定义指令和过滤器为 Vue 2 提供了更灵活的 UI 表现控制能力。指令适合操作 DOM 层，过滤器用于模板层数据展示处理，在实际项目中能极大提高可读性与复用性。
