---
outline: deep
---

# 高级概念

TypeScript 作为一个强类型的超集，它不仅仅提供了静态类型检查，还引入了一些高级特性，帮助开发者更加高效、灵活地编写类型安全的代码。理解这些高级概念将大大提升开发者使用 TypeScript 进行大型项目开发的能力。以下是几个高级概念，它们在复杂应用开发中尤为重要：类型推断与类型保护、装饰器以及模块与命名空间。

## 类型推断与类型保护

### 了解如何自动推断类型

类型推断（Type Inference）是 TypeScript 的一项核心功能，意味着编译器会在缺少显式类型注解的情况下自动推导变量的类型。TypeScript 根据变量的初始化值、返回类型等信息来推断类型。

#### 基本类型推断

TypeScript 会根据变量的初始值自动推断出其类型。例如：

```typescript
let message = "Hello, TypeScript!"; // 推断类型为 string
```

在上面的例子中，`message` 变量的类型是 `string`，因为它被初始化为一个字符串。即便没有显式地指定类型，TypeScript 也能自动推断出类型。

#### 推断函数返回值类型

如果一个函数根据传入的参数返回某个结果，TypeScript 也能推断出函数的返回值类型。例如：

```typescript
function add(a: number, b: number) {
  return a + b;
}

let sum = add(2, 3); // 推断类型为 number
```

在这个例子中，`add` 函数的返回值被推断为 `number` 类型。TypeScript 会根据函数体内的返回语句自动推断。

#### 推断数组和对象类型

```typescript
let numbers = [1, 2, 3]; // 推断类型为 number[]
let person = { name: "Alice", age: 30 }; // 推断类型为 { name: string, age: number }
```

TypeScript 会推断出数组和对象的类型，基于其元素或属性的类型。

### 使用类型保护（Type Guards）

类型保护是 TypeScript 提供的一种机制，能够在运行时检查某个值的类型，并在后续代码中安全地使用该值。通过类型保护，开发者可以在不同的代码分支中限制变量的类型，确保类型安全。

#### `typeof` 类型保护

`typeof` 操作符用于检查基础类型，如 `number`、`string`、`boolean` 等。

```typescript
function printLength(value: string | number) {
  if (typeof value === "string") {
    console.log(value.length); // 安全地访问 string 特有的属性
  } else {
    console.log(value.toFixed(2)); // 安全地访问 number 特有的方法
  }
}
```

在这个例子中，`typeof` 用来检查 `value` 是 `string` 还是 `number` 类型，然后分别使用不同的方法来处理。

#### `instanceof` 类型保护

`instanceof` 操作符用于检查对象的构造函数类型，常用于类的实例类型判断。

```typescript
class Animal {
  move() {
    console.log("Moving");
  }
}

class Dog extends Animal {
  bark() {
    console.log("Barking");
  }
}

function handleAnimal(animal: Animal) {
  if (animal instanceof Dog) {
    animal.bark(); // 仅当 animal 是 Dog 的实例时才能安全调用
  } else {
    animal.move(); // 否则调用 Animal 的方法
  }
}
```

通过 `instanceof`，我们可以根据对象的构造函数来进行类型保护，从而安全地调用该类型的特有方法。

## 装饰器（Decorators）

装饰器是 TypeScript 和 ECMAScript 提案中的一个特性，用于通过注解和元编程来修改类、方法、属性等的行为。装饰器通常用于框架或库中，以提供可重用的逻辑。

### 什么是装饰器？

装饰器本质上是一个函数，它可以用来修改类、方法、访问器、属性、参数等的行为。装饰器在类实例化或方法调用时被自动调用，从而可以在运行时动态地修改类的行为。

装饰器通常通过 `@` 符号来表示。例如：

```typescript
function Log(target: any) {
  console.log(`Class ${target.name} has been created.`);
}

@Log
class Person {
  constructor(public name: string) {}
}

new Person("Alice"); // 控制台输出：Class Person has been created.
```

在这个示例中，`@Log` 是一个类装饰器，当 `Person` 类被实例化时，它会输出一条日志。

### 使用装饰器的场景与实现

装饰器的常见应用场景包括但不限于：

1. **日志记录**：跟踪函数调用、参数、返回值等信息。
2. **权限验证**：在访问方法之前检查用户权限。
3. **缓存**：为函数添加缓存功能，减少重复计算。
4. **自动注入依赖**：例如在依赖注入框架中使用装饰器来自动注入服务或组件。

一个简单的日志装饰器例子：

```typescript
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b;
  }
}

const calculator = new Calculator();
calculator.add(2, 3); // 控制台输出：Calling add with args: [2,3]
```

## 模块与命名空间

### ES6 模块 vs. 命名空间

在 TypeScript 中，模块（Modules）和命名空间（Namespaces）是组织代码的两种方式，它们各自有不同的特点和适用场景。

#### ES6 模块

ES6 模块是 JavaScript 标准中引入的模块系统，使用 `export` 和 `import` 来进行模块间的导出和导入。

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';

console.log(add(2, 3)); // 输出 5
```

ES6 模块更符合现代 JavaScript 标准，并且具有静态分析、树摇优化等优势。在 TypeScript 中推荐使用 ES6 模块，因为它更符合现代 JavaScript 的生态。

#### 命名空间

命名空间是一种在 TypeScript 中用来组织代码的方式，它将代码划分为多个模块，通过点操作符访问内部的成员。

```typescript
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }
}

console.log(MathUtils.add(2, 3)); // 输出 5
```

命名空间的使用在大型项目中可能导致全局污染，并且不支持按需加载，因此在现代 TypeScript 开发中，推荐使用 ES6 模块。

### 导出和导入

在 TypeScript 中，导出和导入是模块化的核心，通过 `export` 和 `import` 可以将代码拆分到多个文件中，提升代码的可维护性和可扩展性。

```typescript
// 导出
export const PI = 3.14;
export function multiply(x: number, y: number): number {
  return x * y;
}

// 导入
import { PI, multiply } from './math';
console.log(PI); // 输出 3.14
console.log(multiply(2, 3)); // 输出 6
```

可以通过 `export default` 语法导出一个默认成员，并使用不同的方式来导入：

```typescript
// 默认导出
export default class Person {
  constructor(public name: string) {}
}

// 导入默认成员
import Person from './person';
```

## 总结

掌握 TypeScript 的高级概念将极大地增强开发者的编码能力和项目的可扩展性。

- **类型推断与类型保护**：类型推断提高开发效率，类型保护确保代码在运行时的类型安全。
- **装饰器**：提供了一种声明式编程方式，能够在类、方法、属性等上添加行为，适合用于日志、权限验证等场景。
- **模块与命名空间**：ES6 模块系统在现代 TypeScript 项目中应用广泛，命名空间适用于封装内部逻辑，但较为过时。

掌握这些高级特性，将使你能够在 TypeScript 中编写更清晰、更具可维护性的代码。
