---
outline: deep
---
# 堆

堆是一种特殊的完全二叉树，它满足以下条件：

- **最大堆**（Max-Heap）：每个节点的值都大于或等于其子节点的值。
- **最小堆**（Min-Heap）：每个节点的值都小于或等于其子节点的值。

堆常用于实现优先队列（Priority Queue），也可用于排序（堆排序）。堆是一种基于树的数据结构，能够支持高效的插入、删除、查找最大值或最小值等操作。

---

## **堆的基本操作**

### 1. **插入操作（Insert）**

- **时间复杂度**：O(log n)
- **过程**：将新元素添加到堆的最后一个位置，并通过向上调整（heapify-up）来保持堆的性质。

### 2. **删除操作（Remove）**

- **时间复杂度**：O(log n)
- **过程**：删除根节点（最大堆中是最大元素，最小堆中是最小元素），将堆的最后一个元素放到根节点，然后通过向下调整（heapify-down）来保持堆的性质。

### 3. **堆化（Heapify）**

- **时间复杂度**：O(log n)
- **过程**：从一个节点开始，向下调整子树以满足堆的性质。通常在堆化时，我们从最后一个非叶节点开始向上调整，直到根节点。

### 4. **查找最大值或最小值**

- **最大堆**：查找根节点即为最大值，时间复杂度为 O(1)。
- **最小堆**：查找根节点即为最小值，时间复杂度为 O(1)。

---

## **堆的应用**

1. **优先队列（Priority Queue）**：
   - 堆通常用于实现优先队列，支持高效的插入和删除操作。每次从队列中删除时，都会删除当前优先级最高或最低的元素。

2. **堆排序（Heap Sort）**：
   - 使用堆的性质来排序数组。通过多次删除根节点（最大堆或最小堆），可以得到从大到小或从小到大的排序。

3. **合并多个有序链表**：
   - 使用堆合并多个有序链表，可以在 O(log n) 的时间复杂度内每次提取出最小元素。

---

## **堆排序算法**

堆排序是一种基于堆数据结构的排序算法。堆排序可以分为两个主要阶段：

1. **构建堆**：从最后一个非叶节点开始，逐步将堆调整为一个最大堆或最小堆。
2. **排序**：每次将堆的根节点（最大元素或最小元素）与最后一个元素交换，减少堆的大小，然后重新调整堆。

---

## **堆的代码实现（JavaScript）**

### **1. 堆的插入操作**

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  // 向上调整堆
  heapifyUp(index) {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] < this.heap[index]) {
        [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
        index = parent;
      } else {
        break;
      }
    }
  }

  // 插入元素
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  // 打印堆
  print() {
    console.log(this.heap);
  }
}

// 示例
const maxHeap = new MaxHeap();
maxHeap.insert(10);
maxHeap.insert(20);
maxHeap.insert(15);
maxHeap.print(); // 输出: [20, 10, 15]
```

### **2. 堆的删除操作（移除根节点）**

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  // 向下调整堆
  heapifyDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let largest = index;

    if (left < this.heap.length && this.heap[left] > this.heap[largest]) {
      largest = left;
    }
    if (right < this.heap.length && this.heap[right] > this.heap[largest]) {
      largest = right;
    }
    if (largest !== index) {
      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      this.heapifyDown(largest);
    }
  }

  // 移除根节点
  removeRoot() {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  // 打印堆
  print() {
    console.log(this.heap);
  }
}

// 示例
const maxHeap = new MaxHeap();
maxHeap.insert(10);
maxHeap.insert(20);
maxHeap.insert(15);
console.log(maxHeap.removeRoot()); // 输出: 20
maxHeap.print(); // 输出: [15, 10]
```

### **3. 堆排序实现**

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  heapifyUp(index) {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] < this.heap[index]) {
        [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
        index = parent;
      } else {
        break;
      }
    }
  }

  heapifyDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let largest = index;

    if (left < this.heap.length && this.heap[left] > this.heap[largest]) {
      largest = left;
    }
    if (right < this.heap.length && this.heap[right] > this.heap[largest]) {
      largest = right;
    }
    if (largest !== index) {
      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      this.heapifyDown(largest);
    }
  }

  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  removeRoot() {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  // 堆排序
  heapSort(arr) {
    // 1. 构建堆
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }

    // 2. 排序
    for (let i = arr.length - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      this.heapifyDown(0, i);
    }

    return arr;
  }
}

// 示例
const maxHeap = new MaxHeap();
let arr = [3, 2, 1, 5, 4, 6];
console.log(maxHeap.heapSort(arr)); // 输出: [6, 5, 4, 3, 2, 1]
```

### **总结**

- **堆**是一种特殊的完全二叉树，具有很高的效率，常用于实现优先队列、堆排序等。
- **常见操作**：
  - 插入操作：时间复杂度 O(log n)。
  - 删除根节点操作：时间复杂度 O(log n)。
  - 堆排序：时间复杂度 O(n log n)。
- **堆**通过向上调整和向下调整维护其性质。
- **应用**：堆在实际问题中的应用非常广泛，特别是在调度任务、求解最大值或最小值时具有优势。
