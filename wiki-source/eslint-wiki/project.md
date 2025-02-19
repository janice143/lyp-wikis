# **第十章：ESLint 项目实战**

在本章中，我们将通过一系列实际项目来展示如何在不同类型的项目中配置和使用 ESLint。我们将从 **React**、**Vue** 和 **TypeScript** 项目的 ESLint 配置开始，深入探讨如何通过集成 **Prettier** 和 **Husky** 提高开发效率，最后展示如何在 **CI/CD 流水线** 中集成 ESLint，确保代码质量的一致性。

## **1. 实战 1：React 项目的 ESLint 配置**

### **1.1 安装 ESLint 依赖**

在 React 项目中使用 ESLint，首先需要安装必要的依赖，包括 ESLint、React 插件以及其他相关配置包。

```bash
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks eslint-config-airbnb
```

### **1.2 配置 ESLint**

在项目根目录下创建 `.eslintrc.js` 文件，配置 ESLint 规则集。我们将使用 Airbnb 的规则，并添加 React 和 React Hooks 插件。

```javascript
module.exports = {
  extends: [
    'eslint:recommended',            // 使用 ESLint 官方推荐的规则
    'plugin:react/recommended',      // React 插件推荐规则
    'plugin:react-hooks/recommended', // React Hooks 插件推荐规则
    'airbnb'                         // Airbnb 风格指南
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.js'] }],
    'react/prop-types': 'off',  // 如果使用 TypeScript, 可以关闭 prop-types 检查
    'no-console': 'warn'        // 警告使用 console
  },
  settings: {
    react: {
      version: 'detect',  // 自动检测 React 版本
    }
  }
};
```

📌 **效果**：配置完成后，React 项目将遵循 Airbnb 风格指南，同时确保符合 React 和 React Hooks 的最佳实践。

## **2. 实战 2：Vue 项目的 ESLint 配置**

### **2.1 安装 ESLint 依赖**

在 Vue 项目中，我们需要安装 Vue 插件及相关依赖。

```bash
npm install --save-dev eslint eslint-plugin-vue eslint-config-airbnb-base
```

### **2.2 配置 ESLint**

在 Vue 项目的根目录下，创建 `.eslintrc.js` 配置文件。配置 Vue 插件并引入 Airbnb 基本规则。

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',  // Vue 3 插件推荐规则
    'airbnb-base'                   // Airbnb 基本规则
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 'warn',          // 警告使用 console
    'no-debugger': 'error'         // 禁止使用 debugger
  }
};
```

📌 **效果**：配置完成后，Vue 项目将遵循 Airbnb 的 JavaScript 风格，同时确保 Vue 代码符合推荐规则。

## **3. 实战 3：TypeScript 项目的 ESLint 配置**

### **3.1 安装 ESLint 依赖**

在 TypeScript 项目中，除了 ESLint 插件，还需要安装 TypeScript 解析器和插件。

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### **3.2 配置 ESLint**

在项目根目录创建 `.eslintrc.js` 配置文件，并配置 TypeScript 解析器和插件。

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',  // 使用 TypeScript 解析器
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended' // TypeScript 插件推荐规则
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn', // 使用 any 类型时给出警告
    'no-console': 'warn',                      // 警告使用 console
    '@typescript-eslint/explicit-module-boundary-types': 'off' // 关闭强制函数返回类型声明
  }
};
```

📌 **效果**：配置完成后，TypeScript 项目将符合 TypeScript 的最佳实践，确保代码质量和一致性。

## **4. 实战 4：集成 ESLint + Prettier + Husky 提高开发效率**

### **4.1 安装 Prettier 和 Husky**

集成 Prettier 来自动格式化代码，并通过 Husky 在每次提交前执行 ESLint 和 Prettier。

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier husky lint-staged
```

### **4.2 配置 ESLint 和 Prettier**

在 `.eslintrc.js` 配置文件中，启用 Prettier 插件并配置其与 ESLint 的冲突规则：

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',  // 启用 Prettier 插件，关闭 ESLint 中与 Prettier 冲突的规则
  ],
  rules: {
    'no-console': 'warn',
    'prettier/prettier': 'error'  // 强制执行 Prettier 格式化规则
  }
};
```

### **4.3 配置 Husky 和 lint-staged**

在 `package.json` 中配置 Husky 和 lint-staged，确保在每次 Git 提交时自动运行 ESLint 和 Prettier。

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": "eslint --fix",
    "*.ts": "eslint --fix",
    "*.{js,ts,jsx,tsx}": "prettier --write"
  }
}
```

📌 **效果**：每次提交代码时，Husky 会触发 `pre-commit` 钩子，自动修复代码中的 ESLint 错误并格式化代码。

## **5. 实战 5：在 CI/CD 流水线中集成 ESLint**

### **5.1 配置 ESLint 在 CI/CD 流水线中运行**

在 CI/CD 流水线中集成 ESLint，可以确保每次推送到远程仓库的代码都符合规定的质量标准。

#### **5.1.1 在 GitHub Actions 中配置 ESLint**

在项目根目录创建 `.github/workflows/lint.yml` 文件，配置 GitHub Actions 在每次推送时运行 ESLint：

```yaml
name: Lint Code

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm install
      - run: npm run lint  # 执行 ESLint 检查
```

#### **5.1.2 在 GitLab CI 中配置 ESLint**

在 GitLab CI 配置文件 `.gitlab-ci.yml` 中添加 ESLint 检查步骤：

```yaml
stages:
  - lint

lint:
  stage: lint
  script:
    - npm install
    - npm run lint  # 执行 ESLint 检查
```

📌 **效果**：每次提交代码时，CI/CD 流水线会自动执行 ESLint 检查，确保代码质量符合团队标准。

## **总结**

### **✅ 在不同项目中的 ESLint 配置**

1️⃣ **React**：使用 `eslint-plugin-react` 和 `plugin:react/recommended` 配置 React 代码规范。  
2️⃣ **Vue**：使用 `eslint-plugin-vue` 配置 Vue 项目规则。  
3️⃣ **TypeScript**：使用 `@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin` 配置 TypeScript 代码规范。

### **✅ 集成 ESLint、Prettier 和 Husky**

4️⃣ **集成 ESLint 和 Prettier**，确保代码格式和质量一致。  
5️⃣ **使用 Husky 和 lint-staged**，在 Git 提交前自动执行代码修复。

### **✅ 在 CI/CD 流水线中运行 ESLint**

6️⃣ **在 GitHub Actions、GitLab CI 中配置 ESLint**，确保每次提交的代码都符合质量标准。

🚀 **通过这些实战示例，你将能够高效地在项目中配置 ESLint，提升代码质量并确保团队的协作顺畅。**
