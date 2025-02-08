---
outline: deep
---

# 进阶特性

TypeScript 通过引入接口、类和泛型等高级特性，使得代码更加结构化、灵活且可扩展。这些特性能够帮助开发者编写更具类型安全性的代码，同时增强代码的复用性和可维护性。

## 接口（Interfaces）

接口是一种用于描述对象结构的方式，规定对象必须具备的属性和方法。它是 TypeScript 中的核心特性之一，提供了更好的代码组织性和类型检查能力。

### 定义和使用接口

接口用于定义对象的形状，可以包含属性和方法的声明。

```ts
interface Person {
  name: string;
  age: number;
  greet(): string;
}

const user: Person = {
  name: "Alice",
  age: 25,
  greet() {
    return `Hello, my name is ${this.name}`;
  }
};
console.log(user.greet());
```

在上面的示例中，Person 接口规定了 name、age 和 greet 方法，确保 user 对象符合该结构。

### 可选属性和只读属性

接口中的属性可以标记为可选（?）或只读（readonly），用于提供更灵活的类型定义。

```ts
interface Car {
  readonly brand: string;
  model: string;
  year?: number;
}

const myCar: Car = { brand: "Tesla", model: "Model 3" };
// myCar.brand = "BMW"; // 错误：brand 是只读属性
```

- readonly 修饰符确保属性不可修改。
- ? 使得 year 成为可选属性，可以省略该属性。

## 类（Classes）

TypeScript 提供了面向对象编程（OOP）的支持，允许使用类来封装数据和行为。类是 JavaScript 的 ES6 规范引入的概念，而 TypeScript 在此基础上增加了类型支持。

### 类的基本语法

使用 class 关键字定义类，类可以包含属性、构造函数和方法。

```ts
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`${this.name} makes a sound.`);
  }
}

const dog = new Animal("Dog");
dog.speak(); // Dog makes a sound.
```

### 继承和多态

TypeScript 支持类的继承（extends），子类可以继承父类的属性和方法，同时可以重写父类的方法，实现多态。

```ts
class Dog extends Animal {
  speak(): void {
    console.log(`${this.name} barks.`);
  }
}

const myDog = new Dog("Buddy");
myDog.speak(); // Buddy barks.
```

## 泛型（Generics）

泛型提供了一种编写可复用代码的方式，使得类型参数化，从而提高代码的灵活性。

### 泛型函数与类

泛型可以用于函数、类和接口，使得代码可以适应不同类型，而不必预先指定具体类型。

```ts
function identity<T>(value: T): T {
  return value;
}

console.log(identity<string>("Hello")); // Hello
console.log(identity<number>(42)); // 42
```

泛型同样适用于类：

```ts
class Box<T> {
  content: T;

  constructor(content: T) {
    this.content = content;
  }

  getContent(): T {
    return this.content;
  }
}

const stringBox = new Box<string>("TypeScript");
console.log(stringBox.getContent()); // TypeScript
```

### 泛型约束

可以使用 extends 关键字对泛型进行约束，确保传入的类型满足一定的条件。

```ts
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}

logLength("Hello"); // 5
logLength([1, 2, 3]); // 3
// logLength(42); // 错误：number 没有 length 属性
```

### 多个泛型类型参数

可以使用多个泛型参数，使函数适应多种类型的输入。

```TS
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>("age", 30);
console.log(result); // ["age", 30]
```

## 联合类型与交叉类型

TypeScript 允许变量的类型可以是多种类型之一（联合类型），或者同时符合多个类型（交叉类型）。

### 联合类型（Union Types）

使用 | 操作符表示变量可以是多个类型之一。

```ts
function formatInput(input: string | number): string {
  return `Formatted: ${input}`;
}

console.log(formatInput(42)); // Formatted: 42
console.log(formatInput("Hello")); // Formatted: Hello
```

### 交叉类型（Intersection Types）

交叉类型 & 表示一个类型需要同时符合多个类型的要求。

```ts
interface A {
  name: string;
}

interface B {
  age: number;
}

type AB = A & B;

const person: AB = { name: "Alice", age: 25 };
```

## 类型别名（Type Aliases）

类型别名用于为复杂类型定义简洁的名称，提高可读性。

```ts
type Point = {
  x: number;
  y: number;
};

const p: Point = { x: 10, y: 20 };
```

类型别名也可以用于联合类型：

```ts
type ID = string | number;
let userId: ID = 123;
userId = "abc";
```

## 总结

TypeScript 的进阶特性提供了强大的类型系统，使代码更安全、更灵活，同时提升了可读性和可维护性。

- 接口：定义对象结构，支持可选属性和只读属性。
- 类：支持继承、多态。
- 泛型：提升代码复用性，支持泛型约束和多个类型参数。
- 联合与交叉类型：允许变量同时符合多个类型的要求。
- 类型别名：简化复杂类型定义，提高代码可读性。

这些特性是 TypeScript 强大类型系统的重要组成部分，为构建复杂应用提供了更完善的开发体验。
