# **第三章：ESLint 规则**

ESLint 提供了丰富的规则配置选项，帮助开发者保持代码质量、风格一致性和可维护性。本章将介绍常见的 **ESLint 规则分类**、**最佳实践**、**代码风格**、**可维护性**、**错误处理**等规则，并展示如何配置这些规则的严重性。

## **1. 常见规则分类**

ESLint 的规则可以按**功能**或**目的**分类，以便更清晰地管理和配置。以下是一些常见的规则分类：

### **1.1 最佳实践（Best Practices）**

这些规则旨在帮助开发者遵循一些良好的编码规范，以提高代码的健壮性、可读性和可维护性。

### **1.2 代码风格（Code Style）**

这些规则确保项目中代码的统一风格，减少风格上的争议，提高团队的协作效率。

### **1.3 可维护性（Maintainability）**

这些规则帮助确保代码的可维护性，减少潜在的 bug 和代码冗余。

### **1.4 错误处理（Error Handling）**

这些规则用于规范错误处理，确保代码中错误能够正确捕获和处理，避免潜在的运行时错误。

## **2. 常见的 ESLint 规则**

### **2.1 最佳实践**

#### **2.1.1 `no-console`**

禁止在代码中使用 `console`（例如 `console.log`）进行调试输出，避免调试信息泄露到生产环境。

```json
"rules": {
  "no-console": "warn"  // 使用警告提示 console 的使用
}
```

#### **2.1.2 `no-eval`**

禁止使用 `eval()`，因为它会导致潜在的安全问题和性能问题。

```json
"rules": {
  "no-eval": "error"  // 严格禁止使用 eval
}
```

#### **2.1.3 `no-implicit-globals`**

禁止在全局范围内声明变量和函数，以避免全局污染。

```json
"rules": {
  "no-implicit-globals": "error"
}
```

### **2.2 代码风格**

#### **2.2.1 `indent`**

强制统一的缩进风格（如 2 个空格或 4 个空格），以提高代码可读性。

```json
"rules": {
  "indent": ["error", 2]  // 强制 2 个空格的缩进
}
```

#### **2.2.2 `quotes`**

规定使用单引号或双引号进行字符串声明，保持一致性。

```json
"rules": {
  "quotes": ["error", "single"]  // 强制使用单引号
}
```

#### **2.2.3 `semi`**

强制代码行末使用分号，保持一致的语法风格。

```json
"rules": {
  "semi": ["error", "always"]  // 强制每行末尾加分号
}
```

### **2.3 可维护性**

#### **2.3.1 `no-unused-vars`**

禁止声明但未使用的变量，保持代码整洁。

```json
"rules": {
  "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]  // 警告未使用的变量，但允许以 `_` 开头的变量
}
```

#### **2.3.2 `consistent-return`**

要求函数的返回值保持一致，避免在同一函数中既返回 `undefined` 又返回其他值。

```json
"rules": {
  "consistent-return": "error"  // 强制一致的返回值
}
```

#### **2.3.3 `no-magic-numbers`**

禁止在代码中使用 "魔法数字"（即未经解释的数字常量），建议使用常量或枚举来代替。

```json
"rules": {
  "no-magic-numbers": ["warn", { "ignore": [0, 1] }]  // 警告魔法数字，但允许 0 和 1
}
```

### **2.4 错误处理**

#### **2.4.1 `no-throw-literal`**

禁止抛出字面量（如抛出字符串、数字等），确保抛出的错误是 `Error` 对象。

```json
"rules": {
  "no-throw-literal": "error"  // 禁止抛出字面量
}
```

#### **2.4.2 `no-catch-shadow`**

禁止在 `catch` 语句中使用与外部作用域相同的变量名，避免覆盖外部变量。

```json
"rules": {
  "no-catch-shadow": "error"  // 强制避免在 catch 中覆盖外部变量
}
```

## **3. 如何配置规则**

在 ESLint 配置中，你可以为每个规则设置不同的严重性：

- **`off`**：关闭规则
- **`warn`**：警告，规则违规时只会给出警告
- **`error`**：错误，规则违规时会报错并阻止代码执行

### **3.1 配置规则的基本格式**

```json
"rules": {
  "rule-name": ["severity", "options"]
}
```

- `severity`：`"off"`, `"warn"`, 或 `"error"`，定义规则的严重性。
- `options`：该规则的配置选项，通常为数组。

### **3.2 配置示例**

#### **3.2.1 `no-console`**

```json
"rules": {
  "no-console": "warn"  // 启用警告，禁止使用 console
}
```

#### **3.2.2 `quotes`**

```json
"rules": {
  "quotes": ["error", "single"]  // 强制使用单引号
}
```

#### **3.2.3 `semi`**

```json
"rules": {
  "semi": ["error", "always"]  // 强制每行末尾加分号
}
```

#### **3.2.4 `no-unused-vars`**

```json
"rules": {
  "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]  // 警告未使用的变量，但允许以 `_` 开头的变量
}
```

## **4. ESLint 规则的最佳实践**

### **4.1 使用标准化规则**

- **`eslint:recommended`**：包含 ESLint 推荐的基本规则集，适用于大多数项目。
- **`airbnb-base`**：Airbnb 提供的 JavaScript 风格指南，适合追求一致性和规范的团队。

### **4.2 动态调整规则**

- 在项目的不同阶段，可以**调整规则的严重性**。例如，在开发阶段可能更宽松，而在生产阶段需要严格控制。

```json
"rules": {
  "no-console": "warn",  // 开发阶段允许 console，但在生产环境中可以改为 error
  "no-debugger": "error" // 强制禁用 debugger
}
```

### **4.3 开发团队的一致性**

- 确保团队成员在项目中**使用相同的 ESLint 配置**，避免风格不一致。
- 通过 **`eslint-config-prettier`** 和 **`eslint-plugin-prettier`** 集成 ESLint 和 Prettier，避免冲突。

## **总结**

### **✅ 常见的 ESLint 规则分类**

1️⃣ **最佳实践**：例如 `no-console`、`no-eval`。  
2️⃣ **代码风格**：例如 `indent`、`quotes`、`semi`。  
3️⃣ **可维护性**：例如 `no-unused-vars`、`consistent-return`。  
4️⃣ **错误处理**：例如 `no-throw-literal`、`no-catch-shadow`。

### **✅ 如何配置规则**

1️⃣ **使用 `rules` 配置项**，通过指定规则和严重性控制代码检查。  
2️⃣ **配置选项**：关闭、警告或错误，控制代码的风格和质量。  
3️⃣ **最佳实践**：根据项目需求定制 ESLint 配置，确保一致性和代码质量。

🚀 **下一章，我们将深入探讨 ESLint 与其他工具（如 Prettier）的集成，帮助你进一步提升开发效率！**
