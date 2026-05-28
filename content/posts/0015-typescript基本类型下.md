---
title: "TypeScript基本类型(下)"
date: 2019-08-05
issue_number: 15
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/15"
---
### 任意值 any
有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用any类型来标记这些变量：
```
let notSure: any = 4;
notSure = "maybe a string instead"; //ok, 赋值字符串
notSure = false; // ok，赋值布尔类型
```

### 空值 void
某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是void
```
function warnUser(): void {
    console.log("This is my warning message");
}
```

### Object
```
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

### 类型断言
类型断言有两种形式。 其一是“尖括号”语法
```
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

另一种as语法
```
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```


