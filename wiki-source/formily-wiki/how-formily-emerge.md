# formily是如何产生的

Formily 的诞生，不是一个偶然，而是前端技术和政策环境共同作用下的产物。本小节主要从宏观角度推导formily的产生。

## 前端技术背景

### 表单的起源

表单是用户与网站交互的最基本方式之一，可以对数据进行提交、处理和存储，对用户输入至关重要。
作为核心 Web 标准的一部分，表单标签是HTML 2.0引入的，当时的目的就是创建一个结构，使用户能够将数据提交到服务器，这种交互与之前的静态页面截然不同，网站从此有了动态行为。

表单最初设计得非常简单，仅仅是为了通过 HTTP 收集用户数据并将其发送到服务器。下面是一个典型例子：

```html
<form action="submit_form.php"method="post">
  <label for="name">Name:</label>
  <input type="text"id="name"name="name">

  <label for="email">Email:</label>
  <input type="email"id="email"name="email">

  <input type="submit"value="Submit">
</form>
```

可以看到，从本质上讲，表单是一个简单的容器，用于将输入字段（如文本框、单选按钮、复选框和提交按钮）分组。当通过 HTTP 请求（GET 或 POST）提交表单时，服务器便会处理数据。

随着前端技术如 JavaScript 开始成熟，表单处理技术也在发展，比如引入了客户端表单验证、局部刷新等。

到现在，表单依然是 Web 应用的重要组成部分，但随着现代前端框架（如 React、Angular 和 Vue）的发展，表单技术也发生了巨大变化。

### MVVM架构：数据驱动视图

MVVM（Model-View-ViewModel）架构在前端领域中广泛使用，核心思想是实现数据和视图的双向绑定，从而通过数据的变化自动更新视图，简化了 UI 层的开发复杂度。模型层（Model）负责数据处理和业务逻辑，视图（View）用于展示，视图模型（ViewModel）负责桥接数据与视图，并处理用户交互。

这个架构特别适合以数据驱动为核心的业务场景，和企业的数据驱动业务思路一拍即合。

### React与组件化的开发范式

React 提供了一种基于组件的声明式开发范式。组件化架构不仅增强了代码复用性和可维护性，还通过虚拟DOM 优化了 UI 渲染性能，使得频繁的数据变更不会带来明显的性能损耗。React 通过 Hook 和 Context API 等特性进一步提升了状态管理的灵活性，使组件的状态和行为可以轻松管理。React 在构建动态、可组合 UI 界面时非常高效，已成为企业中后台系统开发的主流选择。

React + Ant Design Form 的传统表单开发方式
在传统表单开发方式中，Ant Design组件库的 Form 组件被广泛应用于中后台项目中，这套开发方式具有以下特点：

1. 组件化：Ant Design Form 提供了高度封装的表单控件（如 Input、Select、DatePicker 等），可以轻松组合和复用，提升了开发效率。
2. 受控与非受控表单：通过 value 和 onChange 来控制表单输入，或者使用 Ant Design 的 Form 提供的 Form.Item 机制，开发者可以灵活地管理表单数据和状态。
3. 内置校验：Ant Design Form 支持基于 rules 属性的简单校验，能够快速实现表单验证逻辑，而无需开发者手动编写繁琐的验证函数。

可以说，这种开发方式可以满足很多表单的开发要素，覆盖很多业务场景，开发效率也有很大提升。这种通过组件化设计和受控/非受控思想的工作方式，对于开发者来讲，上手也十分简单。

### 二次封装 + 配置化渲染

为了进一步提高开发效率和代码复用率，很多开发者会在这基础之上，采用“二次封装 + 配置化” 的方式做一些改进。这种方法大概是这样的：

1. 抽象出统一的Form渲染组件
将 Ant Design 提供的 Form 和 Form.Item 进行二次封装，形成一个可复用的高层级组件。这个组件可以接收一组配置参数，用来动态生成表单控件。
2. 使用配置驱动渲染
根据Form.Item的Props属性，定义一个JSON 配置对象，这个配置对象包含表单结构和逻辑，将这个对象传入给封装的组件，通过遍历的方式渲染出相应的表单项和控件。

在一个典型的 Ant Design Form 表单开发中，开发者会从这样的代码：

```html
<Form>
    <Form.Item label="是否为公司用户" name="userType" rules={[{ required: true }]}>
      <Select>
        <Option value="yes">是</Option>
        <Option value="no">否</Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="公司名称"
      name="companyName"
    >
      <Input placeholder="请输入公司名称" />
    </Form.Item>
</Form>
```

转换成这种写法：

```html
// 配置对象示例
const formConfig = [
  {
    label: '是否为公司用户',
    name: 'userType',
    components: 'select',
    options: [
      { value: 'admin', label: '管理员' },
      { value: 'user', label: '普通用户' },
    ],
    rules: [{ required: true }],
  },
  {
    label: '公司名称',
    name: 'companyName',
    components: 'input',
  },
];

// 使用封装组件
const MyForm = () => {
  return <CustomForm formConfig={formConfig} />;
};

export default MyForm;
```

配置化带来的好处是代码简洁、易于维护和高可复用性。

### 传统方案的局限性

传统表单开发方式虽然极大地提升了前端开发效率，但在真实的中后台系统中，表单场景的复杂度会迅速上升，比如会有处理长表单、复杂联动关系、多层嵌套结构等复杂场景。

基于上面的示例，当我们开始加上动态逻辑，比如根据用户输入联动显示/隐藏字段、复杂的表单验证规则，代码就会迅速膨胀，成为维护噩梦，像下面这样：

```tsx
const ComplexForm = () => {
 const [isCompanyUser, setIsCompanyUser] = useState(false);

 const handleUserTypeChange = (value) => {
  setIsCompanyUser(value === 'yes');
 };

 const validateCompanyName = (_, value) => {
  if (isCompanyUser && (!value || value.length < 3 || value.length > 50)) {
   return Promise.reject('公司名称必须在 3 到 50 个字符之间');
  }
  return Promise.resolve();
 };

 return (
  <Form>
   {/* 用户类型选择 */}
   <Form.Item label="是否为公司用户" name="userType" rules={[{ required: true }]}>
    <Select onChange={handleUserTypeChange}>
     <Option value="yes">是</Option>
     <Option value="no">否</Option>
    </Select>
   </Form.Item>

   {/*公司名称字段，动态显示/隐藏*/}
   {isCompanyUser && (
   <Form.Item
    label="公司名称"
    name="companyName"
    rules={[{ validator: validateCompanyName }]}
    >
    <Input placeholder="请输入公司名称" />
   </Form.Item>
  )}
  </Form>
 );
};

export default ComplexForm;
// 定义配置对象
const formConfig =({isCompanyUser,setIsCompanyUser})=> [
 {
  label: '是否为公司用户',
  name: 'userType',
  type: 'select',
  options: [
   { value: 'yes', label: '是' },
   { value: 'no', label: '否' },
  ],
  rules: [{ required: true, message: '请选择用户类型' }],
  onChange: () => (value) => setIsCompanyUser(value === 'yes'), // 动态逻辑
 },
 {
  label: '公司名称',
  name: 'companyName',
  type: 'input',
  rules: [
   {
    validator: () => (_, value) => {
     if (isCompanyUser && (!value || value.length < 3 || value.length > 50)) {
      return Promise.reject('公司名称必须在 3 到 50 个字符之间');
     }
     return Promise.resolve();
    },
   },
  ],
  visible: () => isCompanyUser, // 控制显示/隐藏
 },
];
// 使用封装组件
const ComplexForm = () => {
 const [isCompanyUser, setIsCompanyUser] = useState(false);

 <CustomForm formConfig={formConfig({isCompanyUser,setIsCompanyUser})} />
};

export default ComplexForm;
```

在这两种写法中，我们可以发现这些问题：

1. 状态管理膨胀：使用了useState来管理字段的显示/隐藏逻辑。当业务需求越来越多时，你会发现这些状态变量和处理逻辑会迅速增多，代码变得臃肿。
2. 校验规则分散：表单验证逻辑需要手动配置到每个字段中，随着表单字段和规则的增加，这些逻辑难以维护。
3. 组件耦合性高：字段显示/隐藏和配置紧密耦合在一起，缺乏解耦和可复用性。
4. 配置对象的复杂度：因为有联动和显隐，配置对象变得臃肿，不易管理。
5. 缺乏上下文感知：组件之间缺乏“上下文”感知，如果一个表单项想要获取其他表单项的状态，往往需要通过上下文或手动传递 props 来实现

传统方法虽然上手简单，但是也很脆弱，无法管理好复杂的联动和校验等逻辑，难以应对中后台业务场景中的高复杂性需求，无法适应“数据驱动业务”的要求。

另外，传统的配置化表单开发方式虽然简化了表单渲染，但是这个配置协议本身具有很大问题，比如不通用、不稳定、不标准。最简单的协议是基于Form.item的props设计，当每个表单项的特性（如 label、name、rules 等）都通过配置对象传入时，随着需求复杂化，配置对象会越来越臃肿。另外，一旦组件的属性名称或者用法变化，配置也得跟着变化。

## 政策和商业背景

### “大中台、小前台”战略

2015年，阿里巴巴为了应对多元化业务的迅速扩展，推出了“大中台、小前台”战略[参考]。这种策略的核心在于加强中台能力，解耦业务，提供快速响应的支持服务，尤其是数据和技术共享。

### 企业数字化转型

阿里巴巴提出中台战略后，业界掀起了一场“中台”热。各家都在搭建各式各样的中台，如商务中台、组织中台、技术中台、数据中台等。企业纷纷加速数字化转型，试图通过建立技术中台、数据中台等方式把数据从“死数据”变成“活数据”，也就是为实际业务服务。

### 数据驱动业务

企业要通过数据驱动业务，指的是用数据来指导战略决策、优化运营流程，甚至预测市场趋势，减少商业决策的风险。这意味着，数据不再是简单的存储和归档，而是成为公司“智慧的大脑”，主导各个环节的运营。
用阿里巴巴前架构师王思轩的话来讲，“一切业务数据化，一切数据业务化”[参考]。
大量企业在追求敏捷开发和模块化架构，于是，所有技术团队都在寻找更快、更易维护的方式来构建复杂的业务表单。

## Formily 的诞生

传统表单的痛点正是 Formily 想解决的，而且在那个时代背景下，Formily又要强大到足够能支撑企业数字化驱动的要求。
