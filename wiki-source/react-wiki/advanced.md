# React 进阶

在本章中，我们将深入探讨 React 的进阶特性，涵盖组件间通信、Refs、性能优化等方面。通过掌握这些进阶特性，你将能够更高效地组织 React 应用的架构、优化性能，并处理复杂的用户界面交互。

---

## **1. 组件间通信**

### **父子组件通信**

父子组件通信是 React 中最常见的通信方式，父组件通过 **props** 将数据传递给子组件。子组件则通过访问 `props` 来获取父组件传递的数据，并可以通过父组件传递的函数来触发父组件的状态更新。

```jsx
// 父组件
function Parent() {
  const [message, setMessage] = useState('Hello from Parent');

  return <Child message={message} updateMessage={setMessage} />;
}

// 子组件
function Child({ message, updateMessage }) {
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => updateMessage('Updated by Child')}>Update</button>
    </div>
  );
}
```

在这个例子中，父组件将 `message` 通过 `props` 传递给子组件，并将 `setMessage` 函数传递给子组件。当子组件点击按钮时，父组件的 `message` 状态被更新。

### **兄弟组件通信：通过状态提升或 Context**

当需要在兄弟组件之间进行通信时，可以通过 **状态提升** 或 **Context API** 实现。

#### **状态提升**

状态提升是指将子组件的共享状态提升到它们的父组件，父组件再通过 `props` 将状态传递给兄弟组件。

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ChildA count={count} />
      <ChildB setCount={setCount} />
    </div>
  );
}

// 子组件A
function ChildA({ count }) {
  return <p>Count: {count}</p>;
}

// 子组件B
function ChildB({ setCount }) {
  return <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>;
}
```

在这个例子中，父组件管理了 `count` 状态，并通过 `props` 将它传递给 `ChildA` 和 `ChildB`。`ChildB` 更新 `count` 时，`ChildA` 会重新渲染。

#### **使用 Context API**

`Context API` 允许在组件树中跨越多个层级共享数据，避免了 `props` 层层传递的问题，适合于全局状态或配置的数据传递。

---

## **2. Context API**

### **什么是 Context？**

`Context` 是 React 提供的一种共享数据的方式，它可以让我们在组件树中共享数据而不需要通过每个组件的 `props` 来逐层传递。常见的应用场景包括用户认证信息、主题切换、语言切换等全局状态。

### **使用 React.createContext 和 useContext**

React 中的 Context 是通过 `React.createContext` 创建的，`useContext` Hook 用于在函数组件中订阅 Context。

#### **创建 Context**

```jsx
const ThemeContext = React.createContext('light'); // 创建一个默认值为 'light' 的 Context
```

#### **提供数据**

使用 `ThemeContext.Provider` 来提供 Context 的值：

```jsx
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  );
}
```

#### **消费数据**

子组件通过 `useContext` 获取 Context 的值：

```jsx
function ThemedComponent() {
  const theme = useContext(ThemeContext);
  return <div>Current theme is {theme}</div>;
}
```

`useContext` 会返回 `ThemeContext.Provider` 中提供的值，即 `dark`。

---

## **3. Refs 与 DOM 操作**

### **什么是 Refs？**

`Refs`（引用）是 React 提供的一种方式，可以让你访问和操作 DOM 元素或 React 组件实例。在 React 中，通常情况下我们不直接操作 DOM，但有些情况下（如焦点控制、文本选择、动画等）我们需要直接访问 DOM 元素，`refs` 就是用来实现这种需求的。

### **使用 useRef 访问 DOM 元素**

`useRef` Hook 返回一个可变的 `ref` 对象，`ref.current` 可以用来访问 DOM 元素或组件实例。

#### **基本用法**

```jsx
function FocusInput() {
  const inputRef = useRef();

  const handleFocus = () => {
    inputRef.current.focus(); // 聚焦输入框
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Focus the input</button>
    </div>
  );
}
```

在这个例子中，`inputRef` 用于引用输入框，点击按钮时通过 `inputRef.current.focus()` 来聚焦输入框。

#### **访问类组件的实例**

`ref` 不仅可以用来访问 DOM 元素，还可以用来访问类组件的实例：

```jsx
class MyComponent extends React.Component {
  myMethod() {
    console.log('MyComponent method called');
  }

  render() {
    return <div>MyComponent</div>;
  }
}

function Parent() {
  const componentRef = useRef();

  const handleClick = () => {
    componentRef.current.myMethod(); // 调用 MyComponent 的方法
  };

  return (
    <div>
      <MyComponent ref={componentRef} />
      <button onClick={handleClick}>Call method</button>
    </div>
  );
}
```

---

## **4. 性能优化**

### **React.memo 的使用**

`React.memo` 是 React 提供的一个高阶组件，用于优化函数组件的渲染性能。它会记住上一次渲染的输出，并在相同的 `props` 下跳过重新渲染。

#### **基本用法**

```jsx
const MyComponent = React.memo(function MyComponent({ value }) {
  console.log('Rendering MyComponent');
  return <p>{value}</p>;
});
```

`React.memo` 仅在 `props` 改变时才会重新渲染组件。适用于渲染频繁且 `props` 不经常变化的组件。

### **useCallback 与 useMemo 的应用场景**

`useCallback` 和 `useMemo` 用于优化性能，避免不必要的计算和渲染。

- **useCallback** 用于缓存函数实例，避免在每次渲染时都创建新的函数。
- **useMemo** 用于缓存计算结果，避免在每次渲染时都重新计算。

#### **useCallback 示例**

```jsx
const handleClick = useCallback(() => {
  console.log('Button clicked');
}, []);
```

`handleClick` 会在 `[]` 为空时只创建一次，避免了每次渲染都重新创建函数。

#### **useMemo 示例**

```jsx
const computedValue = useMemo(() => expensiveCalculation(value), [value]);
```

`computedValue` 只有在 `value` 改变时才会重新计算，从而减少了不必要的计算。

### **分片渲染与懒加载**

**分片渲染**和**懒加载**是两种常见的性能优化技术，特别是在渲染大量数据时。

- **懒加载**：React 的 `React.lazy` 和 `Suspense` 可以实现按需加载组件，减少初始加载时间。

#### **React.lazy 示例**

```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

`React.lazy` 用于动态导入组件，`Suspense` 用于在组件加载时显示加载状态。

---

## **总结**

本章介绍了 React 中的一些进阶特性：

- **组件间通信**：父子组件、兄弟组件之间的通信，包括通过 `props`、状态提升和 `Context API` 实现。
- **Refs 和 DOM 操作**：使用 `useRef` 访问 DOM 元素和类组件实例，处理 DOM 操作。
- **性能优化**：通过 `React.memo`、`useCallback`、`useMemo` 来优化组件的性能，避免不必要的重新渲染和计算。
- **分片渲染与懒加载**：通过 `React.lazy` 和 `Suspense` 实现懒加载，提高应用性能。

这些进阶特性将帮助你在开发 React 应用时更高效地组织代码、优化性能，并实现更复杂的组件交互。接下来的章节将探讨 **React 路由**、**状态管理** 等内容，进一步提升你的 React 开发能力。
