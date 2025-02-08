---
outline: deep
---
# 线性&区间问题

线性问题和区间问题是算法中的两大重要问题类型，广泛应用于数据处理、优化和动态规划等领域。

1. **线性问题**：输入数据呈线性结构（如数组、链表等），目标是对这些线性数据进行处理和计算。
   - 典型问题：前缀和、滑动窗口、双指针、动态规划。
2. **区间问题**：处理某些区间上的操作，如查询某区间的最大值、最小值、和或乘积，或者对区间进行修改。
   - 典型问题：区间求和、区间更新、区间覆盖，通常使用线段树、树状数组等数据结构。

---

### **线性问题**

#### **1. 前缀和**

**概念**：前缀和是一个数组，用于存储数组前 `i` 个元素的和，方便快速计算任意区间的和。

**公式**：

- 前缀和数组 `prefixSum[i] = nums[0] + nums[1] + ... + nums[i]`
- 区间 `[l, r]` 的和：`prefixSum[r] - prefixSum[l-1]`

**代码实现**：

```javascript
function prefixSum(nums) {
  const n = nums.length;
  const prefix = Array(n + 1).fill(0); // 初始化前缀和数组

  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  return prefix;
}

// 示例：计算区间和
const nums = [1, 2, 3, 4, 5];
const prefix = prefixSum(nums);
const l = 1, r = 3;
console.log(prefix[r + 1] - prefix[l]); // 输出: 9 (2 + 3 + 4)
```

---

#### **2. 滑动窗口**

**概念**：通过一个移动窗口在数组上滑动，以求解最优解，常用于处理连续子数组问题。

**典型应用**：

- 求最长连续子数组。
- 求连续子数组的最大或最小值。
- 检查字符串中是否包含某子串。

**代码实现**：
**例：长度为 k 的子数组最大值**

```javascript
function maxSlidingWindow(nums, k) {
  const deque = []; // 存储索引
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 移除滑出窗口的元素
    if (deque.length && deque[0] < i - k + 1) deque.shift();

    // 移除队列中比当前元素小的元素
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // 添加窗口最大值
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

// 示例
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // 输出: [3, 3, 5, 5, 6, 7]
```

---

### **区间问题**

#### **1. 树状数组**

**概念**：树状数组是一种支持动态更新的前缀和数据结构，时间复杂度为 O(log n)。

**操作**：

- 更新某个元素：将元素值增加或减少。
- 查询区间和：快速计算区间 `[1, i]` 的和。

**代码实现**：

```javascript
class FenwickTree {
  constructor(size) {
    this.tree = Array(size + 1).fill(0);
  }

  // 单点更新
  update(index, delta) {
    while (index < this.tree.length) {
      this.tree[index] += delta;
      index += index & -index; // 移动到上一级
    }
  }

  // 查询前缀和
  query(index) {
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & -index; // 移动到下一级
    }
    return sum;
  }
}

// 示例
const fenwick = new FenwickTree(5);
fenwick.update(1, 2); // nums[1] = 2
fenwick.update(2, 3); // nums[2] = 3
fenwick.update(3, 5); // nums[3] = 5
console.log(fenwick.query(3)); // 输出: 10 (2 + 3 + 5)
```

---

#### **2. 线段树**

**概念**：线段树是一种分治的数据结构，支持快速的区间查询与更新操作，适用于处理较大的区间问题。

**操作**：

- **查询**：查询区间 `[l, r]` 的和、最大值或最小值。
- **更新**：修改区间或单点的值。

**代码实现**：

```javascript
class SegmentTree {
  constructor(nums) {
    const n = nums.length;
    this.tree = Array(4 * n).fill(0);
    this.n = n;

    const build = (start, end, node) => {
      if (start === end) {
        this.tree[node] = nums[start];
        return;
      }
      const mid = Math.floor((start + end) / 2);
      build(start, mid, 2 * node + 1);
      build(mid + 1, end, 2 * node + 2);
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    };

    build(0, n - 1, 0);
  }

  query(l, r) {
    const queryTree = (start, end, node, L, R) => {
      if (start > R || end < L) return 0;
      if (L <= start && end <= R) return this.tree[node];

      const mid = Math.floor((start + end) / 2);
      return (
        queryTree(start, mid, 2 * node + 1, L, R) +
        queryTree(mid + 1, end, 2 * node + 2, L, R)
      );
    };

    return queryTree(0, this.n - 1, 0, l, r);
  }

  update(index, value) {
    const updateTree = (start, end, node) => {
      if (start === end) {
        this.tree[node] = value;
        return;
      }
      const mid = Math.floor((start + end) / 2);
      if (index <= mid) {
        updateTree(start, mid, 2 * node + 1);
      } else {
        updateTree(mid + 1, end, 2 * node + 2);
      }
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    };

    updateTree(0, this.n - 1, 0);
  }
}

// 示例
const nums = [1, 3, 5];
const segTree = new SegmentTree(nums);
console.log(segTree.query(0, 2)); // 输出: 9 (1 + 3 + 5)
segTree.update(1, 2); // 修改 nums[1] 为 2
console.log(segTree.query(0, 2)); // 输出: 8 (1 + 2 + 5)
```

---

### **总结**

#### **线性问题**

- 常见方法：
  - 前缀和：快速计算区间和。
  - 滑动窗口：解决连续子数组问题。
- 时间复杂度：一般为 O(n)。

#### **区间问题**

- 数据结构：
  - 树状数组：高效处理前缀和与单点更新。
  - 线段树：支持动态区间查询与修改。
- 时间复杂度：
  - 单次操作 O(log n)。

通过熟练掌握线性与区间问题的解法，能有效解决多种算法题目，如路径计数、范围求和、子数组问题等。
