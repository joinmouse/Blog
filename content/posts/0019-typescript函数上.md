---
title: "TypeScript函数(上)"
date: 2019-08-06
issue_number: 19
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/19"
---
### JavaScript中定义函数
```
// Named function
function add(x, y) {
    return x + y;
}

let myAdd = function(x, y) { 
    return x + y; 
};
```

### 为函数定义类型
这里给每个参数添加类型之后再为函数本身添加返回值类型
```
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { 
    return x + y; 
};
```

### 可选参数、默认参数
TypeScript里的每个函数参数都是必须的，传递给一个函数的参数个数必须与函数期望的参数个数一致。
```
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ok
```

- 可选参数
和接口中一样`?`表示可选的参数
```
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");  // Bob
let result2 = buildName("Bob", "Adams");  // Bob Adams
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
```

- 默认参数
```
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
```

### 剩余参数
```
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```
剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个


