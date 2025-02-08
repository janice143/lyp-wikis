---
outline: deep
---
# 一个ts的困惑，关于结构化类型的兼容性

## 问题描述

最近在开发的时候，出现了一个和ts有关的bug。

调用分页查询接口的时候，入参中表示当前页实际上是pageNo,但是我传的是page。

我编写的interface和请求函数是这样的：

```jsx
const params = {
  ...其他参数,
  pageSize, // 页码长度
  page: current, // 页码
};
const res = await service.getXXXList(params);

// 接口的入参ts
interface IgetXXXList{
 ...其他参数，
 pageNo?: number;
 pageSize?: number;
}
```

可以发现我传参错误，但是ts并没有检测出来。

## 分析和解决

1. bug的直接原因在于我传了不符合接口的参数。根本原因是接口规范化的问题。

目前我们的一些老的接口，表示当前页的参数是page，但是后面出现了一些使用pageNo的接口。但是这周问后端，听说最新的规范是出参和入参一样，用curPage。

解决：了解当前的规范现状，目前入参到底有没有统一的规范呢？如果有的话目前执行情况是怎样的？等等。

1. 为什么ts不报错呢？（结构性匹配（兼容性匹配），额外属性检查）

TypeScript 在接口与具体对象之间做的匹配是结构性匹配(structural type)。结构化匹配的基本规则是，只要传入的对象含有接口中定义的所有必选属性,并且这些属性的类型也匹配,那么就会认为匹配成功。如果接口的所以属性都为非必选，只要传入的对象含有接口中定义的属性，且类型相同，也认为匹配成功。

另外，ts的额外属性检查（excess property checking)只适用于使用对象字面量直接作为参数。

如果想让这个匹配更加严格,可以:

1. 使用类型断言:

```
const res = await service.getXXXList(params as Idata);
```

1. 如果不是service接口，而是个普通函数，直接给函数加上严格的泛型类型:

```jsx
const params = {
  page: 1,
  pageSize: 1,
};
type StrictPropertyCheck<T, TExpected, TError> = Exclude<
  keyof T,
  keyof TExpected
> extends never
  ? {}
  : TError;

const test = <T extends Idata>(
  data: T & StrictPropertyCheck<T, Idata, 'Only allowed properties of Idata'>
): any => {};

interface Idata {
  pageNo?: number;
  pageSize?: number;
}

test(params); // 报错
```

1. 限制params类型

```jsx
const params:IgetXXXList = {
  ...其他参数,
  pageSize, // 页码长度
  page: current, // 页码
};
const res = await service.getXXXList(params);

// 接口的入参ts
interface IgetXXXList{
 ...其他参数，
 pageNo?: number;
 pageSize?: number;
}
```

1. 对象字面量

```jsx
const res = await service.getXXXList({
  ...其他参数,
  pageSize, // 页码长度
  page: current, // 页码
});

```

## 参考资料

1. <https://stackoverflow.com/questions/54775790/forcing-excess-property-checking-on-variable-passed-to-typescript-function>
2. <https://segmentfault.com/a/1190000022418050>
3. <https://juejin.cn/post/7011810022246055973>
