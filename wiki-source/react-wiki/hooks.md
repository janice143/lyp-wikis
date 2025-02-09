# 第三章：React Hooks

## 什么是 React Hooks？

React Hooks 是 React 16.8 引入的新特性，它为函数组件提供了状态管理和副作用处理的能力，使得函数组件能够拥有和类组件一样的功能。React Hooks 彻底改变了我们编写 React 组件的方式，使得函数组件成为主流选择。使用 Hooks 后，开发者无需再编写类组件，便能完成大部分操作，代码变得更加简洁、易懂。

React 提供了一些内置的 Hook，使得开发者可以在函数组件中使用 **状态（State）**、**生命周期（Lifecycle）**、**副作用（Side Effects）** 等功能。

---

## **常用的 React Hooks**

### **1. useState**

`useState` 是 React 中最常用的 Hook，用于在函数组件中添加状态。

#### **基本用法**

`useState` 返回一个数组，第一个元素是当前的状态值，第二个元素是更新状态的函数。可以通过该函数来修改状态，触发组件重新渲染。

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // 初始化状态为 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

- **初始状态**：`useState` 接受一个参数作为初始状态值。
- **更新状态**：调用返回的 `setCount` 函数来更新状态。

### **2. useEffect**

`useEffect` 用于处理副作用（如数据获取、DOM 操作、订阅等），它的作用类似于类组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount`。

#### **基本用法**

`useEffect` 可以接受两个参数：

- 第一个参数是一个函数，包含副作用的代码。
- 第二个参数是一个依赖数组，用于控制副作用的触发条件。如果依赖数组为空，则表示只在组件挂载和卸载时触发副作用。

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // 只有 count 变化时才会重新运行

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

- `useEffect` 允许你在组件挂载后执行某些副作用操作，例如更新文档标题、获取数据等。
- 依赖数组 `[count]` 确保只有在 `count` 改变时才重新运行副作用函数。

#### **清理副作用**

`useEffect` 还可以返回一个清理函数，用于清除副作用，例如取消网络请求、移除事件监听器等：

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("This runs every second");
  }, 1000);

  // 清理副作用
  return () => clearInterval(timer);
}, []); // 只在组件挂载时执行一次
```

### **3. useContext**

`useContext` 是用来订阅 React 上下文（Context）的 Hook。它允许你在组件树中共享数据而不必通过 props 逐层传递。

#### **基本用法**

```jsx
import React, { useContext } from 'react';

// 创建一个 Context
const ThemeContext = React.createContext('light');

function ThemedComponent() {
  const theme = useContext(ThemeContext); // 订阅主题

  return <div>Current theme is {theme}</div>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  );
}
```

- `useContext` 获取到 `ThemeContext` 的当前值。
- `ThemeContext.Provider` 用于向下传递上下文数据。

### **4. useReducer**

`useReducer` 是 `useState` 的替代品，通常用于复杂的状态逻辑，例如多个子值依赖的状态更新。它的工作方式类似于 Redux。

#### **基本用法**

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
}
```

- `useReducer` 接受两个参数：**reducer 函数**和**初始状态**。
- `dispatch` 用于发送动作（`action`），并根据 `action` 更新状态。

### **5. useMemo 和 useCallback**

`useMemo` 和 `useCallback` 都是用于优化性能的 Hook。它们确保只有在依赖项改变时才重新计算或重新创建函数，避免不必要的计算和渲染。

#### **useMemo**：缓存计算结果

```jsx
import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ number }) {
  const computedValue = useMemo(() => {
    return expensiveCalculation(number);
  }, [number]); // 只有 number 变化时才重新计算

  return <div>{computedValue}</div>;
}
```

#### **useCallback**：缓存函数实例

```jsx
import React, { useState, useCallback } from 'react';

function Button({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
}

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return <Button onClick={handleClick} />;
}
```

### **6. useRef**

`useRef` 返回一个可变的引用对象，该对象在组件的整个生命周期中保持不变。`useRef` 常用于访问 DOM 元素或保存一个跨渲染周期不需要重新渲染的值。

#### **基本用法**

```jsx
import React, { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // 使输入框自动获取焦点
  }, []);

  return <input ref={inputRef} />;
}
```

---

## **总结**

本章介绍了 **React Hooks** 的核心概念和常用的 Hook，包括：

- **useState**：管理组件的状态
- **useEffect**：处理副作用
- **useContext**：订阅上下文
- **useReducer**：管理复杂的状态逻辑
- **useMemo** 和 **useCallback**：性能优化
- **useRef**：引用和存储值

Hooks 使得 React 的函数组件能够具备与类组件一样的功能，提供了更简洁、灵活的编程方式。接下来的章节将深入探讨 React 的 **状态管理、路由控制、性能优化** 等内容，帮助你在实际项目中更高效地使用 React。
