---
outline: deep
---

# 滑动窗口和双指针

滑动窗口和双指针是两种高效的数组或字符串处理技巧，常用于解决涉及区间、子数组或子字符串的问题。它们在思想上类似，但具体应用略有不同。

## **1. 滑动窗口**

### **核心思想**

滑动窗口的本质是维护一个区间 `[left, right]`，通过动态调整窗口的左右边界，来找到满足某种条件的子数组或子字符串。

### **应用场景**

- 固定窗口大小问题：比如大小为 `k` 的窗口。
- 动态窗口大小问题：窗口随着条件满足动态调整。

### **滑动窗口的步骤**

1. 初始化两个指针 `left` 和 `right` 表示窗口的左右边界。
2. 使用 `right` 扩展窗口（右移），直到窗口满足条件。
3. 如果需要缩小窗口，移动 `left`（左移），并更新窗口内的状态。
4. 重复以上步骤，直到 `right` 遍历完整个数组。

### 例题

#### **例题 1: 找到字符串中所有长度为 k 的子字符串**

**问题**：给定一个字符串 `s` 和整数 `k`，找到所有长度为 `k` 的子字符串。

**代码**：

```jsx
function findSubstrings(s, k) {
  let result = [];
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    // 如果当前窗口大小等于 k，则记录子字符串
    if (right - left + 1 === k) {
      result.push(s.substring(left, right + 1));
      left++; // 缩小窗口
    }
  }

  return result;
}

// 示例
console.log(findSubstrings("abcdef", 3)); // 输出: ["abc", "bcd", "cde", "def"]

```

#### **例题 2: 最小覆盖子串 (LeetCode 76)**

**问题**：给定字符串 `s` 和 `t`，找到 `s` 中包含 `t` 所有字符的最小子串。

**代码**：

```jsx
function minWindow(s, t) {
  let map = {};
  for (let char of t) {
    map[char] = (map[char] || 0) + 1;
  }

  let left = 0, minLen = Infinity, minStart = 0, count = t.length;

  for (let right = 0; right < s.length; right++) {
    if (map[s[right]] > 0) {
      count--; // 减少需要匹配的字符数
    }
    map[s[right]] = (map[s[right]] || 0) - 1;

    while (count === 0) { // 当前窗口已经满足条件
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      map[s[left]]++;
      if (map[s[left]] > 0) count++; // 增加需要匹配的字符数
      left++; // 缩小窗口
    }
  }

  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}

// 示例
console.log(minWindow("ADOBECODEBANC", "ABC")); // 输出: "BANC"

```

## **2. 双指针**

### **核心思想**

双指针的本质是通过两个指针的移动来遍历数组或字符串。指针可以：

- 同向移动（通常用于子数组问题）。
- 相向移动（通常用于有序数组或字符串问题）。

### **应用场景**

- 排序数组或字符串的处理。
- 查找特定的元素对（如两数之和）。
- 删除数组中的重复项。

### **双指针的步骤**

1. 初始化两个指针（`left` 和 `right` 或 `i` 和 `j`）。
2. 根据问题要求调整指针的移动方式（同向或相向）。
3. 在遍历的过程中更新状态或结果。

### 例题

#### **例题 1: 两数之和 II (有序数组)**

**问题**：给定一个升序数组 `numbers` 和目标值 `target`，找到两个数的索引，使它们的和等于 `target`。

**代码**：

```jsx
function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;

  while (left < right) {
    let sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 索引从 1 开始
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}

// 示例
console.log(twoSum([2, 7, 11, 15], 9)); // 输出: [1, 2]

```

#### **例题 2: 移动零**

**问题**：将数组中的所有零移到末尾，同时保持非零元素的相对顺序。

**代码**：

```jsx
function moveZeroes(nums) {
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] !== 0) {
      [nums[left], nums[right]] = [nums[right], nums[left]]; // 交换非零元素和零
      left++;
    }
  }
}

// 示例
let nums = [0, 1, 0, 3, 12];
moveZeroes(nums);
console.log(nums); // 输出: [1, 3, 12, 0, 0]

```

#### **例题 3: 盛最多水的容器**

**问题**：给定一个数组，代表柱子的高度，找到两个柱子，使它们与 x 轴围成的面积最大。

**代码**：

```jsx
function maxArea(height) {
  let left = 0, right = height.length - 1;
  let max = 0;

  while (left < right) {
    let area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);

    // 移动较短的柱子
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}

// 示例
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // 输出: 49

```

## **滑动窗口 vs 双指针**

| **滑动窗口** | **双指针** |
| -- | -- |
| 通常用于子数组或子字符串的问题 | 通常用于元素对或特定条件的搜索问题 |
| 窗口的左右边界动态调整 | 两个指针可以同向或相向移动 |
| 窗口大小可以固定或动态 | 通常解决排序数组或集合问题 |
| 示例：最小覆盖子串、子数组和问题 | 示例：两数之和、盛水容器问题 |

##

## **总结**

- **滑动窗口**：适合区间动态调整问题，常用于子数组、子字符串的处理。
- **双指针**：适合两端处理问题，常用于排序数组的二分查找或相向移动问题。
