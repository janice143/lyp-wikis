---
outline: deep
---

# 深度优先搜索

**深度优先搜索（DFS, Depth First Search）** 是一种用于遍历或搜索树或图的算法。该算法会从起始节点开始，沿着树的深度遍历，尽可能深入地探索每一个分支。当当前节点没有未被探索的邻居时，算法会回溯到最近的一个分支点并继续探索。

DFS 主要用于以下几种场景：

- **路径搜索**：查找是否存在从一个节点到另一个节点的路径。
- **连通性检测**：判断图中是否存在连通区域。
- **拓扑排序**：在有向图中对节点进行排序。
- **求解迷宫**：如迷宫问题，可以通过 DFS 找到路径。

## **DFS 的两种实现方式**

### **1. 递归实现 (Recursive DFS)**

- 直接利用函数栈来实现回溯。

在递归实现中，我们利用函数的调用栈来保存当前节点的状态（即每一次递归调用都会在栈中保存一个节点）。每当我们访问一个节点时，递归会继续深入到该节点的邻居节点，直到没有更多的邻居或者达到目标。

#### **伪代码：递归 DFS**

```jsx
DFS(node):
    if node is already visited:
        return
    mark node as visited
    for each neighbor in neighbors(node):
        DFS(neighbor)

```

#### **递归实现流程**

1. 从起始节点开始，标记当前节点为已访问。
2. 递归访问当前节点的所有邻居节点（未访问过的邻居）。
3. 每当访问一个节点时，再继续递归访问其邻居，直到没有更多节点可访问。

#### **示例伪代码**

```jsx
function DFS(graph, start):
    # 创建访问标记数组
    visited = []
    for each node in graph:
        visited[node] = false

    # 定义递归的DFS函数
    function dfs(node):
        if visited[node] == true:
            return
        visited[node] = true
        print(node)  # 访问该节点

        for each neighbor in graph[node]:
            if visited[neighbor] == false:
                dfs(neighbor)

    # 从起始节点开始深度优先搜索
    dfs(start)

```

#### **递归实现的优缺点**

- **优点**：代码简洁、易于理解，符合自然的递归思想。
- **缺点**：递归调用深度过大会导致栈溢出问题，尤其是在图比较大或深度较深时。

---

### **2. 非递归实现 (使用栈模拟 DFS)**

- 使用栈来模拟递归的过程。

在非递归实现中，我们显式地使用栈来模拟递归的过程。每次访问一个节点时，我们将其未访问的邻居节点压入栈中，然后继续访问栈顶的节点。栈的作用是记录待访问的节点，模拟递归调用的过程。

#### **伪代码：非递归（栈）DFS**

```js
DFS(graph, start):
    create an empty stack
    create a visited set or array

    push start node to stack
    while stack is not empty:
        current_node = pop from stack
        if current_node is already visited:
            continue
        mark current_node as visited
        print(current_node)  # 访问当前节点

        for each neighbor in neighbors(current_node):
            if neighbor is not visited:
                push neighbor to stack

```

#### **非递归实现流程**

1. 从起始节点开始，将其压入栈中。
2. 每次从栈中弹出一个节点，并访问该节点。
3. 将未访问过的邻居节点压入栈中。
4. 重复上述步骤直到栈为空。

#### **示例伪代码**

```js
function DFS(graph, start):
    # 创建访问标记数组
    visited = []
    for each node in graph:
        visited[node] = false

    # 创建栈并将起始节点压入栈中
    stack = []
    stack.push(start)

    while stack is not empty:
        node = stack.pop()

        if visited[node] == true:
            continue

        visited[node] = true
        print(node)  # 访问该节点

        # 将邻居节点按逆序压入栈中（栈的后进先出特性）
        for each neighbor in reverse(graph[node]):
            if visited[neighbor] == false:
                stack.push(neighbor)

```

#### **非递归实现的优缺点**

- **优点**：避免了递归深度限制，适用于图的规模较大时。
- **缺点**：代码较递归实现稍显复杂，需要显式管理栈的操作。

---

### **递归与非递归 DFS 的对比**

| 特点 | 递归实现 (Recursive DFS) | 非递归实现 (Stack-based DFS) |
| --- | --- | --- |
| **实现方式** | 使用函数调用栈自动保存状态 | 使用显式栈模拟递归调用 |
| **代码简洁度** | 简单，容易理解 | 稍复杂，需要管理栈的操作 |
| **效率** | 受递归深度限制（栈溢出问题） | 不受递归深度限制，适合大规模图 |
| **空间复杂度** | O(V)（递归栈空间） | O(V)（显式栈空间） |
| **使用场景** | 简单的遍历或图较小时使用 | 当图较大或深度较大时更合适 |

### **DFS 基本步骤**

1. 从一个起始节点开始。
2. 标记当前节点为已访问。
3. 访问当前节点的每一个邻居。
4. 对每个未访问的邻居递归或迭代执行 DFS。
5. 如果遇到没有未访问的邻居，回溯到上一个节点，继续搜索。

### **DFS 应用案例**

#### **1. 求图的连通分量（无向图）**

给定一个无向图，求图中有多少个连通分量。

- **解题思路**:
  - 每次从一个未访问的节点开始执行 DFS，DFS 会遍历该节点所在的所有连通区域。
  - 每次 DFS 完成，都意味着找到了一个新的连通分量。

```jsx
function numOfComponents(n, edges) {
  const graph = new Array(n).fill(null).map(() => []);

  // 构建图
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const visited = new Array(n).fill(false);
  let componentCount = 0;

  function dfs(node) {
    visited[node] = true;
    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      componentCount++;
      dfs(i);
    }
  }

  return componentCount;
}

// 示例
console.log(numOfComponents(5, [[0, 1], [0, 2], [3, 4]])); // 输出: 2

```

#### **2. 求解迷宫问题**

在一个迷宫中，给定起点和终点，判断是否存在一条从起点到终点的路径。

- **解题思路**:
  - 将迷宫表示为一个二维数组，1表示墙壁，0表示可以通过的道路。
  - 使用 DFS 从起点开始，尝试探索四个方向。
  - 若当前点是终点，则返回 `true`，否则继续探索。

```jsx
function canReach(maze, start, end) {
  const rows = maze.length;
  const cols = maze[0].length;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // 四个方向

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  function dfs(x, y) {
    // 如果出界或者是墙壁，返回false
    if (x < 0 || y < 0 || x >= rows || y >= cols || maze[x][y] === 1 || visited[x][y]) {
      return false;
    }
    // 如果到达终点，返回true
    if (x === end[0] && y === end[1]) {
      return true;
    }
    visited[x][y] = true;

    // 遍历四个方向
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (dfs(nx, ny)) return true; // 如果可以到达终点，则返回true
    }

    return false; // 如果所有方向都不能到达终点，则返回false
  }

  return dfs(start[0], start[1]);
}

// 示例
const maze = [
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 1],
  [0, 0, 0, 0]
];
console.log(canReach(maze, [0, 0], [3, 3])); // 输出: true

```

---

### **DFS 关键技巧与优化**

1. **递归深度限制**：
    - JavaScript 的递归深度有限，递归过深时可能会导致栈溢出。可以通过非递归的方式（使用显式栈）来避免这个问题。
2. **回溯法**：
    - 在 DFS 中，常常会遇到回溯的情况。比如在迷宫问题中，若某个方向行不通，则需要回到原点并尝试其他方向。
3. **剪枝**：
    - 在遍历过程中，若发现当前路径不可能到达目标，可以提前停止搜索（例如，在路径搜索中，若目标节点已经访问过，则不再搜索）。
4. **使用状态数组标记访问**：
    - 在图遍历中，我们通常使用 `visited` 数组来避免重复访问节点，确保算法效率。

---

### **DFS 时间与空间复杂度**

- **时间复杂度**:
  - 对于图的 DFS，最坏情况下每个节点都会被访问一次，每条边也会被访问一次，因此时间复杂度为 **O(V + E)**，其中 `V` 是节点数，`E` 是边数。
- **空间复杂度**:
  - 最多需要存储图的节点及其边，因此空间复杂度为 **O(V)**。
  - 如果使用递归实现，还需要考虑递归栈的空间开销，最坏情况下栈深度为 `O(V)`。

---

### **DFS 相关问题**

1. **岛屿数量问题**:
    - 给定一个二维网格，表示一个地图，'1' 表示陆地，'0' 表示水域，计算岛屿的数量。
    - 解法可以使用 DFS 来遍历每个岛屿，并将岛屿标记为水域（通过修改值）。
2. **路径搜索问题**:
    - 给定一个图或迷宫，找到从起点到终点的所有可能路径。

通过 DFS，你可以高效地解决很多图遍历相关的题目，掌握 DFS 的递归和栈两种实现方式，能帮助你在面对算法挑战时游刃有余。
