# **第二章：ESLint 基础配置**

在这一章中，我们将深入介绍 **ESLint 配置文件的格式和配置项**。掌握这些配置选项将帮助你在不同的开发环境中灵活地使用 ESLint，确保代码质量和一致性。

## **1. 配置文件格式**

ESLint 提供了多种配置文件格式，以满足不同开发者的需求。你可以选择 **JSON、YAML** 或 **JavaScript** 格式来编写 ESLint 配置文件。

### **1.1 `.eslintrc.json` 格式**

最常见的格式，配置文件以 JSON 格式存储 ESLint 的配置。它非常简洁并且易于解析。

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

✅ **优点：**

- 简单、直接，易于维护。
- 使用 JSON 配置文件时，不需要写代码逻辑，只有键值对。

### **1.2 `.eslintrc.yml` 格式**

YAML 格式的配置文件在某些项目中更为流行，尤其是在一些对配置格式有偏好的项目中。YAML 格式没有冗余的括号和逗号，结构清晰易读。

```yaml
env:
  browser: true
  node: true

extends: "eslint:recommended"

rules:
  no-console: "warn"
  no-unused-vars: "error"
```

✅ **优点：**

- 更加简洁，特别适合需要层级结构的配置。
- 避免了 JSON 中需要逗号和括号的繁琐。

### **1.3 `.eslintrc.js` 格式**

JavaScript 格式的配置文件可以让你使用 **动态逻辑**，例如通过条件判断来加载不同的配置，这对于复杂项目很有帮助。

```javascript
module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: "eslint:recommended",
  rules: {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
};
```

✅ **优点：**

- **动态配置**，可以使用条件语句、变量等。
- 适用于需要自定义配置的复杂项目。

### **1.4 `eslintConfig` 在 `package.json` 中的使用**

除了使用 `.eslintrc.*` 文件来配置 ESLint，也可以在 **`package.json`** 文件中配置 ESLint。这样做的好处是避免了额外的配置文件，保持项目根目录的简洁。

```json
{
  "eslintConfig": {
    "env": {
      "browser": true,
      "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
      "no-console": "warn",
      "no-unused-vars": "error"
    }
  }
}
```

✅ **优点：**

- **集成在 `package.json` 中**，对于小型项目或没有复杂配置的项目非常方便。
- 不需要额外的配置文件，保持项目根目录简洁。

## **2. 基本配置项**

### **2.1 `env` 配置环境**

`env` 用于指定代码的运行环境，决定了哪些全局变量会被定义。常用的环境配置项包括：

- `browser`：启用浏览器环境（如 `window`, `document` 等全局变量）
- `node`：启用 Node.js 环境（如 `require`, `module` 等全局变量）
- `es6`：启用 ES6 环境（如 `Promise`, `let`, `const` 等）

```json
{
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  }
}
```

### **2.2 `extends` 配置扩展规则**

`extends` 让你能够**继承已有的规则集**。一些常见的基础配置扩展如下：

- `eslint:recommended`：推荐的基本规则
- `airbnb-base`：Airbnb 提供的 JavaScript 规则（非常常用）
- `plugin:react/recommended`：React 的推荐规则

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ]
}
```

✅ **优点：**

- **减少重复配置**，直接继承规则集。
- **适用于团队开发，保证一致性**。

### **2.3 `rules` 配置规则**

`rules` 允许你为每个检查项设置不同的规则，**可以关闭、修改严重性、或设置自定义规则**。规则可以有以下几种值：

- `"off"`：关闭规则
- `"warn"`：警告（不会阻止代码运行）
- `"error"`：错误（会阻止代码运行）

```json
{
  "rules": {
    "no-console": "warn", // 警告 console 使用
    "no-unused-vars": "error", // 报错未使用的变量
    "quotes": ["error", "double"] // 强制使用双引号
  }
}
```

### **2.4 `ignorePatterns` 配置忽略文件**

`ignorePatterns` 用于配置 ESLint 忽略的文件或文件夹，常见的如 `node_modules` 和构建文件夹。

```json
{
  "ignorePatterns": ["node_modules/", "dist/", "build/"]
}
```

📌 **常见用途：**

- 忽略生成文件、第三方依赖、或测试文件等。

## **3. 忽略文件配置**

### **3.1 `.eslintignore` 文件**

`.eslintignore` 文件是用来指定不需要被 ESLint 检查的文件或目录。它的语法和 `.gitignore` 类似。

```txt
node_modules/
dist/
build/
*.min.js
```

✅ **用途：**

- 不希望 ESLint 检查的文件（如依赖、构建文件等）
- 可以与 `eslintConfig.ignorePatterns` 配置项一起使用，避免重复配置。

### **3.2 `eslintConfig.ignorePatterns` 配置项**

`eslintConfig.ignorePatterns` 配置项也是用于忽略某些文件的，与 `.eslintignore` 文件的作用相同，但它直接在 `package.json` 中配置。

```json
{
  "eslintConfig": {
    "ignorePatterns": ["node_modules/", "dist/"]
  }
}
```

✅ **优点：**

- 不需要额外创建 `.eslintignore` 文件，直接在 `package.json` 中配置。

## **总结**

### **✅ 配置文件格式**

1️⃣ **`.eslintrc.json`**：简洁、常用的 JSON 格式配置文件  
2️⃣ **`.eslintrc.yml`**：简洁的 YAML 格式，适合喜欢层级结构的开发者  
3️⃣ **`.eslintrc.js`**：可以使用动态代码来配置，适合复杂项目  
4️⃣ **`eslintConfig` 在 `package.json` 中**：适用于简单项目，避免额外的配置文件

### **✅ 基本配置项**

5️⃣ **`env`**：配置代码运行环境，决定全局变量  
6️⃣ **`extends`**：继承规则集，减少重复配置  
7️⃣ **`rules`**：配置具体的检查规则，控制规则行为  
8️⃣ **`ignorePatterns` 和 `.eslintignore`**：配置需要忽略的文件和文件夹

🚀 **在下一章，我们将深入探讨 ESLint 常用规则与自定义规则，帮助你精细化配置 ESLint！**
