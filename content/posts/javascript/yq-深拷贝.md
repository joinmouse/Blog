---
title: "深拷贝"
date: 2021-01-01
tags: ["JS深入浅出"]
---

## 一、从一个例子说起

```javascript
let a = {
    age: 1
}
let b = a
a.age = 2
console.log(b.age) // 2
```

这个例子中，当一个变量赋值给一个对象的时候，相当于将a的引用(地址)赋值给了b，因此当a.age改变的时候，b.age也会发生改变，但是有时候我们并不想这样。使用浅拷贝就可以解决这个问题

## 二、浅拷贝 | Object.assign

浅拷贝我们可以通过 Object.assign 来实现一个浅拷贝

```javascript
let a = {
    age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

这里当我们改变a.age的时候，可以发现b.age还是当前拷的值。通常浅拷贝就能解决上面的问题了，但是当我们遇到接口返回的数据层级比较深的时候，还想去复制一份的话，浅拷贝就会不够用

```javascript
let a = {
    age: 1,
    jobs: {
        city: 'wuhan'
    }
}
let b = Object.assign({}, a)
a.jobs.city = 'hangzhou'
console.log(b.jobs.city) // hangzhou
```

运行上面的代码，我们发现当我们更改a.jobs.city的时候，b.jobs.city的值也发生改变了，这并不是我们所期待的了。 浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们就需要引入深拷贝了

## 三、非完整深拷贝| JSON.parse(JSON.stringify(object))

这里我们可以使用 JSON.parse(JSON.stringify(object))来实现，实现逻辑是将JSON.stringify先将对象转换为非引用类型(即字符串类型），然后在做解析

```javascript
let a = {
    age: 1,
    jobs: {
        city: 'wuhan'
    }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.city = 'hangzhou'
console.log(b.jobs.city) // wuhan
```

JSON.parse() 和 JSON.stringify() 能正确处理的对象只有 Number、String、Array 等能够被 json 表示的数据结构，因此该方法有以下的局限：
- 会忽略 undefined
- 会忽略 symbol
- 不能处理正则类型
- 不能序列化函数
- 不能解决循环引用的对象

```javascript
let a = {
    age: undefined,
    sex: Symbol('male'),
    jobs: function() {},
    name: 'yck'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "yck"}
```

大部分情况该深拷贝的方式还是可以覆盖掉问题的，若实在遇到以上的几种问题，可以考虑使用完全版本的深克隆

## 四、完全体深克隆

```javascript
class DeepCloner {
    // 初始化一个cache用作缓存
    constructor() {
        this.cache = new Map()
    }
    clone(source) {
        // 判断是否为对象
        if (source instanceof Object) {
            // 是否缓存中存在该source对象，避免成环
            let cachedDist = this.findCache(source)
            if (cachedDist) return cachedDist
            // 不存在的情况下分别判断source子类型：Array、Function、RegExp、Date
            let dist  // copy的source对象
            if (source instanceof Array) {
                dist = new Array()
            } else if (source instanceof Function) {
                dist = function() {
                    return source.apply(this, arguments)
                }
            } else if (source instanceof RegExp) {
                dist = new RegExp(source.source, source.flags)
            }
        }
    }
}
```

参考链接：
https://segmentfault.com/a/1190000016672263
https://github.com/FrankFang/deepClone/blob/master/src/index.js
