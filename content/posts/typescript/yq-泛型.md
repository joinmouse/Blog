---
title: "【泛型】"
date: 2021-01-01
tags: ["TypeScript"]
---

泛型表示泛指某一种类型，开发者可以指定一个表示类型的变量，用它来作为实际类型的占位符，用尖括号来包裹类型变量<T>。泛型的主要作用是创建可重用的组件，从而让一个组件可以支持多种数据类型，它可以作用在接口、类、函数或类型别名上。

1、泛型函数
TypeScriptRun CodeCopy91234function identity<T, U>(value: T, message: U): [T, U] {    return [value, message]}identity<number, string>(1, '1')![image.png](https://cdn.nlark.com/yuque/0/2021/png/158659/1635240904210-fc1c81ff-4e48-4b65-b8d5-9de60903efa5.png)
2、泛型接口
TypeScriptRun CodeCopy991234567891011interface Idectities<V, W> {    value: V    message: W}function identity<T, U>(value: T, message: U): Idectities<T, U> {    return {        value,        message    }}identity<number, string>(2, '2')
3、泛型类
TypeScriptRun CodeCopy9912345678910111213141516171819202122interface GenericInterface<U> {    value: U    getIdentity: () => U}
class IdentityClass<T> implements GenericInterface<T> {    value: T
    constructor(value: T) {        this.value = value    }
    getIdentity(): T {        return this.value    }}
const myNumberClass = new IdentityClass<number>(68)console.log(myNumberClass.getIdentity()) // 68
const myStringClass = new IdentityClass<string>('Semlinker!')console.log(myStringClass.getIdentity()) // Semlinker!
4、泛型约束
### 4.1 确保属性存在
991234567891011interface Length {	length: number}
function identity<T extends length>(arg: T): T {	console.log(arg.length)  // 可以获取length属性  return arg}
identity(68); // Error// Argument of type '68' is not assignable to parameter of type 'Length'.(2345)T extends Length 用于告诉编译器，我们支持实现 Length 接口的任何类型。

### 4.2 检查对象上的键是否存在
keyof 操作符用于获取某种类型的所有键，其返回类型是联合类型
91234567interface Person {  name: string;  age: number;  location: string;}
type K1 = keyof Person;  // "name" | "age" | "location"通过keyof操作符，我们可以获取制定类型的所有键，之后就结合前面的extends约束，限制输入的属性包含在keyof返回的联合类型中，具体使用如下
9123function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {  return obj[key];}通过 K extends keyof T 确保参数key 一定是对象中含有的键，这样就不会出现运行时错误，这是一个类型安全的解决方案。
99123456789101112131415161718192021enum Difficulty {  Easy,  Intermediate,  Hard}
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {	return obj[key]}
let tsInfo = {   name: "Typescript",   supersetOf: "Javascript",   difficulty: Difficulty.Intermediate}
let difficulty: Difficulty = getProperty(tsInfo, 'difficulty'); // OK
let supersetOf: string = getProperty(tsInfo, 'superset_of'); // Error// Argument of type '"superset_of"' is not assignable to parameter of type // '"difficulty" | "name" | "supersetOf"'使用泛型约束，可以在编译阶段可以提前发现错误

5、泛型工具类型
为了方便开发者 TypeScript 内置了一些常用的工具类型，比如 Partial、Required、Readonly、Record 和 ReturnType 等
5.1、Partial
Partial<T> 的作用就是将某个类型里的属性全部变为可选项"?"
通过keyof T 拿到 T的所有属性名，然后使用in进行编译，将值赋值给类型变量P，最后通过 T[P] 获取属性P 对应的类型。中间的"?"号，表示将属性变为可选。
5.2、Record
Record<K extends keyof any, T> 是将K中所有的属性转换为T类型
5.3、Pick
Pick<T, K extends keyof T> 作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。
### 5.4 Exclude
Exclude<T, U> 作用是将某个类型中属于另一个的类型移除掉
### 5.5 ReturnType
获取函数T的返回类型

参考
https://mp.weixin.qq.com/s/WtTOxHKbegZHAcYopgYTrw
