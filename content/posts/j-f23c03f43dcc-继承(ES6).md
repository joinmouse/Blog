---
title: "继承(ES6)"
date: 2017-11-28
slug_jianshu: f23c03f43dcc
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/f23c03f43dcc"
source_kind: jianshu
---
#### 1、简介

在ES6中，我们定义类用Class，而继承通过extends关键字实现继承，这相比于ES5的通过修改原型链实现继承，更加的清晰和方便

```
class Person {
}

class Male extends Person {
}
```

现在我们在继承Person的类Male中添加一些属性和方法

```

class Male extends Person {
  constructor(x, y, color) {
    super(x, y);           // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString();    // 调用父类的toString()
  }
}
```

这里有一个很重要的点我们需要注意：**子类必须在constructior方法中调用super方法**，否则新建的实例会报错，因为**子类没有自己的this对象，而是继承父类的this对象**，然后对其进行加工。若不调用super方法，子类就得不到this对象

#### 2、继承的实质

我们知道在ES5的继承中，是先创造了子类的实例对象this，然后将父类的方法添加到this上(Person.bind(this))，详见上一篇文章[继承ES5](https://www.jianshu.com/p/6d068d062307)。  
ES6中的继承机制是这样的：先创造父类的实例对象this(所以必须先调用super方法)，然后再用子类的构造函数来修改this。

-   关于construction方法：  
    子类没有定义constructor方法，这个方法会被默认添加。也就是说，不管有没有显式定义，任何一个子类都有constructor方法。

```
class Male extends Person {
}

// 等同于
class Male extends Person {
  constructor(...args) {
    super(...args);     //只有调用super后，才可以使用this关键字
  }
}
```

#### 3、super关键字

第一种情况：super作函数，只能出现在子类的构造函数中

```
class A1 {
  constructor() {
    console.log(new.target.name)  //new.target指向当前正在执行的函数
  }
}

// super虽然代表父类A的构造函数，但返回子类B的实例
class B1 extends A1 {
  constructor() {
    //super相当于：A1.prototype.constructor.call(this)
    super()
  }
}
new A1()  // A1
new B1()  // B
```

第二种情况：super作对象时，指向父类的原型对象

```
class A2 {
  p() {
    return 2
  }
}

class B2 extends A2 {
  constructor() {
    super()
    console.log(super.p())  //2
  }
}

let b = new B2()  //2
```

需要补充一点的是：当super调用父类方法，方法内部的this指向子类

```
class A3 {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B3 extends A3 {
  constructor() {
    super();
    this.x = 3;
  }
  m() {
    super.print();
  }
}

let b3 = new B3();
b3.m()   // 3
```

#### 4、Class语法糖继承的实现

在ES5中，每一个实例对象都有\_\_\_proto\_\_\_\_属性，指向对应的构造函数的prototype属性。Class 作为构造函数的语法糖，同时有prototype属性和\_\_\_\_proto\_\_\_\_属性，因此同时存在两条继承链。

-   子类的的\_\_\_\_proto\_\_\_\_属性，表示构造函数的继承，总是指向父类
-   子类prototype属性的\_\_\_\_proto\_\_\_\_属性，表示方法的继承，总是指向父类的prototype属性。

Demo

```
class A {
}

class B extends A {
}

B.__proto__ === A    // true 构造函数的继承
B.prototype.__proto__ === A.prototype   // true 方法的继承
```

实现的方式：`Object.setPrototypeOf()`

```
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于B.prototype.__proto__ = A.prototype;

// B 的实例继承 A 的静态属性
Object.setPrototypeOf(B, A);
// 等同于B.__proto__ = A;
```

补充说明：Object.setPrototypeOf()的实现

```
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```
