# React 路由

在现代单页面应用（SPA）中，路由是非常重要的一个部分，React Router 是 React 官方推荐的路由解决方案。React Router 使得我们能够在 React 应用中管理和控制 URL 路径，并根据不同的路径渲染不同的组件。

本章将深入探讨 React Router 的基础知识、安装与配置、核心概念以及如何实现动态路由、嵌套路由、导航和路由守卫等功能。

---

## **1. React Router 基础**

React Router 是一个用于实现路由功能的库，允许我们在 React 应用中根据不同的 URL 渲染不同的组件。React Router 提供了一个声明式的 API，通过 `Route`、`BrowserRouter`、`Link` 等组件，帮助我们处理导航和视图的切换。

---

## **2. 安装与配置**

在 React 项目中使用 React Router，首先需要安装 `react-router-dom` 包：

```sh
npm install react-router-dom
```

安装完成后，我们就可以在项目中使用 React Router 提供的 API。

---

## **3. 使用 BrowserRouter 与 Route**

`BrowserRouter` 是 React Router 的一个路由容器，它使用 HTML5 的 History API 来管理应用的历史记录，并控制 URL 的变化。`Route` 组件用于定义与 URL 路径匹配的视图（组件）。

### **基本用法：**

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );
}

export default App;
```

- **`BrowserRouter`**：用于包裹整个应用，管理 URL 和浏览器历史记录。
- **`Route`**：根据匹配的路径渲染对应的组件。
- **`Switch`**：确保在匹配路径时只渲染第一个符合条件的 `Route`，避免多个组件同时渲染。

---

## **4. 路由的核心概念**

### **路径与组件映射**

`Route` 组件通过 `path` 属性与 URL 路径进行映射，并根据路径匹配渲染相应的组件。例如，`<Route path="/about" component={About} />` 会在 URL 为 `/about` 时渲染 `About` 组件。

### **动态路由**

动态路由用于处理具有参数的 URL。通过在 `path` 中使用占位符，React Router 会提取 URL 参数并将其传递给组件。

```jsx
function UserProfile({ match }) {
  return <h1>User Profile for {match.params.userId}</h1>;
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userId" component={UserProfile} />
      </Switch>
    </Router>
  );
}
```

在上面的例子中，`/user/:userId` 中的 `:userId` 是一个动态路由参数，当访问 `/user/123` 时，`UserProfile` 组件将接收到 `userId` 参数，并显示 `User Profile for 123`。

---

## **5. 嵌套路由**

React Router 也支持嵌套路由，允许我们在父路由组件中嵌套多个子路由。通过嵌套路由，父组件可以定义公共布局，而子组件则根据不同的 URL 渲染具体的内容。

```jsx
function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Switch>
        <Route path="/dashboard/overview" component={Overview} />
        <Route path="/dashboard/stats" component={Stats} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
}
```

在这个例子中，`Dashboard` 组件包含了子路由：`/dashboard/overview` 和 `/dashboard/stats`，不同的路径会渲染不同的子组件。

---

## **6. 导航与跳转**

### **使用 Link 和 NavLink**

`Link` 和 `NavLink` 是 React Router 提供的导航组件，用于在不同的路由之间跳转。

#### **Link 组件**

`Link` 用于渲染 `<a>` 标签，允许用户在不同的路由间跳转而不引起页面刷新：

```jsx
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </div>
  );
}
```

#### **NavLink 组件**

`NavLink` 是 `Link` 的扩展，具有激活状态的功能。当 `NavLink` 的路径与当前 URL 匹配时，它会自动添加一个 `active` 类名，便于我们为当前活动的链接应用特定的样式。

```jsx
import { NavLink } from 'react-router-dom';

function App() {
  return (
    <div>
      <NavLink to="/" exact activeClassName="active">Home</NavLink>
      <NavLink to="/about" activeClassName="active">About</NavLink>
    </div>
  );
}
```

---

## **7. 编程式导航：useNavigate**

`useNavigate` 是 React Router 6 引入的一个 Hook，用于在函数组件中实现编程式导航。它返回一个 `navigate` 函数，允许你在代码中控制路由跳转。

```jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 执行登录逻辑
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

在这个例子中，`useNavigate` 返回的 `navigate` 函数被用来在用户点击按钮后跳转到 `/dashboard`。

---

## **8. 路由守卫**

### **保护路由的实现**

路由守卫（Route Guard）用于在特定条件下控制路由访问。例如，在用户未登录时禁止访问某些页面。React Router 本身并不直接提供路由守卫，但我们可以通过编程式导航和条件渲染来实现路由保护。

#### **示例：路由守卫**

```jsx
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = false; // 模拟登录状态

  if (!isAuthenticated) {
    navigate('/login'); // 如果未登录，跳转到登录页
    return null; // 返回 null，避免渲染子组件
  }

  return children;
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}
```

在这个例子中，`ProtectedRoute` 组件会检查用户是否已登录。如果未登录，用户将被重定向到 `/login`，否则渲染子组件（例如 `Dashboard`）。

---

## **总结**

在本章中，我们深入学习了 React Router 的核心概念和常用功能：

- **React Router 基础**：安装与配置，使用 `BrowserRouter` 和 `Route` 定义路由。
- **路由的核心概念**：路径与组件映射，动态路由和嵌套路由。
- **导航与跳转**：使用 `Link`、`NavLink` 进行导航，编程式导航通过 `useNavigate`。
- **路由守卫**：实现保护路由的功能，控制访问权限。

这些知识使得我们能够在 React 应用中实现多页面路由、动态路由和基于条件的路由访问控制，为构建复杂的单页面应用提供了强大的支持。接下来的章节将深入探讨 **状态管理** 和 **性能优化** 等进阶内容，进一步提升你的 React 开发能力。
