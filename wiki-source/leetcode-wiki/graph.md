---
outline: deep
---
# 图

在图（Graph）数据结构中，**广度优先搜索（BFS）** 是一种基础算法，用于探索图的节点与边的关系。下面详细介绍 **图** 的概念、类型，以及如何在图中应用 **BFS**。

---

### **图的概念**

- **定义**: 图是一组节点（Vertices）和边（Edges）的集合。
  - 节点：图中的元素。
  - 边：连接两个节点的关系。
- **表示方法**:
  1. **邻接表**（Adjacency List）: 用列表存储每个节点的所有邻居节点。
  2. **邻接矩阵**（Adjacency Matrix）: 用二维数组表示节点之间的连接关系。

#### **图的类型**

1. **无向图（Undirected Graph）**: 边没有方向，表示双向连接。
2. **有向图（Directed Graph）**: 边有方向，从一个节点指向另一个节点。
3. **带权图（Weighted Graph）**: 边上有权值，用于表示距离、成本等。
4. **无权图（Unweighted Graph）**: 边没有权值。

---

### **图的表示**

#### **1. 邻接表**

用一个对象或数组存储节点及其邻居节点：

```javascript
const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2, 4],
  4: []
};
```

#### **2. 邻接矩阵**

用二维数组存储节点间的连接关系（0 表示无边，1 表示有边）：

```javascript
const matrix = [
  [0, 1, 1, 0, 0], // 0 -> 1, 2
  [1, 0, 0, 1, 0], // 1 -> 0, 3
  [1, 0, 0, 1, 0], // 2 -> 0, 3
  [0, 1, 1, 0, 1], // 3 -> 1, 2, 4
  [0, 0, 0, 1, 0]  // 4 -> 3
];
```

---

### **广度优先搜索 (BFS) 在图中的实现**

#### **伪代码**

```js
BFS(graph, start):
    create a queue
    mark start as visited and enqueue it
    while queue is not empty:
        node = dequeue from queue
        process(node)  # 对节点进行操作
        for each neighbor in neighbors(node):
            if neighbor is not visited:
                mark neighbor as visited
                enqueue(neighbor)
```

---

#### **代码实现（邻接表）**

```javascript
function bfs(graph, start) {
  const visited = new Set(); // 用于记录访问过的节点
  const queue = [start];     // 队列，用于管理待访问节点

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift(); // 取出队首节点
    console.log(node);          // 访问节点（打印或其他处理）

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

// 示例图（邻接表）
const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2, 4],
  4: []
};

bfs(graph, 0); // 输出: 0 1 2 3 4
```

---

### **应用案例**

#### **1. 判断两点是否连通**

通过 BFS 判断从起点到终点是否存在路径：

```javascript
function isConnected(graph, start, target) {
  const visited = new Set();
  const queue = [start];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    if (node === target) return true;

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

// 示例
console.log(isConnected(graph, 0, 4)); // 输出: true
console.log(isConnected(graph, 0, 5)); // 输出: false
```

#### **2. 最短路径求解**

利用 BFS 找到从起点到终点的最短路径（无权图）：

```javascript
function shortestPath(graph, start, target) {
  const queue = [[start, 0]]; // 队列存储 [节点, 路径长度]
  const visited = new Set();

  visited.add(start);

  while (queue.length > 0) {
    const [node, distance] = queue.shift();

    if (node === target) return distance;

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
      }
    }
  }

  return -1; // 无法到达目标节点
}

// 示例
console.log(shortestPath(graph, 0, 4)); // 输出: 3
```

---

### **BFS 的时间与空间复杂度**

#### **时间复杂度**

- 每个节点最多被访问一次，每条边最多被访问一次。
- 时间复杂度为 **O(V + E)**，其中 `V` 是节点数，`E` 是边数。

#### **空间复杂度**

- 队列中最多需要存储一层的所有节点。
- 空间复杂度为 **O(V)**。

---

### **总结**

1. **广度优先搜索 (BFS)** 是一种逐层遍历的图搜索算法。
2. 它使用 **队列** 存储当前层次的节点。
3. BFS 常用于解决最短路径问题、连通性检测等问题。
4. 常见的图表示方式有邻接表和邻接矩阵，邻接表在稀疏图中更高效。

掌握 BFS 的实现与优化技巧，可以在算法题目中灵活运用，特别是在图的搜索和路径问题中。
