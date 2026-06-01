---
title: "JavaScript数组笔记2：ES5中新增Array方法（一）"
date: 2017-06-18
slug_jianshu: b2f438c4e013
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/b2f438c4e013"
source_kind: jianshu
---
#### 1、引言

ES5中数组新增了不少东西，现在ES5使用也比较普及，了解这些新增的方法，对我们使用JavaScript也有不少的好处  
下面的ES5新增写的数组方法：

> 1、[forEach](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)  
> 2、[map](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)  
> 3、[filter](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)  
> 4、[some](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)  
> 5、[every](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)  
> 6、[indexOf](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)  
> 7、[lastIndexOf](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)  
> 8、[reduce](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)  
> 9、[reduceRight](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)

#### 2、forEach、map、filter

> 1、forEach()方法是Array中最基本的一个，简单的循环和遍历；但也可以对数组的每个元素执行一次提供的函数

**_语法：_**

```
array.forEach(callback(currentValue, index, array){
       //do something
}, this)

array.forEach(callback[, thisArg])
```

补充衍生：对比jQuery中的`$.each`方法(callback中第一个参数正好和第二个参数相反)

```
$.each(array,callback(index,  currentValue,array){
    //do something        
})
```

forEach方法中的callback函数接受三个参数：

-   currentValue：数组当前项的值
-   index : 数组当前项的索引
-   arrry : 数组对象本身

thisArg ：可选参数，当给forEach传递了thisArg参数，调用时，将传递给callback函数，作为它的this值。

**_demo1 :一个简单的例子_**

```
var sum = 0
var arr = [1,2,3,4]

arr.forEach(function(item,index,arr) {
  console.log(arr[index] == item)
  sum += item;
})

console.log(sum)
```

image.png

**_demo2 :使用thisArg的小例子_**

```
function Counter() {
  this.sum = 0;
  this.count = 0;
}
Counter.prototype.add = function(array) {
  array.forEach(function(entry){
    this.sum += entry
    ++this.count;
},this)
  console.log(this);
}

var obj = new Counter();
obj.add([1,3,5,7]);
```

当我们new一个新的对象时，构造函数的this将绑定到新对象上，那么这里的thisArg参数(this)即在new新对象时，绑定到了新对象上

  

这里的thisArg参数即为this

**_demo3 :使用thisArg升级版例子_**

```
var database = {
  users: ["hello", "world", "wu"],
  sendEmail: function (user) {
    if (this.isValidUser(user)) {
      console.log("你好，" + user);
    } else {
      console.log("抱歉，"+ user +"，你不是本家人");  
    }
  },
  isValidUser: function (user) {
    return /^w/.test(user);
  }
};

// 给每个人法邮件
database.users.forEach(  // database.users中人遍历
  database.sendEmail,    //callback函数 -> 发送邮件
  database               // thisArg ->calllback函数中的this指向database
);

```

console结果

> 2、 map 这里的map不是’地图‘的意思，而指的’映射‘，`[].map();`,基本的用法和forEach类似

**_mdn：_** map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果

**_语法：_**

```
var new_array = arr.map(function callback(currentValue, index, array) {
      // return  element for  new_array
}[, thisArg])
```

**_demo1:一个简单的小例子_**

```
var data = [1,2,3,4]

var arrSquares = data.map(function(item){
  return item*item        //callback需要有return值，若无则返回undefined
})

console.log(arrSquares)
```

console结果

**_demo2:利用map方法获取对象数组中的特性属性值_**

```
var users = [
  {name: "wolrd", "email": "world@gmail.com"},
  {name: "hello",   "email": "hello@gmail.com"},
  {name: "wu",  "email": "wu@gmail.com"}
];

var emails = user.map(function(user) {
  return user.email         //遍历数组内的每一个对象       
})
console.log(emails)
console.log(emails.join(","))
```

console结果

> 延伸：在字符串String中使用map方法

**_demo1:获取字符串中每一个字符的ASCII码_**

```
var a = Array.prototype.map.call('hello world',function(x){
  return x.charCodeAt(0); 
})
console.log(a)
```

通过call方法使String->'hello world'有通过map方法来执行转换操作，将this绑定到’hello world‘字符串上

  

console结果

**_demo1:反转字符串_**

```
var str = '12345';
var a = Array.prototype.map.call(str,function(x) {
  return x
}).reverse().join('')

console.log(a)
```

console结果

> 3、filter为“过滤”、“筛选”之意。指数组filter后，返回过滤后的新数组。用法与map类似

**_mdn：_**filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

\*\*\*语法：`var new_array = arr.filter(callback[, thisArg])`

**_demo:_**

```
function isBigEnough(value) {
  return value>10;
}

var filtered = [12,5,8,101].filter(isBigEnough)
console.log(filtered)
```

console结果
