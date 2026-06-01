---
title: "JavaScript 异步编程 (): ⽣成器和协程"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

我们知道ES7中引⼊了async/await，这是JavaScript异步编程的终极解决⽅案，提供了不阻塞主线程
的情况下使⽤同步代码访问资源的能⼒，并且使代码逻辑更加清晰。参考下⾯的代码
上⾯的代码中，我们可以发现整个异步的处理逻辑都是使⽤同步的代码⽅式来实现的，⽽且还⽀持try 
catch来捕获异常，这就是同步的代码，⾮常符合我们⼈线性的思维，但是背后隐藏的细节是什么呢？
ES6语法中引⼊了⽣成器这⼀个函数，那么什么是⽣成器函数？
⽣成器函数是⼀个带星号函数，⽽且是可以暂停执⾏和恢复执⾏的，接下来我们来看⼀段代码1、⽣成器(Generator)async function  foo(){
  try{
    let response1  = await fetch('https://www.geekbang.org' )
    console.log('response1' )
    console.log(response1 )
    let response2  = await fetch('https://www.geekbang.org/test' )
    console.log('response2' )
    console.log(response2 )
  }catch(err) {
    console.error(err)
  }
}
foo()1
3
5
7
9
11
13
JavaScript

191观察上⾯的代码我们会发现genDemo函数并不是⼀次性的执⾏完的，⽽是全局的代码和genDemo函数
交替执⾏，其实这就是⽣成器的特性，函数可以暂停执⾏，也可以恢复执⾏。
1、在⽣成器函数内部执⾏⼀段代码，如果遇到yield关键字，那么JavaScript引擎将发挥关键词字后⾯的
内容给外部并暂停该函数的执⾏
2、外部函数可以通过next⽅法恢复函数的执⾏
那么JavaScript 引擎 V8 是如何实现⼀个函数的暂停和恢复的，⾸先你需要知道协程这个概念。协程是
⼀种⽐线程更加轻量级的存在。
协程可以看作跑在线程上⾯的任务，⼀个线程可以有多个协程，但是在线程上同时只能执⾏⼀个协程，
⽐如当前执⾏的是 A 协程，要启动 B 协程，那么 A 协程就需要将主线程的控制权交给 B 协程，这就体2、协程(Coroutine)function * genDemo() {
console.log(" 开始执⾏第⼀段  ")
    yield 'generator 1'
 
    console.log(" 开始执⾏第⼆段  ")
    yield 'generator 2'
 
    console.log(" 开始执⾏第三段  ")
    yield 'generator 3'
 
    console.log(" 执⾏结束  ")
    return 'generator 4'
}
console.log('main 0' )  //main 0
let gen = genDemo()
console.log(gen.next().value)  // 开始执⾏第⼀段  generator 1
console.log('main 1' ) //main 1
console.log(gen.next().value)  // 开始执⾏第⼆段  generator 2
console.log('main 2' )  //main 2
console.log(gen.next().value)  // 开始执⾏第三段  generator 3
console.log('main 3' )  //main 3
console.log(gen.next().value)  // 执⾏结束  generator 4
console.log('main 4' )  //main 41
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

192现在 A 协程暂停执⾏，B 协程恢复执⾏；同样，也可以从 B 协程中启动 A 协程。通常，如果从 A 协程
启动 B 协程，我们就把 A 协程称为 B 协程的⽗协程。
如同⼀个进程可以拥有多个线程⼀样，⼀个线程也可以拥有多个协程。区别在于协程不是操作系统内核
管理的，⽽是完全由程序所控制的(⽤户态执⾏)。这样性能可以得到很⼤的提升，⽽不需要像线程⼀样
去来回的切换消耗资源。下⾯是上⾯代码的协程执⾏的流程图：
1、通过调⽤⽣成器函数 genDemo 来创建⼀个协程 gen，创建之后，gen 协程并没有⽴即执⾏。
2、要让 gen 协程执⾏，需要通过调⽤ gen.next。
3、当协程正在执⾏的时候，可以通过yield关键字来暂停执⾏，并返回主要信息给⽗协程
4、如果协程执⾏期间，遇到了return关键字，那么 JavaScript 引擎会结束当前协程，并将 return 后⾯
的内容返回给⽗协程。
⽗协程有⾃⼰的调⽤栈，gen 协程时也有⾃⼰的调⽤栈，当 gen 协程通过 yield 把控制权交给⽗协程
时，V8 是如何切换到⽗协程的调⽤栈？当⽗协程通过 gen.next 恢复 gen 协程时，⼜是如何切换 gen 
协程的调⽤栈？
1、gen 协程和⽗协程是在主线程上交互执⾏的，并不是并发执⾏的，它们之前的切换是通过 yield 和 
gen.next 来配合完成的。

1932、当在 gen 协程中调⽤了 yield ⽅法时，JavaScript 引擎会保存 gen 协程当前的调⽤栈信息，并恢
复⽗协程的调⽤栈信息。同样，当在⽗协程中执⾏ gen.next 时，JavaScript 引擎会保存⽗协程的调⽤
栈信息，并恢复 gen 协程的调⽤栈信息。
在JavaScript中，⽣成器就是协程的⼀种实现⽅式，那我们我们接下来看是如何改造我们的Promise代
码，先写⼀个我们使⽤Promise请求的例⼦3、Generator改造Promise

194使⽤Generator来改造如下：
代码⼯作流程如下：
1、⾸先执⾏的是let gen = foo() ，创建了 gen 协程。fetch('https://www.joinmouse.me/a' ).then((response1 ) => {
  console.log(response1 )
  return fetch('https://www.joinmouse.me/b' )
}).then((response2 ) => {
  console.log(response2 )
}).catch((error) => {
  console.log(error)
})1
3
5
7
JavaScript
//foo 函数
function * foo() {
    let response1  = yield fetch('https://www.joinmouse.me/a' )
    console.log('response1' )
    console.log(response1 )
    let response2  = yield fetch('https://www.joinmouse.me/b' )
    console.log('response2' )
    console.log(response2 )
}
// 执⾏foo 函数的代码
let gen = foo()
function  getGenPromise (gen) {
return gen.next().value
}
getGenPromise (gen).then(res1 => {
console.log('res1')
  console.log(res1)
  return genGenPromise (gen)
}).then(res2 => {
console.log('res2')
  console.log(res2)
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
23
JavaScript

1952、在⽗协程中通过执⾏ gen.next 把主线程的控制权交给 gen 协程。
3、gen 协程获取到主线程的控制权后，就调⽤ fetch 函数创建了⼀个 Promise 对象 res1，然后通过 
yield 暂停 gen 协程的执⾏，并将 res1 返回给⽗协程。
4、⽗协程恢复执⾏后，调⽤ res1.then ⽅法等待请求结果。
5、通过 fetch 发起的请求完成之后，会调⽤ then 中的回调函数，then 中的回调函数拿到结果之后，
通过调⽤ gen.next 放弃主线程的控制权，将控制权交 gen 协程继续执⾏下个请求，依次执⾏。
我们想是否可以简化上⾯的流程，有⼀个执⾏器⾃动的帮我们去执⾏⽣成器函数上的控制权的暂停和恢
复的函数，后来社区是通过Thunk库 和 co库来优化的，也就有了后来的async/await的标准
Thunk函数是⾃动执⾏Generator函数的⼀种⽅法
Thunk 函数早在上个世纪 60 年代就诞⽣了。
那时，编程语⾔刚刚起步，计算机学家还在研究，编译器怎么写⽐较好。⼀个争论的焦点是"求值策
略"，即函数的参数到底应该何时求值
上⾯的代码先定义的函数f，然后向它传⼊表达式 x+5，那么表达式应该如何求值呢？
⼀种⽅式是"传值调⽤" call by value，即在进⼊函数体之前，就计算x + 5的值，再传⼊函数f，C语⾔就
是这样的4、Thunk函数
4.1、参数的求值策略
var x = 1;
function  f(m) {
  return m * 2;
}
f(x + 5)1
3
5
7
JavaScript

196还有⼀种是"传名调⽤"，即直接将表达式 x+5 传⼊函数体，只在⽤到它的时候去求值。Haskell语⾔就
是采⽤这种策略
传值调⽤和传名调⽤各有利弊。传值调⽤⽐较简单，但是对参数传值的时候，实际上还没有⽤到这个参
数，有可能就会造成性能的损失
上⾯这段代码中都没有⽤到第⼀个参数，但是如果采⽤传值调⽤实际上先计算这⼀步更本没必要的，上
⾯例⼦中我们⽤thunk函数定义⼀下f(x + 5)
// 传值调⽤时 , 等价于
f(6)1
3
JavaScript
f(x + 5)
// 传名调⽤时，等于
(x + 5) * 21
3
JavaScript
function  f(a, b){
  return b
}
f(3 * x * x - 2 * x - 1, x)1
3
5
JavaScript

197JavaScript 语⾔是传值调⽤，它的 Thunk 函数含义有所不同。
在 JavaScript 语⾔中，Thunk 函数替换的不是表达式，⽽是多参数函数，将其替换成⼀个只接受回调
函数作为参数的单参数函数。
s 模块的 readFile ⽅法是⼀个多参数函数，两个参数分别为⽂件名和回调函数。经过转换器处
理，它变成了⼀个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。
任何函数，只要参数有回调函数，就可以写成 Thunk函数 的形势，下⾯是⼀个简单的Thunk函数转换器4.2、JavaScript中的Thunk函数function  f(m) {
  return m * 2;
}
f(x + 5);
// 等同于
var thunk = function  () {
  return x + 5
}
function  f(thunk) {
  return thunk() * 2;
}1
3
5
7
9
11
13
15
JavaScript
// 正常版本的 readFile （多参数版本）
fs.readFile (fileName , callback );
// Thunk 版本的 readFile （单参数版本）
var Thunk = function  (fileName ) {
  return function  (callback ) {
    return fs.readFile (fileName , callback );
  }
}
var readFileThunk  = Thunk(fileName )
readFileThunk (callback )1
3
5
7
9
11
JavaScript

198你可能会问， Thunk 函数有什么⽤？回答是以前确实没什么⽤，但是 ES6 有了 Generator 函数，
Thunk 函数现在可以⽤于 Generator 函数的⾃动流程管理
Generator 函数可以⾃动执⾏5、Generator + Thunk库
5.1、Generator 函数的流程管理const Thunk = function (fn) {
  return function  (...args) {
    return function  (callback ) {
      return fn.call(this, ...args, callback );
    }
  }
}1
3
5
7
JavaScript
function * genDemo() {
console.log(" 开始执⾏第⼀段  ")
    yield 'generator 1'
 
    console.log(" 开始执⾏第⼆段  ")
    yield 'generator 2'
 
    console.log(" 开始执⾏第三段  ")
    yield 'generator 3'
 
    console.log(" 执⾏结束  ")
    return 'generator 4'
}
let gen = genDemo()
let res = gen.next()
while(!res.done) {
console.log(res.value)
  res = gen.next()
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
JavaScript

199上⾯的代码中Generator 函数 gen 会⾃动执⾏完所有步骤，但是这并不适合于异步操作。如果必须保
证上⼀步执⾏完，才能执⾏下⼀步，上⾯的⾃动执⾏就不可⾏了。但是 Thunk 函数就可以派上⽤处
了。接下来就以读取⽂件做例⼦，下⾯的Generator函数封装两个异步操作
 
上⾯的代码中使⽤ yield关键字将控制权交给主线程，那么也需要⼀种⽅法，将控制权再交还给 
Genertor 函数，这种⽅式就是Thunk函数，因为它可以在回调参数中将控制权交给Genertor函数
其中变量 g 是 Generator 函数的内部指针，表示⽬前执⾏到哪⼀步。 next ⽅法负责将指针移动到下
⼀步，并返回该步的信息（ value 属性和 done 属性）
可以发现 Generator 函数的执⾏过程，其实是将同⼀个回调函数，反复传⼊ next ⽅法的 value 属
性。这使得我们可以⽤递归来⾃动完成这个过程。var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);
var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab')
  console.log(r1.toString())
  var r2 = yield readFileThunk('/etc/shells')
  console.log(r2.toString())
}1
3
5
7
9
Plain Text
let g = gen()
var r1 = g.next()
r1.value(function (err, data) {
if(err) throw err;
  
  var r2 = g.next(data)
  r2.value(function(err, data) {
  if(err) throw err;
    g.next(data);
  })
})1
3
5
7
9
11
13
Plain Text

200Thunk 函数真正的威⼒，在于可以⾃动执⾏ Generator 函数。下⾯就是⼀个基于 Thunk 函数的 
Generator 执⾏器5.2、Thunk函数的⾃动管理流程

201打印结果如下// ⾃动执⾏器
function  run(fn) {
  var gen = fn()
  function  next(err, data) {
    var result = gen.next(data)
    if (result.done) return
    result.value(next)
  }
  next()
}
function * genDemo() {
    console.log(" 开始执⾏第⼀段  ")
    yield function (fn) {
        console.log('gen 1')
        setTimeout (fn, 0)
    }
    console.log(" 开始执⾏第⼆段  ")
    yield function (fn) {
        console.log('gen 2')
        setTimeout (fn, 0)
    }
    console.log(" 开始执⾏第三段  ")
    yield function (fn) {
        console.log('gen 3')
        setTimeout (fn, 0)
    }
    console.log(" 执⾏结束  ")
    return function (fn) {
        console.log('gen 4')
        setTimeout (fn, 0)
    }
}
run(genDemo)1
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
31
33
35
37
39
JavaScript

202上⾯代码中的run函数，就是⼀个 Generator 函数⾃动化执⾏器。内部的next函数就是 Thunk 的回调函
数。next函数先将指针转移到 Generator 函数的下⼀步gen.next()，然后判断Generator函数是否结束
了(result.done属性)，如果没有结束就将next函数传⼊Thunk函数(result.value属性)，否则直接退出。
有了这个执⾏器，执⾏ Generator 函数⽅便多了。不管内部有多少个异步操作，直接把 Generator 函
数传⼊ run 函数即可。当然，前提是每⼀个异步操作，都要是 Thunk 函数，也就是说，跟在 yiel
d 命令后⾯的必须是 Thunk 函数。
Thunk函数并不是Generator函数⾃动化执⾏的唯⼀⽅案，因为⾃动执⾏的关键是必须有⼀种机制，⾃
动控制Generator函数的流程，接受和交还程序的执⾏权。回调函数可以做到这⼀点，Promise对象也
可以做到这⼀点。
co库是著名的作者TJ写的⼀个⾃动执⾏⽣成器函数的库，简单的说上⾯每次我们都需要⼿动的去调
gen.next()这个函数来切换控制权，⽽co库会帮我们⾃动执⾏。上⾯的例⼦，通过co可以简化为6、Generator + co库
6.1、co简介开始执⾏第⼀段
gen 1
开始执⾏第⼆段
gen 2
开始执⾏第三段
gen 3
执⾏结束1
3
5
7
JavaScript

203将Generator函数只要传⼊co函数，程序就会⾃动的执⾏
co函数返回⼀个Promise对象，因此可以使⽤then⽅法来添加回调函数
为什么 co 可以⾃动执⾏ Generator 函数？
前⾯说过，Generator 就是⼀个异步操作的容器。它的⾃动执⾏需要⼀种机制，当异步操作有了结果，
能够⾃动交回执⾏权。
有两种⽅法可以实现上⾯的例⼦
1、回调函数：将异步操作包装成 Thunk 函数，在回调函数⾥⾯去交回执⾏权
2、Promise对象： 将异步操作包装成Promise对象，⽤then⽅法交回控制权
co模块其实就是将这两种⾃动执⾏器（Thunk 函数和 Promise 对象），包装成了⼀个模块。使⽤ co 
的前提条件是，Generator 函数的 yield 命令后⾯，只能是 Thunk 函数或 Promise 对象。如果数组
或对象的成员，全部都是 Promise 对象，也可以使⽤ co，详⻅后⽂的例⼦。6.2、co库的原理
6.3、基于Promise对象的⾃动执⾏function * foo() {
    let response1  = yield fetch('https://www.joinmouse.me/a' )
    console.log('response1' )
    console.log(response1 )
    let response2  = yield fetch('https://www.joinmouse.me/b' )
    console.log('response2' )
    console.log(response2 )
}
co(foo())1
3
5
7
9
JavaScript
co(gen).then(res => {
console.log("Generator 函数执⾏完成 ")
})1
3
JavaScript

204接下来我们⼿动的去执⾏上⾯的 Generator 函数
⼿动的去调⽤then⽅法，层层加上回调函数，接下来我们就可以写⼀个⾃动执⾏器了var fs = require('fs')
var readFile  = function  (fileName ){
  return new Promise(function  (resolve, reject){
    fs.readFile (fileName , function (error, data){
      if (error) return reject(error)
      resolve(data)
    })
  })
}
var gen = function * (){
  var f1 = yield readFile ('/etc/fstab' )
  var f2 = yield readFile ('/etc/shells' )
  console.log(f1.toString ())
  console.log(f2.toString ())
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
var g = gen()
g.next.value.then(function (data) => {
g.next(data).value.then(function (data){
    g.next(data)
  })              
})1
3
5
7
JavaScript

205上⾯代码中，只要 Generator 函数还没执⾏到最后⼀步， next 函数就调⽤⾃身，以此实现⾃动执
⾏，其实思路和Thunk执⾏回调函数是类似的。
co就上上⾯两种执⾏器的拓展，源码只有⼏⼗⾏，并不是很复杂，⾸先co接受 Generator 函数作为参
数，返回⼀个 Promise 对象
在返回的 Promise 对象⾥⾯，co 先检查参数 gen 是否为 Generator 函数。如果是，就执⾏该函数，
得到⼀个内部指针对象；如果不是就返回，并将 Promise 对象的状态改为 resolved 。6.4、co模块的源码function  run(gen) {
let g = gen()
  
  function  next(data) {
  let result = g.next(data)
    
    if(result.done) return result.value
    
    result.value.then(res => {
    next(res)
    })
  }
  
  next()
}1
3
5
7
9
11
13
15
JavaScript
function  co(gen) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
  });
}1
3
5
JavaScript

206接下来，co将Generator函数的内部指针对象的next⽅法，包装成onFulfilled函数，这主要是为了捕捉
抛出的错误
最后关键的就是next函数，它回去反复的调⽤⾃⼰，真的是巧妙啊return new Promise(function (resolve, reject) {
    if (typeof gen === 'function' ) gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function' ) return resolve(gen);
});1
3
JavaScript
function  co(gen) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    if (typeof gen === 'function' ) gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function' ) return resolve(gen);
    onFulfilled ()
    function  onFulfilled (res) {
      var ret
      try {
        ret = gen.next(res)
      } catch (e) {
        return reject(e)
      }
      next(ret)
    }
  })
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
JavaScript

207co ⽀持并发的异步操作，即允许某些操作同时进⾏，等到它们全部完成，才进⾏下⼀步。这时，要将并
发的操作都放在数组或者对象⾥⾯，跟在yield语句的后⾯6.5、处理异步并发操作function  next(ret) {
  // 1、检查当前是否为  Generator 函数的最后⼀步，如果是就返回
  if (ret.done) return resolve(ret.value);
  // 2、确保每⼀步的返回值，是  Promise 对象
  var value = toPromise .call(ctx, ret.value);
  // 3、使⽤ then ⽅法，为返回值加上回调函数，然后通过 onFulfilled 函数再次调⽤ next 函
数
  if (value && isPromise (value)) return value.then(onFulfilled , onReject
ed);
  // 4、在参数不符合要求的情况下 ( 参数⾮  Thunk 函数和  Promise 对象 ),
    // 将 Promise 对象的状态改为 rejected ，从⽽终⽌执⾏
  return onRejected (
    new TypeError (
      'You may only yield a function, promise, generator, array, or ob
ject, '
      + 'but the following object was passed: "'
      + String(ret.value)
      + '"'
    )
  )
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

208// 数组的写法
co(function * () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);
// 对象的写法
co(function * () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);1
3
5
7
9
11
13
15
17
JavaScript

209