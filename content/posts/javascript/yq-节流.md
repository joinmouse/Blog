---
title: "节流"
date: 2021-01-01
tags: ["性能优化"]
---

节流原理：如果持续的触发事件，每隔一段时间，只执行一次事件。一般有两种实现方式：使用时间戳，设置定时器

### 时间戳实现

时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳，如果大于设置的时间周期就执行函数；然后更新时间为当前时间戳，若小于就不执行。

```javascript
function throttle(func, wait) {
    var previous = 0
    return function() {
        var now = new Date()
        var context = this
        var args = arguments
        if(now - previous > wait) {
            func.apply(context, args)
            previous = now
        }
    }
}

// 以点击事件为例子
let count = 1
function getUserAction() {
    count += 1
    console.log(count)
}
div.onclick = throttle(getUserAction, 1000)
```

### 定时器实现

当触发事件的时候，我们就去设置一个定时器，再次触发事件的时候，如果定时器存在，就不执行，直到定时器执行；然后执行函数，清空定时器

```javascript
function throttle(func, wait) {
    var timeout
    var previous = 0
    return function() {
        var context = this
        var args = arguments
        if(!timeout) {
            timeout = setTimeout(function(){
                time = null;
                fn.apply(context, args)
            }, wait)
        }
    }
}
```
