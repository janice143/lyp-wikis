# React 与异步操作

在现代 Web 应用中，异步操作是不可避免的，尤其是在与服务器 API 交互时。React 提供了多种方法来处理异步操作，确保我们的 UI 在数据加载过程中能保持流畅，并能优雅地处理错误和加载状态。

本章将深入探讨 React 与异步操作的结合，包括如何与 API 交互、如何使用 React Query 进行数据管理，以及如何处理异步操作中的错误。

---

## **1. 与 API 的交互**

React 中与 API 的交互通常通过 **`fetch`** 或 **`axios`** 进行，常用于获取外部数据、提交表单或处理服务器响应。

### **使用 fetch 获取数据**

`fetch` 是原生 JavaScript 提供的用于发送 HTTP 请求的 API。它返回一个 Promise，因此可以通过 `.then()` 或 `async/await` 来处理响应。

#### **基本用法：**

```jsx
import React, { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataFetcher;
```

在这个例子中，`fetch` 用于从 API 获取数据。组件渲染时会先显示“Loading...”，一旦数据加载完毕或者发生错误，状态会被更新，UI 会相应更新。

### **使用 axios 获取数据**

`axios` 是一个流行的 HTTP 客户端，它提供了更加简洁和一致的 API 相比于 `fetch`，并且具有自动处理 JSON 数据、请求取消等功能。

#### **基本用法：**

```bash
npm install axios
```

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://api.example.com/data')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataFetcher;
```

相比于 `fetch`，`axios` 在处理 JSON 响应时更为方便，它自动将响应的数据解析为 JavaScript 对象。

---

## **2. 异步数据流的处理**

在 React 中，处理异步操作时常需要将异步数据存储在组件的状态中，并通过状态更新来触发重新渲染。使用 `useState` 和 `useEffect` 是常见的方式，但随着应用复杂度的增加，可能需要更强大的工具来管理异步数据流。

### **使用 useEffect 处理异步操作**

React 的 `useEffect` Hook 是处理副作用（如数据获取、订阅等）的理想工具。通过 `useEffect`，你可以在组件挂载时执行异步操作，并在数据加载后更新组件状态。

```jsx
import React, { useEffect, useState } from 'react';

function FetchData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 空数组表示仅在组件挂载时调用一次

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default FetchData;
```

在这个例子中，`useEffect` 用于加载数据，并使用 `async/await` 语法处理异步请求。通过 `setState` 更新组件的状态，React 会重新渲染组件。

---

## **3. 使用 React Query 管理异步状态**

`React Query` 是一个强大的数据获取和缓存库，专为 React 设计，提供了更简洁的 API 来管理异步数据、缓存和更新。

### **安装 React Query**

```bash
npm install react-query
```

### **基本使用**

```jsx
import React from 'react';
import { useQuery } from 'react-query';

function fetchData() {
  return fetch('https://api.example.com/data').then(res => res.json());
}

function DataFetcher() {
  const { data, error, isLoading } = useQuery('data', fetchData);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataFetcher;
```

`React Query` 通过 `useQuery` Hook 自动处理数据获取、错误处理、加载状态和缓存。它大大简化了异步数据的管理，并提供了内置的缓存和后台数据同步功能。

---

## **4. 错误边界**

React 提供了 **错误边界**（Error Boundaries）功能，允许我们在组件树中捕获 JavaScript 错误，并显示一个友好的错误提示，防止整个应用崩溃。

### **基本使用：**

错误边界是一个 React 类组件，必须实现 `componentDidCatch` 生命周期方法，来捕获子组件的错误。

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

在这个例子中，`ErrorBoundary` 捕获了子组件（`MyComponent`）中的错误，并显示一个友好的提示信息，而不是让整个应用崩溃。

---

## **总结**

本章介绍了 React 与异步操作的处理方法：

- **与 API 的交互**：使用 `fetch` 和 `axios` 获取数据，并通过状态更新渲染数据。
- **异步数据流的处理**：使用 `useEffect` 处理异步操作，并管理数据的加载和错误状态。
- **使用 React Query 管理异步状态**：通过 `useQuery` 提供更简洁的 API 来获取、缓存和同步异步数据。
- **错误边界**：使用 React 错误边界捕获并显示友好的错误提示，防止应用崩溃。

这些方法和工具使得在 React 应用中处理异步操作和错误变得更加容易，并且提高了用户体验和应用的可靠性。接下来的章节将探讨 **React 性能优化** 和 **高级特性**，帮助你提升应用的响应速度和可维护性。
