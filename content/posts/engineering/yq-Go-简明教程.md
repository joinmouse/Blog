---
title: "Go 简明教程"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

Go的数组和C一样，声明一个数组时需要 指定它的长度，一旦指定了长度，那么它的长度值是不可以改
变的。
很多时候，我们在事前并不知道数组的长度是多少, 这时候就需要sl ices1、数组、切片和映射
数组 Arrays
切片 Slices//声明长度为 10 的数组
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
// make 相当于其他语言的 new
scores := make([]int, 10)1
3
5
创建切片 Go

83Go 语言中的映射，就好比其他语言中的 hash 表或者字典。
struct就是一个把一些基础的数据类型组合成一个复杂的数据类型
go中interface是通用数据类型，有点类似t s中的u nknown，这里也可以使用断言在进行对类型断言映射 map
2、结构体、i nterface
结构体 struct
接口 interfacefunc main() {
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
// 定义一个结构体
type Book struct {
    title string
    author string
}
unkonwn1
3
5
7
struct Go

84计算机科学领域， 反射是指一类应用，它们能够自描述和自控制。也就是说，这类应用通过采用某种机
制来实现对自己行为的描述（self -representation）和监测（e xamination），并能根据自身行为的状态
和结果，调整或修改应用所描述行为的状态和相关的语义。
每种语言的反射模型都不同，并且有些语言根本不支持反射。G olang语言实现了反射， 反射机制就是在
运行时动态的调用对象的方法和属性 ，官方自带的r eflect包就是反射相关的， Golang的gRPC也是通过
反射实现的。3、反射 reflect
反射基本原理func funcName (a interface {}) string {
    // 这里是对 a 断言为 string
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