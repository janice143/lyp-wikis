---
outline: deep
---

# 排序

以下是几种常见的排序算法的讲解及其 **JavaScript** 实现：

### **1. 冒泡排序 (Bubble Sort)**

**思路**：

- 比较相邻两个元素，如果前一个比后一个大，则交换它们。
- 每一轮将最大的元素“冒泡”到数组末尾。
- 重复 n-1 次即可完成排序。

**时间复杂度**：

- 最坏情况下：`O(n^2)`，当数组是完全逆序时。
- 最好情况下：`O(n)`，当数组已排序时（优化版）。

**代码**：

```jsx
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false; // 优化：检查是否发生交换
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // 交换
        swapped = true;
      }
    }
    if (!swapped) break; // 如果没有交换，提前结束
  }
  return arr;
}

```

**示例**：

```jsx
console.log(bubbleSort([5, 2, 9, 1, 5, 6])); // 输出: [1, 2, 5, 5, 6, 9]

```

---

### **2. 选择排序 (Selection Sort)**

**思路**：

- 每一轮找到数组中最小的元素，将它放到数组的起始位置。
- 需要 n-1 轮，依次将最小值放到正确位置。

**时间复杂度**：

- 最坏情况下：`O(n^2)`。
- 最好情况下：`O(n^2)`（没有优化）。

**代码**：

```jsx
function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j; // 找到最小值的索引
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // 交换
    }
  }
  return arr;
}

```

**示例**：

```jsx
console.log(selectionSort([5, 2, 9, 1, 5, 6])); // 输出: [1, 2, 5, 5, 6, 9]

```

---

### **3. 插入排序 (Insertion Sort)**

**思路**：

- 将数组分为已排序和未排序两部分。
- 依次从未排序部分取出元素，插入到已排序部分的正确位置。

**时间复杂度**：

- 最坏情况下：`O(n^2)`，当数组是逆序时。
- 最好情况下：`O(n)`，当数组已经有序时。

**代码**：

```jsx
function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    // 将比 key 大的元素向后移动
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key; // 插入 key 到正确位置
  }
  return arr;
}

```

**示例**：

```jsx
console.log(insertionSort([5, 2, 9, 1, 5, 6])); // 输出: [1, 2, 5, 5, 6, 9]

```

---

### **4. 快速排序 (Quick Sort)**

**思路**：

- 选择一个基准值（pivot），将数组分为两部分：小于基准值和大于基准值的部分。
- 递归地对两部分进行排序。

**时间复杂度**：

- 最坏情况下：`O(n^2)`，当每次选择的基准值是最小或最大值时。
- 最好和平均情况下：`O(n log n)`。

**代码**：

```jsx
function quickSort(arr) {
  if (arr.length <= 1) return arr; // 递归终止条件
  let pivot = arr[0]; // 基准值
  let left = [], right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

```

**示例**：

```jsx
console.log(quickSort([5, 2, 9, 1, 5, 6])); // 输出: [1, 2, 5, 5, 6, 9]

```

---

### **5. 归并排序 (Merge Sort)**

**思路**：

- 将数组分成两部分，分别排序后合并。
- 合并时保持有序性。

**时间复杂度**：

- 最坏情况下：`O(n log n)`。
- 最好情况下：`O(n log n)`。

**代码**：

```jsx
function mergeSort(arr) {
  if (arr.length <= 1) return arr; // 递归终止条件
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

```

**示例**：

```jsx
console.log(mergeSort([5, 2, 9, 1, 5, 6])); // 输出: [1, 2, 5, 5, 6, 9]

```

---

### **6. 堆排序 (Heap Sort)**

**思路**：

- 将数组构造成最大堆（完全二叉树）。
- 依次将堆顶元素与最后一个元素交换，然后重新调整堆。

**时间复杂度**：

- 最坏情况下：`O(n log n)`。
- 最好情况下：`O(n log n)`。

**代码**：

```jsx
function heapSort(arr) {
  let n = arr.length;

  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 逐步将最大值放到数组末尾
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // 交换
    heapify(arr, i, 0); // 调整堆
  }
  return arr;
}

function heapify(arr, size, root) {
  let largest = root;
  let left = 2 * root + 1;
  let right = 2 * root + 2;

  if (left < size && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < size && arr[right] > arr[largest]) {
    largest = right;
  }
  if (largest !== root) {
    [arr[root], arr[largest]] = [arr[largest], arr[root]];
    heapify(arr, size, largest);
  }
}

```

**示例**：

```jsx
console.log(heapSort([5, 2, 9, 1, 5, 6])); // 输出: [1, 2, 5, 5, 6, 9]

```

---

### **排序算法总结**

| 算法 | 时间复杂度 (最坏) | 时间复杂度 (最好) | 空间复杂度 | 稳定性 |
| --- | --- | --- | --- | --- |
| 冒泡排序 | O(n^2) | O(n) | O(1) | 稳定 |
| 选择排序 | O(n^2) | O(n^2) | O(1) | 不稳定 |
| 插入排序 | O(n^2) | O(n) | O(1) | 稳定 |
| 快速排序 | O(n^2) | O(n log n) | O(log n) | 不稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 |
