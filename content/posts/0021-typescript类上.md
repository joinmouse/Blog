---
title: "TypeScript类(上)"
date: 2019-08-06
issue_number: 21
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/21"
---
ECMAScript 6开始，JavaScript程序员将能够使用基于类的面向对象的方式

### 类
这里写一个简单的例子，如果熟悉面向对象或者ES6语法看下面应该很熟悉
```
class Greeter {
    greeting: string;
    
    constructor(message: string) {
        this.greeting = message
    }
    
    greet() {
        return `hello, ${this.greeting}`
    }
}

let greeter = new Greeter('world')
console.log(greeter.greet())
```

### 继承
先来写一个最基本的继承的例子
```
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof!, Woof!')
    }
}

let dog = new Dog()
dog.bark()
dog.move()
dog.move(10)
```

接下来看一个复杂一点的类的继承的例子
```
class Animals {
    name: string;
    constructor(theName: string) {
        this.name = theName
    }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animals {
    // super会执行父类中的构造函数
    // 构造函数里访问this的属性之前，我们一定要调用super()
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animals {
    constructor(name: string) { 
        super(name); 
    }
}

let sam = new Snake("Sammy the Python");
let tom = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

### 公共，私有与受保护的修饰符
- 默认为public
TypeScript里，成员都默认为`public`, 当然我们也可以用public来标明
```
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```
- 理解private
private表示私有的，当类中成员被`private`标记的时候，它就不能在声明它的类的外部访问
```
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容.
```
例子中有Animal和Rhino两个类，Rhino是Animal类的子类。 还有一个Employee类，其类型看上去与Animal是相同的。 我们创建了几个这些类的实例，并相互赋值来看看会发生什么。 因为Animal和Rhino共享了来自Animal里的私有成员定义private name: string，因此它们是兼容的。 然而Employee却不是这样。当把Employee赋值给Animal的时候，得到一个错误，说它们的类型不兼容。 尽管Employee里也有一个私有成员name，但它明显不是Animal里面定义的那个。

- 理解protected
protected修饰符与private修饰符的行为很相似，不同之处在于，protected成员在派生类中仍然可以访问
```
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name);   // error
```
我们不能在Person类外使用name，但是我们仍然可以通过Employee类的实例方法访问，因为Employee是由Person派生而来的

构造函数也可以被标记为protected, 但是这个类不可以在类外部被实例化，继承是可以的
```
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee 能够继承 Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
```

### readonly 修饰符
可以使用readonly 修饰符将关键字属性设置为只读
```
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
```





