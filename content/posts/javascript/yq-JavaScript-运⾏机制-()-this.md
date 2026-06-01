---
title: "JavaScript 运⾏机制 (): this"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

之前的⽂章写了词法作⽤域、作⽤域链以及闭包，这篇将写另外⼀个很重要的点就是this，关于this其实
之前也写了不少⽂章，这次还是从执⾏上下⽂的视⻆去看待this
还是先从⼀段代码说起
结合之前的⽂章，我们知道最后打印出来的结果是"demo3"，这是因为JavaScript语⾔的作⽤域是由词
法作⽤域决定的，⽽词法作⽤域是由于代码结构来确定的。
但是有时候在对象内部的⽅法中使⽤内部的属性是⼀个⾮常常⻅的需求，但是JavaScript的作⽤域机制
并不⽀持这样的⼀点，基于这个需求，JavaScript于是创⽴了this机制
对于this，还是需要从执⾏上下⽂说起，前⾯的⽂章中分别介绍了执⾏上下⽂中包含变量环境、词法环
境、外部环境，今天补上最后⼀环this。1、为什么需要this
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

154this 是和执⾏上下⽂绑定的， 也就是说每个执⾏上下⽂中都含有⼀个this，执⾏上下⽂⼀般分为：全局
执⾏上下⽂、函数执⾏上下⽂和 eval 执⾏上下⽂(⽤的不多，不会做过多介绍)
我们在控制台的环境中输⼊console.log(this)，会发现最终输出的是window对象，也就是全局执⾏上下
⽂的this是指向window对象的。
这也是 this 和作⽤域链的唯⼀交点，作⽤域链的最底端包含了 window 对象，全局执⾏上下⽂中的 
this 也是指向 window 对象。
接下来，我们就来重点分析函数执⾏上下⽂中的 this。还是先看下⾯这段代码：2.1、全局执⾏上⽂中的this
2.2、函数执⾏上⽂中的this
function  foo(){
  console.log(this)
}
foo()1
3
JavaScript

155执⾏上⾯的代码我们会发现，打印的是window对象。这说明在默认情况下调⽤⼀个函数，其执⾏上下
⽂中的 this 也是指向 window 对象的，那么我们是否可以改变this的指向呢？
理解call调⽤，我们先需要去看下mdn上关于call的⽂档
https://developer.mozilla.org/zh-
CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call
我们是可以通过call⽅法来设置函数执⾏上下⽂中的this指向的，⽐如：
执⾏这段代码我们，发现使⽤call后foo函数内部的this已经指向了bar对象。
同时通过读call的⽂档我们知道，其实将第⼀个程序改写⼀下3、通过call来彻底的理解this指向
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

156通过在控制台打印的结果我们发现foo()函数的实际调⽤是foo.call(window)，默认的话是将this指向了
window
指向上⾯的代码我们会发现this指向的是myObj，使⽤对象来调⽤内部的⼀个⽅法的时候，该⽅法的this
是指向对象本身的，上⾯的代码等价于
在全局环境中调⽤⼀个函数，⽐如obj()的时候，函数内部的this是指向全局变量window的3.2、对象调⽤⽅法的this指向function  foo() {
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

157在这段代码中我们使⽤new创建了对象，但是此时构造函数 CreateObj 中的 this 到底指向了那⾥了？
其实当执⾏ new CreateObj() 的时候，JavaScript 引擎做了如下四件事：
1、⾸先创建了⼀个空对象 tempObj
2、调⽤ CreateObj.call ⽅法，并将 tempObj 作为 call ⽅法的参数，这样当 CreateObj 的执⾏上下⽂
创建时，它的 this 就指向了 tempObj 对象
3、然后执⾏ CreateObj 函数，此时的 CreateObj 函数执⾏上下⽂中的 this 指向了 tempObj 对象
4、返回 tempObj 对象
这样通过⼀个new关键字创建了⼀个新对象，并且构造函数中的this其实就是新对象本身，具体可以参
考下mdn上的new关键词⽂档：https://developer.mozilla.org/zh-
CN/docs/Web/JavaScript/Reference/Operators/new
在⼀个⼦构造函数中，你可以通过调⽤⽗构造函数的  call  ⽅法来实现继承，类似于  Jav
a  中的写法。下例中，使⽤  Food  和  Toy  构造函数创建的对象实例都会拥有在 Produc
t  构造函数中添加的  name  属性和  price  属性,但  category  属性是在各⾃的构造函数中
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

158this是为了解决函数调⽤灵活性不⾜的问题，但是有些地⽅却有不少的坑
这段代码的 showThis ⽅法⾥⾯添加了⼀个 bar ⽅法，然后接着在 showThis 函数中调⽤了 bar 函数，
那么现在的问题是：bar 函数中的 this 是什么？4、this的设计缺陷以及应对⽅案
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

159我们会觉得this 应该和其外层show函数中的 this 是⼀致的，都是指向 myObj 对象的，这很符合⼈的直
觉。但是时机上，执⾏这段代码后，我们会发现函数 bar 中的 this 指向的是全局 window对象，⽽函
数 show中的 this 指向的是 myObj 对象。这⼀点是⾮常让⼈迷惑的地⽅，需要我们注意。
解决的⽅式⽐较简单，我们可以在show函数声明⼀个变量 self ⽤来保存this，然后bar函数中使⽤
self，代码如下
执⾏这段代码，我们可以将外部的this传⼊到bar内部得到我们想要的结果。其实这个⽅式的本质是将
this体系转化为作⽤域体系
ES6中我们使⽤箭头函数也可以解决这个问题var myObj = {
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

160ES6的箭头函数并不会创建其⾃身的执⾏上下⽂，所以箭头函数中的 this 取决于它的外部函数，⾮常符
合我们的预期，因⽽现在也被⼴泛的使⽤
上⾯我们已经知道了，默认调⽤⼀个函数的时候，其执⾏上下⽂中的this是默认指向全局对象的window
但是这样设计也有⼀种缺陷，因为实际的⼯作中我们并不希望函数执⾏上下⽂中的 this默认指向全局对
象，因为这样会打破数据的边界，造成⼀些误操作。如果要让函数执⾏上下⽂中的 this 指向某个对象，
最好的⽅式是通过 call ⽅法来显示调⽤。
可以通过设置JavaScript在严格模式下解决这个问题，在严格模式下，默认执⾏⼀个函数，其函数的执
⾏上下⽂中的this值是undefined，就解决了上⾯的问题4.2、普通函数中的this 默认指向全局对象window

161JavaScript 运⾏机制 (): 作⽤域链和闭 包
上⼀篇⽂章中我们讲到了什么是作⽤域，以及 ES6 是如何通过变量环境和词法环境来同时⽀持变量提
升和块级作⽤域，在最后我们也提到了如何通过词法环境和变量环境来查找变量，这其中就涉及到作⽤
域链的概念。
理解作⽤域链是理解闭包的基础，⽽闭包在 JavaScript 中⼏乎⽆处不在，同时作⽤域和作⽤域链还是
所有编程语⾔的基础。
我们可以先将之前说到过的执⾏上下⽂环境给描画出来1、作⽤域链
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

162对于作⽤域链，其实每个执⾏上下⽂的环境中都包含了⼀个外部的引⽤，⽤来执⾏外部的执⾏上下⽂，
我们将这个外部的引⽤称之为outer
当⼀段代码使⽤了⼀个变量时，JavaScript 引擎⾸先会在“当前的执⾏上下⽂”中查找该变量，⽐如上⾯
那段代码在查找 myName 变量时，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续
在 outer 所指向的执⾏上下⽂中查找。为了直观理解，你可以看下⾯这张图：

163从图中我们可以观察到bar函数和foo函数都指向的是全局上下⽂的，这也就意味着如果在bar函数和foo
函数中使⽤了外部变量，那么 JavaScript 引擎会去全局执⾏上下⽂中查找。我们把这个查找的链条就
称为作⽤域链。
现在我们知道变量是通过作⽤域链来查找的了，不过还有⼀个疑问没有解开，foo 函数调⽤的 bar 函
数，那为什么 bar 函数的外部引⽤是全局执⾏上下⽂，⽽不是 foo 函数的执⾏上下⽂？
原因是词法作⽤域，在JavaScript 执⾏过程中，其作⽤域链是由词法作⽤域决定的
词法作⽤域：是指作⽤域是由代码中函数声明的位置来决定的，所以词法作⽤域也是静态的作⽤域，通
过它就能够预测代码在执⾏过程中如何查找标识符。
回到上⾯的例⼦，我们可以发现foo 和 bar 的上级作⽤域都是全局作⽤域，所以如果 foo 或者 bar 函
数使⽤了⼀个它们没有定义的变量，那么它们会到全局作⽤域去查找。也就是说，词法作⽤域是代码阶
段就决定好的，和函数是怎么调⽤的没有关系。

164闭包是⼀个JS很重要的概念，在不太熟悉 JavaScript 这⻔语⾔的时候，很难通过理解背后的原理来彻
底理解闭包，从⽽导致学习过程中似乎总是似懂⾮懂。更要命的是，JavaScript 代码中还总是充斥着⼤
量的闭包代码，这篇⽂章就是为了闭包⽽⽣的，通过变量环境、词法环境和作⽤域链等知识来帮助我们
更好的理解闭包
⾸先我们可以在执⾏foo函数的时候，调⽤栈如下：2、闭包
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

165innerBar 是⼀个对象，包含了 getName 和 setName 的两个⽅法，并且这两个⽅法都是在 foo 函数内
部定义的，内部使⽤了 myName 和 test1 两个变量。
根据词法作⽤域的规则：内部函数 getName 和 setName 总是可以访问它们的外部函数 foo 中的变量
因此当innerBar对象返回给全局变量bar的时候，虽然foo函数已经执⾏结束了，但是getName和
setName函数依旧可以使⽤foo 函数中的变量myName 和 test1，因此当foo函数执⾏完之后，整个调⽤
栈如下图：

166当foo函数执⾏完成之后，其执⾏上下⽂从栈顶弹出，但由于返回的setName 和 getName ⽅法中使⽤
了 foo 函数内部的变量 myName 和 test1，所以这两个变量依然保存在内存中。
这就像 setName 和 getName ⽅法背着⼀个专属背包，⽆论在那⾥调⽤了setName 和 getName⽅
法，它们都会背着整个foo函数的专属背包。之所以称之为专属背包，是因为除了setName和getName
函数之外，其他任何地⽅都⽆法访问该背包，我们将这个背包称之为foo函数的 闭包
闭包：在JavaScript中，依据词法作⽤域的规则，内部函数总是可以访问外部函数中声明的变量，当通
过调⽤⼀个外部函数返回⼀个内部函数后，即使该外部函数已经执⾏结束，但是该内部函数引⽤外部函
数的变量依然保存在内存中，我们就可以将这个变量的集合称之为闭包，⽐如外部函数是 foo，那么这
些变量的集合就称为 foo 函数的闭包。
当执⾏到bar.setName⽅法中的myName="极客邦" 的时候，JavaScript引擎会沿着 "当前执⾏上下⽂–
>foo 函数闭包–> 全局执⾏上下⽂" 的顺序来查找变量：

167当调⽤getName的时候，在Chorme控制台我们可以发现结果如下：

168通常，如果引⽤闭包的函数是⼀个全局变量，那么闭包会⼀直存在直到⻚⾯关闭；但如果这个闭包以后
不再使⽤的话，就会造成内存泄漏。
如果引⽤闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执⾏垃圾回收时，判断闭
包这块内容如果已经不再被使⽤了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。
因⽽在使⽤闭包的时候注意⼀个原则：如果该闭包会⼀直使⽤，那么它可以作为全局变量⽽存在；但如
果使⽤频率不⾼，⽽且占⽤内存⼜⽐较⼤的话，那就尽量让它成为⼀个局部变量。3、闭包的回收

169