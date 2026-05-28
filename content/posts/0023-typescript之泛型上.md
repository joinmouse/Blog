---
title: "TypeScript之泛型(上)"
date: 2019-08-06
issue_number: 23
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/23"
---
## 泛型简介
关于泛型，按照wiki的定义：**泛型允许程序员在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型**
在Java这门典型的面向对象编程的语言当中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据，下面直接上例子
```
function identity(arg: number): number {
    return arg;
}

function ident(arg: any): any {
    return arg;
}
```
我们创建了上面两个函数,  第一个当我们传入的是number类型，返回的也是number； 第二个使用any意味者我们传入的参数是任何类型，但是返回的也可以是任何类型。假设现在我们想到达到一个目的是传入的类型和返回的类型的相同的， 这里我们需要引入**类型变量**这个概念了。

### 类型变量
**类型变量**是一个特殊的变量，只用于表示类型而不是值。
```
function identity<T>(arg: T): T {
    return arg;
}
```
我们给identity添加了类型变量`T`，`T`帮助我们捕获用户传入的类型(比如number)，之后我们再次使用了T当做返回值类型，现在我们可以知道参数类型与返回值类型是相同的。上面的函数也被称之为泛型函数
```
let output = identity<string>('hello')  
//这里我们明确的指定了T是string类型，做为一个参数传给函数，使用了<>
```
接下来我们在深入一下, 看下面这个例子
```
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```
编译器会报错说我们使用了arg的.length属性，但是没有地方指明arg具有这个属性。这里的类型变量可以表示任何类型，所以可能传入数字，但数字就没有`,length`属性

接着来：
```
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```
这里不会报错是因为我已经指定了参数的类型是T的数组，看下Array数组的实现
```
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

