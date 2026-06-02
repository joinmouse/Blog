---
title: "基础 | 参数传递调用方式"
date: 2021-01-01
tags: ["JS深入浅出"]
---

1、引子
最近觉得stackoverflow 上一个问题吸引了：[Is JavaScript a pass-by-reference or pass-by-value language?](https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language)
问的是JS是一门传引用调用的还是传值调用的语言，我们知道JS语言的数据类型分为基础数据类型(除object外)和引用数据类型(object)

2、函数调用的求值策略
首先我们需要明确的是这里的传值调用和传引用调用说的对象是谁(没错，我开始一直和数据类型混淆了)，他们说的是在函数调用传入的参数求值的时候，是值传递还是引用传递？

其实值传递还是引用传递是计算机的专用名词，理解的时候不要讲任何语言的概念向上套，比较容易引起误解。
值传递和引用传递，属于函数在调用的时候的求值策略，这是对调用函数时，求值和传值方式的描述，而传递内容的类型，也就是说和数据类型中的值类型、引用类型无关。

值类型/引用类型，是用于区分两种内存分配方式，值类型在调用栈上分配，引用类型在堆上分配。说白了一种是描述内存的分配方式，一种是描述参数求值时候的求值策略，两者是不同层面上的概念，也没有依赖和约束关系

3、按值传递 (pass-by-value)
在《JavaScript高级程序设计》第三版 4.1.3，讲到传递参数

ECMAScript中所有函数的参数都是按值传递的

什么是按值传递呢？

也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样

举个例子
JavaScriptRun CodeCopy91234567var value = 1function foo(v) {    v = 2    console.log(v)}foo(value) //2console.log(value) // 1当传入的value到函数foo中，相当于拷贝一份value，假设拷贝的这份叫 _value，函数中修改的都是 _value 的值，而不会影响原来的 value 值。

4、引用传递（Pass by reference）
拷贝很容易理解，但是当引入的是一个复杂的数据结构，拷贝就会产生性能问题，因此还有一种方式是按引用传递，

所谓按引用传递，就是传递对象的引用，函数内部对参数的任何改变都会影响该对象的值，因为两者引用的是同一个对象。

举个例子如下
JavaScriptRun CodeCopy9123456789ar obj = {    value: 1};function foo(o) {    o.value = 2;    console.log(o.value) //2}foo(obj)console.log(obj.value) // 2这里我们发现怎么按照引用传递也可以成功，之前不是说都是按值传递嘛，其实在这两种传递之外还有一种传递方式

5、传共享调用（Call by sharing）
我们先来看下ECMAscript中对call by sharing的定义：

The main point of this strategy is that function receives the copy of the reference to object. This reference copy is associated with the formal parameter and is its value.
Regardless the fact that the concept of the reference in this case appears, this strategy should not be treated as call by reference (though, in this case the majority makes a mistake), because the value of the argument is not the direct alias, but the copy of the address.
The main difference consists that assignment of a new value to argument inside the function does not affect object outside (as it would be in case of call by reference). 

翻译一下如下：
这种策略的要点在于函数接收对象引用的副本。这个所引用副本与形式参数关联并且作为其值。
不管本例中引用的概念是否出现，都不应将此策略视为按引用调用（尽管在这种情况下，大多数人会出错），因为参数的值不是直接别名，而是地址的副本。
主要区别在于，给函数内部的参数赋值不会影响外部对象（就像引用调用时一样），但是由于地址副本的形势参数可以访问同一个对象（即，外部的对象没有像按值调用时那样完全复制），所以局部参数对象属性的更改会反应在外部对象中，局部参数对象属性的更改-反映在外部对象中。

重点关注一下加粗的文字就好了，是地址的副本，也就是拷贝了一份引用地址

举个例子如下
我们来看这里，如果是按照引用传递，那么外层的值也会被修改，而按照共享传递是对象的引用的副本，进入函数foo后将地址改为了2，但是不影响外部的obj对象。

而上一个按照引用传递的例子中，修改o.value，可以通过引用找到原值，因而会被修改掉；而这个例子中直接修改o，并不会修改原值，所以第二个例子和第三个都属于按照共享传递

6、总结
参数是基本类型的时候是按值传递
参数为引用类型的类型的时候是按照共享传递

但拷贝副本也属于值的拷贝，所以高程中统一称之为按值传递

| Strategy 策略 | Value | 修改内容 | 替换内容 |
| --- | --- | --- | --- |
| By Value | full content copy | no | no |
| By Reference | address | yes | yes |
| By Share | address copy | yes | no |

参考：
https://www.zhihu.com/question/20628016/answer/28970414
https://github.com/mqyqingfeng/Blog/issues/10
1 like

- ![joinmouse](https://cdn.nlark.com/yuque/0/2019/png/158659/1560488687824-avatar/bfe21c43-8448-4b33-acf8-a70bee99e258.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng)
1