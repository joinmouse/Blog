---
title: "Go 简明教程"
date: 2026-06-01
slug_yuque: xt9h4g61ylw0bq4t
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/xt9h4g61ylw0bq4t"
source_kind: yuque
---

返回文档1、数组、切片和映射
数组 Arrays
Go的数组和C一样，声明一个数组时需要指定它的长度，一旦指定了长度，那么它的长度值是不可以改变的。
​Go运行代码复制代码99123456789101112//声明长度为10的数组var scores [10]int scores[0] = 399
// 初始化数组的时候指定值，默认为0scores2 := [4]int{9001, 9333, 212, 33}
// 遍历迭代数组for index, value := range scores2 {    }

切片 Slices
很多时候，我们在事前并不知道数组的长度是多少, 这时候就需要slices
​创建切片Go运行代码复制代码912345// 声明 slicesscores := []int{1,4,293,4,9}
// make相当于其他语言的newscores := make([]int, 10)
映射 map
Go 语言中的映射，就好比其他语言中的 hash 表或者字典。
​mapGo运行代码复制代码9123456789func main() {  lookup := make(map[string]int)  lookup["goku"] = 9001  power, exists := lookup["vegeta"]
  // prints 0, false  // 0 is the default value for an integer  fmt.Println(power, exists)}
2、结构体、interface
结构体 struct
struct就是一个把一些基础的数据类型组合成一个复杂的数据类型
​structGo运行代码复制代码91234567// 定义一个结构体type Book struct {    title string    author string}
unkonwn接口 interface
go中interface是通用数据类型，有点类似ts中的unknown，这里也可以使用断言在进行对类型断言
​9912345678910111213func funcName(a interface{}) string {    // 这里是对a断言为string    value, ok := a.(string)        if !ok {            fmt.Println("It is not ok for type string")            return ""    }    fmt.Println("The value is ", value)

    return value}
3、反射 reflect
计算机科学领域，反射是指一类应用，它们能够自描述和自控制。也就是说，这类应用通过采用某种机制来实现对自己行为的描述（self-representation）和监测（examination），并能根据自身行为的状态和结果，调整或修改应用所描述行为的状态和相关的语义。

每种语言的反射模型都不同，并且有些语言根本不支持反射。Golang语言实现了反射，反射机制就是在运行时动态的调用对象的方法和属性，官方自带的reflect包就是反射相关的，Golang的gRPC也是通过反射实现的。
反射基本原理

![](https://cdn.nlark.com/yuque/0/2023/png/158659/1699258425051-9fcc4f35-34b5-4d9a-8631-1c7e944eaae4.png)
​若有收获，就点个赞吧