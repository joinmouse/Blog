---
title: "JavaScript 异步编程 (): Promise"
date: 2020-10-15
tags: ["语雀"]
source_kind: yuque
---

在上一篇文章中我们说到了微任务并以Promise做了一些演示，现在浏览器很多新加的API都是建立在
Promise之上，新的前端框架也大量的使用Promise，那么这篇文章就会重点的写下Promise。
学习一门新技术，最好的方式是了解这门技术是如何诞生的，以及它所解决的问题是什么。了解了这些
之后，我们才可能抓住这门技术的本质。那么JavaScript引入Promise的动机是什么呢？⼜解决了什么
问题呢？
首先说下结论：Promise解决了异步编码风格的问题，避免写出回调地狱式风格的代码。
在一段请求中我们重点关注输入内容(请求信息)和输出内容(响应信息)，基本的抽象流程可以如下图所示
具体代码的如下：1、异步编程的问题：回调地狱

212封装请求信息如下：
我们来封装后的请求我们可以如何使用：//request 输入
function  makeRequest (request_url ) {
    let request = {
        method: 'Get',
        url: request_url ,
        headers: '',
        body: '',
        credentials : false,
        sync: true,
        responseType : 'text',
        referrer : ''
    }
    return request
}1
JavaScript
//[in] request ，请求信息，请求头，延时值，返回类型等
//[out] resolve, 执行成功，回调该函数
//[out] reject  执行失败，回调该函数
function  XFetch(request, resolve, reject) {
    let xhr = new XMLHttpRequest ()
    xhr.ontimeout  = function  (e) { reject(e) }
    xhr.onerror = function  (e) { reject(e) }
    xhr.onreadystatechange  = function  () {
        if (xhr.status = 200)
            resolve(xhr.response )
    }
    xhr.open(request.method, URL, request.sync);
    xhr.timeout = request.timeout;
    xhr.responseType  = request.responseType ;
    // 补充其他请求信息
    //...
    xhr.send();
}1
JavaScript

213经过封装后的函数中我们这里主要传入3个参数就好了：一个请求信息、一个成功回调函数和一个失败
的回调函数
其实上面的代码已经封装的很好了，但是如果我们面对的是一个比较复杂的项目，嵌套了3层的回调会
发生什么呢？
这段代码是先请求 time.geekbang.org/?category //[in] request ，请求信息，请求头，延时值，返回类型等
//[out] resolve, 执行成功，回调该函数
//[out] reject  执行失败，回调该函数
XFetch(
  makeRequest ('https://time.geekbang.org' ),
    function  resolve(data) {
        console.log(data)
    }, function  reject(e) {
        console.log(e)
    }
)1
JavaScript
XFetch(
  makeRequest ('https://time.geekbang.org/?category' ),
      function  resolve(response ) {
          console.log(response )
          XFetch(makeRequest ('https://time.geekbang.org/column' ),
              function  resolve(response ) {
                  console.log(response )
                  XFetch(makeRequest ('https://time.geekbang.org' )
                      function  resolve(response ) {
                          console.log(response )
                      }, function  reject(e) {
                          console.log(e)
                      })
              }, function  reject(e) {
                  console.log(e)
              })
      }, function  reject(e) {
          console.log(e)
      }
 )1
JavaScript

214如果请求成功的话，那么再请求 time.geekbang.org/column 
如果再次请求成功的话，就继续请求 time.geekbang.org 
这段代码用了三层嵌套请求，就已经让代码变得非常混乱了，让开发者很难去维护这样的代码，我们把
这种现象称之为回调地狱。
这段代码看起来很难维护主要原因有这样两个点：
第一是嵌套调用，下面的任务依赖上个任务的请求结果，并在上个任务的回调函数内部执行新的业
务逻辑，这样当嵌套层次多了之后，代码的可读性就变得非常差了
第二是任务的不确定性，执行每个任务都有两种可能的结果（成功或者失败），所以体现在代码中
就需要对每个任务的执行结果做两次判断，这种对每个任务都要进行一次额外的错误处理的方式，
明显增加了代码的混乱程度
解决上面的问题的方案是：消灭嵌套调用以及合并多个任务的错误处理
实际上Promise就是这么去做的
使用Promise重构上面的XFetch的封装请求代码2、如何解决回调地狱的问题
- 
- 
3、Promise：消灭嵌套调用和多次错误处理

215接下来用XFetch改造上面的流程：
通过上面的代码，我们观察霞Promise的执行机制function  XFetch(request) {
  function  executor (resolve, reject) {
      let xhr = new XMLHttpRequest ()
      xhr.open('GET', request.url, true)
      xhr.ontimeout  = function  (e) { reject(e) }
      xhr.onerror = function  (e) { reject(e) }
      xhr.onreadystatechange  = function  () {
          if (this.readyState  === 4) {
              if (this.status === 200) {
                  resolve(this.responseText , this)
              } else {
                  let error = {
                      code: this.status,
                      response : this.response
                  }
                  reject(error, this)
              }
          }
      }
      xhr.send()
  }
  return new Promise(executor )
}1
JavaScript
var x1 = XFetch(makeRequest ('https://time.geekbang.org/?category' ))
var x2 = x1.then(value => {
    console.log(value)
    return XFetch(makeRequest ('https://www.geekbang.org/column' ))
})
var x3 = x2.then(value => {
    console.log(value)
    return XFetch(makeRequest ('https://time.geekbang.org' ))
})
x3.catch(error => {
    console.log(error)
})1
JavaScript

216引入Promise，在调用XFetch的时候，会返回一个Promise对象
构建 Promise 对象时，需要传入一个executor 函数，XFetch 的主要业务流程都在 executor 函数
中执行
如果运行在excutor函数中的业务都执行成功了，就会调用resolve函数；若执行失败，则取调用
reject函数
在excutor函数中调用resolve函数时，会触发Promise.then设置回调函数；而调用reject函数时，
会触发promise.catch 设置的回调函数
上面的代码非常清晰的帮我们解决了嵌套回调的问题，接下来会具体分析是如何取解决的
回调函数的延时绑定在代码就体现在Promise对象x1，通过Promise的构造函数 executor 来执行业务逻
辑；创建好Promise 对象 x1 后，在使用x1.then 来设置回调函数。
首先执行 new Promise 时，Promise 的构造函数会被执行，不过由于 Promise 是 V8 引擎提供的，所
以暂时看不到 Promise 构造函数的细节。
接下来，Promise 的构造函数会调用 Promise 的参数 executor 函数。然后在executor中执行
resolve，resolve函数也是 V8 内部提供的，那么 resolve 函数到底做了什么呢？●
- 
- 
- 
4、Promise解决嵌套回调
4.1、解决回调函数的延时绑定
// 创建Promise 对象  x1, 并在  executor 函数中执行业务逻辑
function  executor (resolve, reject) {
resolve(100)
}
let x1 = new Promise(executor )
// x1延时绑定回调函数 onResolve
function  onResolve (val) {
console.log(val)
}
x1.then(onResolve )1
JavaScript

217我们知道执行resolve函数会触发x1.then设置的回调函数onResolve，所以可以推测resolve函数内部调
用了通过x1.then设置的onResolve函数，由于 Promise 采用了回调函数延迟绑定技术，所以在执行 
resolve 函数的时候，回调函数还没有绑定，那么只能推迟回调函数的执行。
可以写的有点抽象，接下来我们写一段模拟Promise的代码
观察上面的代码，我们自己实现了自己的构造函数、resolve、then 方法。接下来使用PromiseX来编写
我们的业务代码
执行后报错如下：function  PromiseX (executor ) {
    var onResolve_  = null
    var onReject_  = null
    // 模拟实现  resolve 和  then ，暂不支持  rejcet
    this.then = function  (onResolve , onReject ) {
        onResolve_  = onResolve
    };
    function  resolve(value) {
         // setTimeout(()=>{
            onResolve_ (value)
         // },0)
    }
    executor (resolve, null);
}1
JavaScript
function  executor (resolve, reject) {
    resolve(100)
}
// 将 Promise 改成我们自己的  PromsieX
let x1 = new PromiseX (executor )
 
function  onResolve (value){
    console.log(value)
}
x1.then(onResolve )1
JavaScript

218之所以出现这个错误，是由于 PromiseX 的延迟绑定导致的，在调用到 onResolve_ 函数的时候，
PromiseX.then 还没有执行，所以执行上述代码的时候，当然会报"onResolve_  is not a function"的
错误了。我们可以加入setTimeout改造
采用了定时器来推迟 onResolve 的执行，不过使用定时器的效率并不是太高，好在我们有微任务，所
以 Promise ⼜把这个定时器改造成了微任务了，这样既可以让 onResolve_ 延时被调用，⼜提升了代码
的执行效率。这就是 Promise 中为啥使用微任务了。
我们依据onResolve函数的传入值来决定创建什么类型的Promise任务，创建好的Promise对象需要返回
到最外层，这样就摆脱了嵌套循环的问题4.2、需要将回调函数onResolve的返回值穿透到最外层Uncaught TypeError : onResolve_ is not a function
    at resolve (&lt;anonymous &gt;:10:13)
    at executor  (&lt;anonymous &gt;:17:5)
    at new Bromise (&lt;anonymous &gt;:13:5)
    at &lt;anonymous &gt;:19:121
JavaScript
function  resolve(value) {
  setTimeout (()=>{
    onResolve_ (value)
  },0)
}1
JavaScript

219  Promise 通过回调函数延迟绑定和回调函数返回值穿透的技术，解决了循环嵌套
5、Promise如何处理异常// 创建Promise 对象  x1, 并在  executor 函数中执行业务逻辑
function  executor (resolve, reject) {
resolve(100)
}
let x1 = new Promise(executor )
// x1延时绑定回调函数 onResolve
function  onResolve (val) {
console.log(val)
  let x2 = new Promise((resolve, reject) => {
  resolve(value + 1)
  })
  console.log(v2)
  return x2   //返回的值穿透到函数的最外层
}
let x2 = x1.then(onResolve )
x2.then((value) => {
console.log(x2)
  console.log(value)
})1
JavaScript

220上面这段代码中有4个Promise对象：p0~p4，无论哪个对象里面有异常，都可以通过最后一个p4.catch
来捕获到，通过这种方式可以将Promise对象的错误合并到一个函数中去处理，这样就解决了每个任务
需要单独处理异常的问题。
之所以可以使用最后一个对象来捕获所有异常，是因为 Promise 对象的错误具有"冒泡"性质，会一直向
后传递，直到被 onReject 函数处理或 catch 语句捕获为止。具备了这样的"冒泡"性质，就不需要要在
每个Promise对象中去单独的捕获异常了，这样的好处是消灭了频繁的错误处理，使我们写出来的代码
更加的优雅和符合人的线性思维。
手写Promise源码参考： https://github.com/joinmouse/promise-testfunction  executor (resolve, reject) {
    let rand = Math.random();
    console.log(1)
    console.log(rand)
    if (rand > 0.5)
        resolve()
    else
        reject()
}
var p0 = new Promise(executor );
 
var p1 = p0.then((value) => {
    console.log("succeed-1" )
    return new Promise(executor )
})
 
var p3 = p1.then((value) => {
    console.log("succeed-2" )
    return new Promise(executor )
})
 
var p4 = p3.then((value) => {
    console.log("succeed-3" )
    return new Promise(executor )
})
 
p4.catch((error) => {
    console.log("error")
})
console.log(2)1
JavaScript

221思考：
1、Promise 中为什么要引入微任务？
2、Promise 中是如何实现回调函数返回值穿透的？
3、Promise 出错后，是怎么通过“冒泡”传递给最后那个捕获异常的函数？
