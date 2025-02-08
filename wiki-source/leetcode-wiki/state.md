---
outline: deep
---

# 状态压缩、计数问题、矩阵快速幂以及数位动态规划问题

以下是对 **状态压缩、计数问题、矩阵快速幂、数位动态规划** 这些重要算法与问题类型的详细介绍，包括概念、应用场景和代码实现。

---

### **1. 状态压缩**

#### **概念**

状态压缩是一种通过使用整数的位表示法，将多个布尔值（状态）压缩为一个整数的方法。常用于动态规划中，当状态空间较大且状态可以用二进制表示时，可以用状态压缩大幅优化空间和时间复杂度。

#### **应用场景**

- **旅行商问题（TSP）**：用二进制位表示某个节点是否已被访问。
- **集合划分问题**：用二进制表示集合的选择。
- **子集生成问题**：通过遍历整数的位表示来生成所有子集。

#### **代码实现**

**例子：旅行商问题（TSP）**

```javascript
function travelingSalesman(graph) {
  const n = graph.length;
  const dp = Array.from({ length: 1 << n }, () => Array(n).fill(Infinity));

  // 起点初始化
  dp[1][0] = 0;

  for (let mask = 1; mask < (1 << n); mask++) {
    for (let u = 0; u < n; u++) {
      if ((mask & (1 << u)) === 0) continue;
      for (let v = 0; v < n; v++) {
        if ((mask & (1 << v)) !== 0) continue;
        dp[mask | (1 << v)][v] = Math.min(
          dp[mask | (1 << v)][v],
          dp[mask][u] + graph[u][v]
        );
      }
    }
  }

  // 最短路径返回起点
  let result = Infinity;
  for (let u = 1; u < n; u++) {
    result = Math.min(result, dp[(1 << n) - 1][u] + graph[u][0]);
  }

  return result;
}

// 示例
const graph = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0]
];
console.log(travelingSalesman(graph)); // 输出: 80
```

---

### **2. 计数问题**

#### **概念**

计数问题的核心是计算满足某些条件的方案数。这类问题通常使用 **动态规划** 或 **组合数学** 来解决。

#### **应用场景**

- 计数路径数（如从矩阵左上角到右下角的路径数）。
- 子序列计数（如字符串中某子序列出现的次数）。
- 组合问题（如背包问题的方案数）。

#### **代码实现**

**例子：不同路径（网格路径计数）**

```javascript
function uniquePaths(m, n) {
  const dp = Array(m).fill(0).map(() => Array(n).fill(0));
  
  // 初始化第一行和第一列
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

// 示例
console.log(uniquePaths(3, 7)); // 输出: 28
```

---

### **3. 矩阵快速幂**

#### **概念**

矩阵快速幂是快速幂的扩展，通过将矩阵指数运算转化为递归地求解小规模问题，从而高效计算矩阵的幂。常用于 **斐波那契数列、递推式的高效求解** 等问题。

#### **应用场景**

- 求解递推式问题（如线性递归关系）。
- 动态系统的演化。
- 图的路径计数。

#### **代码实现**

**例子：斐波那契数列第 n 项**

```javascript
function matrixMultiply(A, B) {
  const n = A.length;
  const C = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return C;
}

function matrixPower(matrix, power) {
  const n = matrix.length;
  let result = Array.from({ length: n }, (_, i) =>
    Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))
  );
  let base = matrix;

  while (power > 0) {
    if (power % 2 === 1) {
      result = matrixMultiply(result, base);
    }
    base = matrixMultiply(base, base);
    power = Math.floor(power / 2);
  }

  return result;
}

function fibonacci(n) {
  if (n <= 1) return n;

  const matrix = [
    [1, 1],
    [1, 0]
  ];
  const result = matrixPower(matrix, n - 1);

  return result[0][0];
}

// 示例
console.log(fibonacci(10)); // 输出: 55
```

---

### **4. 数位动态规划**

#### **概念**

数位动态规划是一种用于解决 **数字范围内计数问题** 的动态规划技巧，核心是逐位构造数字，并根据约束条件递归计算。

#### **应用场景**

- 统计范围内满足条件的数字个数（如某些数字的个数）。
- 特定数字出现次数（如范围内某个数字出现的次数）。
- 满足特定规则的数的计数（如不包含重复数字的数）。

#### **代码实现**

**例子：统计范围内不含某数字的整数个数**

```javascript
function countNumbersWithoutDigit(limit, forbiddenDigit) {
  const digits = String(limit).split("").map(Number);
  const n = digits.length;

  function dp(pos, isLimit, hasForbidden) {
    if (pos === n) return hasForbidden ? 0 : 1; // 如果已到最后一位

    const maxDigit = isLimit ? digits[pos] : 9;
    let result = 0;

    for (let d = 0; d <= maxDigit; d++) {
      result += dp(
        pos + 1,
        isLimit && d === maxDigit,
        hasForbidden || d === forbiddenDigit
      );
    }

    return result;
  }

  return dp(0, true, false);
}

// 示例
console.log(countNumbersWithoutDigit(100, 5)); // 输出: 不含数字5的数字个数
```

---

### **总结**

1. **状态压缩**：
   - 将多个状态用二进制位表示，应用于子集生成、旅行商问题等。
   - 优化状态存储，常用于动态规划。

2. **计数问题**：
   - 统计满足条件的方案数。
   - 常用动态规划解决，如路径计数、子序列计数。

3. **矩阵快速幂**：
   - 高效解决递推式问题。
   - 通过矩阵乘法和快速幂结合，时间复杂度降为 O(log n)。

4. **数位动态规划**：
   - 逐位递归构造满足条件的数字。
   - 用于范围计数、规则数字统计问题。

这些技术和算法在处理复杂问题时非常高效，掌握它们可以显著提升解决问题的能力。
