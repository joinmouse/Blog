---
title: "Go 简明教程"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

Go的数组和C⼀样，声明⼀个数组时需要 指定它的⻓度，⼀旦指定了⻓度，那么它的⻓度值是不可以改
变的。
很多时候，我们在事前并不知道数组的⻓度是多少, 这时候就需要sl ices1、数组、切⽚和映射
数组 Arrays
切⽚ Slices//声明⻓度为 10 的数组
var scores [10]int 
scores[0] = 399
// 初始化数组的时候指定值，默认为 0
scores2 := [4]int{9001, 9333, 212, 33}
// 遍历迭代数组
for index, value := range scores2 {
    
}1
3
5
7
9
11
Go
// 声明 slices
scores := []int{1,4,293,4,9}
// make 相当于其他语⾔的 new
scores := make([]int, 10)1
3
5
创建切⽚ Go

83Go 语⾔中的映射，就好⽐其他语⾔中的 hash 表或者字典。
struct就是⼀个把⼀些基础的数据类型组合成⼀个复杂的数据类型
go中interface是通⽤数据类型，有点类似t s中的u nknown，这⾥也可以使⽤断⾔在进⾏对类型断⾔映射 map
2、结构体、i nterface
结构体 struct
接⼝ interfacefunc main() {
  lookup := make(map[string]int)
  lookup["goku"] = 9001
  power, exists := lookup["vegeta" ]
  // prints 0, false
  // 0 is the default value for an integer
  fmt.Println(power, exists)
}1
3
5
7
9
map Go
// 定义⼀个结构体
type Book struct {
    title string
    author string
}
unkonwn1
3
5
7
struct Go

84计算机科学领域， 反射是指⼀类应⽤，它们能够⾃描述和⾃控制。也就是说，这类应⽤通过采⽤某种机
制来实现对⾃⼰⾏为的描述（self -representation）和监测（e xamination），并能根据⾃身⾏为的状态
和结果，调整或修改应⽤所描述⾏为的状态和相关的语义。
每种语⾔的反射模型都不同，并且有些语⾔根本不⽀持反射。G olang语⾔实现了反射， 反射机制就是在
运⾏时动态的调⽤对象的⽅法和属性 ，官⽅⾃带的r eflect包就是反射相关的， Golang的gRPC也是通过
反射实现的。3、反射 reflect
反射基本原理func funcName (a interface {}) string {
    // 这⾥是对 a 断⾔为 string
    value, ok := a.(string)
    
    if !ok {
            fmt.Println("It is not ok for type string" )
            return ""
    }
    fmt.Println("The value is " , value)
    return value
}1
3
5
7
9
11
13
Go

86