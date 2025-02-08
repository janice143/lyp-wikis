---
outline: deep
---
# TypeScript 类型体系的核心

## 元概念：类型

TypeScript 的核心在于 类型，它为 JavaScript 提供了静态类型检查能力，使代码更安全、可维护，并且易于开发。类型 这一元概念在外界因素（JavaScript 的动态特性与类型安全需求）的作用下，演化出 TypeScript 类型体系的三个正交核心点：类型表示、类型操作 和 类型检查。

## 1. 类型表示

外界作用：JavaScript 变量数据多样化 → 需要静态类型表达

在 JavaScript 中，变量的数据类型可以是不同的基本类型、对象、数组、函数等。为了在 TypeScript 中表示这些数据类型，类型表示 体系应运而生，并被细分为以下三个核心点：

### (1) 基础类型

基础类型用于表示 JavaScript 内置的数据类型：

- number、string、boolean（原始类型）
- null、undefined
- bigint、symbol

示例：

```ts
let age: number = 30;
let username: string = "Alice";
let isActive: boolean = true;
```

### (2) 复合类型

复合类型用于表示更复杂的数据结构：

- 数组 (Array`<number>` 或 number[])
- 对象 ({ name: string; age: number })
- 元组 ([number, string])
- 枚举 (enum)

示例：

```ts
let user: { name: string; age: number } = { name: "Alice", age: 25 };
let colors: string[] = ["red", "green", "blue"];
```

### (3) 特殊类型

特殊类型用于处理更复杂的类型需求：

- any：关闭类型检查
- unknown：更安全的 any
- void：函数无返回值
- never：永远不会有返回值（如抛出异常）

示例：

```ts
let something: unknown = "Hello";
function throwError(): never {
  throw new Error("Something went wrong!");
}
```

## 2. 类型操作

外界作用：程序逻辑的动态性 → 需要灵活的类型组合

在 JavaScript 开发中，我们经常需要操作不同类型的数据，例如合并多个类型、约束类型范围等。TypeScript 提供了强大的 类型操作 机制，使得类型系统更加灵活。类型操作 主要包括以下三个核心点：

### (1) 组合类型

TypeScript 提供了 联合类型（Union） 和 交叉类型（Intersection） 来处理类型的组合。

- 联合类型（|）：变量可以是多种类型之一
- 交叉类型（&）：变量同时满足多个类型的约束

示例：

```ts
let id: string | number;
id = "123"; // ✅
id = 456;   // ✅

type Person = { name: string };
type Employee = { company: string };
type Worker = Person & Employee; // 交叉类型
let worker: Worker = { name: "Alice", company: "TechCorp" };
```

### (2) 泛型（Generics）

泛型允许编写可复用的类型安全代码，尤其适用于函数、类和接口。

```ts
function identity<T>(value: T): T {
  return value;
}

let output = identity<string>("Hello");
let output2 = identity<number>(123);
```

### (3) 类型别名 & 映射类型

类型别名用于定义复杂类型的简洁表达方式，而映射类型（Mapped Types）用于根据已有类型创建新类型。

```ts
type User = { name: string; age: number };
type ReadonlyUser = Readonly<User>; // 所有属性变为只读
```

## 3. 类型检查

外界作用：JavaScript 是动态语言 → 需要静态检查确保代码安全

为了保证 JavaScript 代码的可靠性，TypeScript 提供了 类型检查 机制，在编译时检测类型错误。类型检查 主要包括以下三个核心点：

### (1) 类型推断

TypeScript 会自动推断变量的类型，无需显式声明。

```ts
let count = 42; // TypeScript 推断 count 为 number 类型
```

### (2) 类型守卫（Type Guards）

类型守卫用于在运行时根据不同类型执行不同的逻辑：

- typeof
- instanceof
- 自定义类型保护

示例：

```ts
function handle(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // 这里 TypeScript 知道 value 是 string
  } else {
    console.log(value.toFixed(2)); // 这里 TypeScript 知道 value 是 number
  }
}
```

### (3) 类型断言

类型断言用于告诉编译器“我知道这个值的类型”，但不会做实际的类型转换。

```ts
let someValue: unknown = "Hello";
let strLength: number = (someValue as string).length;
```

## 总结

|元概念 |外界因素 |核心点 1| 核心点 2 |核心点 3|
|----|----|----|----|----|
|类型| JavaScript 的动态特性 & 类型安全需求 |类型表示 |类型操作 |类型检查|
|类型表示| 变量数据多样化 |基础类型（string, number, boolean）|复合类型（对象, 数组, 元组）| 特殊类型（any, unknown, void, never）|
|类型操作 |需要灵活的类型组合 |组合类型（联合 & 交叉）| 泛型（Generics）| 类型别名 & 映射类型|
|类型检查| 需要静态检查代码安全 |类型推断（Type Inference）| 类型守卫（Type Guards）| 类型断言（Type Assertions）|

通过这个框架，我们可以清晰地理解 TypeScript 类型体系的构成，并且可以更有条理地学习和应用 TypeScript 的核心概念。
