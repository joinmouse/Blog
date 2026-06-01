---
title: "JavaScript 运⾏机制 (): this"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

之前的文章写了词法作用域、作用域链以及闭包，这篇将写另外一个很重要的点就是this，关于this其实
之前也写了不少文章，这次还是从执行上下文的视角去看待this
还是先从一段代码说起
结合之前的文章，我们知道最后打印出来的结果是"demo3"，这是因为JavaScript语言的作用域是由词
法作用域决定的，而词法作用域是由于代码结构来确定的。
但是有时候在对象内部的方法中使用内部的属性是一个非常常见的需求，但是JavaScript的作用域机制
并不支持这样的一点，基于这个需求，JavaScript于是创立了this机制
对于this，还是需要从执行上下文说起，前面的文章中分别介绍了执行上下文中包含变量环境、词法环
境、外部环境，今天补上最后一环this。1、为什么需要this
2、JavaScript中的 this 是什么var bar = {
    myName: "demo1",
    printName : function  () {
        console.log(myName)
    }
}
function  foo() {
    let myName = "demo2"
    return bar.printName
}
let myName = "demo3"
let _printName  = foo()
_printName ()  // demo3
let _getName  = bar.printName
_getName () // demo31
3
5
7
9
11
13
15
17
JavaScript

154this 是和执行上下文绑定的， 也就是说每个执行上下文中都含有一个this，执行上下文一般分为：全局
执行上下文、函数执行上下文和 eval 执行上下文(用的不多，不会做过多介绍)
我们在控制台的环境中输入console.log(this)，会发现最终输出的是window对象，也就是全局执行上下
文的this是指向window对象的。
这也是 this 和作用域链的唯一交点，作用域链的最底端包含了 window 对象，全局执行上下文中的 
this 也是指向 window 对象。
接下来，我们就来重点分析函数执行上下文中的 this。还是先看下面这段代码：2.1、全局执行上文中的this
2.2、函数执行上文中的this
function  foo(){
  console.log(this)
}
foo()1
3
JavaScript

155执行上面的代码我们会发现，打印的是window对象。这说明在默认情况下调用一个函数，其执行上下
文中的 this 也是指向 window 对象的，那么我们是否可以改变this的指向呢？
理解call调用，我们先需要去看下mdn上关于call的文档
https://developer.mozilla.org/zh-
CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call
我们是可以通过call方法来设置函数执行上下文中的this指向的，比如：
执行这段代码我们，发现使用call后foo函数内部的this已经指向了bar对象。
同时通过读call的文档我们知道，其实将第一个程序改写一下3、通过call来彻底的理解this指向
3.1、全局环境下改变this指向
let bar = {
  myName : "demo1",
  test1 : 1
}
function  foo(){
  console.log(this.myName)
}
foo()  // undefined
foo.call(bar)  // demo11
3
5
7
9
11
JavaScript

156通过在控制台打印的结果我们发现foo()函数的实际调用是foo.call(window)，默认的话是将this指向了
window
指向上面的代码我们会发现this指向的是myObj，使用对象来调用内部的一个方法的时候，该方法的this
是指向对象本身的，上面的代码等价于
在全局环境中调用一个函数，比如obj()的时候，函数内部的this是指向全局变量window的3.2、对象调用方法的this指向function  foo() {
console.log(this)
}
foo()
foo.call()
foo.call(window)1
3
5
JavaScript
var myObj = {
  name : " demo1 " , 
  showThis : function (){
    console.log(this)
  }
}
myObj.showThis ()  //myObj
let obj = myObj.showThis
obj() //window1
3
5
7
9
JavaScript
myObj.showThis .call(myObj) 1
JavaScript

157在这段代码中我们使用new创建了对象，但是此时构造函数 CreateObj 中的 this 到底指向了那里了？
其实当执行 new CreateObj() 的时候，JavaScript 引擎做了如下四件事：
1、首先创建了一个空对象 tempObj
2、调用 CreateObj.call 方法，并将 tempObj 作为 call 方法的参数，这样当 CreateObj 的执行上下文
创建时，它的 this 就指向了 tempObj 对象
3、然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向了 tempObj 对象
4、返回 tempObj 对象
这样通过一个new关键字创建了一个新对象，并且构造函数中的this其实就是新对象本身，具体可以参
考下mdn上的new关键词文档：https://developer.mozilla.org/zh-
CN/docs/Web/JavaScript/Reference/Operators/new
在一个子构造函数中，你可以通过调用父构造函数的  call  方法来实现继承，类似于  Jav
a  中的写法。下例中，使用  Food  和  Toy  构造函数创建的对象实例都会拥有在 Produc
t  构造函数中添加的  name  属性和  price  属性,但  category  属性是在各自的构造函数中
定义的3.3、构造函数中this的指向
3.4、通过this来实现JS的继承机制obj.call(window) 1
JavaScript
function  CreateObj (){
  this.name = "joinmouse"
}
var myObj = new CreateObj ()1
3
JavaScript
var tempObj = {}
CreateObj .call(tempObj)
return tempObj1
3
JavaScript

158this是为了解决函数调用灵活性不足的问题，但是有些地方却有不少的坑
这段代码的 showThis 方法里面添加了一个 bar 方法，然后接着在 showThis 函数中调用了 bar 函数，
那么现在的问题是：bar 函数中的 this 是什么？4、this的设计缺陷以及应对方案
4.1、嵌套函数中的this不会从外层函数继承function  Product(name, price) {
  this.name = name;
  this.price = price;
}
function  Food(name, price) {
  Product.call(this, name, price);
  this.category  = 'food';
}
function  Toy(name, price) {
  Product.call(this, name, price);
  this.category  = 'toy';
}
var cheese = new Food('feta', 5);
var fun = new Toy('robot', 40);1
3
5
7
9
11
13
15
17
JavaScript
var myObj = {
name: 'demo',
  show: function () {
  console.log(this)
    function  bar() {
    console.log(this)
    }
  }
}
myObj.show()1
3
5
7
9
JavaScript

159我们会觉得this 应该和其外层show函数中的 this 是一致的，都是指向 myObj 对象的，这很符合人的直
觉。但是时机上，执行这段代码后，我们会发现函数 bar 中的 this 指向的是全局 window对象，而函
数 show中的 this 指向的是 myObj 对象。这一点是非常让人迷惑的地方，需要我们注意。
解决的方式比较简单，我们可以在show函数声明一个变量 self 用来保存this，然后bar函数中使用
self，代码如下
执行这段代码，我们可以将外部的this传入到bar内部得到我们想要的结果。其实这个方式的本质是将
this体系转化为作用域体系
ES6中我们使用箭头函数也可以解决这个问题var myObj = {
name: 'demo',
  show: function () {
  console.log(this)
    let self = this
    function  bar() {
    self.name = 'demo2'
    }
    bar()
  }
}
myObj.show()
console.log(myObj.name) //demo21
3
5
7
9
11
13
JavaScript
var myObj = {
name: 'demo',
  show: function () {
  console.log(this)
    var bar = () => {
    this.name = 'demo2'
    }
    bar()
  }
}
myObj.show()
console.log(myObj.name) //demo21
3
5
7
9
11
JavaScript

160ES6的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数，非常符
合我们的预期，因而现在也被广泛的使用
上面我们已经知道了，默认调用一个函数的时候，其执行上下文中的this是默认指向全局对象的window
但是这样设计也有一种缺陷，因为实际的工作中我们并不希望函数执行上下文中的 this默认指向全局对
象，因为这样会打破数据的边界，造成一些误操作。如果要让函数执行上下文中的 this 指向某个对象，
最好的方式是通过 call 方法来显示调用。
可以通过设置JavaScript在严格模式下解决这个问题，在严格模式下，默认执行一个函数，其函数的执
行上下文中的this值是undefined，就解决了上面的问题4.2、普通函数中的this 默认指向全局对象window

161JavaScript 运行机制 (): 作用域链和闭 包
上一篇文章中我们讲到了什么是作用域，以及 ES6 是如何通过变量环境和词法环境来同时支持变量提
升和块级作用域，在最后我们也提到了如何通过词法环境和变量环境来查找变量，这其中就涉及到作用
域链的概念。
理解作用域链是理解闭包的基础，而闭包在 JavaScript 中⼏乎无处不在，同时作用域和作用域链还是
所有编程语言的基础。
我们可以先将之前说到过的执行上下文环境给描画出来1、作用域链
function  bar() {
    console.log(myName)
}
function  foo() {
var myName = "极客邦"
    bar()
}
var myName = "极客时间 "
foo()1
3
5
7
9
JavaScript

162对于作用域链，其实每个执行上下文的环境中都包含了一个外部的引用，用来执行外部的执行上下文，
我们将这个外部的引用称之为outer
当一段代码使用了一个变量时，JavaScript 引擎首先会在“当前的执行上下文”中查找该变量，比如上面
那段代码在查找 myName 变量时，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续
在 outer 所指向的执行上下文中查找。为了直观理解，你可以看下面这张图：

163从图中我们可以观察到bar函数和foo函数都指向的是全局上下文的，这也就意味着如果在bar函数和foo
函数中使用了外部变量，那么 JavaScript 引擎会去全局执行上下文中查找。我们把这个查找的链条就
称为作用域链。
现在我们知道变量是通过作用域链来查找的了，不过还有一个疑问没有解开，foo 函数调用的 bar 函
数，那为什么 bar 函数的外部引用是全局执行上下文，而不是 foo 函数的执行上下文？
原因是词法作用域，在JavaScript 执行过程中，其作用域链是由词法作用域决定的
词法作用域：是指作用域是由代码中函数声明的位置来决定的，所以词法作用域也是静态的作用域，通
过它就能够预测代码在执行过程中如何查找标识符。
回到上面的例子，我们可以发现foo 和 bar 的上级作用域都是全局作用域，所以如果 foo 或者 bar 函
数使用了一个它们没有定义的变量，那么它们会到全局作用域去查找。也就是说，词法作用域是代码阶
段就决定好的，和函数是怎么调用的没有关系。

164闭包是一个JS很重要的概念，在不太熟悉 JavaScript 这门语言的时候，很难通过理解背后的原理来彻
底理解闭包，从而导致学习过程中似乎总是似懂非懂。更要命的是，JavaScript 代码中还总是充斥着大
量的闭包代码，这篇文章就是为了闭包而生的，通过变量环境、词法环境和作用域链等知识来帮助我们
更好的理解闭包
首先我们可以在执行foo函数的时候，调用栈如下：2、闭包
function  foo() {
    var myName = " 极客时间  "
    let test1 = 1
    const test2 = 2
    var innerBar  = {
        getName:function (){
            console.log(test1)
            return myName
        },
        setName:function (newName){
            myName = newName
        }
    }
    return innerBar
}
var bar = foo()
bar.setName(" 极客邦 ")
bar.getName()
console.log(bar.getName())1
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

165innerBar 是一个对象，包含了 getName 和 setName 的两个方法，并且这两个方法都是在 foo 函数内
部定义的，内部使用了 myName 和 test1 两个变量。
根据词法作用域的规则：内部函数 getName 和 setName 总是可以访问它们的外部函数 foo 中的变量
因此当innerBar对象返回给全局变量bar的时候，虽然foo函数已经执行结束了，但是getName和
setName函数依旧可以使用foo 函数中的变量myName 和 test1，因此当foo函数执行完之后，整个调用
栈如下图：

166当foo函数执行完成之后，其执行上下文从栈顶弹出，但由于返回的setName 和 getName 方法中使用
了 foo 函数内部的变量 myName 和 test1，所以这两个变量依然保存在内存中。
这就像 setName 和 getName 方法背着一个专属背包，无论在那里调用了setName 和 getName方
法，它们都会背着整个foo函数的专属背包。之所以称之为专属背包，是因为除了setName和getName
函数之外，其他任何地方都无法访问该背包，我们将这个背包称之为foo函数的 闭包
闭包：在JavaScript中，依据词法作用域的规则，内部函数总是可以访问外部函数中声明的变量，当通
过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束，但是该内部函数引用外部函
数的变量依然保存在内存中，我们就可以将这个变量的集合称之为闭包，比如外部函数是 foo，那么这
些变量的集合就称为 foo 函数的闭包。
当执行到bar.setName方法中的myName="极客邦" 的时候，JavaScript引擎会沿着 "当前执行上下文–
>foo 函数闭包–> 全局执行上下文" 的顺序来查找变量：

167当调用getName的时候，在Chorme控制台我们可以发现结果如下：

168通常，如果引用闭包的函数是一个全局变量，那么闭包会一直存在直到页面关闭；但如果这个闭包以后
不再使用的话，就会造成内存泄漏。
如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭
包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。
因而在使用闭包的时候注意一个原则：如果该闭包会一直使用，那么它可以作为全局变量而存在；但如
果使用频率不高，而且占用内存⼜比较大的话，那就尽量让它成为一个局部变量。3、闭包的回收

169