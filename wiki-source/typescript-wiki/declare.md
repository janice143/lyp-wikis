---
outline: deep
---

# `declare` 声明类型

在 TypeScript 中，`declare` 关键字用于声明变量、模块、函数、类等，但不会在编译后的 JavaScript 代码中生成实际的定义。主要用于告诉 TypeScript 编译器某些值的存在，例如当使用外部库、全局变量或自定义类型时。

## `declare` 的作用

`declare` 主要用于以下场景：

1. **声明全局变量**：当 JavaScript 代码已经定义了某个全局变量，但 TypeScript 代码没有显式声明它时，可以使用 `declare` 来告诉编译器该变量的存在。
2. **声明全局函数**：用于声明全局可用的 JavaScript 函数，以便 TypeScript 进行类型检查。
3. **声明外部模块**：在 TypeScript 项目中使用 JavaScript 库（如 jQuery）时，通常需要手动声明模块。
4. **声明类型文件（.d.ts）**：`declare` 语句通常用于 `.d.ts` 类型声明文件，以便 TypeScript 识别第三方库的类型信息。

---

## 使用 `declare` 声明全局变量

当 TypeScript 代码运行在浏览器或 Node.js 环境中，可能会引用某些全局变量（如 `window`、`process`），如果 TypeScript 无法识别它们，可以使用 `declare` 进行声明。

```typescript
declare let myGlobalVar: string;

myGlobalVar = "Hello"; // 正常使用，不会报错
console.log(myGlobalVar);
```

在这个例子中，`myGlobalVar` 只是一个类型声明，TypeScript 只会进行静态类型检查，但不会在 JavaScript 代码中生成 `declare let myGlobalVar` 这样的代码。

---

## 使用 `declare` 声明全局函数

如果某个 JavaScript 代码定义了全局函数，但 TypeScript 不知道其存在，可以使用 `declare function` 进行声明：

```typescript
declare function showMessage(message: string): void;

// 可以直接调用这个函数
showMessage("Hello, TypeScript!");
```

在 TypeScript 编译时，它不会生成 `declare function showMessage(...)` 这行代码，只会对 `showMessage("Hello, TypeScript!")` 进行类型检查。

---

## 使用 `declare` 声明全局对象（接口）

在某些场景下，我们可能需要声明一个全局对象的结构，而不仅仅是变量。例如，假设有一个全局的 `config` 对象：

```typescript
declare const config: {
  apiUrl: string;
  version: number;
};

console.log(config.apiUrl); // TypeScript 认为 config 具有 apiUrl 属性
```

这样可以确保 `config` 在代码中是可访问的，并且具有指定的属性类型。

---

## 使用 `declare` 声明外部模块

当使用非 TypeScript 的 JavaScript 库（如 jQuery）时，TypeScript 可能无法识别其模块。这时可以使用 `declare module` 来声明它。

```typescript
declare module "lodash" {
  export function cloneDeep<T>(value: T): T;
}
```

然后在 TypeScript 代码中，可以直接使用 `lodash`：

```typescript
import { cloneDeep } from "lodash";

const obj = { name: "Alice" };
const newObj = cloneDeep(obj);
console.log(newObj);
```

如果没有 `declare module "lodash"` 这样的声明，TypeScript 可能会报错 `Cannot find module 'lodash'`。

---

## 使用 `declare` 进行 `.d.ts` 类型声明

`.d.ts` 文件是 TypeScript 专门用于存放类型声明的文件。通常用于：

- 声明第三方 JavaScript 库的类型。
- 定义全局变量、函数、模块的类型信息，而不会在最终 JavaScript 代码中生成任何实际代码。

一个典型的 `.d.ts` 文件内容示例：

```typescript
// global.d.ts
declare let API_KEY: string;
declare function fetchData(url: string): Promise<any>;
declare module "my-library" {
  export function myFunction(param: number): string;
}
```

然后，在 TypeScript 代码中就可以正常使用这些声明：

```typescript
console.log(API_KEY); // 可以直接访问
fetchData("https://example.com").then(console.log);
```

---

## `declare` 不会生成 JavaScript 代码

一个重要的概念是，`declare` 关键字不会出现在编译后的 JavaScript 代码中。例如：

**TypeScript 代码（example.ts）：**

```typescript
declare let externalVar: string;
console.log("Hello, World!");
```

**编译后的 JavaScript 代码（example.js）：**

```javascript
console.log("Hello, World!");
```

`declare` 语句完全被忽略，仅用于 TypeScript 类型检查，而不会影响最终的 JavaScript 代码。

---

## `declare` 与 `export` 结合使用

在某些情况下，可以使用 `declare` 与 `export` 结合，以便在 TypeScript 项目中导出类型声明。例如：

```typescript
declare module "math-utils" {
  export function add(a: number, b: number): number;
}
```

在 TypeScript 代码中导入时：

```typescript
import { add } from "math-utils";
console.log(add(2, 3)); // 5
```

这样，TypeScript 能够识别 `math-utils` 模块的 `add` 函数，并提供类型检查。

---

## 总结

`declare` 关键字在 TypeScript 中主要用于声明全局变量、全局函数、外部模块等，但不会在编译后的 JavaScript 代码中生成任何定义。它的主要用途包括：

- **声明全局变量**（`declare let` / `declare const`）
- **声明全局函数**（`declare function`）
- **声明全局对象或接口**
- **声明外部模块**（`declare module`）
- **在 `.d.ts` 类型声明文件中定义类型信息**

掌握 `declare` 关键字的使用方式，可以更好地在 TypeScript 项目中使用外部 JavaScript 代码，同时保持类型安全性和代码的可维护性。
