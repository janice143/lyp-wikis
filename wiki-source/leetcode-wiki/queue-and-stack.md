---
outline: deep
---
# 队列与栈

以下是关于“队列与栈”相关知识点的总结，包含概念介绍、典型案例、解题思路以及 JavaScript 实现代码。

### **队列与栈简介**

#### **队列 (Queue)**

- **定义**: 队列是一种先进先出（FIFO, First-In-First-Out）的数据结构。元素从队尾入队，从队首出队。
- **特点**:
  - 先进先出
  - 常用于任务调度、数据流处理等
- **基本操作**:
  - `enqueue(item)`：在队尾插入元素
  - `dequeue()`：从队首移除元素
  - `peek()`：查看队首元素
  - `isEmpty()`：判断队列是否为空

#### **栈 (Stack)**

- **定义**: 栈是一种后进先出（LIFO, Last-In-First-Out）的数据结构。元素从栈顶入栈，从栈顶出栈。
- **特点**:
  - 后进先出
  - 常用于递归、表达式求值、括号匹配等
- **基本操作**:
  - `push(item)`：将元素压入栈顶
  - `pop()`：从栈顶弹出元素
  - `peek()`：查看栈顶元素
  - `isEmpty()`：判断栈是否为空

---

### **典型案例与解题思路**

#### **1. 括号匹配问题 (栈)**

- **描述**: 给定一个字符串，判断其中的括号是否匹配。
- **解题思路**:
  - 使用栈存储左括号。
  - 遇到右括号时，检查栈顶是否为对应的左括号。
  - 最后栈为空表示括号匹配。

```javascript
function isValidParentheses(s) {
  const stack = [];
  const map = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  for (let char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else if (stack.length && stack[stack.length - 1] === map[char]) {
      stack.pop();
    } else {
      return false;
    }
  }
  return stack.length === 0;
}

// 示例
console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("([)]"));   // false
```

#### **2. 滑动窗口最大值 (双端队列)**

- **描述**: 给定一个数组和滑动窗口的大小，求每个窗口的最大值。
- **解题思路**:
  - 使用双端队列维护窗口中的索引。
  - 队列中索引对应的值按降序排列，保持队首为最大值。

- 移除队首过期元素：
  - 当队列中的第一个元素的索引已经超出了当前窗口的范围时，需要将其从队列中移除。
  - 这个操作保证了队列中只存储当前窗口内的元素。
- 移除队尾小于当前元素的索引：
  - 我们要保持队列中的元素按递减顺序排列，这样，队首永远是窗口的最大值。
  - 如果当前元素比队尾元素大，那么队尾的元素就不可能是未来窗口的最大值了，因此要从队列中移除它。
  - 通过这个操作，保持队列中的元素按降序排列。
- 推入当前元素的索引：
  - 每次遍历到一个新的元素时，我们会把它的索引推入队列。
  
```javascript
function maxSlidingWindow(nums, k) {
  const deque = [];
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) {
      deque.shift(); // 移除队首过期元素
    }
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop(); // 移除队尾小于当前元素的索引
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

// 示例
console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)); // [3,3,5,5,6,7]
```

#### **3. 用队列实现栈**

- **描述**: 使用两个队列实现栈的功能。
- **解题思路**:
  - 主队列用于存储数据，辅助队列用于调整顺序。
  - 每次`push`时，将新元素加入辅助队列并将主队列的所有元素转移到辅助队列。

```javascript
class MyStack {
  constructor() {
    this.queue1 = [];
    this.queue2 = [];
  }

  push(x) {
    this.queue2.push(x);
    while (this.queue1.length) {
      this.queue2.push(this.queue1.shift());
    }
    [this.queue1, this.queue2] = [this.queue2, this.queue1];
  }

  pop() {
    return this.queue1.shift();
  }

  top() {
    return this.queue1[0];
  }

  isEmpty() {
    return this.queue1.length === 0;
  }
}

// 示例
const stack = new MyStack();
stack.push(1);
stack.push(2);
console.log(stack.top()); // 2
console.log(stack.pop()); // 2
console.log(stack.isEmpty()); // false
```

---

### **知识点总结**

1. **队列与栈的核心区别**:
   - 队列是先进先出，栈是后进先出。
   - 双端队列是队列的扩展，支持从两端插入和删除。
2. **常见应用场景**:
   - 栈: 括号匹配、逆序、递归调用。
   - 队列: BFS（广度优先搜索）、任务调度、滑动窗口。
3. **实现技巧**:
   - 栈可通过数组原生方法`push`和`pop`实现。
   - 队列可通过数组方法`push`和`shift`实现，但需要注意性能问题。
   - 双端队列可使用数组模拟，但性能要求高时需使用优化的双端队列结构。

通过以上案例和代码，可以掌握队列与栈的基础操作及其应用，理解其在算法题中的核心作用。
