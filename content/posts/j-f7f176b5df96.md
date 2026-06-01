---
title: "CSS常见样式（二）"
date: 2017-04-29
slug_jianshu: f7f176b5df96
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/f7f176b5df96"
source_kind: jianshu
---
## 1、背景图像

```
background           
background-color                    //背景颜色
background-image：url()             //背景图片
注意：同时使用背景图片和背景颜色的时候，背景图片总是在背景颜色的上面，所以当图像结束的时候，颜色就显示出来
background-position    //背景位置
默认值为：0% 0%      第一个值是水平位置，第二个是垂直位置，默认位置为左上角
background-repeat       //背景图片重复
分别可以设置：repeat-x、repeat-y、no-repeat
background-size         //设置背景图片大小
设置的值可以是像素（px）,可以是百分比，可以是contain/cover
```

## 2、CSS sprite雪碧图

将一些小的图标或者精灵放在一张图片上，通过对background-position的设置，达到切换不同小图片的目的

## 3、隐藏or透明

opacity：0 //透明度为0，整体  
display：none //消失，不用占位置  
background-color :rgba(0,0,0,0.2) //只是背景色的透明

## 4、inline-block

既有inline特性（不占据一整行，宽度由内容宽度决定），又有 block特性(可设置宽高，内外边距)

## 5、line-height

```
line-height：2     //本身文字位置占据高度的两倍
line-height：200%    //继承父元素文字高度的两倍
```

## 6、盒模型

标准盒模型和IE盒模型（宽高均包含content、padding、border）

CSS3新样式box-sizing

-   box-sizing:content-box //标准盒模型
-   box-sizing:border-box //IE盒模型
