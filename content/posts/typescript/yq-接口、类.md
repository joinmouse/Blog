---
title: "【接口、类】"
date: 2021-01-01
tags: ["Java", "面向对象", "TypeScript"]
---

接口：可用来约束对象、函数、类的类型和结构

TypeScriptRun CodeCopy9912345678910111213141516171819202122232425262728293031323334353637// 接口定义interface List {    id: number,    name: string}interface Result {    data: List[]}
function render(result: Result) {    result.data.forEach((value) => {        console.log(value)    })}let result = {    data: [        {id: 1, name: "A", sex: "male"},        {id: 2, name: "B"},    ]}render(result)

// 函数类型别名type Add = (x: number, y: number) => numberlet add:Add = (a, b) => a+badd(10, 12)
// 混合类型interface Lib {    (): void,    version: string,    doSomeThing(): void}// 单例封装function getLib() {    let lib: Lib = (() => {}) as Lib;
