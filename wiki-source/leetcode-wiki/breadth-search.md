---
outline: deep
---
# 广度优先搜索

**广度优先搜索（BFS, Breadth-First Search）** 是一种遍历或搜索树或图的算法。与深度优先搜索不同，BFS 按照层次遍历节点，即先访问与起始节点距离最近的节点，然后逐步深入到更远的节点。

### **BFS 的特点**

1. **逐层遍历**：先访问起点的所有邻居，然后再访问它们的邻居，依次类推。
2. **使用队列**：利用队列（Queue）的先进先出（FIFO）特性存储当前层次的节点。
3. **适用场景**：
   - 最短路径问题（无权图中）。
   - 连通性检测。
   - 拓扑排序。
   - 网络流中的增广路径查找。

---

### **BFS 基本步骤**

1. 初始化队列，将起点加入队列并标记为已访问。
2. 当队列不为空时，重复以下操作：
   - 从队首取出节点。
   - 遍历该节点的所有邻居。
   - 对未访问的邻居，将其加入队列并标记为已访问。
3. 队列为空时，搜索完成。

---

### **伪代码**

#### **1. 广度优先搜索的伪代码**

```js
BFS(graph, start):
    create a queue and enqueue the start node
    create a visited set or array
    
    mark start as visited
    while queue is not empty:
        current_node = dequeue from queue
        process(current_node)  # 对当前节点进行操作
        for each neighbor in neighbors(current_node):
            if neighbor is not visited:
                mark neighbor as visited
                enqueue neighbor
```

#### **2. BFS 求最短路径（无权图）伪代码**

```js
BFS_shortest_path(graph, start, target):
    create a queue and enqueue (start, 0)  # 存储节点和距离
    create a visited set or array
    
    mark start as visited
    while queue is not empty:
        (current_node, distance) = dequeue from queue
        if current_node == target:
            return distance
        for each neighbor in neighbors(current_node):
            if neighbor is not visited:
                mark neighbor as visited
                enqueue (neighbor, distance + 1)
    return -1  # 如果未找到目标
```

### **BFS 应用案例**

#### **1. 无向图的连通性检测**

判断一个无向图中是否存在从起点到终点的路径。

```javascript
function bfsConnectivity(graph, start, target) {
  const queue = [start];
  const visited = new Set();

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
const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2, 4],
  4: []
};
console.log(bfsConnectivity(graph, 0, 4)); // 输出: true
```

#### **2. 二叉树的层次遍历**

给定一棵二叉树，按层次从上到下输出每一层的节点值。

```javascript
function levelOrderTraversal(root) {
  if (!root) return [];
  const queue = [root];
  const result = [];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }

  return result;
}

// 示例
const tree = {
  val: 1,
  left: { val: 2, left: null, right: null },
  right: { val: 3, left: null, right: null }
};
console.log(levelOrderTraversal(tree)); // 输出: [[1], [2, 3]]
```

#### **3. 最短路径求解（无权图）**

给定一个无向图和起点、终点，求最短路径长度。

```javascript
function shortestPath(graph, start, target) {
  const queue = [[start, 0]]; // 存储 [节点, 当前路径长度]
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

  return -1; // 如果无法到达目标
}

// 示例
const graph2 = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2, 4],
  4: []
};
console.log(shortestPath(graph2, 0, 4)); // 输出: 3
```

---

### **BFS 的关键优化与技巧**

1. **标记已访问节点**：
   - BFS 需要防止节点重复访问，以免进入死循环或重复计算。
   - 使用 `visited` 数组或 `Set` 来存储已访问节点。

2. **层次遍历**：
   - 使用队列按层次处理节点时，可以通过记录队列长度来区分不同层级的节点。
   - 例如，在每次循环开始前记录 `queue.length`，并在本轮循环中处理该数量的节点。

3. **双向 BFS**：
   - 当目标节点距离起点很远时，单向 BFS 的效率较低。此时，可以从起点和目标节点同时执行 BFS，直到两者相遇，减少搜索范围。

---

### **BFS 时间与空间复杂度**

- **时间复杂度**：
  - 遍历所有节点和边，每个节点和边最多被访问一次。
  - 对于图，时间复杂度为 **O(V + E)**，其中 `V` 是节点数，`E` 是边数。
  - 对于二叉树，时间复杂度为 **O(N)**，其中 `N` 是节点数。

- **空间复杂度**：
  - 最坏情况下，队列中需要存储一整层的节点。
  - 空间复杂度为 **O(V)**（对于图）或 **O(N)**（对于树）。

---

### **总结**

广度优先搜索是一种强大的算法，适用于多种场景。其核心思想是逐层遍历节点，使用队列管理节点的访问顺序。在解决最短路径问题、层次遍历、连通性检测等问题时，BFS 通常是首选。通过掌握 BFS 的实现和优化技巧，可以轻松应对各种相关的算法题目。
