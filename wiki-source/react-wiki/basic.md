# 第二章：React 基础

React 是一个用于构建用户界面的 JavaScript 库，它通过声明式的方式来构建复杂的 UI。了解 React 的基础知识对于开发高效且可维护的 React 应用至关重要。本章将介绍 React 的核心概念，包括 JSX 语法、组件、状态管理、Props 等基础内容，并帮助你掌握这些基础知识，以便能够构建出功能丰富的应用。

---

## **1. JSX 语法**

### **1.1 JSX 的基本语法规则**

JSX（JavaScript XML）是一种 JavaScript 语法扩展，使得我们能够在 JavaScript 代码中写类似 HTML 的代码。它看起来像 HTML，但实际上是 JavaScript 的一种语法糖。React 会通过 Babel 转换这些 JSX 代码为标准的 JavaScript。

#### **基本规则：**

- **元素标签**：JSX 标签看起来类似 HTML 标签，但必须闭合标签。比如 `<div></div>` 或 `<img />`。
- **嵌套元素**：多个 JSX 元素需要包裹在一个父元素中（例如 `<div>`，`<section>`），否则会出现错误。
- **属性**：JSX 使用驼峰式命名规则定义属性，例如 `className` 替代 `class`，`htmlFor` 替代 `for`。
- **表达式插值**：在 JSX 中，任何 JavaScript 表达式都可以用 `{}` 包裹，如 `{user.name}`。

```jsx
const element = <h1>Hello, world!</h1>;
```

#### **示例：**

```jsx
const element = <h1 className="greeting">Hello, {name}!</h1>;
```

### **1.2 JSX 与 JavaScript 的关系**

JSX 是 JavaScript 的一种语法扩展，它会被转化为普通的 JavaScript 代码。在 React 中，JSX 会被转译成 `React.createElement()` 调用。这些 `createElement` 调用最终生成了虚拟 DOM 元素，并交给 React 来渲染。

#### **JSX 转译后的代码：**

```jsx
const element = <h1>Hello, world!</h1>;
```

会转译成：

```javascript
const element = React.createElement('h1', null, 'Hello, world!');
```

---

## **2. 组件**

React 组件是 React 应用的构建块。组件允许我们将界面分解成独立的、可复用的部分，每个组件都有自己的逻辑和视图。

### **2.1 函数组件与类组件**

#### **函数组件（Function Components）**

函数组件是 React 最常用的组件类型，它是一个简单的 JavaScript 函数，返回要渲染的 JSX。

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

函数组件没有自己的状态和生命周期方法，但可以通过 `Hooks`（如 `useState`, `useEffect`）来管理状态和副作用。

#### **类组件（Class Components）**

类组件是 React 的传统组件方式。类组件继承自 `React.Component`，并且必须有一个 `render()` 方法来返回 JSX。

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

类组件支持状态和生命周期方法，但由于函数组件更为简洁和灵活，现在推荐使用函数组件。

### **2.2 组件的生命周期（以类组件为例）**

React 组件有不同的生命周期阶段，主要包括：挂载（Mounting）、更新（Updating）和卸载（Unmounting）。类组件通过生命周期方法来执行某些操作。

#### **常用生命周期方法：**

- **`componentDidMount`**：组件挂载完成后调用。常用于发起 API 请求、初始化设置等。
- **`componentDidUpdate`**：组件更新后调用。常用于响应 prop 或 state 的变化。
- **`componentWillUnmount`**：组件卸载前调用。常用于清理操作，比如清除定时器、取消订阅等。

```jsx
class Example extends React.Component {
  componentDidMount() {
    console.log('Component mounted');
  }

  componentDidUpdate() {
    console.log('Component updated');
  }

  componentWillUnmount() {
    console.log('Component will unmount');
  }

  render() {
    return <div>Example Component</div>;
  }
}
```

---

## **3. 组件的复用与组织**

### **3.1 组件的复用**

React 的组件化特性使得我们可以将复杂的 UI 分解为多个小的、独立的组件。通过传递不同的 `props`（属性），可以复用同一个组件来展示不同的数据。

```jsx
function Button({ label }) {
  return <button>{label}</button>;
}

<Button label="Click me" />
<Button label="Submit" />
```

### **3.2 组件的组织**

为了使代码更加清晰和易于维护，通常会将相关组件组织成文件夹结构。例如，可以为每个业务模块创建一个文件夹，并在其中存放相关组件。

```
/components
  /Header
    Header.js
    Header.css
  /Footer
    Footer.js
    Footer.css
```

---

## **4. 状态管理**

### **4.1 使用 `useState` 管理组件状态**

`useState` 是 React 中最常用的 Hook，用于在函数组件中管理状态。`useState` 返回一个数组，其中第一个值是当前状态，第二个值是更新该状态的函数。

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={increment}>Click me</button>
    </div>
  );
}
```

### **4.2 状态的更新机制与异步特性**

React 的 `setState` 或 `useState` 更新状态是异步的。状态更新操作可能不会立即反映在下一行代码中。这是因为 React 批量处理更新，以提高性能。

```jsx
const handleClick = () => {
  setCount(count + 1);
  console.log(count); // 这里可能会打印旧值，因为 setState 是异步的
};
```

为了避免这种问题，可以使用函数式更新形式，它可以访问到最新的状态值。

```jsx
setCount(prevCount => prevCount + 1);
```

---

## **5. Props（属性）**

### **5.1 使用 Props 传递数据**

Props 是 React 中组件之间通信的基础机制。父组件通过 Props 向子组件传递数据。

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return <Greeting name="John" />;
}
```

`props` 是一个只读的对象，子组件不能修改父组件传递的 `props`。

### **5.2 Props 的类型校验（PropTypes 和 TypeScript）**

#### **PropTypes**（用于 JavaScript）

`PropTypes` 是 React 内置的类型校验工具，用于检查组件传递的 Props 是否符合预期的类型。它在开发过程中非常有用，可以捕捉到潜在的错误。

```jsx
import PropTypes from 'prop-types';

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
};
```

#### **TypeScript**（用于 TypeScript）

如果使用 TypeScript，可以通过类型注解来校验 Props 的类型。

```tsx
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
```

TypeScript 提供了更强大的类型检查功能，可以确保开发过程中的类型安全。

---

## **总结**

本章介绍了 React 中的一些基础概念：

- **JSX 语法**：JSX 是 JavaScript 的语法扩展，用于描述 UI。
- **组件**：React 组件是构建应用的核心，支持函数组件和类组件。
- **组件的生命周期**：类组件的生命周期方法可以让开发者在不同阶段执行自定义操作。
- **状态管理**：使用 `useState` Hook 来管理组件状态，并了解状态更新的异步机制。
- **Props**：通过 `props` 在组件之间传递数据，使用 `PropTypes` 或 TypeScript 进行类型校验。

掌握这些基础知识后，您将能够在 React 中编写结构清晰、功能完备的组件，并有效管理组件状态和数据传递。
