---
outline: deep
---
# 递归和分治

递归和分治是密切相关的两种算法思想。**递归** 是实现算法的一种方法，而 **分治** 是一种解决问题的策略，通常通过递归实现。

## **递归 (Recursion)**

### **定义**

递归是一个函数调用自身的过程，通常用于将一个复杂的问题分解为更小的子问题来解决。

### **递归的关键点**

1. **终止条件 (Base Case)**：
    - 防止递归进入死循环。
    - 定义一个简单的条件，当满足时直接返回结果。
2. **递归关系 (Recursive Case)**：
    - 定义问题如何通过调用自身来解决。
    - 将大问题分解为小问题。
3. **递归深度**：
    - 避免递归过深导致栈溢出（Stack Overflow）。

### **递归的代码模板**

```jsx
function recursiveFunction(params) {
  // 1. 终止条件
  if (base_case_condition) {
    return result;
  }

  // 2. 递归调用
  return recursiveFunction(smaller_problem);
}

```

### **例子：计算阶乘**

```jsx
function factorial(n) {
  // 1. 终止条件
  if (n === 0) return 1;

  // 2. 递归调用
  return n * factorial(n - 1);
}

// 示例
console.log(factorial(5)); // 输出: 120

```

- **递归关系**: `factorial(n) = n * factorial(n - 1)`
- **终止条件**: `factorial(0) = 1`

### **递归的常见应用**

1. **数学问题**：如阶乘、斐波那契数列。
2. **树结构遍历**：如二叉树的前序、中序、后序遍历。
3. **图的深度优先搜索 (DFS)**：如查找连通分量。
4. **分治算法的实现**：如归并排序、快速排序。

## **分治 (Divide and Conquer)**

### **定义**

分治是一种算法设计策略，将一个问题分解为多个规模较小的子问题，递归解决这些子问题，最后合并结果。

### **分治的关键点**

1. **分解 (Divide)**：
    - 将原问题划分为多个子问题。
2. **解决 (Conquer)**：
    - 递归地解决每个子问题。
3. **合并 (Combine)**：
    - 将子问题的解合并为原问题的解。

### **分治的代码模板**

```jsx
function divideAndConquer(problem, params) {
  // 1. 终止条件
  if (problem_size == trivial) {
    return solution;
  }

  // 2. 分解问题
  let subProblems = divide(problem);

  // 3. 解决子问题
  let subSolutions = subProblems.map(p => divideAndConquer(p, params));

  // 4. 合并结果
  return combine(subSolutions);
}

```

### **例子：归并排序**

**问题**：将一个无序数组排序。

**代码**：

```jsx
function mergeSort(arr) {
  // 1. 终止条件
  if (arr.length <= 1) return arr;

  // 2. 分解
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  // 3. 合并
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 示例
console.log(mergeSort([5, 2, 4, 7, 1, 3, 2, 6])); // 输出: [1, 2, 2, 3, 4, 5, 6, 7]

```

- **分解 (Divide)**: 将数组分成两半。
- **解决 (Conquer)**: 递归地对两部分排序。
- **合并 (Combine)**: 将两个有序数组合并为一个有序数组。

## **递归 vs 分治**

| **特性** | **递归** | **分治** |
| --- | --- | --- |
| **定义** | 函数调用自身解决问题 | 将问题分解为更小的子问题，递归解决并合并结果 |
| **目标** | 重复地解决同一类问题 | 将问题规模缩小，最终合并解决 |
| **实现方式** | 直接递归 | 递归 + 分解 + 合并 |
| **应用场景** | 树遍历、DFS、斐波那契数列 | 归并排序、快速排序、二分搜索、最大子数组和 |

### **递归和分治的例题讲解**

### **例题 1: 二叉树的最大深度**

**问题**：

- 给定一棵二叉树，找到它的最大深度。

**递归代码**：

```jsx
function maxDepth(root) {
  if (!root) return 0; // 终止条件
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)); // 递归调用
}

```

### **例题 2: 快速排序**

**问题**：

- 使用分治思想对数组进行排序。

**代码**：

```jsx
function quickSort(arr) {
  if (arr.length <= 1) return arr; // 终止条件
  let pivot = arr[0];
  let left = arr.slice(1).filter(x => x < pivot);
  let right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)]; // 递归分解+合并
}

// 示例
console.log(quickSort([3, 6, 8, 10, 1, 2, 1])); // 输出: [1, 1, 2, 3, 6, 8, 10]

```

### **例题 3: 最大子数组和**

**问题**：

- 使用分治思想解决最大子数组和问题。

**代码**：

```jsx
function maxSubArray(nums) {
  function helper(left, right) {
    if (left === right) return nums[left]; // 终止条件
    let mid = Math.floor((left + right) / 2);
    let leftMax = helper(left, mid);
    let rightMax = helper(mid + 1, right);
    let crossMax = crossSum(nums, left, mid, right);
    return Math.max(leftMax, rightMax, crossMax); // 合并结果
  }

  function crossSum(nums, left, mid, right) {
    let leftSum = -Infinity, sum = 0;
    for (let i = mid; i >= left; i--) {
      sum += nums[i];
      leftSum = Math.max(leftSum, sum);
    }

    let rightSum = -Infinity;
    sum = 0;
    for (let i = mid + 1; i <= right; i++) {
      sum += nums[i];
      rightSum = Math.max(rightSum, sum);
    }

    return leftSum + rightSum;
  }

  return helper(0, nums.length - 1);
}

// 示例
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 输出: 6 (子数组为 [4, -1, 2, 1])

```

## **总结**

1. **递归** 是实现算法的一种方式，强调重复调用自身。
2. **分治** 是解决问题的一种思想，强调分解问题、递归求解、合并结果。
3. 二者经常结合使用，如归并排序、快速排序、最大子数组和等问题。

需要进一步深入某个具体问题或有疑问，随时告诉我！😊
