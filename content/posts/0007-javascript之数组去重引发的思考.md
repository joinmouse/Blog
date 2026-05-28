---
title: "JavaScript之数组去重引发的思考"
date: 2019-04-29
issue_number: 7
tags: []
state: open
source: "https://github.com/joinmouse/Blog/issues/7"
---
### 一、使用ES6属性Set去重

在ES6中对set的定义是:  Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用,
因此我们可以利用这个特性来是实现去重
```
const numbers = [2,3,4,4,2,3,3,4,4,5,5,6,6,7,5,32,3,4,5]
console.log([...new Set(numbers)])    
// [2, 3, 4, 5, 6, 7, 32]
```

### 二、其他方式去重

```
const object = {}
const array = [2,3,4,4,2,3,3,4,4,5,5,6,6,7,5,32,3,4,5]
array.map((number) => {
    object[number] = true
})
// 这一步object的key将都被默认设置为字符串
console.log(object)
let arrayStr = Object.keys(object)
// 便利将每项的字符串转化为10进制数字
arrayStr.map((s) => parseInt(s, 10))
```

### 思考
去重其实应该是我们经常会用到，第一反应就是使用Set就好了(IE11以上都是支持Set的），至于第二种方法的了解对我们日常开发貌似也并没有什么卵用，但是当我看到第二种方式的实现的时候，我还是很想把它记录下来。
- 这里使用`object[number] = true`用对象下标的形式实现相当巧妙，nice
- 但是对象不可以使用数字做下标，所以这里object的key都会转换为字符串, 我们是否知道？
- 然后通过Object.keys来获取对象所有的key,得到一个字符串的数组
- 通过遍历的时候，我们是否知道parselnt可以传递两个参数，后面一个参数代表的是进制?

希望保持一颗沉淀的心

