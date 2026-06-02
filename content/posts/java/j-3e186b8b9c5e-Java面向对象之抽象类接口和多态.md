---
title: "Java面向对象之抽象类、接口和多态"
date: 2019-03-19
slug_jianshu: 3e186b8b9c5e
tags: []
state: open
source: "https://www.jianshu.com/p/3e186b8b9c5e"
source_kind: jianshu
---
## 抽象类

-   Java中抽象类表示的是一种继承关系，一个类只能继承一个抽象类  
    抽象类

```
public abstract class Employee {
   private String name;
   public abstract  display()   // 抽象方法
}
```

## 接口

-   Java提供了关键字interface来申明一个接口。接口可以规定方法的原型：方法名、参数列表以及返回类型，但不规定方法主体。interface 关键字用来声明一个接口

接口的属性:  
1、接口默认就是抽象的。当需要声明一个接口的时候不需要使用 abstract 关键字。  
2、口中的每个方法默认也是抽象的，所以 abstract 关键字也不需要。  
3、接口中的方法默认是 public 的。

```
interface Animal {
  public void eat();
  public void travel();
}
```

接口的实现

```
public class MammalInt implements Animal{
public void eat(){
System.out.println("Mammal eats");
}
public void travel(){
System.out.println("Mammal travels");
}
public int noOfLegs(){
return 0;
}
public static void main(String args[]){
MammalInt m = new MammalInt();
m.eat();
m.travel();
}
}
```

## 多态

-   多态是指对象能够有多种形态
-   多态是同一个行为具有多个不同表现形式或形态的能力，如:

多态展示

我们看一个代码的实例

```
public class Test {
    public static void main(String[] args) {
      show(new Cat());   // 以 Cat 对象调用 show 方法
      show(new Dog());   // 以 Dog 对象调用 show 方法
                
      Animal a = new Cat();  // 向上转型  
      a.eat();               // 调用的是 Cat 的 eat
      Cat c = (Cat)a;        // 向下转型  
      c.work();        // 调用的是 Cat 的 work
   }
   
   // 定义的一个方法show         
   public static void show(Animal a)  {
        a.eat();  
        // 类型判断
        if (a instanceof Cat)  {  // 猫做的事情 
            Cat c = (Cat)a; 
            c.work();  
        } else if (a instanceof Dog) { // 狗做的事情 
            Dog c = (Dog)a;  
            c.work();  
        }  
    }  
}

//  抽象类 Animal
abstract class Animal {  
    abstract void eat();  
}
  
// Cat继承抽象类
class Cat extends Animal {  
    public void eat() {  
        System.out.println("吃鱼");  
    }  
    public void work() {  
        System.out.println("抓老鼠");  
    }  
}  
 
// Dog继承抽象类
class Dog extends Animal {  
    public void eat() {  
        System.out.println("吃骨头");  
    }  
    public void work() {  
        System.out.println("看家");  
    }  
}
```
