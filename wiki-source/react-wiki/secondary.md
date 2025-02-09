# React 核心特性

在本章节中，我们将介绍 React 的核心特性，帮助你深入理解 React 如何通过 Hooks、事件处理、条件渲染、列表渲染以及表单处理来构建高效的用户界面。

## **1. Hooks 的使用**

### **什么是 Hooks？**

React Hooks 是 React 16.8 版本引入的一个重要特性，它允许开发者在函数组件中使用 **状态（State）** 和 **副作用（Effect）** 等功能。Hooks 使得函数组件能够拥有与类组件相同的能力，但语法更加简洁和清晰。

通过 Hooks，开发者无需编写类组件即可实现复杂的逻辑和生命周期管理，提升了代码的可读性和可维护性。

### **常用 Hooks：useState, useEffect, useContext**

#### **useState**

`useState` 是 React 最常用的 Hook，用于在函数组件中管理状态。它返回一个包含 **当前状态值** 和 **更新状态的函数** 的数组。

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

#### **useEffect**

`useEffect` 用于处理副作用（如数据获取、DOM 操作等），它类似于类组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount`。

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

#### **useContext**

`useContext` 是用来订阅 React 上下文的 Hook，它允许在组件树中的任何地方共享数据，而不需要通过逐层传递 `props`。

```jsx
import React, { useContext } from 'react';

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

### **自定义 Hooks 的实现**

自定义 Hooks 是一种允许你在多个组件中复用逻辑的方式。它是一个函数，可以调用其他的 React Hooks，并返回一些值。

```jsx
function useCounter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return [count, increment];
}

function Counter() {
  const [count, increment] = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

通过自定义 Hook，可以将一些常见的逻辑（如计数、表单处理等）提取出来，从而提高代码的复用性。

---

## **2. 事件处理**

### **React 事件的基本用法**

React 事件处理与传统的 DOM 事件处理略有不同。React 使用 **合成事件**（Synthetic Events），它是对浏览器原生事件的封装，确保跨浏览器的兼容性。

React 事件的基本语法与原生 JavaScript 事件相似，但有几个细节需要注意：

1. **事件名称是驼峰命名**，如 `onClick`、`onChange`。
2. **事件处理函数是一个函数**，并且会自动接收事件对象。

```jsx
function MyButton() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### **合成事件机制**

React 的合成事件是 **对浏览器原生事件的封装**，它是跨浏览器兼容的。使用合成事件时，不需要担心不同浏览器的实现差异，React 会自动处理。

React 的合成事件与原生 DOM 事件类似，但它们的生命周期不同。React 事件会在 **事件冒泡阶段** 捕获并触发。

---

## **3. 条件渲染**

### **if/else 条件语句**

React 中的条件渲染与 JavaScript 中的条件语句类似。你可以使用 `if/else` 来决定渲染哪一部分内容。

```jsx
function Greeting(props) {
  if (props.isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please log in</h1>;
  }
}
```

### **三元运算符与逻辑操作符**

React 中常用三元运算符和逻辑操作符进行条件渲染：

#### **三元运算符：**

```jsx
function Greeting(props) {
  return (
    <h1>
      {props.isLoggedIn ? 'Welcome back!' : 'Please log in'}
    </h1>
  );
}
```

#### **逻辑操作符（&&）**

如果条件为真，渲染第二个部分；如果条件为假，什么都不渲染。

```jsx
function Greeting(props) {
  return (
    <div>
      {props.isLoggedIn && <h1>Welcome back!</h1>}
    </div>
  );
}
```

---

## **4. 列表渲染**

### **使用 map 渲染列表**

React 提供了一个简便的方式来渲染列表数据，使用 `map()` 方法遍历数据并返回 JSX 元素。

```jsx
function ItemList(props) {
  const items = props.items;
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

在这个例子中，`map()` 方法遍历 `items` 数组，并为每个项生成一个 `<li>` 元素。`key` 是 React 的一个特别属性，用来帮助 React 高效地更新 DOM。

### **使用 key 提高性能**

`key` 属性帮助 React 在进行 DOM 更新时识别哪些项目被改变、添加或移除，从而提高渲染性能。

```jsx
const items = [1, 2, 3, 4];
return (
  <ul>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);
```

`key` 应该是 **唯一且稳定** 的，通常使用项的唯一标识符，如数据库中的 ID。

---

## **5. 表单处理**

### **受控组件与非受控组件**

在 React 中，表单元素（如 `<input>`、`<textarea>`、`<select>` 等）有两种处理方式：**受控组件**和**非受控组件**。

#### **受控组件**

受控组件是指其值由 React 状态控制的表单组件。每当用户输入数据时，React 更新状态并重新渲染组件。

```jsx
function NameForm() {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    alert('A name was submitted: ' + name);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### **非受控组件**

非受控组件是指由 DOM 自身管理值的组件。React 使用 `ref` 获取表单元素的值，而不是通过状态管理。

```jsx
function NameForm() {
  const inputRef = useRef();

  const handleSubmit = (event) => {
    alert('A name was submitted: ' + inputRef.current.value);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" ref={inputRef} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### **表单验证的实现**

表单验证通常是在用户提交表单时进行。可以通过 `onSubmit` 事件来捕捉表单数据，并验证其正确性。

```jsx
function Form() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      setError('Name is required');
    } else {
      setError('');
      alert('Form submitted');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## **总结**

在本章中，我们学习了 React 的核心特性：

- **Hooks 的使用**：`useState`、`useEffect`、`useContext`、`useReducer` 等 Hook 的使用
- **事件处理**：React 合成事件机制，事件绑定
- **条件渲染**：`if/else`、三元运算符、逻辑运算符进行条件渲染
- **列表渲染**：使用 `map()` 渲染列表，`key` 提高性能
- **表单处理**：受控组件与非受控组件的实现，表单验证

这些基础知识将帮助你更好地构建 React 应用，提升开发效率和代码可维护性。接下来的章节将深入探讨 **React 路由**、**状态管理**、**性能优化** 等进阶内容，进一步提升你的 React 开发技能。
