---
outline: deep
---

# tsconfig.json 配置

### `tsconfig.json` 配置详解

`tsconfig.json` 是 TypeScript 项目的核心配置文件，它用于指定 TypeScript 编译器的行为和如何处理项目中的 TypeScript 文件。理解 `tsconfig.json` 配置选项能够帮助你更高效地管理项目的编译过程、优化性能，并确保代码符合你的需求。

下面，我们将详细分析 `tsconfig.json` 中的主要配置项，并提供实际使用的示例。

---

### 1. **compilerOptions**

`compilerOptions` 是 `tsconfig.json` 中最常见的配置项，用于定义 TypeScript 编译器的行为。这个配置项包含了多个子选项，允许你控制生成的 JavaScript 代码的各种特性。常见的选项如下：

#### a. **target**

指定编译后生成的 JavaScript 的版本。常见的值包括：

- `es5`：编译为 ECMAScript 5
- `es6` / `es2015`：编译为 ECMAScript 6（ES6）
- `esnext`：编译为 ECMAScript 的最新版本

```json
{
  "compilerOptions": {
    "target": "es6"
  }
}
```

#### b. **module**

指定生成的 JavaScript 文件使用的模块系统。常见的模块系统包括：

- `commonjs`：Node.js 默认模块系统
- `es6` / `es2015`：ES6 模块
- `amd`：用于浏览器的异步模块定义
- `umd`：通用模块定义，兼容多种模块加载方式

```json
{
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

#### c. **moduleResolution**

控制如何解析模块。在不同的环境中，模块解析的规则可能不同，常见的值有：

- `node`：使用 Node.js 风格的模块解析
- `classic`：TypeScript 早期的模块解析方式

```json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```

#### d. **strict**

启用严格模式，它会自动启用一组严格的类型检查选项，使 TypeScript 更加严格。包括：

- `noImplicitAny`：禁止隐式的 `any` 类型
- `strictNullChecks`：启用严格的 `null` 和 `undefined` 检查
- `strictFunctionTypes`：启用严格的函数类型检查

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

#### e. **esModuleInterop**

启用对 `CommonJS` 模块的兼容，使得从 CommonJS 模块导入的默认导出能够正确使用 ES6 风格的导入语法。

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

#### f. **allowJs**

允许在 TypeScript 项目中包含 JavaScript 文件。这对于逐步迁移到 TypeScript 或与 JavaScript 库兼容时非常有用。

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

#### g. **outDir**

指定编译后 JavaScript 文件的输出目录。

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

#### h. **sourceMap**

生成 `.map` 文件，帮助在浏览器调试时映射回 TypeScript 源代码，通常用于开发阶段。

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

#### i. **skipLibCheck**

跳过库文件（如 `node_modules` 中的文件）的类型检查，通常在大型项目中使用，可以提高编译速度。

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### 2. **include 和 exclude**

`include` 和 `exclude` 配置项用于指定要包含和排除的文件或文件夹。`include` 可以使用 glob 模式来指定需要包含的文件，`exclude` 则是指定不需要编译的文件或目录。

#### a. **include**

指定要包含的文件或文件夹，支持 glob 模式。

```json
{
  "include": ["src/**/*"]
}
```

#### b. **exclude**

指定排除的文件或文件夹，`node_modules` 默认会被排除。

```json
{
  "exclude": ["node_modules", "build"]
}
```

### 3. **files**

与 `include` 和 `exclude` 不同，`files` 用于显式列出所有需要编译的文件。

```json
{
  "files": ["src/index.ts", "src/app.ts"]
}
```

### 4. **extends**

通过 `extends` 选项，可以继承另一个 `tsconfig.json` 文件的配置。这对于多个项目共享相同的配置或子项目继承父项目的配置非常有用。

```json
{
  "extends": "./base-tsconfig.json"
}
```

### 5. **references**

`references` 允许你在项目中建立多个 TypeScript 项目间的依赖关系。它用于支持 TypeScript 的 **项目引用** 功能，可以在大型项目中实现更好的构建和编译过程。

```json
{
  "references": [
    {
      "path": "../common"
    }
  ]
}
```

### 示例：完整的 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "allowJs": true,
    "outDir": "./dist",
    "sourceMap": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "files": ["src/index.ts"]
}
```

---

### 总结

`tsconfig.json` 配置文件在 TypeScript 项目中扮演着至关重要的角色，管理着编译器的行为、源代码的组织结构以及输出的生成方式。理解和掌握常见的配置项，如 `target`、`module`、`strict` 等，能够帮助开发者优化开发流程，提高代码质量，并确保代码符合项目需求。
