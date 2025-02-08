---
outline: deep
---

# TypeScript 的注释指令

TypeScript 提供了一些 **注释指令**（Pragmas），它们可以直接影响编译器的行为或控制 TypeScript 代码的检查方式。这些指令主要用于在某些特定情况下绕过编译器的严格检查、控制编译流程，或提供更好的类型安全性。以下是 TypeScript 中常见的注释指令及其应用场景。

---

## 1. `@ts-ignore` —— 忽略下一行的 TypeScript 错误

### **作用**

告诉 TypeScript 编译器忽略当前行的错误，即使代码存在类型错误，编译器也不会报错。

### **使用场景**

- 代码在运行时不会出错，但 TypeScript 认为有类型错误
- 需要临时绕过类型检查（不推荐长期使用）

### **示例**

```typescript
// @ts-ignore 忽略下一行的错误
// TypeScript 认为 `name` 不存在于 `{}`，但它不会报错
// 这可能会导致运行时错误，所以要谨慎使用
const obj: {} = {};
// @ts-ignore
console.log(obj.name);
```

---

## 2. `@ts-nocheck` —— 禁用整个文件的类型检查

### **作用**

告诉 TypeScript 编译器**跳过整个文件的类型检查**，不会对任何代码进行错误检查。

### **使用场景**

- 迁移旧项目时，部分文件可能不符合 TypeScript 规则，可以暂时跳过检查
- 需要在某个文件中禁用类型检查以提高编译速度

### **示例**

```typescript
// @ts-nocheck
console.log("这段代码不会进行类型检查，即使有错误也不会报错");
```

⚠ **注意**：`@ts-nocheck` 适用于整个文件，不仅仅是一行代码。它必须放在文件的顶部，并且不能出现在 TypeScript 配置 `compilerOptions` 中的 `strict` 选项开启时。

---

## 3. `@ts-check` —— 强制启用类型检查

### **作用**

即使当前文件是 JavaScript 文件（`.js`），`@ts-check` 也会强制 TypeScript 对其进行类型检查。

### **使用场景**

- 在 JavaScript 项目中逐步引入 TypeScript，进行类型检查
- 让 TypeScript 对 `.js` 文件执行类型推断，提高代码质量

### **示例**

```javascript
// @ts-check
let message = "Hello, TypeScript!";
message = 123; // TypeScript 会报错，因为 message 不能赋值为 number
```

---

## 4. `@ts-expect-error` —— 期望发生 TypeScript 错误

### **作用**

告诉 TypeScript **当前行代码应该报错**，如果 TypeScript 没有报错，编译器反而会提示错误。这用于确保 TypeScript 版本升级后，某些特定的代码仍然符合预期的类型错误。

### **使用场景**

- 用于 TypeScript 版本升级时的错误回归测试
- 期望某段代码本应报错，以确保类型系统的正确性

### **示例**

```typescript
// @ts-expect-error
const num: number = "string"; // TypeScript 预期这里会报错
```

如果 `num` 被正确赋值为 `number` 类型，例如：

```typescript
// @ts-expect-error
const num: number = 42; // TypeScript 没有报错，这行代码就会被标记为错误
```

编译器会提示：

```
Error: Expected an error, but none was reported.
```

---

## 5. `// #pragma` —— 控制 `tsc` 解析行为的指令

### **作用**

`#pragma` 主要用于控制 TypeScript 编译器如何处理特定代码。例如：

- `#pragma once`：防止重复编译（TypeScript 中不常用）
- `#pragma disable-next-line`：禁用下一行的错误检查

但 TypeScript 目前**并不支持标准的 `#pragma` 指令**，这些更多是用于 ESLint 或 Babel 这样的工具。

---

## 6. `/// <reference path="..." />` —— 引用其他文件

### **作用**

`/// <reference>` 指令用于手动指定 TypeScript 依赖的声明文件（`.d.ts`），主要用于早期 TypeScript 版本，或者当自动模块解析失败时。

### **使用场景**

- 在 TypeScript 项目中手动引入 `.d.ts` 声明文件
- 解决自动模块解析无法找到类型定义的问题

### **示例**

```typescript
/// <reference path="./types.d.ts" />
```

如果 `types.d.ts` 声明了某个类型：

```typescript
declare var myGlobalVar: string;
```

那么 `myGlobalVar` 变量就可以在当前文件中使用。

⚠ **注意**：现代 TypeScript 项目通常通过 `import` 或 `tsconfig.json` 的 `typeRoots` 选项自动管理类型文件，因此 `/// <reference>` 逐渐被淘汰。

---

## 7. `/// <reference types="..." />` —— 引用类型声明包

### **作用**

用于在 TypeScript 文件中**手动指定**依赖的类型定义。与 `/// <reference path="..." />` 不同的是，它引用的是 NPM 安装的 **类型声明包**（如 `@types/node`、`@types/jquery`）。

### **使用场景**

- 在手动配置类型声明时使用，避免 TypeScript 找不到类型定义
- 确保全局变量的类型声明正确

### **示例**

```typescript
/// <reference types="node" />
import * as fs from "fs";
fs.readFileSync("file.txt");
```

如果没有 `/// <reference types="node" />`，TypeScript 可能会报错找不到 `fs` 模块。

---

## 8. `@jsx` 和 `@jsxFrag` —— 控制 JSX 编译方式

### **作用**

用于配置 TypeScript 如何解析 JSX 代码，主要用于 React 或其他 JSX 框架。

### **使用场景**

- 配合 `compilerOptions.jsx` 选项使用，控制 JSX 转换行为
- 在 TypeScript 代码中指定 JSX 解析方式

### **示例**

```typescript
/** @jsxImportSource preact */
import { h } from "preact";

const element = <div>Hello</div>; // 会被转换为 preact.h() 形式
```

如果使用 `@jsx` 指定 JSX 转换方式：

```typescript
/** @jsx React.createElement */
const element = <div>Hello</div>; // 会被转换为 React.createElement() 形式
```

---

## 9. `@deprecated` —— 标记 API 过时

### **作用**

用于标记某个变量、方法或类已过时，在 TypeScript 代码中会显示警告。

### **使用场景**

- 在库的 API 迁移过程中，提示开发者不要使用某些 API
- 提供开发者警告信息，指导他们使用新的替代方案

### **示例**

```typescript
class MyClass {
  /**
   * @deprecated 请使用 newMethod()
   */
  oldMethod() {
    console.log("This method is deprecated.");
  }

  newMethod() {
    console.log("Use this instead.");
  }
}

const obj = new MyClass();
obj.oldMethod(); // 在编辑器中会显示警告
```

---

## 总结

| 指令 | 作用 | 适用范围 |
|------|------|---------|
| `@ts-ignore` | 忽略下一行 TypeScript 错误 | 某一行代码 |
| `@ts-nocheck` | 禁用整个文件的类型检查 | 整个文件 |
| `@ts-check` | 在 `.js` 文件中启用 TypeScript 类型检查 | JavaScript 文件 |
| `@ts-expect-error` | 期望 TypeScript 代码报错 | 某一行代码 |
| `/// <reference path="..." />` | 引用本地 `.d.ts` 文件 | 旧项目 |
| `/// <reference types="..." />` | 引用 NPM 安装的类型定义 | NPM 依赖 |
| `@jsx` | 控制 JSX 解析 | React/Preact |
| `@deprecated` | 标记 API 过时 | 类、方法 |

掌握这些 TypeScript 注释指令，可以帮助开发者更灵活地控制代码的类型检查、编译方式和 API 维护策略，使 TypeScript 项目更加稳定和高效。
