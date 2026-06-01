---
title: "JavaScript 异步编程 (): Promise"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

在上⼀篇⽂章中我们说到了微任务并以Promise做了⼀些演示，现在浏览器很多新加的API都是建⽴在
Promise之上，新的前端框架也⼤量的使⽤Promise，那么这篇⽂章就会重点的写下Promise。
学习⼀⻔新技术，最好的⽅式是了解这⻔技术是如何诞⽣的，以及它所解决的问题是什么。了解了这些
之后，我们才可能抓住这⻔技术的本质。那么JavaScript引⼊Promise的动机是什么呢？⼜解决了什么
问题呢？
⾸先说下结论：Promise解决了异步编码⻛格的问题，避免写出回调地狱式⻛格的代码。
在⼀段请求中我们重点关注输⼊内容(请求信息)和输出内容(响应信息)，基本的抽象流程可以如下图所示
具体代码的如下：1、异步编程的问题：回调地狱

212封装请求信息如下：
我们来封装后的请求我们可以如何使⽤：//request 输⼊
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
3
5
7
9
11
13
JavaScript
//[in] request ，请求信息，请求头，延时值，返回类型等
//[out] resolve, 执⾏成功，回调该函数
//[out] reject  执⾏失败，回调该函数
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
3
5
7
9
11
13
15
17
JavaScript

213经过封装后的函数中我们这⾥主要传⼊3个参数就好了：⼀个请求信息、⼀个成功回调函数和⼀个失败
的回调函数
其实上⾯的代码已经封装的很好了，但是如果我们⾯对的是⼀个⽐较复杂的项⽬，嵌套了3层的回调会
发⽣什么呢？
这段代码是先请求 time.geekbang.org/?category //[in] request ，请求信息，请求头，延时值，返回类型等
//[out] resolve, 执⾏成功，回调该函数
//[out] reject  执⾏失败，回调该函数
XFetch(
  makeRequest ('https://time.geekbang.org' ),
    function  resolve(data) {
        console.log(data)
    }, function  reject(e) {
        console.log(e)
    }
)1
3
5
7
9
11
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
3
5
7
9
11
13
15
17
19
JavaScript

214如果请求成功的话，那么再请求 time.geekbang.org/column 
如果再次请求成功的话，就继续请求 time.geekbang.org 
这段代码⽤了三层嵌套请求，就已经让代码变得⾮常混乱了，让开发者很难去维护这样的代码，我们把
这种现象称之为回调地狱。
这段代码看起来很难维护主要原因有这样两个点：
第⼀是嵌套调⽤，下⾯的任务依赖上个任务的请求结果，并在上个任务的回调函数内部执⾏新的业
务逻辑，这样当嵌套层次多了之后，代码的可读性就变得⾮常差了
第⼆是任务的不确定性，执⾏每个任务都有两种可能的结果（成功或者失败），所以体现在代码中
就需要对每个任务的执⾏结果做两次判断，这种对每个任务都要进⾏⼀次额外的错误处理的⽅式，
明显增加了代码的混乱程度
解决上⾯的问题的⽅案是：消灭嵌套调⽤以及合并多个任务的错误处理
实际上Promise就是这么去做的
使⽤Promise重构上⾯的XFetch的封装请求代码2、如何解决回调地狱的问题
●
●
3、Promise：消灭嵌套调⽤和多次错误处理

215接下来⽤XFetch改造上⾯的流程：
通过上⾯的代码，我们观察霞Promise的执⾏机制function  XFetch(request) {
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
3
5
7
9
11
13
15
17
19
21
23
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
3
5
7
9
11
JavaScript

216引⼊Promise，在调⽤XFetch的时候，会返回⼀个Promise对象
构建 Promise 对象时，需要传⼊⼀个executor 函数，XFetch 的主要业务流程都在 executor 函数
中执⾏
如果运⾏在excutor函数中的业务都执⾏成功了，就会调⽤resolve函数；若执⾏失败，则取调⽤
reject函数
在excutor函数中调⽤resolve函数时，会触发Promise.then设置回调函数；⽽调⽤reject函数时，
会触发promise.catch 设置的回调函数
上⾯的代码⾮常清晰的帮我们解决了嵌套回调的问题，接下来会具体分析是如何取解决的
回调函数的延时绑定在代码就体现在Promise对象x1，通过Promise的构造函数 executor 来执⾏业务逻
辑；创建好Promise 对象 x1 后，在使⽤x1.then 来设置回调函数。
⾸先执⾏ new Promise 时，Promise 的构造函数会被执⾏，不过由于 Promise 是 V8 引擎提供的，所
以暂时看不到 Promise 构造函数的细节。
接下来，Promise 的构造函数会调⽤ Promise 的参数 executor 函数。然后在executor中执⾏
resolve，resolve函数也是 V8 内部提供的，那么 resolve 函数到底做了什么呢？●
●
●
●
4、Promise解决嵌套回调
4.1、解决回调函数的延时绑定
// 创建Promise 对象  x1, 并在  executor 函数中执⾏业务逻辑
function  executor (resolve, reject) {
resolve(100)
}
let x1 = new Promise(executor )
// x1延时绑定回调函数 onResolve
function  onResolve (val) {
console.log(val)
}
x1.then(onResolve )1
3
5
7
9
11
13
JavaScript

217我们知道执⾏resolve函数会触发x1.then设置的回调函数onResolve，所以可以推测resolve函数内部调
⽤了通过x1.then设置的onResolve函数，由于 Promise 采⽤了回调函数延迟绑定技术，所以在执⾏ 
resolve 函数的时候，回调函数还没有绑定，那么只能推迟回调函数的执⾏。
可以写的有点抽象，接下来我们写⼀段模拟Promise的代码
观察上⾯的代码，我们⾃⼰实现了⾃⼰的构造函数、resolve、then ⽅法。接下来使⽤PromiseX来编写
我们的业务代码
执⾏后报错如下：function  PromiseX (executor ) {
    var onResolve_  = null
    var onReject_  = null
    // 模拟实现  resolve 和  then ，暂不⽀持  rejcet
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
3
5
7
9
11
13
JavaScript
function  executor (resolve, reject) {
    resolve(100)
}
// 将 Promise 改成我们⾃⼰的  PromsieX
let x1 = new PromiseX (executor )
 
function  onResolve (value){
    console.log(value)
}
x1.then(onResolve )1
3
5
7
9
JavaScript

218之所以出现这个错误，是由于 PromiseX 的延迟绑定导致的，在调⽤到 onResolve_ 函数的时候，
PromiseX.then 还没有执⾏，所以执⾏上述代码的时候，当然会报"onResolve_  is not a function"的
错误了。我们可以加⼊setTimeout改造
采⽤了定时器来推迟 onResolve 的执⾏，不过使⽤定时器的效率并不是太⾼，好在我们有微任务，所
以 Promise ⼜把这个定时器改造成了微任务了，这样既可以让 onResolve_ 延时被调⽤，⼜提升了代码
的执⾏效率。这就是 Promise 中为啥使⽤微任务了。
我们依据onResolve函数的传⼊值来决定创建什么类型的Promise任务，创建好的Promise对象需要返回
到最外层，这样就摆脱了嵌套循环的问题4.2、需要将回调函数onResolve的返回值穿透到最外层Uncaught TypeError : onResolve_ is not a function
    at resolve (&lt;anonymous &gt;:10:13)
    at executor  (&lt;anonymous &gt;:17:5)
    at new Bromise (&lt;anonymous &gt;:13:5)
    at &lt;anonymous &gt;:19:121
3
5
JavaScript
function  resolve(value) {
  setTimeout (()=>{
    onResolve_ (value)
  },0)
}1
3
5
JavaScript

219  Promise 通过回调函数延迟绑定和回调函数返回值穿透的技术，解决了循环嵌套
5、Promise如何处理异常// 创建Promise 对象  x1, 并在  executor 函数中执⾏业务逻辑
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
3
5
7
9
11
13
15
17
19
21
JavaScript

220上⾯这段代码中有4个Promise对象：p0~p4，⽆论哪个对象⾥⾯有异常，都可以通过最后⼀个p4.catch
来捕获到，通过这种⽅式可以将Promise对象的错误合并到⼀个函数中去处理，这样就解决了每个任务
需要单独处理异常的问题。
之所以可以使⽤最后⼀个对象来捕获所有异常，是因为 Promise 对象的错误具有"冒泡"性质，会⼀直向
后传递，直到被 onReject 函数处理或 catch 语句捕获为⽌。具备了这样的"冒泡"性质，就不需要要在
每个Promise对象中去单独的捕获异常了，这样的好处是消灭了频繁的错误处理，使我们写出来的代码
更加的优雅和符合⼈的线性思维。
⼿写Promise源码参考： https://github.com/joinmouse/promise-testfunction  executor (resolve, reject) {
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
3
5
7
9
11
13
15
17
19
21
23
25
27
29
JavaScript

221思考：
1、Promise 中为什么要引⼊微任务？
2、Promise 中是如何实现回调函数返回值穿透的？
3、Promise 出错后，是怎么通过“冒泡”传递给最后那个捕获异常的函数？

222