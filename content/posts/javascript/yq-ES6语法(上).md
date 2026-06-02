---
title: "ES6语法(上)"
date: 2021-01-01
tags: ["ES6"]
---

## 1、var-let-const

- var可声明前置

```javascript
a = 3
var a
var a = 4
```

- let/const不可声明前置

```javascript
a = 3
let a  //Uncaught ReferenceError: Cannot access 'a' before initialization
```

- let/const不可重复声明

```javascript
let a = 3
let a = 4  // Uncaught SyntaxError: Identifier 'a' has already been declared
var a = 5
```

- let/const 存在块级作用域

```javascript
for(let i=0; i<3; i++) {
    console.log("i: ", i)
}
console.log("end: ", i)  // Uncaught ReferenceError: i is not defined
```

暂时性死区(TDZ)：在let变量声明之前都是该变量的死区，在死区内该变量不可使用

- const声明常量不可改变

```javascript
const a = 1
a = 2 // Assignment to constant variable

const obj = {a: 1}
obj.a = 2
obj = {a: 3}  // Assignment to constant variable
```

## 2、解构赋值

- 数组的解构赋值

```javascript
let [a, b, c] = [1,2,3]
console.log(a, b, c)

let [a, b=2] = [3]
a //3
b //2

let [a=2, b=3] = [undefined, null]
a //2
b //null
```

- 对象的解构赋值

```javascript
let {name, age} = {name: "joinmouse", age: 13}
name // joinmouse
age  // 13

// 默认值
let {x, y=5} = {x: 1}
x // 1
y //5
```

- 函数解构

```javascript
function add([x=1, y=2]) {
    return x+y
}
add() //3
add([2]) // 4
add([3, 4]) // 7
```

## 3、数组-函数-对象

- 数组拓展

```javascript
var a = [1, 2]
console.log(...a) //1,2
var b = [...a, 3]
console.log(b)  //1,2,3
```

- 函数参数的扩展

```javascript
function sort(...arr) {
    console.log(arr.sort())
}
sort(3, 1, 5)  // [1,3,5]

function max(arr) {
    return Math.max(...arr)
}
max([3, 4, 1])  // 4

function m1({x = 0, y = 0} = {}) {
    return [x, y]
}
m1()  //[0, 0]
m1({x: 3, y: 0})  //[3, 0]
m1({})  //[undefined, undefined]
```

- 类数组对象转数组

```javascript
let p = document.querySelectorAll("p")
Array.form(p).forEach(item => {
    console.log(item.innerText)
})

// 使用拓展操作符后
let p = document.querySelectorAll("p")
[...p].forEach(item => console.log(item.innerText))
```

## 4、Class和继承

- 构造函数

- 静态方法

- 继承

## 5、模块化

- 变量导入/导出

- 函数导入/导出

- 默认导出
