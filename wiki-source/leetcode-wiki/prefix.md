---
outline: deep
---

# 前缀和

## **什么是前缀和？**

**定义**：

前缀和是一种 **数组处理技巧**，用于快速计算数组中任意区间的元素和。

前缀和数组的定义如下：

- 假设原数组为 `nums`，前缀和数组为 `prefix`。
- 其中，`prefix[i]` 表示数组 `nums` 从下标 `0` 到下标 `i` 的元素之和：

   `prefix[i]=nums[0]+nums[1]+⋯+nums[i]prefix[i] = nums[0] + nums[1] + \dots + nums[i]`

---

## **前缀和的公式**

对于数组区间 `[i, j]`，其区间和可以通过前缀和数组快速计算：

区间和=`prefix[j]−prefix[i−1]\text{区间和} = prefix[j] - prefix[i-1]`

- 当 `i == 0` 时，区间和直接是 `prefix[j]`。

---

## **前缀和的应用场景**

### **1. 快速求任意区间和**

**场景**：

- 给定一个数组 `nums`，你需要多次查询任意区间 `[i, j]` 的和。

**解法**：

1. **构建前缀和数组**：

    ```python
    n = len(nums)
    prefix = [0] * n
    prefix[0] = nums[0]
    for i in range(1, n):
        prefix[i] = prefix[i-1] + nums[i]
    
    ```

2. **查询区间和**：
使用公式：

    ```python
    def range_sum(prefix, i, j):
        return prefix[j] - (prefix[i-1] if i > 0 else 0)
    
    ```

**复杂度**：

- 构建前缀和数组：`O(n)`
- 查询每个区间和：`O(1)`

**例子**：

- 输入：`nums = [1, 2, 3, 4, 5]`，查询区间 `[1, 3]` 的和。
- 计算：
  - 前缀和数组：`prefix = [1, 3, 6, 10, 15]`
  - 区间和：`prefix[3] - prefix[0] = 10 - 1 = 9`

---

### **2. 求一个固定数组的所有子数组和**

**场景**：

- 给定一个数组，求所有子数组的和。

**解法**：

- 前缀和可以快速帮助你计算每个子数组的和，但复杂度仍为 `O(n^2)`。

    ```python
    for i in range(len(nums)):
        for j in range(i, len(nums)):
            subarray_sum = prefix[j] - (prefix[i-1] if i > 0 else 0)
    
    ```

---

### **3. 差分数组**

**定义**：

- 差分数组是前缀和的逆向概念，用于快速处理**区间修改问题**。
- 对于一个数组 `nums`，其差分数组 `diff` 定义为：

其中，`nums[0] = diff[0]`。

`diff[i]=nums[i]−nums[i−1]diff[i] = nums[i] - nums[i-1]`

**用途**：

- 差分数组可以快速对原数组进行 **区间加减更新**。

**例子**：

- 给定数组 `nums = [0, 0, 0, 0, 0]`，需要将区间 `[1, 3]` 的元素加上 `2`。
- 操作：
  - 在差分数组中，`diff[1] += 2`，`diff[4] -= 2`。
  - 通过差分数组 `diff` 恢复原数组：前缀和的累加得到最终数组。

**代码实现**：

```python
# 差分数组构建
n = len(nums)
diff = [0] * (n + 1)

# 区间 [i, j] 增加 val
def add_range(diff, i, j, val):
    diff[i] += val
    if j + 1 < len(diff):
        diff[j+1] -= val

# 构造最终数组
def build_array(diff):
    res = [0] * (len(diff) - 1)
    res[0] = diff[0]
    for i in range(1, len(res)):
        res[i] = res[i-1] + diff[i]
    return res

# 示例
nums = [0, 0, 0, 0, 0]
add_range(diff, 1, 3, 2)  # 区间 [1, 3] 加 2
result = build_array(diff)  # 还原数组
print(result)  # 输出 [0, 2, 2, 2, 0]

```

---

### **4. 快速检测是否存在子数组的目标和**

**场景**：

- 给定数组 `nums` 和一个目标值 `k`，判断是否存在一个子数组，其和等于 `k`。

**解法**：

- 使用前缀和结合哈希表快速查找。

**思路**：

1. 记录前缀和的每个值，并存储在哈希表中。
2. 在遍历过程中，检查当前前缀和 `prefix[i]` 是否存在 `prefix[i] - k`。

**代码实现**：

```python
def subarray_sum(nums, k):
    prefix_sum = 0
    prefix_map = {0: 1}  # 初始化，前缀和为 0 的次数为 1
    count = 0

    for num in nums:
        prefix_sum += num
        # 检查是否存在 prefix_sum - k
        if prefix_sum - k in prefix_map:
            count += prefix_map[prefix_sum - k]
        # 更新哈希表
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1

    return count

# 示例
nums = [1, 2, 3]
k = 3
print(subarray_sum(nums, k))  # 输出 2，子数组 [1, 2] 和 [3]

```

---

## **总结**

1. **前缀和** 用于快速计算区间和，适合多次查询的场景。
2. **差分数组** 适合处理区间修改问题。
3. **结合前缀和与哈希表** 可以快速解决目标和问题。
4. 前缀和和差分数组是算法中常用的技巧，适用于优化时间复杂度。
