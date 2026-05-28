---
title: "TypeScript之接口(一)"
date: 2019-08-05
issue_number: 16
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/16"
---
### 初探

类检查器查看`printLabel`的调用， printLabel有一个参数labelledObj对象，要求该对象中有一个名为label的字符串属性

```
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```
上面用函数写出的代码非常不易阅读，我们用接口来描述就是：参数对象是必须包含一个label属性且类型为string

```

interface LabelledValue {
    label: string
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label)
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```
LabelledValue接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个label属性且类型为string的对象


### 可选属性
可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个`?`符号
```
interface Square {
    color: string
    area: number
}

interface SquareConfig {
    color?: string
    width?: number
}

function createSquare(config: SquareConfig):Square {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}
```
可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误


### 只读属性
一些对象属性只能在对象刚刚创建的时候修改其值，这里可以在属性名前用readonly来指定只读属性
```
interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5   // error
```

TypeScript具有ReadonlyArray<T>类型，它与Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：
```
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```





