---
outline: deep
---
# 树形、图上、概率&博弈问题

以下是对树形问题、图上问题、概率问题及博弈问题的详细解析，包括概念、应用场景、解题思路及代码实现。

---

## **1. 树形问题**

### **概念**

树是一种特殊的图，是一种无环连通图，常用于表示层次结构。树形问题通常围绕递归、动态规划、深度优先搜索（DFS）、广度优先搜索（BFS）展开。

### **常见问题**

1. 树的遍历（前序、中序、后序、层次）。
2. 树的路径问题（最长路径、最短路径、路径和）。
3. 二叉树与多叉树的动态规划。
4. 最近公共祖先（LCA）问题。

---

### **代码实现**

#### **例子：求二叉树的最大路径和**

```javascript
function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;
    const left = Math.max(0, dfs(node.left)); // 左子树贡献
    const right = Math.max(0, dfs(node.right)); // 右子树贡献
    maxSum = Math.max(maxSum, left + right + node.val); // 更新全局最大路径和
    return node.val + Math.max(left, right); // 返回当前节点的最大贡献
  }

  dfs(root);
  return maxSum;
}

// 示例
const tree = {
  val: -10,
  left: { val: 9, left: null, right: null },
  right: {
    val: 20,
    left: { val: 15, left: null, right: null },
    right: { val: 7, left: null, right: null }
  }
};
console.log(maxPathSum(tree)); // 输出: 42
```

---

## **2. 图上问题**

### **概念**

图是由节点（顶点）和边组成的结构，可以是有向或无向，有权或无权。图上问题通常包括路径搜索、连通性、最小生成树等。

### **常见问题**

1. 最短路径问题（Dijkstra、Bellman-Ford、Floyd-Warshall）。
2. 连通分量（DFS、BFS、并查集）。
3. 最小生成树（Kruskal、Prim）。
4. 拓扑排序（有向无环图）。
5. 图的环检测。

---

### **代码实现**

#### **例子：Dijkstra 求最短路径**

```javascript
function dijkstra(graph, start) {
  const dist = Array(graph.length).fill(Infinity);
  const visited = new Set();
  dist[start] = 0;

  while (visited.size < graph.length) {
    let minDist = Infinity, u = -1;

    // 找到未访问节点中距离最小的
    for (let i = 0; i < graph.length; i++) {
      if (!visited.has(i) && dist[i] < minDist) {
        minDist = dist[i];
        u = i;
      }
    }

    if (u === -1) break; // 无法继续访问
    visited.add(u);

    // 更新邻居的距离
    for (let v = 0; v < graph.length; v++) {
      if (graph[u][v] !== 0 && !visited.has(v)) {
        dist[v] = Math.min(dist[v], dist[u] + graph[u][v]);
      }
    }
  }

  return dist;
}

// 示例
const graph = [
  [0, 1, 4, 0, 0],
  [0, 0, 4, 2, 7],
  [0, 0, 0, 3, 5],
  [0, 0, 0, 0, 4],
  [0, 0, 0, 0, 0]
];
console.log(dijkstra(graph, 0)); // 输出: [0, 1, 4, 3, 7]
```

---

## **3. 概率问题**

### **概念**

概率问题处理随机事件的可能性或期望值，常涉及 **动态规划、数学期望、概率分布** 等。

### **常见问题**

1. 随机游走（如掷骰子问题）。
2. 期望值计算（如随机点分布）。
3. 动态规划中的概率转移。

---

### **代码实现**

#### **例子：掷骰子和为目标的概率**

```javascript
function diceProbability(n, target) {
  const dp = Array(n + 1).fill(0).map(() => Array(target + 1).fill(0));
  dp[0][0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      for (let k = 1; k <= 6; k++) {
        if (j >= k) dp[i][j] += dp[i - 1][j - k];
      }
    }
  }

  const totalOutcomes = Math.pow(6, n);
  return dp[n][target] / totalOutcomes;
}

// 示例
console.log(diceProbability(2, 7)); // 输出: 0.16666666666666666 (2/12)
```

---

## **4. 博弈问题**

### **概念**

博弈问题研究两个玩家（或多方）在竞争过程中如何决策，涉及 **动态规划、极小化极大算法** 和 **博弈树**。

### **常见问题**

1. 零和博弈（如 Nim 游戏）。
2. 最优策略问题（如棋盘问题）。
3. 极小化极大算法（如 Alpha-Beta 剪枝）。

---

### **代码实现**

#### **例子：Nim 游戏**

```javascript
function canWinNim(n) {
  return n % 4 !== 0; // 当石子数是4的倍数时，先手必败
}

// 示例
console.log(canWinNim(4)); // 输出: false
console.log(canWinNim(5)); // 输出: true
```

#### **例子：博弈树搜索（极小化极大算法）**

```javascript
function minimax(depth, isMaximizingPlayer, values, alpha, beta) {
  if (depth === values.length) return values[depth - 1];

  if (isMaximizingPlayer) {
    let best = -Infinity;
    for (let i = 0; i < 2; i++) {
      const val = minimax(depth + 1, false, values, alpha, beta);
      best = Math.max(best, val);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 2; i++) {
      const val = minimax(depth + 1, true, values, alpha, beta);
      best = Math.min(best, val);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

// 示例
const values = [3, 5, 6, 9, 1, 2, 0, -1];
console.log(minimax(0, true, values, -Infinity, Infinity)); // 输出: 5
```

---

## **总结**

### **树形问题**

- **方法**：递归、动态规划。
- **应用**：树的遍历、路径问题、最近公共祖先。

### **图上问题**

- **方法**：DFS、BFS、最短路径（Dijkstra）、最小生成树（Kruskal）。
- **应用**：路径优化、网络连通性。

### **概率问题**

- **方法**：动态规划、数学期望。
- **应用**：骰子问题、期望值计算、随机游走。

### **博弈问题**

- **方法**：动态规划、极小化极大算法。
- **应用**：零和博弈、棋类游戏、最优策略。

通过掌握这些问题的核心思想和算法实现，可以灵活应对复杂的算法挑战。
