### **MobX 小册**

本小册系统性介绍 MobX，从基础概念到高级特性，帮助开发者理解其核心思想，并掌握如何在 React 或其他框架中高效地管理状态，实现响应式数据流。

---

## **1. MobX 简介**

- 什么是 MobX？
- MobX 与传统状态管理（Redux、Context API）的区别
- MobX 响应式编程的核心思想
- MobX 适用于哪些场景？
- MobX 与 MobX-State-Tree（MST）的关系

---

## **2. MobX 核心概念**

- **`observable`（可观察状态）**
  - 让对象、数组、Map、Set 变成可观察的
  - `makeObservable` vs `makeAutoObservable`
- **`action`（修改状态的操作）**
  - 为什么要用 `action` 更新状态？
  - `runInAction` 的用法
- **`computed`（计算属性）**
  - 什么时候使用 `computed` ？
  - `computed` 如何提高性能？
- **`reaction`（副作用处理）**
  - `autorun`：自动追踪依赖
  - `reaction`：显式指定依赖
  - `when`：只运行一次的副作用

---

## **3. MobX 在 React 中的使用**

- **`observer` 高阶组件**
- **使用 `useLocalObservable` 管理组件状态**
- **使用 `Provider` 和 `useStore` 共享全局状态**
- **类组件 vs 函数组件中的 MobX**
- **处理异步数据（`flow` 和 `async action`）**

---

## **4. MobX 进阶**

- **如何优化 MobX 性能**
  - 避免不必要的重新渲染
  - `computed` 结合 `reaction`
- **调试 MobX**
  - `mobx-devtools`
  - `spy` 和 `trace` 调试状态变化
- **MobX 与 TypeScript**
  - 如何定义 `observable` 状态的类型？
  - `computed` 和 `action` 的类型注解

---

## **5. MobX 与其他状态管理方案对比**

- **MobX vs Redux**
  - 开发体验
  - 学习成本
  - 适用场景
- **MobX vs Recoil**
- **MobX vs Zustand**

---

## **6. MobX 项目实战**

- **实战 1：使用 MobX 构建 Todo 应用**
- **实战 2：MobX + React Router 结合**
- **实战 3：MobX + TypeScript 搭建大型前端应用**
- **实战 4：MobX + WebSocket 处理实时数据**

---

## **7. 未来展望**

- MobX 发展趋势
- MobX 与 Server Components 的结合
- MobX 在前端状态管理中的地位

---

本小册完整覆盖 MobX 的基础、进阶、性能优化和实战应用，帮助开发者高效管理 React 或其他框架中的状态，实现流畅的响应式开发体验！ 🚀
