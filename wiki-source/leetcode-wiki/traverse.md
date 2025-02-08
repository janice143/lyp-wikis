---
outline: deep
---
# 回溯

## 内容

**回溯算法是在遍历「树枝」，DFS 算法是在遍历「节点」。**

解决一个回溯问题，实际上就是一个决策树的遍历过程，站在回溯树的一个节点上，你只需要思考 3 个问题：

1、路径：也就是已经做出的选择。

2、选择列表：也就是你当前可以做的选择。

3、结束条件：也就是到达决策树底层，无法再做选择的条件。

伪代码

```jsx
result = []
def backtrack(路径, 选择列表):
    if 满足结束条件:
        result.add(路径)
        return
    
    for 选择 in 选择列表:
        做选择
        backtrack(路径, 选择列表)
        撤销选择
```

## 应用场景

全排列、N皇后

说到底就是回溯可以解决三种问题：排列、组合、子集问题，其中**组合问题和子集问题其实是等价的。这三种问题，无非是在这两棵树上剪掉或者增加一些树枝罢了**

## 排列、组合、子集问题的一些形式

### 元素不重复

#### 1. **子集**

比如输入 `nums = [1,2,3]`，算法应该返回如下子集：`[ [],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3] ]`

代码核心在于：使用 `start` 参数控制树枝的生长避免产生重复的子集。

```jsx
var subsets = function(nums) {
    const res = [], n = nums.length
    const backtrack = (path, start)=>{
        res.push([...path])

        for(let i=start;i<n;i++){
            path.push(nums[i])
            backtrack(path,i+1)
            path.pop()
        }
    }
    backtrack([],0)
    return res
};
```

#### 2. **组合**

给定两个整数 `n` 和 `k`，返回范围 `[1, n]` 中所有可能的 `k` 个数的组合。

比如 `combine(3, 2)` 的返回值应该是：`[ [1,2],[1,3],[2,3] ]`

本质就是长度为k的子集问题。

```jsx
var combine = function(n, k) {
    const res = []
    const backtrack = (path, start)=>{
        if(path.length === k){
            res.push([...path])
            return
        }

        for(let i=start;i<=n;i++){
            path.push(i)
            // 从i+1开始遍历，防止重复使用前面的数字
            backtrack(path,i+1)
            path.pop()
        }
    }
    backtrack([],1)
    return res
};
```

#### 3. **排列**

典型就是全排列问题

```jsx
var permute = function(nums) {
    const res = [], n = nums.length
    const visited = new Array(n).fill(0)
    const backtrack = (path)=>{
        if(path.length === n){
            res.push([...path])
            return
        }

        for(let i=0;i<n;i++){
            if(visited[i] === 0){
                visited[i] = 1
                path.push(nums[i])
                // 从i+1开始遍历，防止重复使用前面的数字
                backtrack(path)
                path.pop()
                visited[i] = 0
            
            
        }
    }
    // 这里不适用start参数，因为全排列问题和子集问题不同，子集问题
    // 可以使用start来保证nums[i] 之后只出现nums[i+1...]的元素，不会出现之前的元素
    // 所以就会避免重复
    // 全排列问题，使用nums[i]之后，也可以出现之前的数组
    backtrack([])
    return res
};
```

### 元素重复

1. 对 `nums` 进行了排序。
2. 添加了一句额外的剪枝逻辑。

**需要先进行排序，让相同的元素靠在一起，如果发现 `nums[i] == nums[i-1]`，则跳过**

#### 1. **子集/组合**

```jsx
var subsetsWithDup = function(nums) {
    const res = [], n = nums.length
    nums.sort((a,b)=>a-b)
    const backtrack = (path, start)=>{
        res.push([...path])

        for(let i=start;i<n;i++){
            // 剪枝，值相邻且相同，只遍历第一条
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            path.push(nums[i])
            backtrack(path,i+1)
            path.pop()
        }
    }
    backtrack([],0)
    return res
};
```

#### 2. 排列

```jsx
var permuteUnique = function(nums) {
    const res = [], n = nums.length
    const visited = new Array(n).fill(0)
    nums.sort((a,b)=>a-b)

    const backtrack = (path)=>{
        if(path.length === n){
            res.push([...path])
            return
        }

        for(let i=0;i<n;i++){
            if(i > 0 && nums[i] === nums[i-1] && visited[i-1] === 0) continue
            if(visited[i] === 0){
                visited[i] = 1
                path.push(nums[i])
                // 从i+1开始遍历，防止重复使用前面的数字
                backtrack(path)
                path.pop()
                visited[i] = 0
            }
            
        }
    }
    backtrack([])
    return res
};
```

## 总结

**形式一、元素无重不可复选，即 `nums` 中的元素都是唯一的，每个元素最多只能被使用一次**，`backtrack` 核心代码如下：

```jsx
/* 组合/子集问题回溯算法框架 */
void backtrack(int[] nums, int start) {
    // 回溯算法标准框架
    for (int i = start; i < nums.length; i++) {
        // 做选择
        track.addLast(nums[i]);
        // 注意参数
        backtrack(nums, i + 1);
        // 撤销选择
        track.removeLast();
    }
}

/* 排列问题回溯算法框架 */
void backtrack(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        // 剪枝逻辑
        if (used[i]) {
            continue;
        }
        // 做选择
        used[i] = true;
        track.addLast(nums[i]);

        backtrack(nums);
        // 撤销选择
        track.removeLast();
        used[i] = false;
    }
}
```

**形式二、元素可重不可复选，即 `nums` 中的元素可以存在重复，每个元素最多只能被使用一次**，其关键在于排序和剪枝，`backtrack` 核心代码如下：

```jsx
Arrays.sort(nums);
/* 组合/子集问题回溯算法框架 */
void backtrack(int[] nums, int start) {
    // 回溯算法标准框架
    for (int i = start; i < nums.length; i++) {
        // 剪枝逻辑，跳过值相同的相邻树枝
        if (i > start && nums[i] == nums[i - 1]) {
            continue;
        }
        // 做选择
        track.addLast(nums[i]);
        // 注意参数
        backtrack(nums, i + 1);
        // 撤销选择
        track.removeLast();
    }
}

Arrays.sort(nums);
/* 排列问题回溯算法框架 */
void backtrack(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        // 剪枝逻辑
        if (used[i]) {
            continue;
        }
        // 剪枝逻辑，固定相同的元素在排列中的相对位置
        if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) {
            continue;
        }
        // 做选择
        used[i] = true;
        track.addLast(nums[i]);

        backtrack(nums);
        // 撤销选择
        track.removeLast();
        used[i] = false;
    }
}
```

**形式三、元素无重可复选，即 `nums` 中的元素都是唯一的，每个元素可以被使用若干次**，只要删掉去重逻辑即可，`backtrack` 核心代码如下：

```jsx
/* 组合/子集问题回溯算法框架 */
void backtrack(int[] nums, int start) {
    // 回溯算法标准框架
    for (int i = start; i < nums.length; i++) {
        // 做选择
        track.addLast(nums[i]);
        // 注意参数
        backtrack(nums, i);
        // 撤销选择
        track.removeLast();
    }
}

/* 排列问题回溯算法框架 */
void backtrack(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        // 做选择
        track.addLast(nums[i]);
        backtrack(nums);
        // 撤销选择
        track.removeLast();
    }
}
```
