---
outline: deep
---
# 哈希

**哈希（Hashing）** 是一种将数据映射到特定位置的技术，通过一个 **哈希函数（Hash Function）** 将输入数据（键）映射到一个整数（哈希值），再通过这个整数将数据存储在哈希表中。哈希在算法和数据结构中广泛应用，特别是在需要快速查找和存储的场景中。

---

### **哈希的核心概念**

#### **1. 哈希函数**

- 哈希函数是将输入（通常是一个键）映射到整数值的函数。
- 特性：
  1. **确定性**：相同的输入总是产生相同的输出。
  2. **均匀性**：理想情况下，哈希值应均匀分布在整个范围内，避免冲突。
  3. **高效性**：计算哈希值的过程应快速。

#### **2. 哈希表（Hash Table）**

- **定义**: 一种基于数组的数据结构，使用哈希函数将键映射到数组的索引位置。
- **存储**: 键值对（Key-Value Pair）。
- **核心操作**:
  - 插入（Insert）：通过哈希函数找到键对应的索引，将值存储在该位置。
  - 查找（Search）：根据键通过哈希函数找到对应的值。
  - 删除（Delete）：根据键通过哈希函数找到值并移除。

#### **3. 冲突处理**

由于哈希函数的值域有限，可能会有多个键映射到同一个位置，称为 **冲突（Collision）**。常见的冲突解决方法有：

1. **链地址法（Chaining）**: 将同一位置的元素存储为链表。
2. **开放寻址法（Open Addressing）**: 在发生冲突时，寻找下一个空位置存储数据。

---

### **哈希的应用场景**

#### **1. 查找**

哈希表提供了接近常数时间复杂度（O(1)）的查找性能，常用于：

- 判断元素是否存在（例如判断一个集合中的元素）。
- 频率统计（统计字符串中字符出现的频率）。

#### **2. 数据去重**

通过哈希表快速检测重复元素。

#### **3. 缓存（Cache）**

- 哈希表用于实现缓存（如 LRU 缓存）。
- 提供快速的数据存取。

#### **4. 哈希集合和哈希映射**

- 哈希集合（Hash Set）：存储键的集合，快速判断是否存在某个元素。
- 哈希映射（Hash Map）：存储键值对，通过键快速访问对应的值。

---

### **哈希的代码实现**

#### **1. 自定义哈希表**

以下是使用链地址法实现的哈希表：

```javascript
class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size);
  }

  // 简单哈希函数
  _hash(key) {
    let hash = 0;
    for (const char of key) {
      hash += char.charCodeAt(0);
    }
    return hash % this.size;
  }

  // 插入键值对
  set(key, value) {
    const index = this._hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index][i][1] = value; // 更新值
        return;
      }
    }
    this.table[index].push([key, value]);
  }

  // 获取值
  get(key) {
    const index = this._hash(key);
    if (this.table[index]) {
      for (const [k, v] of this.table[index]) {
        if (k === key) {
          return v;
        }
      }
    }
    return undefined;
  }

  // 删除键值对
  delete(key) {
    const index = this._hash(key);
    if (this.table[index]) {
      this.table[index] = this.table[index].filter(([k]) => k !== key);
    }
  }
}

// 示例
const hashTable = new HashTable(10);
hashTable.set("name", "Alice");
hashTable.set("age", 25);
console.log(hashTable.get("name")); // 输出: "Alice"
console.log(hashTable.get("age"));  // 输出: 25
hashTable.delete("age");
console.log(hashTable.get("age"));  // 输出: undefined
```

#### **2. 哈希集合（Hash Set）**

利用 JavaScript 的 `Set` 实现哈希集合。

```javascript
const hashSet = new Set();

// 添加元素
hashSet.add(1);
hashSet.add(2);
hashSet.add(3);

// 检查元素是否存在
console.log(hashSet.has(2)); // 输出: true
console.log(hashSet.has(4)); // 输出: false

// 删除元素
hashSet.delete(2);
console.log(hashSet.has(2)); // 输出: false
```

#### **3. 哈希映射（Hash Map）**

利用 JavaScript 的 `Map` 实现哈希映射。

```javascript
const hashMap = new Map();

// 插入键值对
hashMap.set("name", "Alice");
hashMap.set("age", 25);

// 获取值
console.log(hashMap.get("name")); // 输出: "Alice"
console.log(hashMap.get("age"));  // 输出: 25

// 删除键值对
hashMap.delete("age");
console.log(hashMap.get("age"));  // 输出: undefined
```

---

### **哈希的优缺点**

#### **优点**

1. **快速查找**：哈希表的查找、插入、删除操作在平均情况下的时间复杂度为 O(1)。
2. **灵活性强**：可以存储多种数据类型。

#### **缺点**

1. **冲突处理**：哈希冲突的处理会增加一定的时间复杂度。
2. **内存消耗**：需要为哈希表分配较大的空间，以减少冲突。
3. **无法保持顺序**：哈希表中的键值对通常无序存储。

---

### **总结**

1. **哈希是数据结构和算法中的重要工具**：
   - 提供快速查找、插入和删除的能力。
2. **常见哈希应用**：
   - 哈希表（键值对存储）。
   - 哈希集合（元素唯一性检查）。
   - 缓存（快速访问存储数据）。
3. **常见冲突处理方法**：
   - 链地址法（使用链表存储冲突元素）。
   - 开放寻址法（寻找下一个空位置存储元素）。
4. **实践场景**：
   - 数据去重、频率统计、最短路径等。

掌握哈希的核心思想和实现方法，可以更高效地解决许多实际问题。
