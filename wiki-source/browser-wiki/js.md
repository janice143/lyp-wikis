# **第四章：JavaScript 在浏览器中的执行**

JavaScript 是浏览器中的核心编程语言，负责 **DOM 操作、事件处理、异步操作** 等功能。它的执行依赖于 **JavaScript 引擎**，并受 **事件循环（Event Loop）** 控制，影响页面的交互性和性能。本章将详细解析 **JS 执行过程、事件循环、渲染阻塞、垃圾回收机制及优化策略**。

---

## **1. JavaScript 引擎**

JavaScript 引擎（JS Engine）是浏览器中 **解析、编译、执行 JavaScript** 的核心组件。不同浏览器采用不同的 JS 引擎：

| 浏览器 | JavaScript 引擎 |
|--------|----------------|
| Chrome / Edge | **V8** |
| Firefox | **SpiderMonkey** |
| Safari | **JavaScriptCore（JSC）** |

### **1.1 解析、编译、执行的过程**

JavaScript 引擎的执行流程如下：

1. **解析（Parsing）**：
   - 将 JavaScript 代码转换成 **AST（抽象语法树）**。
   - 词法分析（Lexing）：将代码拆解成 Token。
   - 语法分析（Parsing）：将 Token 解析成 AST。

2. **编译（Compilation）**：
   - 现代 JS 引擎使用 **JIT（Just-In-Time 编译）**，动态将 JS 代码转换为 **机器码**，提升执行速度。
   - **V8 引擎优化策略**：
     - **Ignition**：字节码解释执行器。
     - **TurboFan**：优化编译器，提高运行效率。

3. **执行（Execution）**：
   - 解释执行（Interpreter）：**直接执行字节码**。
   - JIT 编译（JIT Compiler）：**热点代码优化**，加快执行速度。

✅ **优化建议**：

- 避免过多 **动态属性**，影响 JIT 编译优化。
- 使用相同类型的数据，减少 Hidden Class 变更，提高执行效率。

---

## **2. 事件循环（Event Loop）**

### **2.1 什么是事件循环？**

JavaScript 是 **单线程** 语言，但它能处理异步任务（如 **定时器、DOM 事件、网络请求**）。这是因为 **事件循环（Event Loop）** 机制。

#### **事件循环的核心概念**

1. **调用栈（Call Stack）**：
   - 执行同步代码，遇到异步任务则放入任务队列。

2. **任务队列（Task Queue）**：
   - **宏任务（Macro Task）**：`setTimeout`、`setInterval`、`requestAnimationFrame`、I/O 操作等。
   - **微任务（Micro Task）**：`Promise.then`、`MutationObserver`、`queueMicrotask`。

3. **事件循环（Event Loop）**：
   - 依次执行 **调用栈中的任务**。
   - **执行完同步代码后，依次执行所有微任务（Micro Task）**。
   - **然后执行宏任务（Macro Task）**，进入下一轮循环。

---

### **2.2 宏任务（Macro Task）与微任务（Micro Task）**

| 类型 | 任务示例 |
|------|---------|
| **宏任务** | `setTimeout`、`setInterval`、`setImmediate`、`requestAnimationFrame` |
| **微任务** | `Promise.then`、`MutationObserver`、`queueMicrotask` |

#### **示例：setTimeout、Promise.then 执行顺序**

```javascript
console.log("Start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

✅ **执行顺序**：

```
Start
End
Promise
setTimeout
```

**解析**：

1. `console.log("Start")` 和 `console.log("End")` **是同步任务**，立即执行。
2. `setTimeout` **是宏任务**，放入宏任务队列。
3. `Promise.then` **是微任务**，放入微任务队列。
4. **执行完同步代码后，先执行微任务（Promise），再执行宏任务（setTimeout）**。

✅ **优化建议**：

- **避免过多微任务**，否则可能导致渲染阻塞。
- **`requestAnimationFrame` 适用于动画**，比 `setTimeout` 更流畅。

---

## **3. JavaScript 对渲染的影响**

### **3.1 阻塞渲染（同步脚本）**

当浏览器解析 HTML 时，遇到 **`<script>` 标签** 会暂停解析 HTML，先执行 JavaScript，导致**渲染阻塞**。

#### **阻塞示例**

```html
<script src="large.js"></script> <!-- 页面解析会被阻塞 -->
```

**问题**：

- JavaScript 需要下载、解析、执行，**会阻塞 HTML 渲染**。
- 大型脚本可能 **延迟页面加载**，影响用户体验。

---

### **3.2 解决方案：defer & async**

为了优化页面加载，可以使用 **`defer`** 和 **`async`**。

| 方式 | 是否阻塞 HTML 解析 | 执行顺序 |
|------|-----------------|---------|
| **同步 `<script>`** | **阻塞** | 立即执行 |
| **`defer`** | **不阻塞** | 按顺序执行，等 DOM 加载完毕后执行 |
| **`async`** | **不阻塞** | **下载完立即执行，不保证顺序** |

#### **示例：使用 `defer`**

```html
<script src="main.js" defer></script>
```

✅ **适用于业务逻辑 JS（依赖 DOM 结构）**。

#### **示例：使用 `async`**

```html
<script src="analytics.js" async></script>
```

✅ **适用于独立 JS（如统计代码）**。

✅ **最佳实践**：

- 业务逻辑 JS 用 `defer`。
- 外部分析代码用 `async`。

---

## **4. 垃圾回收（Garbage Collection, GC）**

JavaScript 采用**自动垃圾回收**，主要使用 **标记清除** 和 **引用计数** 方式。

### **4.1 标记清除（Mark and Sweep）**

1. **标记（Marking）**：
   - 遍历所有可达对象（从 `window`、`global` 开始）。
   - 标记仍然可以访问的对象。

2. **清除（Sweeping）**：
   - 删除未被标记的对象，释放内存。

✅ **适用于处理循环引用问题**。

---

### **4.2 引用计数（Reference Counting）**

- 每个对象都有 **引用计数**，如果计数变为 0，则释放内存。
- 但会导致 **循环引用问题**。

#### **示例：循环引用导致内存泄漏**

```javascript
function leakMemory() {
  let a = {};
  let b = {};
  a.ref = b;
  b.ref = a; // 循环引用
}
leakMemory();
```

✅ **解决方案**：

- **避免循环引用**。
- **使用 `WeakMap` 或 `WeakSet`** 处理可回收对象：

  ```javascript
  let map = new WeakMap();
  let obj = {};
  map.set(obj, "some value");
  obj = null; // `obj` 会被自动回收
  ```

✅ **最佳实践**：

- **手动清理 DOM 引用**（如 `removeChild`）。
- **避免全局变量**，尽量使用局部变量。

---

## **总结**

JavaScript 在浏览器中的执行涉及多个关键机制：
1️⃣ **JS 引擎（解析 → JIT 编译 → 执行）**  
2️⃣ **事件循环（同步、微任务、宏任务）**  
3️⃣ **JS 影响渲染（同步脚本阻塞）**  
4️⃣ **垃圾回收（Mark-Sweep，避免内存泄漏）**  

✅ **优化建议**：

- 使用 **`defer` 加载 JS**，避免阻塞渲染。
- 优先使用 **`Promise`** 处理异步任务。
- **减少 DOM 操作**，提高性能。
- **避免循环引用**，优化垃圾回收。

在下一章，我们将深入探讨 **浏览器存储机制（LocalStorage、IndexedDB、Cookies）**！ 🚀
