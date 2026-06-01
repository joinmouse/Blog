---
title: "TypeScript基本类型(上)"
date: 2019-08-05
issue_number: 14
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/14"
---
### 简介
 TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用

### 常见基本数据类型
- 布尔
```
let isDone: boolean = false;
```

- 数字
```
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

- 字符串
```
let name: string = "bob";
```

- 数组

TypeScript中两种方式可以定义数组： 第一种，可以在元素类型后面接上[]，表示由此类型元素组成的一个数组：
```
let list: number[] = [1, 2, 3];
```
第二种是使用数组泛型，Array<元素类型>，关于泛型后面会介绍
```
let list: Array<number> = [1, 2, 3];
```

- 元组 Tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
```
let x: [string, number];
x = ['hello', 12];
```

- 枚举
enum类型是对JavaScript标准数据类型的一个补充。
```
enum Color {
    Red = 1,
    Green,
    Blue
}

let a: string = Color[2];

console.log(a);  //Green
```

- Null 和 Undefined
在TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null，维持了和JavaScript一致的




