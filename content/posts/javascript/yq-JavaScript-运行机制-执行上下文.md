---
title: "JavaScript 运⾏机制 (): 执⾏上下⽂"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

这篇文章主要介绍执行上下文相关的内容，只有理解了JavaScript的执行上下文，才能更好的理解
JavaScript语言本身，比如后面的变量提升、作用域和闭包等
使用过 JavaScript 开发的程序员应该都知道，JavaScript 是按顺序执行的。若按照这个逻辑来理解的
话，那么：
1、当执行到第 1 行的时候，由于函数 showName 还没有定义，所以执行应该会报错；
2、同样执行第 2 行的时候，由于变量 myname 函数也未定义，所以同样也会报错。
但是实际的执行结果是这样的：1、变量提升 (Hoisting）
showName ()
console.log(myname)
var myname = '极客时间 '
function  showName () {
    console.log('函数 showName 被执行 ');
}1
3
5
JavaScript

178之所以是上面这种情况是因为我们知道JavaScript中对函数声明和变量声明会有一个提升。
var myname = '极客时间 '
// 将上面的代码拆分成 2 行
var myname    // 声明部分
myname = '极客时间 '  // 赋值部分1
3
5
JavaScript

179上面是变量的声明和赋值，下面我们来理解下函数的声明和赋值
第一个函数 foo 是一个完整的函数声明，也就是说没有涉及到赋值操作；第二个函数是先声明变量 
bar，再把 function(){console.log('bar')} 赋值给 bar。为了直观理解，你可以参考下图：
function  foo(){
  console.log('foo')
}
 
var bar = function (){
  console.log('bar')
}1
3
5
7
JavaScript

180总结下：所谓的变量提升，是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和
函数的声明部分提升到代码开头的“行为”。变量被提升后，会给变量设置默认值，这个默认值就是我们
熟悉的 undefined
我们将最上面的代码可以分为声明部分和执行部分

181图示如下
2、JavaScript 代码的执行流程/*
* 变量提升部分
*/
// 把变量  myname 提升到开头，
// 同时给  myname 赋值为  undefined
var myname = undefined
// 把函数  showName 提升到开头
function  showName () {
    console.log('showName 被调用 ');
}
 
/*
* 可执行代码部分
*/
showName ()  // showName 被调用
console.log(myname)   //undefined
// 去掉 var 声明部分，保留赋值语句
myname = '极客时间 '1
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

182那么我们这里可能会好奇，为什么要把代码分为声明阶段和执行阶段，这就要从js代码执行说起了，js
代码在浏览器执行是先被编译，编译完成后再执行，大致流程如下：
“变量提升”意味着变量和函数的声明会在物理层面移动到代码的最前面，正如我们所模拟的那样。但，
这并不准确。实际上变量和函数声明在代码里的位置是不会改变的，而且是在编译阶段被 JavaScript 
引擎放入内存中。
我们前面将代码分为了声明阶段和执行阶段其实对应的就是JS引擎的编译阶段和执行阶段，以上面的代
码为例，在JS引擎中执行如下所示：
从上图可以看出，输入一段代码，经过编译后，会生成两部分内容：执行上下文（Execution 
context）和可执行代码。2.1、编译阶段

183执行上下文是 JavaScript 执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行
上下文，确定该函数在执行期间用到的诸如 this、变量、对象以及函数等。
执行上下文中会存在一个变量环境对象（Viriable Environment），该对象中保存了变量提升的内容，
比如上面代码中的变量 myname 和函数 showName，都保存在该对象中，可以简单的如下所示
执行阶段就比较好理解了，就是依据编译阶段形成的执行上下文，去一行行的执行代码
我们来分析上面的运行流程
1、首先是编译阶段。遇到了第一个 showName 函数，会将该函数体存放到变量环境中。接下来是第二
个 showName 函数，继续存放至变量环境中，但是变量环境中已经存在一个 showName 函数了，此
时，第二个 showName 函数会将第一个 showName 函数覆盖掉。这样变量环境中就只存在第二个 
showName 函数了。
2、执行阶段。先执行第一个 showName 函数，但由于是从变量环境中查找 showName 函数，而变量
环境中只保存了第二个 showName 函数，所以最终调用的是第二个函数，打印的内容是“极客时间”。2.2、执行阶段
3、出现相同的变量或者函数VariableEnvironment :
     myname -> undefined , 
     showName  ->function  : {console.log(myname)1
3
JavaScript
function  showName () {
    console.log('极客邦');
}
showName ();
function  showName () {
    console.log('极客时间 ');
}
showName (); 1
3
5
7
JavaScript

184第二次执行 showName 函数也是走同样的流程，所以输出的结果也是“极客时间”。
总结：一段代码如果定义了两个相同名字的函数，那么最终生效的是最后一个函数。
站在JS引擎编译和执行的阶段去看变量/函数的声明和赋值对应起来，我们会发现对JS运行机制的理解
更加深刻了

185JavaScript 异步编程 (): async/await
生成器Generator+co库已经能够很好的去满足我们的需求了，因而在ES7中引入async/await，这种方
式能够彻底告别执行器和生成器，实现更加直观简洁的代码。其实 async/await 技术背后的秘密就是 
Promise 和生成器应用，往低层说就是微任务和协程应用。
要搞清楚 async 和 await 的工作原理，我们就得对 async 和 await 分开分析
我们先来看看 async 到底是什么？根据 MDN 定义，async 是一个通过异步执行并隐式返回 
Promise 作为结果的函数。
上面这段代码中，我们知道调用 async 声明的 foo 函数返回了一个 Promise 对象，状态是 resolved的
我们知道了 async 函数返回的是一个 Promise 对象，那下面我们再结合文中这段代码来看看 await 到
底是什么。1、async
2、awaitasync function  foo() {
return 2
}
console.log(foo())  //Promise {&lt;resolved&gt;: 2}1
3
5
JavaScript

186我们可以先站在协程的视角去看上面的执行过程：
1、首先，执行 console.log(0)这个语句，打印出来 0。
2、执行 foo 函数，由于 foo 函数是被 async 标记过的，所以当进入该函数的时候，JavaScript 引擎
会保存当前的调用栈等信息，然后执行 foo 函数中的 console.log(1) 语句，并打印出 1。
3、执行到 foo 函数中的 await 100 这个语句了，这里是我们分析的重点，因为在执行 await 10
0 这个语句时，JavaScript 引擎在背后为我们默默做了太多的事情，那么下面我们就把这个语句拆开，
来看看 JavaScript 到底都做了哪些事情。
当执行到 await 100 时，会默认创建一个 Promise 对象，代码如下所示：async function  foo() {
    console.log(1)
    let a = await 100
    console.log(a)
    console.log(2)
}
console.log(0)
foo()
console.log(3)1
3
5
7
9
JavaScript

187在这个 promise_ 对象创建的过程中，我们可以看到在 executor 函数中调用了 resolve 函数，
JavaScript 引擎会将该任务提交给微任务队列
4、 JavaScript 引擎会暂停当前协程的执行，将主线程的控制权转交给父协程执行，同时会将 
promise_ 对象返回给父协程。
5、主线程的控制权已经交给父协程了，这时候父协程要做的一件事是调用 promise_.then 来监控 
promise 状态的改变
6、继续执行父协程的流程，这里我们执行 console.log(3) ，并打印出来 3。随后父协程将执行结
束，在结束之前，会进入微任务的检查点，然后执行微任务队列，微任务队列中有 resolve(100) 的
任务等待执行，执行到这里的时候，会触发 promise_.then 中的回调函数，如下所示：
该回调函数被激活以后，会将主线程的控制权交给 foo 函数的协程，并同时将 value 值传给该协程。
7、foo 协程激活之后，会把刚才的 value 值赋给了变量 a，然后 foo 协程继续执行后续语句，执行完
成之后，将控制权归还给父协程。
3、其他异步执行方案比较let promise_   = new Promise((resolve,reject){
  resolve(100)
})1
3
JavaScript
promise_ .then((value)=>{
   // 回调函数被激活后
   // 将主线程控制权交给  foo 协程，并将  vaule 值传给协程
})1
3
JavaScript

188语法层面上比较我们发现其实就是funtion*  变成了 async function，并且默认返回promise对象，关键
字yield变成了await，然后async/await会自动执行，也就是不用掉额外的co库，整体代码看起来更简洁
了，看起来更加同步线性化了，也被称之为异步编程的终极解决方案。
我们知道async/await是按照顺序的依次完成异步操作4、实现并发请求function * gen() {
  console.log("执行第一段 ")
let a = yield function (fn) {
  setTimeout (fn, 0)
  }
  console.log("执行第二段 ")
  let b = yield function (fn) {
  setTimeout (fn, 0)
  }
  return b
}
co(gen)1
3
5
7
9
11
13
JavaScript
async gen() {
  console.log("执行第一段 ")
let a = await function (fn) {
  setTimeout (fn, 0)
  }
  console.log("执行第二段 ")
  let b = await function (fn) {
  setTimeout (fn, 0)
  }
}1
3
5
7
9
JavaScript

189上面的代码有个问题是所有远程操作都是继发。只有前一个 URL 返回结果，才会去读取下一个 URL，
这样做效率很差，非常浪费时间。当我们需要的是并发发出远程请求，上面就不支持了，可以改成下面
这样
虽然map方案的参数是async函数，但是他是并发执行的。因为只有async函数内部是继发执行的，外部
的不受影响。后面的 for..of 循环内部使用了 await ，因此实现了按顺序输出。async function  logInOrder (urls) {
  for (const url of urls) {
    const response  = await fetch(url);
    console.log(await response .text());
  }
}1
3
5
JavaScript
async function  logInOrder (urls) {
  // 并发的读取远程 URL
  const textPromises  = urls.map(async url => {
  const response  = await fetch(url)
    return response .text()
  })
  
  for (const textPromise  of textPromises ) {
console.log(await textPromise )
  }
}1
3
5
7
9
11
JavaScript

190