---
title: "基本的数据结构 Array、HashMap 与 List(上)"
date: 2018-07-05
slug_jianshu: ebfac7847189
tags: ["数据结构"]
state: open
source: "https://www.jianshu.com/p/ebfac7847189"
source_kind: jianshu
---
### Array

#### 1、常用的JS数组内置函数

```
array.push(element1[, …[, elementN]])  
将一个或多个元素添加到末尾
时间复杂度: O(1)

array.pop()
移除数组末尾的元素
时间复杂度: O(1)

array.shift()
移除数组开头的元素
时间复杂度: O(n)

array.unshift(element1[, …[, elementN]])
将一个元素或多个与元素添加到数组开头
时间复杂度: O(n)

array.slice([beginning[,end]])
返回浅拷贝原数组从 beginning 到 end（不包括 end）部分组成的新数组
时间复杂度: O(n)

array.splice(start[, deleteCount[, item1[,…]]])
改变数组(插入或删除)
时间复杂度: O(n)
```

#### 2、使用数组实现增删改查

在数组中删除元素  
第一种: 在数组的末尾删除元素所需时间是恒定的，也就是 O(1).  
第二种: 从数组的开头或是中间位置删除元素，你都需要调整（删除元素后面的）元素位置。因此复杂度为 O(n).

```
function remove(array, element) {
  const index = s
}
```
