---
title: "防抖"
date: 2021-01-01
tags: ["性能优化"]
---

防抖&节流函数在日常使用的场景还是有不少的，其实节流和防抖本质上都是一种高阶函数的运用，都是通过将一个关键的外部变量保存在外层作用域，通过对这个变量的判断和操作来决定是否使用回调函数(闭包)。先从防抖开始吧

防抖函数：你尽管去触发事件，但是我在事件触发n秒后才执行，如果一个事件触发的n秒内又触发了这个事件，那么我就以新的事件事件为基础，n秒后执行；总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行。

### 简单版本实现

实现如下：

```javascript
/**
 * @param {function} fun 调用函数
 * @param {number} delay 延迟调用时间
*/
function debounce(func, wait) {
    var timeout
    return function() {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait)
    }
}

// 以点击事件为例子
let count = 1
function getUserAction() {
    count += 1
    console.log(count)
}
div.onclick = debounce(getUserAction, 1000)
```

### 添加this和event的处理

如果我们在getUserAction中使用this

```javascript
function debounce(func, wait) {
    var timeout
    return function(){
        var context = this
        var args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait)
    }
}
```

参考文章：https://github.com/mqyqingfeng/Blog/issues/22
