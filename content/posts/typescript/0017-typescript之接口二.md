---
title: "TypeScript之接口(二)"
date: 2019-08-05
issue_number: 17
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/17"
---
### 额外属性检查
表示`SquareConfig`有任意数量的其他属性
```
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

### 可索引的类型
我们希望可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`
可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型
```
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```
当前的索引签名表示了当用number去索引StringArray时会得到string类型的返回值。


### 函数类型
使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义，参数列表里的每个参数都需要名字和类型。
```
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
```
函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的




