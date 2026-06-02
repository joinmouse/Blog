---
title: "异步"
date: 2017-08-15
slug_jianshu: e7cc38a43ba1
tags: []
state: open
source: "https://www.jianshu.com/p/e7cc38a43ba1"
source_kind: jianshu
---
异步加载在前端中是一个很常见套路""，可以说不理解它也就很难真正的学好前端，但同时它在我们生活中也随处可见。比如我点一个外卖，然后在这里写文章，半小时后外卖小哥给我打电话说外卖到了，不需要为了等外卖而在那里等半个小时，只是到了后通知我，这就是异步啊！

#### 1、从setTimeout说起

其实setTimeout并不是JavaScript语言里面的，而是浏览器window下的一个API，就是一个定时器，下面我们看一段运行代码

```
console.log("hello")

setTimeout(function(){
  console.log("什么时候打印了？")
},0)

console.log("1")
console.log("2")
console.log("3")
console.log("4")
console.log("5")
```

运行结果：

console结果

这里可以看到，即使我们设置定时器的时间为0，当执行时会有一个挂起的过程（异步），不会影响下面顺序的执行，最后再执行输出。

### 2、setTimeOut()模拟setInterval()

我们知道setTimeOut()和setInterval() 的区别是，前者只在设定的时间后执行一次，而后者会在时间间隔中一直执行。下面我们来看是如何使用setTimeOut()来模拟执行setInterval() 的

```
setTimeout(function look(){
  var date = new Date()
  console.log(date)
  setTimeout(look,1000)    //look表示look函数，而look()是对函数的调用
},1000)
```

运行的结果如下：

运行结果...

### 3、最经典的异步应用:Ajax

对前端稍微有点熟悉的都知道Ajax作为前端领域中重要的一笔，具体的大家相信可以去参考各种文档或博客，我这里还是直接写demo来说明ajax的异步请求

```
  <button>click me</button>

  <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
  <script>
    $('button').on('click',function(){
        console.log('hello')
        $.get('http://api.jirengu.com/fm/getChannels.php')    //以get请求方式调用的API
        .done(function(res){
            console.log(res)
        });

        console.log("world")
    })
  </script>  
```

运行结果

console运行结果

当点击button的时候，其实我们可以发现这个例子和最开始的setTimeout有点相似，同样这里的$.get()请求就是一个异步，并不会等待请求的数据回来之后再去执行 `console.log("world")`

### 4、异步

最后我们回到最开始的地方，那么到底什么是异步了，其实这个真的很难给一个具体的定义，想想开头举的那个点外卖的例子，我们可以发现在生活中我们大部分时候就是用异步的思维来处理各种事情的啊！或许无法给一个通俗而准确的定义异步，但我相信当你看到一个使用场景，就可以立刻判断那是不是异步了，因为异步本都是我们生活中熟悉的逻辑 。
