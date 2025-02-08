---
outline: deep
---

# 常见的基础类型

TypeScript 的核心优势在于静态类型系统，它提供了强大的类型安全性和智能推断机制，帮助开发者在编译阶段发现潜在错误。本章将介绍 TypeScript 的基础类型、类型推断及变量声明方式，奠定坚实的编程基础。

## 基础类型

TypeScript 提供了一系列基础数据类型，与 JavaScript 保持一致，但引入了类型注解（Type Annotations），明确变量、参数和返回值的类型，提高代码的可读性和可靠性。

### 数字类型（number）

TypeScript 统一了 JavaScript 的 number 类型，所有整数和浮点数均归为 number 类型，并支持二进制、八进制、十进制和十六进制表示法。

```js
let decimal: number = 42;
let hex: number = 0xff;
let binary: number = 0b1010;
let octal: number = 0o744;
```

### 字符串类型（string）

string 类型用于存储文本数据，支持模板字符串（template literals）进行字符串插值。

```js
let name: string = "Alice";
let greeting: string = `Hello, ${name}!`;
```

2.1.3 布尔类型（boolean）

boolean 类型仅有 true 和 false 两个取值，确保逻辑表达式的类型安全。

```js
let isDone: boolean = false;
```

## 复合类型

除了基本数据类型，TypeScript 还支持更复杂的数据结构，如数组、元组和枚举。

### 数组（Array）

TypeScript 数组可以通过两种方式定义：

- 元素类型后加 []：

```js
let numbers: number[] = [1, 2, 3];
let strings: string[] = ["a", "b", "c"];
``

 - 使用 `Array<类型>` 泛型：

```js
let values: Array<number> = [10, 20, 30];
```

### 元组（Tuple）

元组是一种特殊的数组，元素类型和个数固定，可用于存储结构化数据。

```js
let user: [string, number] = ["Alice", 25];
console.log(user[0].toUpperCase());
```

### 枚举（Enum）

枚举用于定义一组具名常量，默认从 0 开始编号，也可自定义值。

```js
enum Color {
  Red = 1,
  Green = 2,
  Blue = 3
}
let myColor: Color = Color.Green; // myColor = 2
```

枚举还可以使用字符串值：

```js
enum Direction {
  Up = "UP",
  Down = "DOWN"
}
```

## 特殊类型

### any

any 允许变量接受任意类型的值，适用于需要兼容 JavaScript 代码的场景，但会降低类型安全性。

```js
let variable: any = "Hello";
variable = 10;
```

### unknown

unknown 是比 any 更安全的类型，它表示未知类型，但不能随意赋值给其他类型，必须经过类型检查。

```js
let input: unknown;
input = "Hello";
input = 42;

if (typeof input === "string") {
  console.log(input.toUpperCase());
}
```

### void

void 主要用于函数返回 undefined 或 null，表示该函数没有返回值。

```js
function logMessage(): void {
  console.log("Logging...");
}
```

### never

never 类型表示永远不会有返回值的函数，常用于抛出异常或无限循环的场景。

```js
function throwError(message: string): never {
  throw new Error(message);
}
```

## 类型注解与推断

### 类型注解（Type Annotation）

TypeScript 允许显式声明变量的类型，以提高代码可读性和类型安全性。

```js
let count: number = 10;
let message: string = "TypeScript";
```

### 类型推断（Type Inference）

如果变量在声明时被赋值，TypeScript 会自动推断其类型，因此可以省略显式类型注解。

```js
let age = 30;
let city = "Berlin";
```

但在函数返回值中，最好显式声明类型，以避免推断错误。

```js
function add(a: number, b: number): number {
  return a + b;
}
```

## 总结

本章介绍了 TypeScript 的基础类型、复合类型、特殊类型及类型系统的核心理念：

- 基础类型：number、string、boolean。
- 复合类型：数组、元组、枚举。
- 特殊类型：any（关闭类型检查）、unknown（更安全的未知类型）、void（无返回值）、never（不会返回）。
- 类型系统：显式类型注解和类型推断，使代码更安全和可维护。

TypeScript 通过类型系统增强了 JavaScript 的能力，使代码更加稳定、易维护。理解这些基础概念后，开发者可以更高效地使用 TypeScript 构建高质量的应用。
