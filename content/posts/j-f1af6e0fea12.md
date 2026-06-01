---
title: "CSS常见样式问答"
date: 2017-04-29
slug_jianshu: f1af6e0fea12
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/f1af6e0fea12"
source_kind: jianshu
---
## 1、text-align: center的作用是什么，作用在什么元素上？能让什么元素水平居中

-   text-align:center作为HTML元素属性主要用来使文本水平居中，text-align属性只针对文本文字和img标签，作用在block元素上，可以让块级元素（block）内的inline和inline-block元素水平居中

## 2、IE 盒模型和W3C盒模型有什么区别?

IE盒模型的宽高包含：content、padding、border  
W3C盒模型的宽高：content

## 3、\*{ box-sizing: border-box;}的作用是什么？

指定所有元素的的盒模型为IE盒模型标准，若设置border-box，实际所占宽高度=设置height/width + margin(外边距)

## 4、line-height: 2和line-height: 200%有什么区别?

```
   line-height：2     //本身文字位置占据高度的两倍
   line-height：200%    //继承父元素文字高度的两倍，一般为浏览器默认文字大小font-size
```

## 5、inline-block有什么特性？如何去除缝隙？高度不一样的inline-block元素如何顶端对齐?

-   **特性**：既有inline特性（不占据一整行，宽度由内容宽度决定），又有 block特性(可设置宽高，内外边距)
    
-   **去除缝隙**：可先将具有inline-block特性的元素标签加一个空的div块包裹，将其font-size设置为0，同时在将inline-block对应的元素标签字体在css中恢复原来样式，这样可以巧妙的出去两个inline-block之间的空字符所产生的间隙
    
-   **顶端对齐**：添加CSS样式vertical-align:top;
    

## 6、CSS sprite 是什么?

-   CSS小精灵图标或雪碧图：将一些小的图标或者精灵放在一张图片上，通过对background-position的设置，达到切换不同小图片的目的，同时可以减少网络请求，提高网页加载性能

## 7、让一个元素"看不见"有几种方式？有什么区别?

让一个元素“看不见”即为透明，从这个方向上考虑有以下4中方式，其中0~1表示透明度，0为全透明，1表示全不透明

-   opacity: 0 ; //透明度为0，原来位置的事件连接还在
-   visibility: hidden; //与opacity:0 类似，但是原来位置上事件连接不在了
-   display:none; //内容完全没有消失，不占用位置
-   background-color: rgba(0，0，0，0) /raba中最后一个a字母对应数值表示透明度，只是背景色透明
