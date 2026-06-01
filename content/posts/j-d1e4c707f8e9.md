---
title: "说清CSS盒模型"
date: 2017-08-06
slug_jianshu: d1e4c707f8e9
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/d1e4c707f8e9"
source_kind: jianshu
---
我们知道再CSS中盒模型作为基础的一个点，也是初入前端必须明白的一个点，才知道网页是如何布局的，那么到底盒模型是什么了？

### 1、从MDN上的文档说起

CSS 盒模型是 CSS 规范的一个模块，它定义了一个长方形的盒子，每个盒子拥有各自的内边距和外边距，并根据视觉格式化模型来对元素进行布局。

在一个文档中，每个元素都被表示为一个矩形的盒子。在CSS中，使用标准盒模型来定义这些矩形盒子的，每一个盒子都从内到外都有4个区域：**content、padding、border、margin**

这是在开发者工具下打开的一个盒模型界面

-   注：上图中最里面的1000\*1916是内容区域(content)的长度和宽度

现在我们已经知道了一个元素在页面中是如何展示内容的，那么多个元素一起是如何布局的了，这里就有一个不得不说的话题：**外边距合并**

### 2、外边距合并

块的顶部外边距和底部外边距有时被组合(折叠)为单个外边距，其大小是组合到其中的最大外边距，这种行为称为边距塌陷(margin collapsing)，在国内一般称为**外边距合并**。

发生外边距合并的三种基本情况：

-   **相邻的兄弟元素**

```
<p style="margin-bottom: 30px;">这个段落的下外边距被合并...</p>
<p style="margin-top: 20px;">这个段落的上外边距被合并。</p>
```

上面的外边距合并的效果可视化模型

不是 ”上面段落的下边距“ 与 ”下面段落的上边距“ 的 求和 ，而是两者中的较大者（在此示例中为30px）。

-   **空块元素**  
    如果存在一个空的块级元素，其 [border](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/CSS/border)、[padding](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding)、inline content、[height  
    ](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/CSS/height)、[min-height](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/CSS/min-height) 都不存在。那么此时它的上下边距中间将没有任何阻隔，此时它的上下外边距将会合并。

两个空块的叠加

  

如果这个外边距碰到另一个元素的外边距，它还会发生叠加：

空元素已经叠加的外边距碰到另一个元素的外边距，它还会发生叠加

-   **块级父元素和子元素的叠加**  
    这个也直接上图，一目了源

元素的顶外边距与父元素的顶外边距发生叠加

以上三种情况都写完了，那么下面我们思考两个问题：如果是一个元素拥有的是负外边距，那么又当如何合并了？有时可能我们需要避免外边距合并，哪有该如何处理？

对于第一个问题，这个比较简单，其实我们稍微自己写一个例子测试就可以出来。

-   demo-test

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Bin</title>
</head>
  <style>
    .p1 {
      background: red;
      margin-bottom:20px;
    }
    .p2 {
      background: blue;
      margin-top:-20px;
    }
  </style>
<body>
  <p class="p1">
    shang
  </p>
  <p class="p2">
    hai
  </p>
</body>
</html>
```

运行结果

**这里我们测试可以知道：当有负边距存在时，合并后的外边距将是最大正边距加上最小负边距（即负边距中绝对值最大的一个）**

第二个问题了，其实我们发生外边距合并只是在普通的文档流中才会发生，像行内框、浮动元素或绝对定位框之间的外边距并不会发生合并，这一系列的的总结出来就是BFC会阻止元素外边距合并，关于BFC我会再写一篇文章总结下。

### 3、CSS3盒子模型

前面我们已经讲过了标准的盒模型，这里在补充下CSS3中的一个有关盒模型的box-sizing属性

-   语法：`box-sizing: content-box|border-box`

在默认情况下`box-sizing: content-box`，在一个元素下添加这个属性也就是说表明它是标准的盒模型，一般情况下我们也不会去声明。

说到这里可能有人好奇了，难道还有其他的盒模型，这就要说到古老的IE了，在IE浏览器占据大额市场分量的时代，定义过一个IE的模型，但我们使用`box-sizing: border-box`这个属性的时候就是IE盒模型的特性了。它和标准盒模型最大的区别时**它的宽/高=content width/height+padding+border**，其实一般情况也使用的频率不是很高。
