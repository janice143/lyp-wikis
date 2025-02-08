---
outline: deep
---
# 数学技巧

### 1. 数论技巧

#### 1.1 阶乘

**输入一个非负整数 `n`，请你计算阶乘 `n!` 的结果末尾有几个 0**。

问题本质就是求解**：`n!` 最多可以分解出多少个因子 5。**

```jsx
int trailingZeroes(int n) {
    int res = 0;
    for (int d = n; d / 5 > 0; d = d / 5) {
        res += d / 5;
    }
    return res;
}
```

#### 1.2 素数

给你一个n，统计[1,n]的素数

如果2是素数，那么4,6,8,10，…不可能是素数

如果3是素数，那么6,9,12,15，不可能是素数

```jsx
int countPrimes(int n) {
    boolean[] isPrime = new boolean[n];
    Arrays.fill(isPrime, true);
    for (int i = 2; i * i < n; i++) 
        if (isPrime[i]) 
            for (int j = i * i; j < n; j += i) 
                isPrime[j] = false;
    
    int count = 0;
    for (int i = 2; i < n; i++)
        if (isPrime[i]) count++;
    
    return count;
}
```

#### 1.3 模幂运算

**`(a * b) % k = (a % k)(b % k) % k`**

#### 1.4 求最大公约数与最小公倍数

- **欧几里得算法**：用于求两个数的最大公约数（GCD），时间复杂度为 O(log min(a, b))。
  
  公式：
  \[
  GCD(a, b) = GCD(b, a \% b)
  \]

  **JavaScript 示例**：

  ```javascript
  function gcd(a, b) {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  ```

- **最小公倍数**：两数的最小公倍数可以通过最大公约数求得：
  \[
  LCM(a, b) = \frac{a \times b}{GCD(a, b)}
  \]

#### 1.5 素数筛法

- **埃拉托斯特尼筛法**：用来找出 1 到 n 之间所有的素数，时间复杂度为 O(n log log n)。

  **JavaScript 示例**：
  
  ```javascript
  function sieveOfEratosthenes(n) {
    let primes = new Array(n + 1).fill(true);
    primes[0] = primes[1] = false;
    for (let i = 2; i * i <= n; i++) {
      if (primes[i]) {
        for (let j = i * i; j <= n; j += i) {
          primes[j] = false;
        }
      }
    }
    return primes.map((v, i) => v ? i : -1).filter(x => x !== -1);
  }
  ```

#### 1.6 快速幂算法

- **快速幂**：计算 \(a^b \mod m\)（即 a 的 b 次方模 m）的快速方法，时间复杂度为 O(log b)。

  公式：
  \[
  a^b =
  \begin{cases}
  a^{b/2} \times a^{b/2} & \text{b 为偶数} \\
  a \times a^{b-1} & \text{b 为奇数}
  \end{cases}
  \]

  **JavaScript 示例**：

  ```javascript
  function modPow(a, b, m) {
    let result = 1;
    a = a % m;
    while (b > 0) {
      if (b % 2 === 1) {
        result = (result * a) % m;
      }
      a = (a * a) % m;
      b = Math.floor(b / 2);
    }
    return result;
  }
  ```

### **2. 组合数学技巧**

#### **2.1 排列与组合**

- **排列**：从 n 个元素中选取 r 个元素的排列数是：
  \[
  P(n, r) = \frac{n!}{(n - r)!}
  \]

- **组合**：从 n 个元素中选取 r 个元素的组合数是：
  \[
  C(n, r) = \frac{n!}{r!(n - r)!}
  \]

  这些公式可以用来计算排列和组合数，但在算法中，通常需要对大数进行取模操作来避免溢出。

  **JavaScript 示例**：

  ```javascript
  // 计算 C(n, r) 组合数
  function combination(n, r) {
    if (r > n) return 0;
    r = Math.min(r, n - r); // 组合数的对称性 C(n, r) = C(n, n - r)
    let num = 1, den = 1;
    for (let i = 0; i < r; i++) {
      num *= (n - i);
      den *= (i + 1);
    }
    return num / den;
  }
  ```

#### **2.2 二项式定理**

- **二项式定理**：
  \[
  (a + b)^n = \sum_{k=0}^{n} C(n, k) \cdot a^{n-k} \cdot b^k
  \]
  用于扩展二项式表达式。这个定理在计算多个项的和时非常有用。

---

### **3. 数位动态规划技巧**

#### **3.1 数位DP（Digit DP）**

- **数位DP** 通常用于求解一类问题，比如计算在某个区间内满足特定条件的数字个数。它的核心思想是，逐位分析数字的每一位，动态地判断能否满足某个条件。

#### **3.2 示例：计算不包含 4 的数字**

- 假设我们需要计算在 1 到 N 范围内，所有不包含数字 4 的整数。

  1. **状态定义**：dp[i][j] 表示当前数字的第 i 位已经处理完，且是否严格小于 N。
  2. **状态转移**：逐位判断数字是否包含 4。

  **JavaScript 示例**：

  ```javascript
  function countWithoutFour(N) {
    let digits = String(N).split('').map(Number);
    let n = digits.length;
    let dp = Array(n + 1).fill().map(() => Array(2).fill(-1));

    function dfs(pos, smaller, leadingZero) {
      if (pos === n) return 1;
      if (dp[pos][smaller] !== -1) return dp[pos][smaller];

      let limit = smaller ? 9 : digits[pos];
      let result = 0;

      for (let i = leadingZero ? 0 : 1; i <= limit; i++) {
        if (i === 4) continue; // 排除包含4的数字
        result += dfs(pos + 1, smaller || i < digits[pos], false);
      }

      return dp[pos][smaller] = result;
    }

    return dfs(0, false, true);
  }
  ```

---

### **4. 其他技巧**

#### **4.1 模拟与贪心**

- **贪心算法**：在某些问题中，我们可以通过局部最优选择来得到全局最优解。贪心算法通常适用于那些满足**最优子结构**的问题。

#### **4.2 排序与二分查找**

- **二分查找**：在排序数组中进行查找时，可以使用二分查找算法，减少查找时间到 O(log n)。
  
  **JavaScript 示例**：
  
  ```javascript
  function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) return mid;
      else if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1; // 未找到
  }
  ```

---

## **总结**

数学技巧在算法设计中起着至关重要的作用，尤其在解题时，它们能够帮助我们设计出更高效的解决方案。掌握这些数学技巧不仅有助于算法的优化，还能提高对问题的理解，帮助我们在面临复杂问题时快速找到解决方法。
