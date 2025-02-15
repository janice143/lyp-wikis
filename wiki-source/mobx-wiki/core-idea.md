# **第二章：MobX 核心概念**

MobX 通过 **observable（可观察状态）、action（修改状态）、computed（计算属性）、reaction（副作用处理）** 组成了一个强大的响应式系统。本章将详细介绍 MobX 的核心概念及其最佳实践。

---

## **1. observable（可观察状态）**

**`observable`** 是 MobX 的核心，负责让**对象、数组、Map、Set** 变成 **响应式**，当状态变化时，依赖它的组件会自动更新。

### **1.1 让对象、数组、Map、Set 变成可观察的**

可以使用 **`makeObservable` 或 `makeAutoObservable`** 让状态变成可观察的：

```javascript
import { makeObservable, observable } from "mobx";

class Store {
  count = 0;
  users = [];

  constructor() {
    makeObservable(this, {
      count: observable,
      users: observable
    });
  }
}

const store = new Store();
console.log(store.count); // 0
store.count++;
console.log(store.count); // 1（会自动触发 UI 更新）
```

### **1.2 `makeObservable` vs `makeAutoObservable`**

| 方法 | 适用场景 | 需要手动声明 observable | 代码简洁性 |
|------|---------|------------------|----------|
| `makeObservable(this, { count: observable })` | 需要手动定义 observable、action | ✅ 需要 | ❌ 代码稍多 |
| `makeAutoObservable(this)` | 自动检测所有字段 | ❌ 不需要 | ✅ 更简洁 |

✅ **示例：`makeAutoObservable`（更简洁）**

```javascript
import { makeAutoObservable } from "mobx";

class Store {
  count = 0;
  users = [];

  constructor() {
    makeAutoObservable(this); // 自动将所有字段变成 observable
  }
}
```

**`makeAutoObservable` 适用于大部分场景**，但如果你需要更精细的控制（如 `computed` 和 `action`），可以使用 `makeObservable`。

---

## **2. action（修改状态的操作）**

默认情况下，**MobX 允许直接修改 observable 状态**，但推荐使用 **`action`** 来管理状态变更，以提高可读性和可维护性。

### **2.1 为什么要用 action 更新状态？**

- **保证状态变更是有意的，避免意外修改**
- **提高可读性**
- **支持 `runInAction` 处理异步操作**

### **2.2 `action` 的基本用法**

```javascript
import { makeAutoObservable, action } from "mobx";

class Store {
  count = 0;

  constructor() {
    makeAutoObservable(this, {
      increment: action
    });
  }

  increment() {
    this.count++;
  }
}
```

✅ **作用**

- `increment()` 负责**修改状态**
- `action` 让 MobX **知道该方法会修改状态**，从而优化性能

---

### **2.3 `runInAction` 处理异步操作**

`runInAction` 允许在异步请求完成后**批量更新状态**：

```javascript
import { makeAutoObservable, runInAction } from "mobx";

class Store {
  count = 0;
  data = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchData() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const result = await response.json();
    
    runInAction(() => {
      this.data = result;
    });
  }
}
```

✅ **作用**

- **在 `runInAction` 里批量修改状态**，避免多次渲染
- **适用于异步请求**

---

## **3. computed（计算属性）**

**`computed`** 是基于 **observable** 的**派生值**，它只有在 **依赖数据发生变化时才会重新计算**，提高性能。

### **3.1 什么时候使用 computed？**

- **当一个值依赖多个 observable 时**
- **当需要避免不必要的计算时**

✅ **示例**

```javascript
import { makeAutoObservable, computed } from "mobx";

class Store {
  count = 5;

  constructor() {
    makeAutoObservable(this, {
      double: computed
    });
  }

  get double() {
    return this.count * 2; // 只有当 count 变化时才重新计算
  }
}

const store = new Store();
console.log(store.double); // 10
store.count = 10;
console.log(store.double); // 20
```

**computed 只有在 `count` 变化时才会重新计算**，避免不必要的计算。

---

## **4. reaction（副作用处理）**

**reaction** 允许我们**在状态变化时执行副作用**，常用于**日志、数据同步、异步请求**等场景。

### **4.1 `autorun`（自动追踪依赖）**

**`autorun` 会自动追踪 observable，并在其变化时执行回调**：

```javascript
import { observable, autorun } from "mobx";

const store = observable({ count: 0 });

autorun(() => {
  console.log("Count changed:", store.count);
});

store.count = 1; // 打印: Count changed: 1
store.count = 2; // 打印: Count changed: 2
```

✅ **特点**

- **初次执行**
- **每次 `count` 变化时都会触发**

---

### **4.2 `reaction`（显式指定依赖）**

**`reaction` 只监听**特定的 `observable`，并在**其变化时执行副作用**：

```javascript
import { observable, reaction } from "mobx";

const store = observable({ count: 0 });

reaction(
  () => store.count, // 只监听 count 变化
  count => console.log("Count changed:", count)
);

store.count = 1; // 打印: Count changed: 1
store.count = 2; // 打印: Count changed: 2
```

✅ **适用于**

- **只监听特定字段，而不是所有 observable**

---

### **4.3 `when`（只运行一次的副作用）**

**`when` 适用于某个状态变为 `true` 时，只执行一次副作用**：

```javascript
import { observable, when } from "mobx";

const store = observable({ isLoaded: false });

when(
  () => store.isLoaded === true,
  () => console.log("数据加载完成！")
);

store.isLoaded = true; // 触发副作用: "数据加载完成！"
store.isLoaded = false; // 不会再触发
```

✅ **适用于**

- **某个任务完成后执行副作用**
- **只想执行一次的逻辑**

---

## **总结**

### **✅ observable**

- **让对象、数组、Map、Set 变成响应式**
- **`makeAutoObservable` 自动处理，推荐使用**
  
### **✅ action**

- **使用 `action` 统一管理状态修改**
- **`runInAction` 适用于异步操作**

### **✅ computed**

- **只在依赖数据变化时才重新计算**
- **避免不必要的计算，提高性能**

### **✅ reaction**

- **`autorun()` 自动追踪所有依赖**
- **`reaction()` 只监听指定 observable**
- **`when()` 适用于一次性副作用**

🚀 **下一章，我们将学习如何在 React 中集成 MobX，并使用 `observer` 监听状态变化！**
