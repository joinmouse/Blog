---
title: "TypeScript泛型(下)"
date: 2019-08-06
issue_number: 24
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/24"
---
### 泛型类
泛型类使用`<>`括起泛型类型
```
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}
// 数字类型
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
// 字符串类型
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };
```

### 泛型约束
这里以定义一个接口来描述约束条件。 创建一个包含.length属性的接口，使用这个接口和extends关键字还实现约束
```
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```
```
loggingIdentity(3);  // Error, number doesn't have a .length property
// 传入符合约束类型的值，必须包含必须的属性
loggingIdentity({length: 10, value: 3});
```


