---
outline: deep
---
# **TypeScript 类型体操**

## **TypeScript 类型编程为什么被叫做类型体操？**

TypeScript 的类型系统远超简单的类型注解，它可以进行 **模式匹配、递归、运算、分解、重构**，甚至可以用来**编写逻辑计算**。由于它的灵活性和复杂性，开发者往往需要像做体操一样绕过类型限制、优化类型推导，因此被称为 **“类型体操”**（TypeScript Type Gymnastics）。

**特点：**

1. **编译期执行**：所有类型体操都是在 **TypeScript 编译阶段** 运行，不影响 JavaScript 运行时的性能。
2. **基于 TypeScript 类型系统**：利用 TypeScript 的 **条件类型、映射类型、泛型、类型推导** 等特性进行复杂运算。
3. **高阶应用**：适用于 **类型转换、类型检查、代码自动化** 等场景，例如：
   - **自动推导 API 响应结构**
   - **动态创建类型**
   - **基于类型信息约束代码逻辑**
  
## **TypeScript 类型系统支持哪些类型和类型运算？**

TypeScript 的类型系统主要由 **基础类型、复合类型、类型运算** 组成，支持模式匹配、条件运算、映射等高级操作。

### **1. 类型分类**

| 类型 | 说明 | 示例 |
|------|------|------|
| **基础类型** | 代表最基础的数据类型 | `number, string, boolean, null, undefined, symbol, bigint` |
| **对象类型** | 用于定义结构化数据 | `{ name: string; age: number }` |
| **数组类型** | 用于表示列表数据 | `number[]` 或 `Array<string>` |
| **元组类型** | 确定元素数量和类型的数组 | `[string, number]` |
| **函数类型** | 表示函数的参数和返回值 | `(a: number, b: number) => number` |
| **联合类型** | 变量可以是多种类型之一 | `string | number` |
| **交叉类型** | 组合多个类型为一个新类型 | `A & B` |
| **映射类型** | 用于批量修改对象类型的属性 | `Partial<T>, Readonly<T>` |
| **条件类型** | 根据类型条件推导不同类型 | `T extends U ? X : Y` |
| **递归类型** | 通过递归定义自身 | `type Nested<T> = T \| Nested<T[]>` |

### **2. 类型运算**

| 运算 | 说明 | 示例 |
|------|------|------|
| **模式匹配** | 利用 `infer` 提取类型 | `T extends infer U ? U : never` |
| **类型条件判断** | 通过 `extends` 判断类型关系 | `T extends U ? X : Y` |
| **类型映射** | 通过 `keyof` 和 `Mapped Type` 修改类型 | `type Readonly<T> = { [K in keyof T]: T[K] }` |
| **类型组合** | 通过 `&` 进行交叉类型合并 | `type NewType = A & B` |
| **类型推导** | `infer` 关键字用于在条件类型中推导 | `T extends Promise<infer U> ? U : never` |
| **递归类型** | 递归定义类型 | `type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T` |

---

## **套路一：模式匹配做提取**

**原理：** 通过 **条件类型 + `infer` 关键字** 提取类型中的部分信息。

### **示例：提取数组的元素类型**

```ts
type ElementType<T> = T extends Array<infer U> ? U : never;

type A = ElementType<number[]>;  // A = number
type B = ElementType<string[]>;  // B = string
type C = ElementType<[number, string]>;  // C = number | string
```

**原理解析：**

- `infer U` 用于**推导** `T` 数组的元素类型。
- 如果 `T` 是 `Array<number>`，那么 `U = number`，返回 `number`。
- 适用于 **数组、元组、Promise** 等结构的类型提取。

---

## **套路二：重新构造做变换**

**原理：** 通过 **映射类型 + `keyof` 关键字**，创建新的类型结构。

### **示例：转换对象的可选属性**

```ts
type PartialObj<T> = {
  [K in keyof T]?: T[K]
};

type User = { name: string; age: number };
type PartialUser = PartialObj<User>;
// 等价于 { name?: string; age?: number }
```

**原理解析：**

- `keyof T` 获取 `T` 的所有属性键。
- `[K in keyof T]` 遍历 `T` 的所有属性并重新构造类型。
- `?:` 将属性变为可选属性。

---

## **套路三：递归复用做循环**

**原理：** 通过 **递归类型** 处理 **嵌套数据结构**。

### **示例：拍平嵌套数组**

```ts
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type A = Flatten<[1, [2, [3, 4]]]>;
```

**最终 `A = 1 | 2 | 3 | 4`**

**适用于：**

- **递归遍历嵌套数据结构**
- **类型递归解析 JSON、树形数据**

---

## **套路四：数组长度做计数**

**原理：** **利用元组 `length` 作为数字计算工具**，实现计数和运算。

### **示例：计算数组的长度**

```ts
type Length<T extends any[]> = T["length"];

type A = Length<[1, 2, 3]>; // 3
type B = Length<[]>; // 0
```

**适用于：**

- **类型层面的计数**
- **计算偏移量、索引等**

---

## **套路五：联合分散可简化**

**原理：** **条件类型对联合类型的分布性**，让联合类型的计算更直观。

### **示例：获取函数的返回值类型**

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = ReturnType<() => string>; // string
type B = ReturnType<() => number>; // number
```

**适用于：**

- **处理联合类型的分布式计算**
- **提取泛型类型信息**

---

## **套路六：特殊特性要记清**

TypeScript 类型系统有一些**特殊特性**，要熟练掌握：

1. **联合类型默认是分布式的**（`T extends U` 自动作用于联合类型的每个成员）。
2. **`unknown` 是比 `any` 更安全的动态类型**（必须先判断类型）。
3. **`never` 代表永远不可能发生的类型**（比如 `throw new Error()`）。

---

## **TypeScript 内置的高级类型**

TypeScript 提供了大量**内置的高级类型**，可用于高效构造类型：

| 高级类型 | 作用 |
|---------|------|
| `Partial<T>` | 使所有属性变为可选 |
| `Required<T>` | 使所有属性变为必选 |
| `Readonly<T>` | 使所有属性变为只读 |
| `Record<K, T>` | 生成指定键值的对象类型 |
| `Pick<T, K>` | 选取对象中的部分属性 |
| `Omit<T, K>` | 移除对象中的部分属性 |
| `ReturnType<T>` | 获取函数的返回值类型 |

---

## **真实案例说明类型编程的意义**

### **场景：API 响应数据自动推导**

如果后端返回的数据是：

```json
{
  "user": { "name": "Alice", "age": 25 },
  "posts": [{ "title": "TypeScript 类型体操" }]
}
```

可以用 `infer` 自动推导类型：

```ts
type APIResponse<T> = T extends { user: infer U; posts: infer P } ? { user: U; posts: P } : never;
```

这样，前端开发者可以**直接获得类型推导**，提高开发效率！

---

## **总结**

TypeScript 类型体操通过 **模式匹配、递归、类型运算** 等手段，使得 **类型编程成为可能**。掌握这些套路，可以极大提升代码的灵活性，减少重复劳动，使类型系统更加智能和自动化！
