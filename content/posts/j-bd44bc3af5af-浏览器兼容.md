---
title: "浏览器兼容"
date: 2017-05-01
slug_jianshu: bd44bc3af5af
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/bd44bc3af5af"
source_kind: jianshu
---
### 1、CSS hack

**由来**：由于不同厂商的浏览器，比如Internet Explorer,Safari,Mozilla Firefox,Chrome等，或者是同一厂商的浏览器的不同版本，如IE6和IE7；这些差异导致不同浏览器对CSS的解析不完全一样，从而会导致生成的页面效果不一样，得不到我们所需要的页面效果。 这个时候我们就需要针对不同的浏览器去写不同的CSS，让它能够同时兼容不同的浏览器，能在不同的浏览器中也能得到我们想要的页面效果。  
简单的说，CSS hack的目的**是使你的CSS代码兼容不同的浏览器**。当然，我们也可以反过来利用CSS hack为不同版本的浏览器定制编写不同的CSS效果。

CSS Hack大致有3种表现形式

-   CSS属性前缀法
-   选择器前缀法
-   IE条件注释法（即HTML头部引用if IE）Hack，实际项目中CSS Hack大部分是针对IE浏览器不同版本之间的表现差异而引入的。  
    注:IE条件注释法(即HTML条件注释Hack)：针对所有IE(注：IE10+已经不再支持条件注释)，这类Hack不仅对CSS生效，对写在判断语句里面的所有代码都会生效。

### 2、浏览器兼容的思路

这里我的认识是当你确定好你完成的项目的主要是考虑向上兼容(j渐进增强)还是向下兼容（优雅降级），这里我的理解是向上兼容就是在完成好基本的功能之后尽量向上兼容追求更好的页面渲染效果；而向下兼容是在追求良好的页面渲染效果（用户体验）之后尽可能的向下兼容一些低版本的浏览器（如古老的IE版本），以达到覆盖更大的用户群体。

**如何做**：

-   根据兼容需求选择技术框架/库(jquery)
    
-   根据兼容需求选择兼容工具([html5shiv.js](https://link.jianshu.com?t=https://github.com/aFarkas/html5shiv)、[respond.js](https://link.jianshu.com?t=https://github.com/scottjehl/Respond)、[css reset](https://link.jianshu.com?t=https://segmentfault.com/a/1190000003021766)、[normalize.css](https://link.jianshu.com?t=https://github.com/necolas/normalize.css)、[Modernizr](https://link.jianshu.com?t=https://github.com/Modernizr/Modernizr)、[postCSS](https://link.jianshu.com?t=https://github.com/postcss/postcss)
    
-   可以利用条件注释、CSS Hack、js 能力检测做一些修补
    

### 3、列举5种以上浏览器兼容的写法

-   (1)条件注释\[if oldIE\]：

```
项目      范例               说明
！     [if !IE]           非IE
lt    [if lt IE 5.5]     小于IE 5.5
lte   [if lte IE 6]      小于等于IE6
gt    [if gt IE 5]       大于 IE5
gte   [if gte IE 7]      大于等于IE7
|     [if (IE 6)|(IE 7)] IE6或者IE7
```

**举例说明如下：**

```
<!--[if IE 6]>  //IE6中执行
    <p>You are using Internet Explorer 6.</p>
 <![endif]-->
<!--[if !IE]><!-->  //非IE浏览器
    <script>alert(1);</script> 
<!--<![endif]-->
 <!--[if IE 8]>   //IE8中执行
     <link href="ie8only.css" rel="stylesheet"> 
<![endif]--> 
```

-   (2)CSS 属性选择前缀法

```
.box{ 
    color: red; 
    _color: blue;     /*ie6*/
    *color: pink;      /*ie67*/ 
    color: yellow\9;      /*ie/edge 6-8*/
}
```

-   (3)选择器前缀法

```
*html *前缀只对IE6生效
*+html *+前缀只对IE7生效
@media screen\9{...}只对IE6/7生效
@media \0screen {body { background: red; }}只对IE8有效
@media \0screen\,screen\9{body { background: blue; }}只对IE6/7/8有效
@media screen\0 {body { background: green; }} 只对IE8/9/10有效
@media screen and (min-width:0\0) {body { background: gray; }} 只对IE9/10有效
@media screen and (-ms-high-contrast: active), 
  (-ms-high-contrast: none) {body { background: orange; }} 只对IE10有效等等
```

-   (4)条件注释结合类选择器整体优化

```
<!DOCTYPE html>
<!--[if IEMobile 7 ]> <html dir="ltr" lang="en-US"class="no-js iem7"> <![endif]-->
<!--[if lt IE 7 ]> <html dir="ltr" lang="en-US" class="no-js ie6 oldie"> <![endif]-->
<!--[if IE 7 ]> <html dir="ltr" lang="en-US" class="no-js ie7 oldie"> <![endif]-->
<!--[if IE 8 ]> <html dir="ltr" lang="en-US" class="no-js ie8 oldie"> <![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7)|!(IEMobile)|!(IE)]><!--><html dir="ltr" lang="en-US" class="no-js"><!--<![endif]-->
```

-   (5)利用CSS hack工具（如Modernizr）  
    运行Modernizr的时候它会在html元素上添加一批CSS的class名称，这些class名称标记当前浏览器支持哪些特性和不支持哪些特性。  
    支持的特性就直接显示该特性的名称作为一个class（例:canvas,websockets），不支持的特性显示的class是“no-特性名称”。以下是IE9下生成的特征类型

```
<html class=" js no-flexbox canvas canvastext no-webgl no-touch geolocation 
              postmessage no-websqldatabase no-indexeddb hashchange no-history 
        draganddrop no-websockets rgba hsla multiplebgs backgroundsize 
        no-borderimage borderradius boxshadow no-textshadow opacity 
        no-cssanimations no-csscolumns no-cssgradients no-cssreflections
        csstransforms no-csstransforms3d no-csstransitions fontface 
        generatedcontent video audio localstorage sessionstorage 
        no-webworkers no-applicationcache svg inlinesvg smil svgclippaths">
```

### 4、以下工具/名词是做什么的

**条件注释:**  
条件注释 是于HTML源码中被 IE 有条件解释的语句。条件注释可被用来向 IE提供及隐藏代码。 条件注释最初于微软的 Internet Explorer 5浏览器中出现，并且直至 Internet Explorer 9 均支持。微软已宣布于IE10停止支持。

**IE Hack**  
针对IE浏览器编写不同的CSS的让IE能够正常渲染的过程

**js 能力检测**  
使用JS的语法检测浏览器支持的属性，就可以给出特定的解决方案。这一部分检测是解决浏览器兼容问题的主要检测。

**html5shiv.js**  
用于解决IE9以下版本浏览器对HTML5新增标签不识别，并导致CSS不起作用的问题。所以我们在使用过程中，想要让低版本的浏览器，即IE9以下的浏览器支持，那么html5shiv.js是一个非常好的选择！

**respond.js**  
Respond.js 是一个小脚本，用于为 IE6-8 以及其它不支持 CSS3 媒体查询功能的浏览器提供媒体查询的 min-width 、max-width 特性，实现响应式网页设计。

**css reset**  
覆盖”浏览器的CSS默认属性，更准确说就是通过重新定义标签样式。

**normalize.css**  
Normalize.css 是一个可以定制的CSS文件，它让不同的浏览器在渲染网页元素的时候形式更统一。作用：  
保留有用的默认值，不同于许多 CSS reset 的简单粗暴。  
标准化的样式，适用范围广的元素。  
纠正错误和常见的浏览器的不一致性。  
一些细微的改进，提高了易用性。  
使用详细的注释来解释代码。

**Modernizr**  
Modernizr 会在页面加载后立即检测特性；然后创建一个包含检测结果的 JavaScript 对象，同时在 html 元素加入方便你调整 CSS 的 class 名。  
Modernizr 可以方便地为各种情况编写 JavaScript 和 CSS，无论浏览器是否支持这些特性。这是处理渐进增强的完美方案。

**postCSS**  
它可以被理解为一个平台，可以让一些插件在上面跑，它提供了一个解析器，可以将CSS解析成抽象语法树，通过PostCSS这个平台，我们能够开发一些插件，来处理CSS。

### 5、一般在哪个网站查询属性兼容性？

caniuse.com 查CSS属性在各浏览器的兼容情况
