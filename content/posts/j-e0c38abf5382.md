---
title: "JavaScript数组笔记3：ES5中新增Array方法（二）"
date: 2017-06-18
slug_jianshu: e0c38abf5382
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/e0c38abf5382"
source_kind: jianshu
---
#### 3、some、every

> some : some() 方法测试数组中的某些元素是否通过由提供的函数实现的测试

**语法：** `arr.some(callback[, thisArg])`

some 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”（即可转换为布尔值 true 的值）。如果找到了这样一个值，some 将会立即返回 true。否则，some 返回 false

**_demo_**

```
function isBigEnough(element, index, array) {
  return  element >= 10;
}

var pass1 = [2, 5, 8, 1, 4].some(isBigEnough);
var pass2 = [12, 5, 8, 1, 4].some(isBigEnough);

console.log(pass1)      //false
console.log(pass2)      //true
```

> every: every() 方法测试数组的所有元素是否都通过了指定函数的测试。

**语法：** `arr.some(callback[, thisArg])`

every 方法为数组中的每个元素执行一次 callback 函数，直到它找到一个使 callback 返回 false（表示可转换为布尔值 false 的值）的元素。如果发现了一个这样的元素，every 方法将会立即返回 false。否则，callback 为每一个元素返回 true，every 就会返回 true。

**_demo_**

```
function isBigEnough(element, index, array) {
  return  element >= 10;
}

var pass1 = [12, 15, 8, 11, 4].every(isBigEnough);
var pass2 = [12, 15, 18, 11, 14].every(isBigEnough);

console.log(pass1)      //false
console.log(pass2)      //true
```

#### 4、indexOf、lastIndexOf

> indexOf()方法返回在数组中可以找到一个给定元素的第一个索引，**如果不存在，则返回-1。**

**语法：** `arr.indexOf(searchElement[, fromIndex = 0])`

-   searchElement ： 要查找的元素
-   fromIndex： 可选参数，开始查找的位置

**_demo1:找出指定元素出现的所有位置_**

```
var arr = ['a','b','a', 'c', 'a', 'd']
var element = 'a'
var index = arr.indexOf(element)

var indices = []
while( index!=-1 ) {
  indices.push(index);
  index = arr.indexOf(element,index+1)
}

console.log(indices);  //[0,2,4]
```

lastIndexOf和indexOf类似，只不过是从后面开始索引，详细可参考MDN的[lastIndexOf](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)

#### 4、reduce、reduceRight

> reduce： reduce() 方法对累加器和数组中的每个元素 (从左到右)应用一个函数，将其“减少”为单个值，其实功能更接近于“迭代、递归”

**语法：** `arr.reduce(callback,[initialValue])`

callback包含四个参数

-   accumulator  
    上一次调用回调返回的值，或者是提供的初始值（initialValue）
-   currentValue  
    数组中正在处理的元素
-   currentIndex  
    数据中正在处理的元素索引，如果提供了 initialValue ，从0开始；否则从1开始
-   array  
    调用 reduce 的数组

initialValue为可选参数，其值用于第一次调用 callback 的第一个参数

## 如何调用：

reduce 为数组中的每一个元素依次执行回调函数，回调函数callback第一次执行时，accumulator 和 currentValue 的取值有两种情况：  
1、调用 reduce 时提供initialValue，accumulator 取值为 initialValue ，currentValue 取数组中的第一个值；  
2、没有提供 initialValue ，accumulator 取数组中的第一个值，currentValue 取数组中的第二个值。

**demo1:一个简单的例子**

```
var arr= [0,1,2,3,4]
var a = arr.reduce(function(accumulator, currentValue, currentIndex, array){
  return accumulator + currentValue;
});

console.log(a)      //10
```

callback 被调用四次,其每次调用各参数的取值和返回值如下：

callback调用拆解分析

**demo2:二维数组的扁平化**

```
var matrix = [
  [1, 2],
  [3, 4],
  [5, 6]
];

var flat = matrix.reduce(function(a,b)  {
  return a.concat(b)
});

console.log(flat);       //output : [1, 2, 3, 4, 5, 6]
```

> reduceRight于reduce相比，用法类似`array.reduceRight(callback[, initialValue])`,差异在于reduceRight是从数组的末尾开始实现,更多可参考MDN的[reduceRight](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)

#### 5、进一步的应用

可以将数组的这些方法应用到其他对象上，这里举一个forEach遍历DOM元素的例子

```
var ele = document.querySelectorAll('div');
//这里相当于借用了Array.prototype.forEach方法
Array.prototype.forEach.call(ele  function(div) {
    console.log("该div类名是：" + (div.className || "空"));
});
```

这些我们可以拓展我们平时遇到的一些类数组都可以通过这样的原理来赋予其数组的方法，哇JavaScript是不是很灵活、很强大

参考链接：[MDN标准](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)、[张鑫旭的文章](https://link.jianshu.com?t=http://www.zhangxinxu.com/wordpress/2013/04/es5%E6%96%B0%E5%A2%9E%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95/#foreach)
