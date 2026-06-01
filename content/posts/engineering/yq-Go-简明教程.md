---
title: "Go 简明教程"
date: 2023-04-10
tags: ["语雀"]
source_kind: yuque
---

## 1、数组、切片和映射

### 数组 Arrays

Go 的数组和 C 一样，声明一个数组时需要指定它的长度，一旦指定了长度，那么它的长度值是不可以改变的。

```go
// 声明长度为 10 的数组
var scores [10]int
scores[0] = 399

// 初始化数组的时候指定值，默认为 0
scores2 := [4]int{9001, 9333, 212, 33}

// 遍历迭代数组
for index, value := range scores2 {

}
```

### 切片 Slices

很多时候，我们在事前并不知道数组的长度是多少，这时候就需要 slices。

```go
// 声明 slices
scores := []int{1, 4, 293, 4, 9}

// make 相当于其他语言的 new
scores := make([]int, 10)
```

### 映射 map

Go 语言中的映射，就好比其他语言中的 hash 表或者字典。

```go
func main() {
  lookup := make(map[string]int)
  lookup["goku"] = 9001
  power, exists := lookup["vegeta"]
  // prints 0, false
  // 0 is the default value for an integer
  fmt.Println(power, exists)
}
```

## 2、结构体、interface

### 结构体 struct

struct 就是一个把一些基础的数据类型组合成一个复杂的数据类型。

```go
// 定义一个结构体
type Book struct {
    title  string
    author string
}
```

### 接口 interface

Go 中 interface 是通用数据类型，有点类似 TypeScript 中的 unknown，这里也可以使用断言来进行类型断言。

```go
func funcName(a interface{}) string {
    // 这里是对 a 断言为 string
    value, ok := a.(string)

    if !ok {
        fmt.Println("It is not ok for type string")
        return ""
    }
    fmt.Println("The value is ", value)
    return value
}
```

## 3、反射 reflect

### 反射基本原理

计算机科学领域，反射是指一类应用，它们能够自描述和自控制。也就是说，这类应用通过采用某种机制来实现对自己行为的描述（self-representation）和监测（examination），并能根据自身行为的状态和结果，调整或修改应用所描述行为的状态和相关的语义。

每种语言的反射模型都不同，并且有些语言根本不支持反射。Golang 语言实现了反射，反射机制就是在运行时动态的调用对象的方法和属性，官方自带的 reflect 包就是反射相关的，Golang 的 gRPC 也是通过反射实现的。
