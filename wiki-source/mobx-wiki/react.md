# **第三章：MobX 在 React 中的使用**

MobX 与 React 结合使用时，可以**让组件自动响应状态变化**，避免手动管理 `useState` 或 `useEffect` 的复杂逻辑。本章将介绍 **MobX 在 React 中的最佳实践**，包括：

- `observer` 让组件变成响应式
- `useLocalObservable` 管理组件状态
- `Provider + useStore` 共享全局状态
- **类组件 vs 函数组件**
- **处理异步数据（flow & async action）**

---

## **1. `observer` 高阶组件**

`observer` 是 MobX 提供的 **高阶组件（HOC）**，用于让 React 组件**自动监听 `observable` 变化**。

### **1.1 基本使用**

```javascript
import React from "react";
import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

const counter = new CounterStore();

const Counter = observer(() => {
  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={() => counter.increment()}>+1</button>
    </div>
  );
});

export default Counter;
```

✅ **特点**

- **`observer` 让组件变成响应式**
- **状态 `count` 变化时，UI 自动更新**
- **没有 `useState()`，但组件仍然是状态驱动的**

---

### **1.2 `observer` 内部原理**

`observer` **只会更新受影响的组件**，类似 `React.memo()`，提高性能：

- **只更新 `count` 相关的组件**
- **不会重新渲染整个应用**

✅ **示例：`observer` 只更新受影响组件**

```javascript
const Header = observer(() => {
  console.log("Header 渲染");
  return <h1>Counter</h1>;
});

const Counter = observer(() => {
  console.log("Counter 渲染");
  return <p>Count: {counter.count}</p>;
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

📌 **结论：**

- **只有 `Counter` 组件会重新渲染**
- **`Header` 组件不会重新渲染，提高性能**

---

## **2. 使用 `useLocalObservable` 管理组件状态**

在函数组件中，**可以用 `useLocalObservable` 代替 `useState`**，让状态变成 **响应式**。

✅ **示例：使用 `useLocalObservable`**

```javascript
import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";

const Counter = observer(() => {
  const counter = useLocalObservable(() => ({
    count: 0,
    increment() {
      this.count++;
    }
  }));

  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={counter.increment}>+1</button>
    </div>
  );
});

export default Counter;
```

✅ **适用于**

- **组件内部状态管理**
- **不需要全局状态的场景**
- **比 `useState` 更直观**

---

## **3. 使用 Provider 和 useStore 共享全局状态**

在大型应用中，通常需要一个**全局状态管理方案**。可以使用：

- **`createContext()` + `useStore()`**
- **`Provider` 提供全局 store**

---

### **3.1 创建全局 Store**

```javascript
import { createContext, useContext } from "react";
import { makeAutoObservable } from "mobx";

class RootStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

const StoreContext = createContext(new RootStore());

export const useStore = () => useContext(StoreContext);
```

---

### **3.2 使用 Provider 提供全局状态**

```javascript
import React from "react";
import { StoreContext, useStore } from "./store";

const Counter = observer(() => {
  const store = useStore();
  return (
    <div>
      <p>Count: {store.count}</p>
      <button onClick={() => store.increment()}>+1</button>
    </div>
  );
});

const App = () => {
  return (
    <StoreContext.Provider value={new RootStore()}>
      <Counter />
    </StoreContext.Provider>
  );
};
```

✅ **优点**

- **在全局 `Provider` 提供 store**
- **`useStore()` 让任意组件访问全局状态**
- **比 Redux 代码更少，管理更简单**

---

## **4. 类组件 vs 函数组件中的 MobX**

MobX **兼容类组件和函数组件**，但 **推荐在函数组件中使用 `observer` + `useLocalObservable`**。

### **4.1 类组件中的 MobX**

```javascript
import React from "react";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";

class CounterStore {
  count = 0;
  constructor() {
    makeAutoObservable(this);
  }
  increment() {
    this.count++;
  }
}

const store = new CounterStore();

@observer
class Counter extends React.Component {
  render() {
    return (
      <div>
        <p>Count: {store.count}</p>
        <button onClick={() => store.increment()}>+1</button>
      </div>
    );
  }
}

export default Counter;
```

📌 **结论：**

- **类组件需要 `@observer` 装饰器**
- **但 `@observer` 依赖 Babel，复杂度更高**
- **更推荐函数组件**

---

## **5. 处理异步数据（flow 和 async action）**

MobX **支持异步状态管理**，但推荐使用 `flow` 或 `async action` 处理异步逻辑。

### **5.1 `flow` 处理异步请求**

```javascript
import { makeAutoObservable, flow } from "mobx";

class Store {
  users = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchUsers = flow(function* () {
    const response = yield fetch("https://jsonplaceholder.typicode.com/users");
    const data = yield response.json();
    this.users = data;
  });
}

const store = new Store();
store.fetchUsers();
```

✅ **特点**

- **`flow` 支持 `yield`，比 `async/await` 更安全**
- **自动捕获错误**
- **不会影响 UI 渲染**

---

### **5.2 使用 `async action`**

```javascript
class Store {
  users = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    this.users = await response.json();
  }
}
```

✅ **适用于**

- **简单的异步请求**
- **不需要 `flow` 的情况下**

---

## **总结**

### **✅ `observer`**

1️⃣ **让 React 组件变成响应式**
2️⃣ **只更新受影响的组件**

### **✅ `useLocalObservable`**

3️⃣ **替代 `useState`，让组件状态变成响应式**
4️⃣ **适用于局部状态管理**

### **✅ `Provider + useStore`**

5️⃣ **适用于全局状态管理**
6️⃣ **比 Redux 更简单**

### **✅ 处理异步数据**

7️⃣ **使用 `flow` 处理异步请求**
8️⃣ **使用 `async action` 处理简单异步请求**

🚀 **下一章，我们将深入 MobX 的高级特性，如 `runInAction`、`reaction`、`when` 等！**
