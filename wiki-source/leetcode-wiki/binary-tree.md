---
outline: deep
---

# 二叉树

## **二叉树 (Binary Tree)**

**二叉树** 是一种树形数据结构，每个节点最多有两个子节点，分别是左子节点和右子节点。它是很多复杂数据结构（如二叉搜索树、堆、红黑树）的基础。

---

### **1. 二叉树的基本类型**

#### **(1) 满二叉树 (Full Binary Tree)**

- 定义：每个节点要么是叶子节点（没有子节点），要么有两个子节点。
- 特点：深度为 `d` 的满二叉树有 `2^d - 1` 个节点。

---

#### **(2) 完全二叉树 (Complete Binary Tree)**

- 定义：每一层节点都是满的，只有最底层可能不满，且节点从左向右依次排列。
- 特点：通常用于堆实现。

---

#### **(3) 二叉搜索树 (Binary Search Tree, BST)**

- 定义：每个节点的值大于其左子树的所有节点值，小于其右子树的所有节点值。
- 特点：支持高效的查找、插入和删除操作，时间复杂度平均为 `O(log n)`。

---

#### **(4) 平衡二叉树**

- 定义：任意节点的左右子树高度差不超过 1。
- 特点：如 AVL 树、红黑树。

---

### **2. 二叉树的基本操作**

#### **(1) 二叉树的定义**

在 JavaScript 中，二叉树可以用类来表示：

```jsx
class TreeNode {
  constructor(value = 0, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

```

#### **(2) 遍历二叉树**

二叉树的遍历分为 **深度优先遍历 (DFS)** 和 **广度优先遍历 (BFS)**。

---

### **3. 深度优先遍历 (DFS)**

**定义**：沿着树的深度遍历，优先访问子节点。

#### **(1) 前序遍历 (Preorder Traversal)**

- 顺序：根节点 → 左子树 → 右子树。
- 实现：

```jsx
function preorderTraversal(root) {
  if (!root) return [];
  let result = [];
  function dfs(node) {
    if (!node) return;
    result.push(node.value); // 访问根节点
    dfs(node.left);          // 遍历左子树
    dfs(node.right);         // 遍历右子树
  }
  dfs(root);
  return result;
}

```

---

#### **(2) 中序遍历 (Inorder Traversal)**

- 顺序：左子树 → 根节点 → 右子树。
- 实现：

```jsx
function inorderTraversal(root) {
  if (!root) return [];
  let result = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);          // 遍历左子树
    result.push(node.value); // 访问根节点
    dfs(node.right);         // 遍历右子树
  }
  dfs(root);
  return result;
}

```

---

#### **(3) 后序遍历 (Postorder Traversal)**

- 顺序：左子树 → 右子树 → 根节点。
- 实现：

```jsx
function postorderTraversal(root) {
  if (!root) return [];
  let result = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);          // 遍历左子树
    dfs(node.right);         // 遍历右子树
    result.push(node.value); // 访问根节点
  }
  dfs(root);
  return result;
}

```

---

#### **4. 广度优先遍历 (BFS)**

**定义**：按照层级顺序遍历二叉树（即从左到右、一层一层地访问）。

**实现**：

```jsx
function levelOrderTraversal(root) {
  if (!root) return [];
  let result = [];
  let queue = [root]; // 用队列存储节点
  while (queue.length) {
    let level = [];
    let size = queue.length;
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      level.push(node.value);
      if (node.left) queue.push(node.left);  // 加入左子节点
      if (node.right) queue.push(node.right); // 加入右子节点
    }
    result.push(level);
  }
  return result;
}

```

---

### **5. 常见二叉树算法题**

#### **(1) 二叉树的最大深度 (LeetCode 104)**

**问题**：计算二叉树的最大深度。

**代码**：

```jsx
function maxDepth(root) {
  if (!root) return 0; // 空树深度为 0
  let leftDepth = maxDepth(root.left);
  let rightDepth = maxDepth(root.right);
  return Math.max(leftDepth, rightDepth) + 1; // 当前深度为左右子树深度的最大值加 1
}

```

---

#### **(2) 验证二叉搜索树 (LeetCode 98)**

**问题**：判断一个二叉树是否是二叉搜索树。

**代码**：

```jsx
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.value <= min || root.value >= max) return false;
  return isValidBST(root.left, min, root.value) &&
         isValidBST(root.right, root.value, max);
}

```

---

#### **(3) 对称二叉树 (LeetCode 101)**

**问题**：判断一棵二叉树是否对称。

**代码**：

```jsx
function isSymmetric(root) {
  if (!root) return true;
  function isMirror(t1, t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    return t1.value === t2.value &&
           isMirror(t1.left, t2.right) &&
           isMirror(t1.right, t2.left);
  }
  return isMirror(root.left, root.right);
}

```

---

#### **(4) 二叉树的层平均值 (LeetCode 637)**

**问题**：计算二叉树每一层节点的平均值。

**代码**：

```jsx
function averageOfLevels(root) {
  if (!root) return [];
  let result = [];
  let queue = [root];
  while (queue.length) {
    let sum = 0, count = queue.length;
    for (let i = 0; i < count; i++) {
      let node = queue.shift();
      sum += node.value;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(sum / count); // 计算平均值
  }
  return result;
}

```

---

### **6. 二叉树的优缺点**

#### **优点**

1. **结构灵活**：不需要连续存储空间，插入和删除更加高效。
2. **高效查找**：二叉搜索树支持快速查找，平均时间复杂度为 `O(log n)`。

#### **缺点**

1. **退化风险**：如果二叉搜索树不平衡，可能退化成链表，查找效率下降到 `O(n)`。
2. **复杂实现**：相比数组和链表，二叉树的操作实现更复杂。

### 二叉树解题思维模式

#### 1. 能否通过遍历所有节点得到答案？

想想前序、后序、中序遍历。如果可以，用一个 `traverse` 函数配合外部变量来实现，这叫「遍历」的思维模式

**适用场景：**

- 序列话和反序列化

#### 2. 能否把定义递归函数，通过子问题（子树）的答案来推导原问题的答案

如果可以，写出这个递归函数的定义，并充分利用这个函数的返回值，这叫「分解问题」的思维模式。

**适用场景：**

- 二叉树构造问题：前和中序遍历构造完整二叉树；后和中序遍历构造完整的二叉树

[leetcode124: **Binary Tree Maximum Path Sum**](https://www.notion.so/leetcode124-Binary-Tree-Maximum-Path-Sum-460bc369a9ec41ffa90b29b6ea857fff?pvs=21)
