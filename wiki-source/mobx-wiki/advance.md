# **第四章：MobX 进阶**

MobX 提供了强大的响应式特性，但在大型应用中，**如何优化性能、调试状态变化、结合 TypeScript 进行类型管理**，是开发者需要深入理解的问题。本章将探讨 **MobX 的性能优化、调试工具、以及 TypeScript 的最佳实践**。

## **1. 如何优化 MobX 性能**

MobX **自动追踪状态变化**，但如果**滥用 `observable` 或 `computed`，可能会导致组件不必要的重新渲染**。以下是提高 MobX 性能的几种最佳实践：

### **1.1 避免不必要的重新渲染**

**原则：** **确保只有受影响的组件重新渲染，而不是整个应用**

### ✅ **最佳实践 1：确保 `observer` 只包裹必要组件**

**❌ 不推荐（整个 App 重新渲染）**

```javascript
const App = observer(() => {
  return (
    <div>
      <Header /> 
      <Counter />
    </div>
  );
});
```

📌 **问题：**

- `observer(App)` 会导致 **`Header` 和 `Counter` 组件都重新渲染**
  
**✅ 推荐（细粒度 `observer` 组件）**

```javascript
const Header = () => <h1>MobX 优化示例</h1>;

const Counter = observer(() => {
  return <p>Count: {store.count}</p>;
});

const App = () => {
  return (
    <div>
      <Header /> 
      <Counter />
    </div>
  );
};
```

📌 **优化效果：**

- **`Header` 组件不会因为 `count` 变化而重新渲染**
- **只有 `Counter` 组件重新渲染**

### ✅ **最佳实践 2：使用 `React.memo` 避免不必要的渲染**

即使 `observer` 能够优化 MobX 的状态变化，有时候也需要 **React.memo** 避免额外的组件更新：

```javascript
const UserInfo = React.memo(({ name }) => {
  console.log("UserInfo 渲染");
  return <p>用户：{name}</p>;
});

const App = observer(() => {
  return <UserInfo name="Alice" />;
});
```

📌 **作用：**

- `React.memo()` 让 `UserInfo` **只在 `name` 变化时渲染**
- **配合 `observer` 提高性能**

## **2. `computed` 结合 `reaction`**

`computed` 适用于**避免不必要的计算**，而 `reaction` 则**适用于监听特定状态变化后执行副作用**。

### **2.1 `computed` 提高性能**

**`computed` 只有在依赖数据变化时才会重新计算**

```javascript
import { makeAutoObservable, computed } from "mobx";

class Store {
  count = 5;

  constructor() {
    makeAutoObservable(this);
  }

  get double() {
    console.log("double 计算");
    return this.count * 2;
  }
}

const store = new Store();
console.log(store.double); // double 计算 -> 10
console.log(store.double); // 直接读取缓存，不计算
store.count = 10;
console.log(store.double); // double 计算 -> 20
```

📌 **优化点**

- **`double` 只在 `count` 变化时计算**
- **如果 `count` 不变，读取 `double` 不会触发重新计算**

### **2.2 `reaction` 监听状态变化**

如果只想在 `count` 变化时执行副作用（例如**发送 API 请求**），可以使用 `reaction`：

```javascript
import { observable, reaction } from "mobx";

const store = observable({ count: 0 });

reaction(
  () => store.count,
  (count) => {
    console.log("count 变为:", count);
  }
);

store.count = 1; // 输出 "count 变为: 1"
store.count = 2; // 输出 "count 变为: 2"
```

📌 **适用于**

- **执行副作用（如日志、数据存储、异步请求）**
- **只在状态变化时执行代码，而不是每次渲染**

## **3. 调试 MobX**

MobX 提供了一些强大的调试工具，包括：

- **mobx-devtools**
- **spy() & trace()**
- **观察状态变化**

### **3.1 使用 mobx-devtools**

`mobx-devtools` 可以在 **Chrome DevTools** 里可视化 MobX 的状态。

#### **安装**

```bash
npm install mobx-devtools
```

#### **使用**

```javascript
import { makeAutoObservable } from "mobx";
import { configure } from "mobx-devtools";

configure({
  enforceActions: "always", // 强制使用 action 修改状态
});
```

📌 **功能**

- **查看 `observable` 状态**
- **监控 `computed` 计算**
- **追踪 `action` 调用**

### **3.2 使用 `spy()` 监控状态变化**

`spy()` 可以 **监控所有 MobX 状态的变化**：

```javascript
import { spy } from "mobx";

spy((event) => {
  console.log("MobX 事件:", event);
});
```

📌 **适用于**

- **排查状态异常**
- **查看 `action` 的执行顺序**

### **3.3 使用 `trace()` 追踪状态**

`trace()` 可以打印**哪些组件或 `computed` 触发了更新**：

```javascript
import { trace } from "mobx";

const store = makeAutoObservable({
  count: 0,
  get double() {
    trace(); // 追踪计算属性调用
    return this.count * 2;
  }
});

console.log(store.double);
```

📌 **适用于**

- **查看 `computed` 是如何被触发的**
- **调试状态更新**

## **4. MobX 与 TypeScript**

MobX **完美支持 TypeScript**，可以通过 `observable`、`computed` 和 `action` 定义**强类型状态**。

### **4.1 定义 `observable` 状态的类型**

```typescript
import { makeAutoObservable } from "mobx";

class Store {
  count: number = 0;

  constructor() {
    makeAutoObservable(this);
  }
}
```

✅ **TypeScript 确保 `count` 是 `number` 类型

### **4.2 `computed` 和 `action` 的类型注解**

```typescript
import { makeAutoObservable } from "mobx";

class Store {
  count: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get double(): number {
    return this.count * 2;
  }

  increment(): void {
    this.count++;
  }
}
```

✅ **适用于**

- **`computed` 的返回值有明确类型**
- **`action` 需要返回 `void`**

## **总结**

### **✅ 优化 MobX 性能**

1️⃣ **只使用 `observer` 包裹必要的组件**  
2️⃣ **使用 `computed` 避免不必要的计算**  
3️⃣ **使用 `reaction` 监听特定状态变化**

### **✅ 调试工具**

4️⃣ **使用 `mobx-devtools` 监控状态变化**  
5️⃣ **使用 `spy()` 和 `trace()` 追踪数据流**

### **✅ TypeScript 最佳实践**

6️⃣ **为 `observable`、`computed`、`action` 添加类型**  
7️⃣ **提高代码可读性，避免类型错误**

🚀 **下一章，我们将探讨 MobX 的高级应用，包括 `flow` 处理异步状态、与 GraphQL 结合等！**
