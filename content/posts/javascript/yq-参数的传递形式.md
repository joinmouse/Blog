---
title: "参数的传递形式"
date: 2021-01-01
tags: ["JS深入浅出"]
---

首先需要明确的Promise本质上还是基于回调函数的
优点：可以解决异步嵌套问题、可以解决多个异步并发问题
缺点：promise无法终止异步

## 一、Promise介绍

1、Promise存在三种状态
- pending - 进行中
- fulfilled - 成功
- rejected - 失败

依据Promise A+标准：只能从pending状态到成功/失败状态，且不可逆

2、每个Promise的实例都有一个then方法

```javascript
let promise = new Promise((resolve, reject) => {
    resolve('hello')
}).then(data => { // 成功
    console.log(data)  // 'hello'
}, err => {  // 失败
    console.log('err', err)
})
```

3、若new Promise的时候，报错了也会变为失败状态(即抛错算失败)

```javascript
let promise = new Promise((resolve, reject) => {
    throw new Error('失败')
    resolve('hello')
}).then(data => { // 成功
    console.log(data)
}, err => {  // 失败
    console.log('err', err)
})
```

4、then的用法，处理异步

```javascript
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello')
    }, 1000)
}).then(data => { // 成功
    console.log(data)
}, err => {  // 失败
    console.log('err', err)
})
```

## 二、实现一个满足上面功能的Promise

```javascript
const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECTED = 'REJECTED'

class myPromise {
    constructor(executor) {
        this.state = PENDING  // 默认是pending状态
        this.result = undefined
        this.reason = undefined

        this.onReolvedCallbacks = []  //成功回调的数组
        this.onRejectedCallbacks = []  //失败回调的数组

        // pending状态下才可以去改值
        let resolve = (result) => {
            if(this.state === PENDING) {
                this.state = RESOLVE
                this.result = result
                this.onReolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if(this.state === PENDING) {
                this.state = REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
    }
}
```

## 三、实现一个可通过PromiseA+规范的myPromise

coding如下： https://github.com/joinmouse/myPromise
