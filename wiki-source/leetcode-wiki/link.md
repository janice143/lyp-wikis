---
outline: deep
---
# 链表

链表是一种常用的动态数据结构，由一系列节点（Node）组成，每个节点包含数据和一个指向下一个节点的引用（指针）。链表的特点是能够高效地进行插入和删除操作。

---

### **链表的分类**

1. **单链表 (Singly Linked List)**：
   - 每个节点只包含一个指向下一个节点的引用。
   - 最后一个节点的引用为 `null`。

2. **双链表 (Doubly Linked List)**：
   - 每个节点包含两个引用，一个指向前一个节点，另一个指向下一个节点。
   - 可以从任意节点向前或向后遍历。

3. **循环链表 (Circular Linked List)**：
   - 尾节点指向头节点，形成一个闭环。

---

### **链表的特点**

- **优点**：
  1. 动态大小：不需要预先分配固定大小，内存使用更灵活。
  2. 插入和删除操作高效：在已知节点位置时，插入和删除操作的时间复杂度为 O(1)。
- **缺点**：
  1. 访问效率低：需要从头节点开始逐个遍历，查找节点的时间复杂度为 O(n)。
  2. 存储空间开销大：每个节点需要额外存储指针。

---

### **链表的基本操作**

#### **1. 单链表的节点定义**

```javascript
class Node {
  constructor(value) {
    this.value = value;  // 节点存储的值
    this.next = null;    // 指向下一个节点的指针
  }
}
```

#### **2. 单链表的实现**

```javascript
class LinkedList {
  constructor() {
    this.head = null; // 链表的头节点
  }

  // 在链表末尾添加节点
  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode; // 如果链表为空，直接设置为头节点
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next; // 找到链表的末尾
    }
    current.next = newNode;
  }

  // 在链表头部添加节点
  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode; // 新节点成为头节点
  }

  // 删除节点
  delete(value) {
    if (!this.head) return;

    // 如果要删除的是头节点
    if (this.head.value === value) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next; // 找到要删除的节点前一个节点
    }
    if (current.next) {
      current.next = current.next.next; // 跳过要删除的节点
    }
  }

  // 打印链表
  print() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    console.log(values.join(" -> "));
  }
}

// 示例
const list = new LinkedList();
list.append(10);
list.append(20);
list.prepend(5);
list.print(); // 输出: 5 -> 10 -> 20
list.delete(10);
list.print(); // 输出: 5 -> 20
```

---

### **链表的操作复杂度**

| 操作         | 时间复杂度 | 备注                                           |
|--------------|------------|-----------------------------------------------|
| 查找 (Search)| O(n)       | 需要从头节点开始遍历，查找指定值的节点。         |
| 插入 (Insert)| O(1)       | 已知插入位置时，插入操作只需改变指针。          |
| 删除 (Delete)| O(1)       | 已知删除位置时，删除操作只需改变指针。          |

---

### **双链表的实现**

#### **1. 节点定义**

```javascript
class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;  // 指向下一个节点
    this.prev = null;  // 指向前一个节点
  }
}
```

#### **2. 双链表的实现**

```javascript
class DoublyLinkedList {
  constructor() {
    this.head = null; // 头节点
    this.tail = null; // 尾节点
  }

  // 在链表末尾添加节点
  append(value) {
    const newNode = new DoublyNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    this.tail.next = newNode;
    newNode.prev = this.tail;
    this.tail = newNode;
  }

  // 在链表头部添加节点
  prepend(value) {
    const newNode = new DoublyNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  // 删除节点
  delete(value) {
    if (!this.head) return;

    // 如果要删除的是头节点
    if (this.head.value === value) {
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null; // 链表为空
      }
      return;
    }

    // 如果要删除的是尾节点
    if (this.tail.value === value) {
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null; // 链表为空
      }
      return;
    }

    // 删除中间节点
    let current = this.head;
    while (current && current.value !== value) {
      current = current.next;
    }
    if (current) {
      current.prev.next = current.next;
      if (current.next) {
        current.next.prev = current.prev;
      }
    }
  }

  // 打印链表
  print() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    console.log(values.join(" <-> "));
  }
}

// 示例
const doublyList = new DoublyLinkedList();
doublyList.append(10);
doublyList.append(20);
doublyList.prepend(5);
doublyList.print(); // 输出: 5 <-> 10 <-> 20
doublyList.delete(10);
doublyList.print(); // 输出: 5 <-> 20
```

---

### **链表的应用场景**

1. **动态数据管理**：
   - 当数据量未知或频繁变化时，链表提供了灵活性。
2. **实现栈和队列**：
   - 链表可以用来实现栈（LIFO）和队列（FIFO）。
3. **缓存实现**：
   - 双链表与哈希表结合实现 LRU 缓存。
4. **字符串处理**：
   - 编辑器中的字符串实现（如文本编辑器的撤销功能）。

---

### **总结**

1. **链表的类型**：
   - 单链表：每个节点只指向下一个节点。
   - 双链表：节点包含前后两个指针。
   - 循环链表：尾节点指向头节点。
2. **优缺点**：
   - 优点：动态大小、快速插入和删除。
   - 缺点：访问效率低，额外存储指针增加了空间开销。
3. **典型应用**：
   - 数据结构实现、动态数据存储、缓存机制等。

链表是一种灵活而重要的数据结构，在处理动态数据时非常实用。掌握链表的操作和实现，是编程基础中的重要部分。
