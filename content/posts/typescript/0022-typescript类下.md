---
title: "TypeScript类(下)"
date: 2019-08-06
issue_number: 22
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/22"
---
### static 静态属性
在下面的Grid这个类中，如同实例属性上使用this.前缀来访问属性一样，这里我们使用Grid.来访问静态属性
```
class Grid {
    static origin = {
        x: 0,
        y: 0
    }
    calculateDistanceFromOrigin(point: {x: number, y: number}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor(public scale: number) {}
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

### 抽象类
抽象类做为其它派生类的基类使用，  它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。
```
abstract class Department {
    constructor(public name: string) {}
    printName(): void {
        console.log('Department name: ' + this.name);
    }
    // 抽象方法
    abstract printMeeting(): void; // 必须在派生类中实现
}

// 继承抽象类
class AccountingDepartment extends Department {
    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();

department = new Department(); // 错误: 不能创建一个抽象类的实例
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

### 高级技巧
在TypeScript中申明一个类，并使用的场景
```
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

我们看下这个函数编译后，转为的JS代码

```
let Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();

let greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```
let Greeter将被赋值为构造函数。 当我们调用new并执行了这个函数后，便会得到一个类的实例。接下来我们改造一下
```
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());

// 使用typeof Greeter，意思是取Greeter类的类型，而不是实例的类型
let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";
```

我们这里还是看下编译之后的js代码，还是很有意思的，关于静态类的实现
```
/* class */
var Greete = (function () {
    function Greete() {
    }
    Greete.prototype.greet = function () {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greete.standardGreeting;
        }
    };
    Greete.standardGreeting = "Hello, there";
    return Greete;
}());
```

### 类当做接口来使用
类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类
```
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```
