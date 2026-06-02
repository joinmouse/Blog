---
title: "Promise是什么?"
date: 2017-09-17
slug_jianshu: b5d6ddb2196e
tags: []
state: open
source: "https://www.jianshu.com/p/b5d6ddb2196e"
source_kind: jianshu
---
window.Promise已经是作为JS的一个内置对象了，其存在的主要目的就是JavaScript异步操作解决的方案

## 1、Promise之前

这里我们假设使用getUser来获取用户数据，它接受两个回调succuessCallback和errorCallback

```
function getUser(successCallback,errorCallback) {
  $ajax.({
    url: '/user',
    success: function(res){
      successCallback(res)
    },
    error: function(err){
      errorCallback(err)  
    }
  })
}
```

这个看起来和合理的ajax请求，但当我们发现请求过多的时候展示起来逻辑就很混乱了

## 2、promise提供的解决方法

```
var promise = getUser()
promise.then(successCallback, errorCallback)
```

当我们想要在请求成功之后做更多的事情，可以这样使用  
`promise.then(success1).then(success2).then(success3)`  
这样当请求成功的时候会依次执行success1、success2、success3

更多参考链接：[http://www.ituring.com.cn/article/66566](https://link.jianshu.com?t=http://www.ituring.com.cn/article/66566)  
[http://javascript.ruanyifeng.com/advanced/promise.html#toc0](https://link.jianshu.com?t=http://javascript.ruanyifeng.com/advanced/promise.html#toc0)
