---
outline: deep
---


# 二分查找

## 二分法难点

1. 开闭区间：`left < right`，`left ≤ right`判断

一般情况下，`left=0`，但是`right`可以取`n`或者`n-1`，`mid`取离`left`近的值。

- 如果`right = n - 1`，`right`可能是`target`，所以为了保证`left = right`，循环条件为`left ≤ right`
- 如果`right = n`，循环条件取`left < right`即可

1. `mid+1`, `mid`判断

判断原则：`mid`有没有被判断过，用过就是`mid+1`（对于`right`来说是`mid-1`，前进或者后退一个位置）

## 示例

二分搜索的原型就是在「**有序数组**」中搜索一个元素 `target`，返回该元素对应的索引。

如果「**有序数组**」中存在多个 `target` 元素，那么这些元素肯定挨在一起，这里就涉及到算法应该返回最左侧的那个 `target` 元素的索引还是最右侧的那个 `target` 元素的索引，也就是所谓的「搜索左侧边界」和「搜索右侧边界」。

```jsx
var search = function(nums, target) {
    let left = 0, right = nums.length
    while(left <= right){
        let mid = left + Math.floor((right - left)/2)
        if(nums[mid] === target){
            return mid
        }else if(nums[mid] < target){
            left = mid + 1
        }else{
            right = mid - 1
        }
    }
    return -1
}
const getLeftBound = (nums,  target)=>{
    let left = 0, right = nums.length-1
    while(left <= right){
        let mid = left + Math.floor((right - left)/2)
        if(nums[mid] === target){
            // 收紧右侧范围
            right = mid - 1
        }else if(nums[mid] < target){
            left = mid + 1
        }else{
            right = mid -1
        }
    }
    // 跳出循环后，right + 1对应的位置是目标值的下标，
    // 但是可能跳出循环的时候并没有找到目标值，right+1 值不在[0,nums.length-1]之间
    if(right + 1 >= nums.length) return -1
    return nums[right+1] === target ? right + 1 : -1

}
const getRightBound = (nums,  target)=>{
    let left = 0, right = nums.length-1
    while(left <= right){
        let mid = left + Math.floor((right - left)/2)
        if(nums[mid] === target){
            // 收紧左侧范围
            left = mid + 1
        }else if(nums[mid] < target){
            left = mid + 1
        }else{
            right = mid -1
        }
    }
    // 跳出循环后，left - 1对应的位置是目标值的下标，
    // 但是可能跳出循环的时候并没有找到目标值
    if(left-1 < 0) return -1
    return nums[left-1] === target ? left - 1 : -1
}

```
