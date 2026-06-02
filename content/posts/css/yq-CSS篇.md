---
title: "CSS篇"
date: 2021-01-01
tags: ["CSS"]
---

1、盒模型、flex布局
盒子模型是CSS比较重要的一个概念，也是CSS 布局的基石。 常见的盒子模型有块级盒子(block)和行内盒子(inline-block)，与盒子相关的几个属性有：margin、border、padding和content 等，这些属性的作用是设置盒子与盒子之间的关系以及盒子与内容之间的关系，而 box-sizing 属性会影响盒子大小的计算方式。

2、CSS3动画
CSS3 中规范引入了两种动画，分别是 transition 和 animation，transition 可以让元素的 CSS 属性值的变化在一段时间内平滑的过渡，形成动画效果，为了使元素的变换更加丰富多彩，CSS3 还引入了 transfrom 属性，它可以通过对元素进行 平移(translate)、旋转(rotate)、放大缩小(scale)、倾斜(skew) 等操作，来实现 2D 和 3D 变换效果。transiton 还有一个结束事件 transitionEnd，该事件是在 CSS 完成过渡后触发，但如果过渡在完成之前被移除，则不会触发 transitionEnd 

animation 需要设置一个 @keyframes，来定义元素以哪种形式进行变换， 然后再通过动画函数让这种变换平滑的进行，从而达到动画效果，动画可以被设置为永久循环演示。设置 animation-play-state:paused 可以暂停动画，设置 animation-fill-mode:forwards 可以让动画完成后定格在最后一帧。

另外，还可以通过JS 监听 animation 的“开始”、“结束” 和 “重复播放” 状态，分别对应三个事件，即 animationStart、animationEnd、animationIteration 。需要注意的是：
当播放次数设置为1时，不会触发 animationIteration 。

和 transition相比，animation 设置动画效果更灵活更丰富，二者还有一个区别是：transition 只能通过主动改变元素的 css 值才能触发动画效果，而 animation 一旦被应用，就开始执行动画。
另外，HTML5 还新增了一个动画API，即 requestAnimationFrame，它通过JS来调用，并按照屏幕的绘制频率来改变元素的CSS属性，从而达到动画效果。

3、BFC(块级格式化上下文)
BFC 是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素。比如：内部滚动就是一个 BFC，当一个父容器的 overflow-y 设置为 auto 时，并且子容器的长度大于父容器时，就会出现内部滚动，无论内部的元素怎么滚动，都不会影响父容器以外的布局，这个父容器的渲染区域就叫 BFC。满足下列条件之一就可触发 BFC：
- 根元素，即 HTML 元素
- overflow 的值不为 visible
- display 的值为 inline-block、table-cell、table-caption
- position 的值为 absolute 或 fixed，float 的值不为 none
- display: flow-root
![image.png](https://cdn.nlark.com/yuque/0/2020/png/158659/1609320300162-7b1358bf-d87d-4250-ae1f-89bfcefb05df.png)

CSS规范中对 BFC 的描述：
9.4.1 块格式化上下文
浮动，绝对定位元素，非块盒的块容器（例如，inline-blocks，table-cells和table-captions）和'overflow'不为'visible'的块盒会为它们的内容建立一个新的块格式化上下文

在一个块格式化上下文中，盒在竖直方向一个接一个地放置，从包含块的顶部开始。两个兄弟盒之间的竖直距离由'margin'属性决定。同一个块格式化上下文中的相邻块级盒之间的竖直margin会合并

在一个块格式化上下文中，每个盒的left外边（left outer edge）挨着包含块的left边（对于从右向左的格式化，right边挨着）。即使存在浮动（尽管一个盒的行盒可能会因为浮动收缩），这也成立。除非该盒建立了一个新的块格式化上下文（这种情况下，该盒自身可能会因为浮动变窄）

参考: https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context

