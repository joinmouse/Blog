---
title: "字符串与JSON"
date: 2017-05-07
slug_jianshu: 791ca4b42bbd
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/791ca4b42bbd"
source_kind: jianshu
---
#### 1、使用数组拼写如下字符串

```
将上面的对象prod转为下面的html格式输出
var prod = {
    name: '女装',
    styles:['短款','冬季','春装']
  };
<dl>
  <dt>女装</dt>
  <dd>短款</dd>
  <dd>冬季</dd>
  <dd>春装</dd>
</dl>
```

使用数组遍历拼接

-   输出结果：

执行代码

#### 2、写出两种以上声明多行字符串的方法

-   使用转义换行字符：\\n

\\n为换行符

-   使用数组的join内置方法进行转换

在数组中添加换行符\\n

3、

```
var str = 'hello\\\\饥人谷'
console.log(str)
```

console中执行

4、  
**输出：**13  
转义字符使用了\\n换行，转义字符占据了一个占位符，但行间的空格并为计算在长度中

5、写一个函数，判断一个字符串是回文字符串，如 abcdcba是回文字符串, abcdcbb不是.

判断函数

console执行结果

#### 6、写一个函数，统计字符串里出现出现频率最多的字符

vscode

  

执行结果如下：

  

console

#### 7、写一个camelize函数，把my-short-string形式的字符串转化成myShortString形式的字符串

vscode

console

#### 8、写一个 ucFirst函数，返回第一个字母为大写的字符

vscode

console

#### 9、写一个函数truncate(str, maxlength), 如果str的长度大于maxlength，会把str截断到maxlength长，并加上...

vscode

console

#### 10、什么是 json？什么是 json 语言？JSON 语言如何表示对象？window.JSON 是什么？

-   JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。它基于JavaScript（Standard ECMA-262 3rd Edition - December 1999）的一个子集。相比XML格式，JSON书写简单，一目了然；而且符合JavaScript原生语法，可以由解释引擎直接处理，不用另外添加解析代码
    
-   JSON对象就是JSON的值，遵守以下规则：
    
    -   复合类型的值只能为数组或对象
    -   简单类型的值只有四种：string、number、boolean、null
    -   字符串必须使用双引号，单引号不行
    -   对象的key也必需使用双引号
-   对象字面量其实就是一种简单的声明方式，如`var count = { "one": 1, "two": 2, "three": 3 },`因为本身json就是JavaScript语法集的一种，所以json字面量就是用json格式的JavaScript对象字面量
    
-   JSON内置对象：经过JSON.parse()转换的值
    

#### 11、如何把JSON 格式的字符串转换为对象？如何把对象转换为 JSON 格式的字符串?.

JSON对象主要有两个静态的函数parse()、stringify()

-   parse：把字符串转化为JSON对象
-   stringify：把JSON对象转化为字符串（出人意料的不叫toString，因为不是实例方法）
    
      
    

```
var json = {
  "name": "Byron",
  "age": 24
};

 var jsonStr = JSON.stringify(json);   //将JSON对象转换为字符串
 console.log(jsonStr);
 console.log(JSON.parse(jsonStr));   //将字符串转换为JSON对象
```
