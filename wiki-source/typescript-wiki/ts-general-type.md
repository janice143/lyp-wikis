---
outline: deep
---
# 什么是泛型

ts的一个强大的特性，可以通过指定类型参数，实现代码的复用，可应用于函数、接口、类等场景。

# 基本使用

## 泛型函数

一个可以接受任意类型的函数，其中类型参数用于指定函数参数的类型和返回值的类型,保证**输入输出类型一致。**

```jsx
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("hello");
console.log(output); // 输出 "hello"

```

T 可以理解为一个变量。

另外， TypeScript 具有类型推断能力，因此可以省略类型参数，让编译器推断出类型

```
let output = identity("hello");
console.log(output); // 输出 "hello"

```

## 泛型接口

创建通用接口，其中类型参数用于指定接口成员的类型

```jsx
interface Pair<T, U> {
  first: T;
  second: U;
}

let pair1: Pair<number, string> = { first: 1, second: "hello" };
let pair2: Pair<string, boolean> = { first: "world", second: true };
console.log(pair1); // 输出 { first: 1, second: "hello" }
console.log(pair2); // 输出 { first: "world", second: true }
```

## 泛型类 class

创建通用类

```jsx
class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T {
    return this.items.pop();
  }
}

let stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.pop()); // 输出 2
console.log(stack.pop()); // 输出 1

```

# 内置工具类型

TypeScript提供了很多工具类型，方便地对类型进行操作和转换，包括 Partial、Required、Readonly、Record 和 ReturnType。

### Partial

将一个类型的所有属性变成可选的

```
interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>;

// 等价于

interface PartialUser {
  name?: string;
  age?: number;
}

```

### Required

将一个类型的所有属性变成必选的

```
interface User {
  name?: string;
  age?: number;
}

type RequiredUser = Required<User>;

// 等价于

interface RequiredUser {
  name: string;
  age: number;
}

```

### Readonly

将一个类型的所有属性变成只读的

```
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;

// 等价于

interface ReadonlyUser {
  readonly name: string;
  readonly age: number;
}

```

### Record

`Record<K, T>`：作用是自定义一个对象。`K` 为对象的 `key` 或 `key` 的类型，`T` 为 `value` 或 `value` 的类型

```
type User = {
  name: string;
  age: number;
};

type UserRecord = Record<string, User>;

// 等价于

interface UserRecord {
  [key: string]: User;
}

```

### ReturnType

`ReturnType<T>`：作用是获取函数返回值的类型。`T` 为函数

```
function add(a: number, b: number) {
  return a + b;
}

type AddReturnType = ReturnType<typeof add>;

// 等价于

type AddReturnType = number;

```

## Pick

从一个类型中选取部分属性创建一个新的类型。

```jsx
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserBasicInfo = Pick<User, 'name' | 'age'>;

// UserBasicInfo 的类型为 { name: string, age: number }

```

## Omit

从一个类型中删除部分属性创建一个新的类型

```
interface User {
  name: string;
  age: number;
  email: string;
}

type UserWithoutEmail = Omit<User, 'email'>;

// UserWithoutEmail 的类型为 { name: string, age: number }

```

`type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;`

## Exclude

从一个联合类型中排除一个或多个类型创建一个新的类型。例如：

`type Exclude<T, U> = T extends U ? never : T;`

```
type NumberOrString = number | string;

type OnlyNumber = Exclude<NumberOrString, string>;

// OnlyNumber 的类型为 number

```

## NonNullable

从一个类型中删除 null 和 undefined 类型创建一个新的类型。例如：

```
type MaybeNumber = number | null | undefined;

type NotNullNumber = NonNullable<MaybeNumber>;

// NotNullNumber 的类型为 number

```

## Parameters

获取一个函数的参数类型组成的元组类型。

```
function add(a: number, b: number) {
  return a + b;
}

type AddParamsType = Parameters<typeof add>;

// AddParamsType 的类型为 [number, number]
```

# 参考资料

[理解代码](https://www.notion.so/d01fe11051884847b3b73a1498c0d302?pvs=21)

[轻松拿下 TS 泛型 - 掘金](https://juejin.cn/post/7064351631072526350#heading-7)

[一文读懂 TypeScript 泛型及应用（ 7.8K字） - 掘金](https://juejin.cn/post/6844904184894980104#heading-8)

[「1.9W字总结」一份通俗易懂的 TS 教程，入门 + 实战！ - 掘金](https://juejin.cn/post/7068081327857205261#heading-78)
