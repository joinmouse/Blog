---
title: "模拟call/apply"
date: 2021-01-01
tags: ["JS深入浅出"]
---

其实call和apply我们用的还挺多的，它们可以去改变this的指向(依据传入的第一个参数)，先从模拟call开始，模拟前可以先看下mdn文档上的 [Function.prototype.call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 说明

## 1、模拟call的简单版本

还是先从一个例子开始看起

```javascript
var foo = {
    value: 1
};
function bar() {
    console.log(this.value)
}

bar()  // undefined
bar.call(foo); // 1
```

上面中使用call改变了this的指向，且bar执行了

如果我们将上面的函数改造一下

```javascript
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
}
foo.bar()  //1
```

此时this指向了foo。依据这个思路我们可以做如下的模拟：
1、将函数设置为对象的属性  //foo.fn = bar
2、执行该函数  //foo.fn()
3、删除该函数(毕竟我们是模拟的，最上面的原始对象foo是木有的嘛) //delete foo.fn

按照这个思路，我们就可以写出如下的代码

```javascript
Function.prototype.myCall = function(context) {
    //1、获取到外面的调用函数，我们可以通过this
    context.fn = this
    //2、执行该函数
    context.fn()
    //3、删除context对象上的属性
    delete context.fn
}

// 测试代码
var foo = {
    value: 1
};
function bar() {
    console.log(this.value);
}
bar.call(foo) // 1
bar.myCall(foo) // 1
```

## 2、考虑传参的处理

先看看使用call传参的情况

```javascript
var foo = {
    value: 1
};
function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call(foo, 'kevin', 18);
```

对于传入的参数，其实我们可以通过对arguments来取第2个到最后一个参数即可

```javascript
// 对参数的处理如下：
var params = [];
for(var i = 1, i < arguments.length; i++) {
    params[i-1] = arguments[i]
}

// 接下来就是考虑将这个params传入到context.func中去执行, 可以利用es6的拓展运算符
context.func(...params)

// es6太新了，模拟这个我们还可以用到eval函数去执行，这里params会自动调用toString这个方法
eval('context.fn(' + params +')')

// 完整版如下
Function.prototype.myCall = function(context) {
    // 1、将外部的函数赋值给属性fn
    context.fn = this
    // 2、处理参数
    var params = [];
    for(var i = 1; i < arguments.length; i++) {
        params.push('arguments[' + i + ']')
    }
    // 3、执行fn, 自动调用toString方法
    console.log(params.toString())
    eval('context.fn(' + params +')')
}
```

## 3、考虑函数return和this传入的参数可能是null

```javascript
// 完整版如下
Function.prototype.myCall = function(context) {
    let context = context || window
    // 1、将外部的函数赋值给属性fn
    context.fn = this
    // 2、处理参数
    var params = [];
    for(var i = 1; i < arguments.length; i++) {
        params.push('arguments[' + i + ']')
    }
    // 3、执行fn, 自动调用toString方法
    console.log(params.toString())
    let result = eval('context.fn(' + params +')')
    // 4、删除属性,return返回值
    delete context.fn
    return result
}
```

## 4、apply的模拟实现

整体的思路基本都是一样的

```javascript
Function.prototype.myApply = function (context, arr) {
    let context = context || window
    arr = arr || []
    context.fn = this
    var params = []
    for (var i=0; i < arr.length; i++) {
       params.push('arr[' + i + ']')
    }
    let res = eval('context.fn(' + args + ')')
    delete context.fn
    return res
}
```

参考：
https://github.com/mqyqingfeng/Blog/issues/11
https://juejin.cn/post/6844904078871363592
