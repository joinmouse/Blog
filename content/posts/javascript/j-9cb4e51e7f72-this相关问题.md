---
title: "this相关问题"
date: 2017-06-04
slug_jianshu: 9cb4e51e7f72
tags: ["this"]
state: open
source: "https://www.jianshu.com/p/9cb4e51e7f72"
source_kind: jianshu
---
### 1、apply、call、bind有什么作用，什么区别？

-   **bind**

> Function.prototype.bind()作为内建对象Function原型的的一个方法，bind()方法创建一个新的函数，当被调用的时候，其this关键字设置为提供者的值，调用新函数时，在任何提供之前提供一个给定的参数序列。

语法：`fun.bind(thisArg[,arg1,aeg2...])`

demo

```
  this.x = 9   //window.x =9 
  var module = {
    x:81,
    getX: function(){
      console.log(this.x);
    }
  }
  module.getX();     //返回81，this指向module对象
  
  var retrieveX =   module.getX
  retrieveX();      //返回9，this指向全局作用域  

  //创建一个新的函数，将"this"绑定到module对象
  var boundGetX =  retrieveX.bind(module);
  boundGetX();   //返回81，通过bind()方法改变this的指向
```

-   **call**、 **apply**

> call()方法的作用和apply()类似，只有一个区别，就是call()方法接受的是若干个参数的列表，而apply()方法接受的是一个包含多个参数的数组。

call()语法：`fun.call(thisArg[, arg1[, arg2[, ...]]])`

call-demo

```
//使用call方法调用匿名函数
  var animals = [
    {species:'Lion',name:'King'},
    {species:'Whale',name:'Fail'}
  ]
  for(var i=0;i<animals.length;i++){
    (function(i){
      this.print = function(){
        console.log('#'+i+' '+this.species+ ' : ' + this.name)
      }
      this.print();
    }).call(animals[i],i);
  }
```

apply()语法：`fun.apply(thisArg, [argsArray])`

apply-demo

```
var numbers = [5,6,2,3,7,8]

var max = Math.max.apply(null,numbers)
var min = Math.min.apply(null,numbers)

console.log(max)
console.log(min)
```

### 2、

```
var john = { 
  firstName: "John" 
}
function func() { 
  alert(this.firstName + ": hi!")
}
john.sayHi = func
john.sayHi()        //John:hi!
```

### 3、

```
func() ；   //Object window ,函数内的this在函数直接调用的时候在非严格模式下指向window
function func() { 
  alert(this)
}
```

### 4、

```
document.addEventListener('click', function(e){
    console.log(this);         //#document
    setTimeout(function(){
        console.log(this);     //window
    }, 200);
}, false);
```

### 5、

```
var john = { 
  firstName: "John" 
}

function func() { 
  alert( this.firstName )
}
func.call(john)      //John,通过call将函数func的this绑定到了john对象上
```

### 6、以下代码有什么问题，如何修改

```
var module= {
  bind: function(){
    $btn.on('click', function(){
      console.log(this)     //this指向$btn
      this.showMsg();
    })
  },
  
  showMsg: function(){
    console.log('饥人谷');
  }
}
```

**修改:**

```
var module= {
  bind: function(){
    $btn.on('click', function(){
      console.log(this)     //通过bind()方法将this绑定到module上
      this.showMsg();
    }).bind(module)
  },
  
  showMsg: function(){
    console.log('饥人谷');
  }
}
```
