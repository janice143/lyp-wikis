# **第十章：ESLint 自定义规则**

在本章中，我们将深入探讨如何在 ESLint 中创建和使用 **自定义规则**，以实现对代码质量和风格的精细控制。通过自定义规则，开发者可以实现团队特定的编码标准、公司内部的代码风格指南，并防止常见的错误模式。通过理解自定义规则的生命周期、AST（抽象语法树）的使用方法、以及如何将规则集成到项目中，你将能够构建适合自己项目需求的 ESLint 规则。

## **1. ESLint 自定义规则简介**

### **1.1 什么是 ESLint 自定义规则？**

ESLint 自定义规则是一种用于**检查代码是否符合特定编码标准**的机制。通过编写自定义规则，开发者能够确保代码遵循项目特定的风格或规范，避免不符合要求的代码提交。自定义规则通过 ESLint 的规则 API 定义，执行代码的静态检查。

#### **1.1.1 自定义规则的应用场景**

- **检查团队特定的编码规范**：确保每个团队成员遵循统一的命名规范、缩进规则等。
- **创建公司内部的代码风格指南**：防止代码不一致或错误，提供更好的可维护性。
- **防止常见的错误模式**：例如限制函数的参数个数、避免使用特定的标识符名等。

### **1.2 规则的生命周期**

自定义规则通常包含以下三个主要阶段：

- **解析阶段**：解析代码并生成 AST（抽象语法树）。
- **检查阶段**：遍历 AST，应用规则逻辑进行代码检查。
- **报告阶段**：生成检查报告，输出违规的代码信息。

## **2. 创建 ESLint 自定义规则的基础**

### **2.1 安装 ESLint 与依赖**

为了创建 ESLint 自定义规则，首先需要安装 ESLint 和解析器（如果使用 Babel）：

```bash
npm install eslint --save-dev
npm install @babel/eslint-parser --save-dev  # 如果项目使用 Babel
```

### **2.2 目录结构**

- 创建 `rules/` 目录来存放自定义规则文件。
- 每个规则文件通常命名为 `rule-name.js`，定义一个具体的规则。

### **2.3 规则模板**

以下是一个简单的 ESLint 自定义规则模板，用于检查标识符是否符合要求：

```javascript
module.exports = {
  meta: {
    type: "problem", // 规则类型（"problem"、"suggestion"、"layout"）
    docs: {
      description: "Describe what the rule does",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: "code", // 是否支持自动修复
  },
  create: function (context) {
    return {
      // AST 节点检查的逻辑
      'Identifier': function (node) {
        // 规则逻辑：检测标识符（如变量名）是否符合要求
        if (node.name === 'badName') {
          context.report({
            node,
            message: 'Avoid using the name "badName".',
          });
        }
      },
    };
  },
};
```

## **3. 自定义规则的构成**

### **3.1 `meta` 元数据**

- **`type`**：定义规则的类型，如 `problem`（问题）、`suggestion`（建议）、`layout`（布局）。
- **`docs`**：规则描述、类别和是否推荐。
- **`fixable`**：是否支持自动修复，设置为 `code` 表示可以修复。
- **`schema`**：规则的配置验证模式，用于定义规则的配置选项。

### **3.2 `create` 方法**

`create` 方法用于定义规则的核心逻辑。在此方法内，使用 `context` 来报告代码中违规的地方。

- **`context.report`**：用于报告违规信息，将违规的 AST 节点和错误信息返回给 ESLint。
- **监听 AST 节点**：通过监听不同类型的节点（如 `Identifier`、`FunctionDeclaration`），应用不同的检查逻辑。

## **4. AST（抽象语法树）基础**

### **4.1 AST 解析**

ESLint 在检查代码时，会先将代码解析成 **抽象语法树（AST）**，并通过遍历 AST 节点来执行规则。

#### **4.1.1 常见 AST 节点类型**

- **`Identifier`**：变量名、函数名等标识符。
- **`Literal`**：字符串、数字、布尔值等字面量。
- **`CallExpression`**：函数调用。
- **`MemberExpression`**：对象成员访问（如 `object.property`）。
- **`BinaryExpression`**：二元表达式（如 `a + b`）。
- **`FunctionDeclaration`**：函数声明。

#### **4.1.2 如何访问 AST 节点**

在自定义规则的 `create` 方法中，可以通过 AST 节点的类型来访问和检查特定节点。

例如，监听 `Identifier` 类型的节点并进行检查：

```javascript
create(context) {
  return {
    Identifier(node) {
      if (/[A-Z]/.test(node.name)) {
        context.report({
          node,
          message: `"${node.name}" should be camelCase.`,
        });
      }
    }
  };
}
```

## **5. 自定义规则的常见实践**

### **5.1 检测变量名规范**

确保变量名符合特定的命名规范（如驼峰命名法）：

```javascript
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce camelCase naming",
      recommended: true,
    },
  },
  create(context) {
    return {
      Identifier(node) {
        if (/[A-Z]/.test(node.name)) {
          context.report({
            node,
            message: `"${node.name}" should be camelCase.`,
          });
        }
      },
    };
  },
};
```

### **5.2 限制函数参数的个数**

限制函数最多接受 3 个参数，防止函数参数过多导致的复杂性：

```javascript
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce a maximum of 3 function parameters",
      recommended: true,
    },
  },
  create(context) {
    return {
      FunctionDeclaration(node) {
        if (node.params.length > 3) {
          context.report({
            node,
            message: "Function should not have more than 3 parameters.",
          });
        }
      },
    };
  },
};
```

## **6. 配置自定义规则**

### **6.1 创建 ESLint 配置文件**

将自定义规则配置到 ESLint 配置文件中，确保项目使用这些规则。

在 `.eslintrc.json` 或 `package.json` 中添加自定义规则配置：

```json
{
  "rules": {
    "my-custom-rule/no-bad-name": "error"
  }
}
```

### **6.2 加载自定义规则包**

- 将自定义规则打包为 npm 包，或将规则直接存储在本地项目中。
- 通过 `eslint-plugin-my-custom-rules` 的方式分发规则包。

## **7. 测试和调试自定义规则**

### **7.1 单元测试自定义规则**

使用 **Mocha** 和 **eslint-tester** 来进行单元测试，确保自定义规则的功能正确。

```javascript
const eslint = require("eslint");
const rule = require("./path/to/your/rule");
const tester = new eslint.RuleTester();

tester.run("no-bad-name", rule, {
  valid: ["var goodName = 'test';"],
  invalid: [
    {
      code: "var badName = 'test';",
      errors: [{ message: 'Avoid using the name "badName".' }],
    },
  ],
});
```

### **7.2 调试自定义规则**

使用 `console.log` 或 `debugger` 进行调试，并使用 `context.report` 输出错误信息。

```javascript
console.log(node.name); // 查看标识符名称
context.report({ node, message: 'Avoid using "badName".' });
```

## **8. 自定义规则的发布与共享**

### **8.1 创建规则包**

将自定义规则封装为 npm 包，确保团队能够轻松共享和使用。

- 发布到 npm 上，供其他项目引用。
- 配置 `package.json`，并确保规则文件已正确导出。

## **9. 自定义规则的高级技巧**

### **9.1 动态规则**

根据项目环境动态调整规则，例如不同环境下允许或禁止某些操作。

### **9.2 集成其他工具**

将 AST 解析与其他工具结合，如 **Babel** 或 **TypeScript**，生成规则，确保多种环境下的代码质量。

### **9.3 自动修复**

通过设置 `fixable: true`，提供自动修复的能力，例如自动转换为驼峰命名法。

## **10. 自定义规则的常见问题与解决方案**

### **10.1 规则无法生效**

- 确保 ESLint 配置文件正确引用了规则。
- 检查规则文件路径是否正确，且已正确导出。

### **10.2 规则的性能问题**

- 优化规则，确保规则只在必要的 AST 节点上进行检查。
- 只报告最重要的违规信息，避免不必要的性能消耗。

### **10.3 测试覆盖不全**

- 使用多种测试用例，确保规则逻辑的正确性。

## **总结**

通过创建自定义规则，开发团队可以严格控制代码质量，确保每个项目遵循相应的编码规范。无论是简单的命名规范，还是复杂的函数参数检查，ESLint 的自定义规则都能为开发者提供灵活的解决方案。
