---
outline: deep
---

# 函数的类型

在 TypeScript 中，函数不仅是执行某种操作的代码块，它的类型定义和类型检查也能增强代码的安全性和可维护性。函数类型的引入使得开发者能够更清晰地定义函数的输入输出，并且在编译期间捕获潜在的错误。理解和应用函数类型是掌握 TypeScript 的关键之一。

## 函数的基本类型

在 JavaScript 中，函数本身就是一种对象，可以赋值给变量或作为参数传递。TypeScript 在此基础上增加了对函数类型的静态检查。函数的类型定义通常包含两个部分：输入参数类型和返回值类型。

### 函数类型的基本语法

TypeScript 使用 : (参数类型) => 返回值类型 的语法来声明函数的类型。

```ts
// 声明一个简单的函数类型
let add: (a: number, b: number) => number;

add = (x, y) => x + y;  // 正确
add = (x, y) => x + String(y);  // 错误：返回值类型不匹配
```

在上面的示例中，add 被声明为一个接受两个 number 类型参数并返回 number 类型结果的函数。TypeScript 会根据类型推断和静态检查来确保函数符合声明的类型。

### 函数声明与表达式

TypeScript 支持函数声明、函数表达式以及箭头函数等不同的定义方式，所有这些方式都可以与类型定义结合使用。

### 函数声明

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

### 函数表达式

```ts
const add = function(a: number, b: number): number {
  return a + b;
}
```

### 箭头函数

```ts
const add = (a: number, b: number): number => a + b;
```

无论是哪种方式，TypeScript 都会根据函数的参数和返回值进行类型推断。

## 可选参数和默认参数

TypeScript 允许函数的某些参数是可选的，也可以为参数设置默认值。这使得函数定义更加灵活，能够处理多种不同的调用场景。

### 可选参数

通过在参数名后面加上 ? 来表示参数是可选的。

```ts
function greet(name: string, age?: number): string {
  return age ? `Hello, ${name}. You are ${age} years old.` : `Hello, ${name}.`;
}

console.log(greet("Alice")); // Hello, Alice.
console.log(greet("Bob", 30)); // Hello, Bob. You are 30 years old.
```

在上面的示例中，age 是一个可选参数，调用时可以省略。

### 默认参数

通过为参数指定默认值，调用函数时如果未传入该参数，则使用默认值。

```ts
function greet(name: string, age: number = 18): string {
  return `Hello, ${name}. You are ${age} years old.`;
}

console.log(greet("Alice")); // Hello, Alice. You are 18 years old.
console.log(greet("Bob", 30)); // Hello, Bob. You are 30 years old.
```

在此示例中，age 参数有一个默认值 18，如果未传入 age，则自动使用默认值。

## 剩余参数（Rest Parameters）

在 TypeScript 中，剩余参数允许函数接收任意数量的参数，并将其表示为一个数组。这对于处理不确定数量的输入非常有用。

```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 10
console.log(sum(5, 10)); // 15
```

在上面的示例中，numbers 使用了剩余参数，它会将所有传入的数字收集到一个数组中。

## 函数重载（Function Overloading）

TypeScript 支持函数重载，即允许同一个函数根据不同的参数类型或数量执行不同的操作。函数重载可以提高代码的灵活性和可读性。

### 函数重载的语法

函数重载的基本思想是为函数定义多个签名，然后根据实际调用的参数类型决定调用哪一个版本的函数。

```ts
function greet(person: string): string;
function greet(person: string, age: number): string;
function greet(person: string, age?: number): string {
  if (age) {
    return `Hello, ${person}. You are ${age} years old.`;
  }
  return `Hello, ${person}.`;
}

console.log(greet("Alice")); // Hello, Alice.
console.log(greet("Bob", 30)); // Hello, Bob. You are 30 years old.
```

在这个例子中，greet 函数被重载了两次，根据参数的数量和类型，TypeScript 会选择适当的签名。

## 函数类型别名

除了普通的函数类型定义，TypeScript 还允许使用类型别名（type）来定义函数类型。这可以使代码更简洁，并为复杂的函数类型提供更具描述性的名称。

```ts
type AddFunction = (a: number, b: number) => number;

const add: AddFunction = (x, y) => x + y;
```

在这个例子中，AddFunction 是一个类型别名，用于描述一个接受两个 number 类型参数并返回 number 的函数类型。使用类型别名能够提高代码的可读性和可维护性，尤其是在需要传递函数作为参数的情况下。

## 函数的上下文类型

在 TypeScript 中，函数的上下文类型（this 类型）对于函数的调用和绑定至关重要。TypeScript 会根据函数的定义和调用环境来推断 this 的类型。

```ts
class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet(this: Person): void {
    console.log(`Hello, ${this.name}`);
  }
}

const person = new Person("Alice");
person.greet(); // Hello, Alice
```

在上面的例子中，greet 方法的 this 被限定为 Person 类型，这样在方法内部访问 this.name 就能得到类型安全的检查。

## 总结

TypeScript 提供了丰富的函数类型系统，帮助开发者在函数定义时显式声明参数和返回值的类型，增强代码的可维护性和可读性。

- 函数类型：通过 (参数类型) => 返回值类型 的语法定义函数。
- 可选参数和默认参数：使得函数的调用更为灵活，可以省略参数或者设置默认值。
- 剩余参数：允许函数接收不定数量的参数，并将其表示为数组。
- 函数重载：通过多个函数签名支持同一函数的多种实现方式。
- 函数类型别名：简化复杂的函数类型定义。
- 函数上下文类型：确保 this 在函数中的类型安全。

理解并熟练运用 TypeScript 的函数类型系统是掌握语言核心概念的关键，也是编写高质量、类型安全代码的基础。
