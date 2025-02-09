# formily内部的演变

上一小节从宏观层面分析了formily是如何从前端技术以及当时的政策背景中产生的，这一小节，我们专注于微观角度，分析formily内部的演变过程，通过阅读这小节，你会知道：

- formily版本演变的动机和变化
- formily的设计理念和核心价值

## 引言

目前，我们使用的formily一般是formily2.x，这个版本不是一蹴而就的，在这之前，存在两个版本：UForm和formily 1.x。所以formily的演变是这样一条路径：从2019 年对外开源的 UForm，再逐步演化成 Formily 1.x，最终进化成 2.x 版本。

## UForm：Formily 的前身

UForm要解决的问题，是一个“React场景中想要更好的写出表单页面”问题。

如果用一个简单的公式描述UForm，那么这个公式是这样的：

`UForm = 字段分布式管理 + React EVA + JSON Schema`

这个公式中的每个要素的引入，都是为了解决表单开发中的特定问题

- 字段分布式管理：React 单向数据流带来的性能缺陷
- React EVA：组件内外通讯
- JSON Schema：动态表单渲染引擎

这三个关键问题都基于一个前提：表单足够复杂。正是因为面对的表单场景足够复杂了，React的渲染问题才暴露出来变成一个需要解决的痛点；为了实现组件间通信，写的那一堆苗条代码严重影响了代码可维护性；以及业务的灵活性，要求表单要有动态渲染的能力。

关于这三个要素，UForm的设计思路是这样的演变的：

1. 提出“分布式管理”的理念让表单自己管理自己的数据，从而解决解决全局渲染的问题；
2. 表单数据分布式管理了，如何实现表单组件间的数据共享呢？答案是事件驱动 + 响应式数据流
3. JSON Schema属性扩展描述表单数据结构

可以发现，字段分布式管理和React EVA 是最基本的、基于React的表单解决方案，即React Form =  字段分布式管理 + React EVA。而JSON Schema是对UForm的另一个维度的赋能。

### 字段分布式管理

对于React，一个核心设计理念是单向数据流，基于单向数据流管理状态，意味着数据从父组件传递到子组件，并通过 props 的方式层层传递。当一个 UI 组件的数据发生变化时，会导致与其相关的所有子组件重新渲染，即使这些子组件的 props 并未发生改变。
可以发现，单向数据流这张方式虽然可以确保数据的可预测性和一致性，但是组件如果足够多，就不得不考虑渲染性能的问题了。

UForm提出的解决方案是使用状态分布式管理，一句话总结就是：根组件不做重绘，只负责消息分发，通过pub/sub广播给子组件自己重绘。

xxx

### React EVA

解决了重新渲染问题，下一个要解决的是表单组件间如何通信。任何场景下的通信问题，本质上只是两个的原子化问题：

- 如何实现子组件对父组件的通信
- 如何实现父组件对子组件的通信

UForm的方案是React EVA，EVA 是 Event-Value-Action 的缩写，主要解决的是表单的数据传递和联动难题。

#### 父组件对子组件的通信：替代 ref 的方案

UForm提出了一种替代 ref 的方案，通过在组件的 props 中传入一个 actions 对象，将组件的内部数据管理暴露给外部使用

```tsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: {} };

    // 将组件的 API 暴露给外部
    if (props.actions) {
      props.actions.getData = () => this.state.data;
      props.actions.setData = (data) => this.setState({ data });
    }
  }

  render() {
    return <div>{JSON.stringify(this.state.data)}</div>;
  }
}

// 使用示例
const actions = {};
<div>
  <MyComponent actions={actions} />
  <Button onClick={() => actions.setData('hello world')}>设置状态</Button>
</div>
```

通过 actions 对象，外部组件可以直接访问和修改内部组件的状态，而不需要依赖 ref，从而避免了 ref 的局限，并且不会被 HOC 拦截，保证了组件的独立性和灵活性。

#### 子组件对父组件的通信：借鉴 Redux 和 RxJS

组件内部如果想要修改父级组件的状态，传统的做法是使用 onXXX 属性（如 onClick、onChange）向外部传递事件。这种代码写多了就会导致代码可维护性降低。

UForm的解决方案是参考Redux 的reducer设计模式+引入RxJS的 Subject，收敛出一个effects处理器来聚合业务逻辑，实现事件驱动和逻辑收敛。

```tsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {} };

        if (typeof props.effects === 'function') {
            this.subscribes = {};
            props.effects(this.selector);
        }
    }

    selector = (type) => {
        if (!this.subscribes[type]) {
            this.subscribes[type] = new Subject();
        }
        return this.subscribes[type];
    };

    dispatch = (type, payload) => {
        if (this.subscribes[type]) {
            this.subscribes[type].next(payload);
        }
    };

    render() {
        return (
            <div>
                {JSON.stringify(this.state.data)}
                <button onClick={() => this.dispatch('onClick', 'clicked')}>点击事件</button>
            </div>
        );
    }
}

// 使用
const effects = ($)=>{
  const [value,setValue]=useState();
  
    $('onClick').subscribe(()=>{
      setValue('xxxx')
    })
}
<div>
   <MyComponent effects={effects} />
</div>
```

#### 共享 actions 和 effects

就这样，一个最基本的父子组件的数据共享与事件管理已经实现，对于一个大型应用，虽然会有很多组件，但是可以通过共享同一个actions引用与一个effects处理器，实现多个组件之间的状态共享和事件管理。这时候actions与effects完全可以通过独立js文件做管理。

```tsx
const actions = {};
const effects = ($) => {
    $('onClick').subscribe(() => {
        actions.setData('data changed');
    });
};

<div>
    <MyComponentA actions={actions} effects={effects} />
    <MyComponentB actions={actions} effects={effects} />
    <MyComponentC actions={actions} effects={effects} />
    <Button onClick={() => actions.setData('hello world')}>设置状态</Button>
</div>
```

这就是React-EVA的核心思想。

### JSON Schema

JSON Schema 的引入使得表单渲染完全 配置化，通过 JSON 文件即可定义表单的结构、字段属性和验证规则。但是直接使用JSON Schema会丢失很多与UI相关的元数据，那么这些元数据应该怎样来描述呢？

UForm借鉴了Mozilla的解决方案，抽象了一层UI Schema的协议，但是区别在于在Mozilla的方案中，UI与数据是分离的，但是UForm认为UI和数据是集合的关系：一个表单字段的数据描述应该是一个表单字段的组件描述的子集。为了不污染JSON Schema原本协议的升级迭代，UForm对数据描述增加x-*属性，这样就能兼顾数据描述与UI描述，同时在代码层面上，用户也不需要分两处去做配置，排查问题也会比较方便。

所以，看到这里，你就能明白为什么在使用formily的时候，要写这么多x-*配置。

### UForm的架构图

字段分布式管理、 React EVA、JSON Schema这三者是UForm的核心，但是不是UForm的全部，UForm的真实定位，是打造一个完整的表单体系化的生态。下面这张图是UForm 架构的整体设计。

## Formily 1.x：从 UForm 到标准化表单解决方案

### 2.1 为何升级到 Formily

随着阿里内部的多 BU（业务单元）共建需求，UForm 在实际使用过程中暴露出了一些问题：

- 可维护性差：随着业务需求增加，UForm 的代码复杂度不断提升，难以维护。
- 性能瓶颈：在处理大量动态表单时，UForm 存在一定的性能瓶颈。
- 标准化不足：不同 BU 的需求各异，UForm 的灵活性反而导致标准化程度不够，难以在多个业务线推广。

### 2.2 Formily 1.0 的推出

- 核心设计：
- 重新架构：基于 React 的新架构，进一步解耦业务逻辑和表单渲染。
- Schema 驱动：延续 UForm 的 Schema 驱动开发，同时增强了对 JSON Schema 的支持。
- 插件系统：引入插件机制，支持表单校验、联动、动态生成等复杂场景。
- 主要特点：
- 统一数据管理：通过 Context 和 Hooks，更高效地管理表单状态。
- 高性能：通过优化渲染机制，解决 UForm 的性能瓶颈。
- 易扩展：模块化设计，允许业务方根据需求进行二次开发和扩展。

### 2.3 Formily 1.0 的应用

Formily 1.0 推出后迅速应用于阿里的多个业务系统，包括供应链管理、商家后台等，为开发团队提供了更高效的表单开发体验。

## Formily 2.x：迈向更高效、更灵活的未来

### 3.1 Formily 2.0 的动机

虽然 Formily 1.0 已经解决了大量问题，但随着阿里业务的扩展和技术的发展，新的需求不断涌现：

- 更高的性能要求：在大规模复杂表单场景下，Formily 1.0 仍然存在性能瓶颈。
- 更灵活的表单配置：业务方需要更灵活的表单定制能力，以应对不断变化的业务需求。
- 跨端支持：需要支持 PC 和移动端的表单场景。

### 3.2 Formily 2.0 的革新

- 全新的架构设计：
- 响应式数据管理：基于 Proxy 的响应式数据管理，提升性能和易用性。
- 高可扩展性：支持多层次表单联动和复杂校验规则，适应不同业务场景。
- 组件生态：内置丰富的表单组件库，支持 Ant Design 和其他 UI 框架的无缝集成。
- 主要特性：
- 性能优化：通过响应式架构，大幅减少不必要的渲染，提升表单的响应速度。
- 跨端适配：支持 PC 端和移动端的无缝切换，统一表单体验。
- 插件和扩展机制：更灵活的插件机制，使得表单功能可以按需加载，避免代码冗余。

### 3.3 Formily 2.0 的应用与未来展望

Formily 2.0 的推出，使得阿里内部及其开源社区的开发者能够更加灵活、高效地构建复杂表单系统。未来，Formily 计划引入更多 AI 驱动的智能表单功能，以进一步简化表单开发流程。

## 总结

从 UForm 到 Formily 2.0，阿里巴巴用实际的业务需求和技术探索推动了开源表单框架的发展。Formily 作为一个 Schema 驱动的表单解决方案，不仅解决了中后台系统的表单开发痛点，也为开源社区提供了一个高度灵活、易扩展的表单开发工具。在未来，随着业务需求的不断变化和技术的进步，Formily 还将继续演化，以适应更复杂的场景和更高效的开发流程。

讲到这里，你应该可以想明白一件事情：人们对formily的争议，其实就是对复杂边界的争议。

参考链接
<https://juejin.cn/post/6844904005777227790>
<https://zhuanlan.zhihu.com/p/62927004>
<https://github.com/AEPKILL/uform/blob/master/README.zh-cn.md>
<https://github.com/AEPKILL/uform/tree/master>
