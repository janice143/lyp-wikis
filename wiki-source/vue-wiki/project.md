# Vue 2 项目架构与构建

Vue CLI 提供了现代化前端工程体系，帮助开发者快速搭建基于 Vue 2 的标准项目结构，支持热更新、环境切换、构建优化等能力。

### 使用 Vue CLI 创建项目

#### 安装 CLI 工具

```bash
npm install -g @vue/cli@4
```

#### 创建项目

```bash
vue create my-project
```

在交互中选择手动配置（Babel、Router、Vuex、Linter 等），也可选择保存配置供下次复用。

### Vue 项目目录结构解析

典型的 Vue CLI 项目结构如下：

```
my-project/
├── public/               // 公共资源，直接拷贝至最终打包目录
├── src/                  // 核心源码目录
│   ├── assets/           // 静态资源（图片、样式）
│   ├── components/       // 可复用组件
│   ├── views/            // 路由页面组件
│   ├── router/           // 路由配置
│   ├── store/            // Vuex 状态管理
│   ├── App.vue           // 根组件
│   └── main.js           // 应用入口文件
├── .env.*                // 环境变量文件
├── vue.config.js         // CLI 配置文件（如代理、构建路径）
└── package.json          // 依赖管理与脚本命令
```

### 单文件组件（.vue）结构说明

Vue 推崇使用 `.vue` 单文件组件格式，封装模板、脚本与样式：

```vue
<template>
  <div class="greeting">Hello {{ name }}</div>
</template>

<script>
export default {
  props: ['name']
}
</script>

<style scoped>
.greeting {
  color: blue;
}
</style>
```

#### 三个部分

- `<template>`：声明式模板，与组件数据绑定
- `<script>`：逻辑处理，包含组件选项（data、props、methods 等）
- `<style scoped>`：作用域样式，仅应用于当前组件

### 环境变量配置（开发、测试、生产）

Vue CLI 默认支持 `.env` 文件：

```
.env.development
.env.production
.env.test
```

变量需以 `VUE_APP_` 前缀定义：

```env
VUE_APP_API_URL=https://api.example.com
```

使用方法：

```js
axios.get(process.env.VUE_APP_API_URL)
```

构建时 CLI 会根据 `NODE_ENV` 自动加载对应环境文件。

### 多页面应用的构建支持

Vue CLI 默认是单页应用（SPA），但也支持多页应用（MPA）配置。

#### 配置多页面入口

在 `vue.config.js` 中：

```js
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    admin: {
      entry: 'src/admin.js',
      template: 'public/admin.html',
      filename: 'admin.html'
    }
  }
}
```

每个页面都有独立的入口、模板与打包输出，适用于管理后台 + 用户端共存等场景。

---

Vue CLI 提供了完善的构建工具与规范化项目结构，是 Vue 2 企业项目开发的基础设施。理解其项目目录、组件结构与构建配置，有助于实现清晰、可扩展的应用架构。
