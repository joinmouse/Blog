---
title: "HTML基础"
date: 2017-04-26
slug_jianshu: 704c83cbf07b
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/704c83cbf07b"
source_kind: jianshu
---
## 1、HTML、XML、XHTML 区别

-   HTML：网页中最常用的标签语言
-   XML： 一种数据传输格式，同类还有json
-   XHTML：可以理解严格模式下的HTML

## 2、HTML语义化

html语义化：当我们在编写html的网页时候，  
需要有良好的结构化的规范页面（使用正确且合理的HTML标签），可以使浏览器更好的渲染出网页的内容；  
需要给html中的给出合适的命名（如class、id之类的倒勾），便于我们的CSS、JavaScript来操作处理html元素；  
需要给html的元素给出当前环境下合适的属性（如给form表单添加put提交方式还是get），可以便于浏览器更精确的识别解析文档以及方式或标签识别的处理。

## 3、理解内容与样式分离原则

将样式（CSS）从网页内容 (HTML)中分离，即可以在不修改网页内容的情况下直接修改样式，使得代码易于维护。  
同时，因为样式都通过后期添加进来，这样编辑内容的的时候就可以更专注于结构的合理性，从而避免很多逻辑性错误。

## 4、常见的meta标签

```
   content属性（必选）：定义与 http-equiv 或 name 属性相关的元信息
   http-equiv属性:  将content 属性关联到 HTTP 头部
   name属性：把 content 属性关联到一个名称。
```

`<meta charset='utf-8' />` // 规定 HTML 文档的字符编码  
`<meta name="description" content="150 words" />` //设置网页的关键字和部分内容，便于搜索引擎查找

## 5、文档声明的作用?严格模式和混杂模式指什么?<!doctype html> 的作用?

文档声明：告诉浏览器以什么的方式去渲染

严格模式：告诉浏览器以什么方式渲染  
混杂模式：浏览器自己选择如何渲染

<!doctype html>:HTML5的规范

## 6、浏览器乱码的原因是什么？如何解决

乱码产生的根本原因：

-   文档的编码格式和浏览器解析时的解码格式不匹配导致

解决办法

-   设置<meta charset>标签声明文档使用的字符编码
-   设置正确的字符编码
-   让浏览器显示正确的编码

## 7、常见的浏览器有哪些？什么内核？

-   Chrome(Blink)
-   IE(Trident)
-   Firefox(Gecko)
-   Safari(Webkit)
-   Opera(presto)

> 截图自维基百科 市场份额如下：
> 
>   
> 
> 浏览器.png

## 8、HTML常见标签

-   link 链接
-   img 图像
-   div、span 块
-   iframe 内联框架
-   form、input 表单
-   HTML5中的画布、媒体、API等
