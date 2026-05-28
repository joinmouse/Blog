---
title: "TypeScript之接口(三) "
date: 2019-08-05
issue_number: 18
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/18"
---
### 类类型
实现接口
```
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d
    }
    constructor(h: number, m: number) { }
}
```
接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员


### 继承接口
和类一样，接口也可以相互继承
```
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```
值得注意的是接口也可以同时继承多个接口


### 混合类型
接口能够描述JavaScript里丰富的类型， 有时你会希望一个对象可以同时具有上面提到的多种类型。
```
// 一个对象可以同时做为函数和对象使用，并带有额外的属性。
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 接口继承类
接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）
```
class Control {
    private state: any;
}

// 接口继承类
interface SelectableControl extends Control {
    select(): void;
}

// Button继承Control类，实现SelectableControl接口
class Button extends Control implements SelectableControl {
    select() { }
}

// Error: Property 'state' is missing in type 'Image'.
class Image implements SelectableControl {
    select() { }
}
```


