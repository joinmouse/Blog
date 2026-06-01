---
title: "jQuery基础-属性和样式篇"
date: 2017-07-20
slug_jianshu: 01be8c78639b
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/01be8c78639b"
source_kind: jianshu
---
### 1、从DOM到jQuery操作特性/属性

我们知道每个元素都有一个或者多个特性，如：在img元素中，src就是元素的特性，用来标记图片的地址。在原生的DOM中操作特性的方法主要有3个：getAttribute()、setAttribute()和removeAttribute()。注：《js高级程序设计》书中将Attribute翻译为“特性”。

|-- getAttribute  
getAttribute是一个函数，只有一个参数——获取的特性名`element.getAttribute(attrName)`,这里我们需要注意的是getAttribute方法不属于document对象，所以不可以使用document对象调用，它是通过元素节点对象调用的。

|-- setAttribute  
setAttribute一般用于对特性节点的值作出修改，同getAttribute一样， setAttribute也只作用于元素节点：`element. setAttribute(attrName,value)`

|-- removeAttribute  
顾名思义，移除元素节点的某个特性  
`element.removeAttribute(attrName)`

-   在jQuery中使用一个attr()与removeAttr()就可以全部搞定了，包括兼容问题  
    attr()有4个表达式：  
    attr(attrName)：获取属性的值  
    attr(attrName, value)：设置属性的值  
    attr(attrName,fn)：设置属性的函数值  
    attr(attriNames)：给指定元素设置多个属性值，即：{属性名一: “属性值一” , 属性名二: “属性值二” , … … }

removeAttr()  
`element.removeAttr( attributeName )`: 为匹配的元素集合中的每个元素中移除一个属性（attribute）

下面写了一个小demo的源码在github上,可以帮助理解和参考  
[源码](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/index1.html)  
[查看效果](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/index1.html)

### 2、jQuery的属性与样式之html()、text()和val()

-   html()方法  
    同JavaScript中的innerHtml属性类似，**用来读取或设置某个元素中的HTML内容**,下面做一下实例，看下原生的innerHtml和jquery中的html()各自使用

HTML

```
<div id="d">
   <p>Content1</p>
   <p>Content2</p>
</div>
```

JS的innerHtml属性

```
const d =document.querySelector('#d')
console.log(d.innerHTML)    //   <p>Content1</p> <p>Content2</p>
```

jQuery的html()方法

```
const $d = $('#d')
console.log($d.html())
```

-   text()方法  
    在原生JS里面innerText是一个可写属性，返回元素内包含的文本内容，在多层次的时候会按照元素由浅到深的顺序拼接其内容；**jquery中text()方法结果返回一个字符串，包含所有匹配元素的合并内容**

HTML

```
  <div>
    <p>123<span>456</span></p>
  </div>
```

JS的innerText属性

```
   const div = document.querySelector('div')
    console.log(div.innerText)       //123456，按照元素由浅到深的顺序拼接其内容
```

jQuery的text()方法

```
const $div = $('div')
console.log($div.text())
```

下面可以参考写的一个复杂点的demo，将以上两种方法一起使用:

\-HTML

```
    <h3>html()与text()</h3>

    <div class="left first-div">
        <div class="div">
            <a>:first-child</a>
            <a>第二个元素</a>
            <a>:last-child</a>
        </div>  
        <div class="div">
            <a>:first-child</a>
            <a>第二个元素</a>
            <a>:last-child</a>
        </div>
    </div>
    
    <h4>显示通过html方法获取到的内容</h4>
    <p></p>

    <h4>显示通过text方法获取到的内容</h4>
    <p></p>

```

jQuery的html()、text()

```
        //显示出html方法获取到的内容,html()是整个html文档结构
        const contentHtml = $(".first-div").html()
        $('p:first').text(contentHtml)

        //显示出text方法获取到的内容,text()是文本内容的合集
        const contentText = $(".first-div").text()
        $('p:last').text(contentText)

        //通过html()方法来替换html结构
        $('.left div:first').html('整个文档被替换了')

        //通过.text()方法替换文本内容
        $(".left a:first").text('替换第一个a元素的内容')
```

[查看源码](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/index2.html)

-   val()方法  
    jQuery中有一个val()方法主要是用于处理表单元素的值，比如 input、select 和 textarea等

**例子：**一个input登陆输入框的例子  
HTML

```
  <input type="text" id="address" value="请输入邮箱地址"></br>
  <input type="text" id="password" value="请输入邮箱密码"></br>
  <input type="button" value="登陆" />
```

jQuery中val()方法

```
//对输入邮箱地址框进行操作
$('#address').focus(function(){
      var textValue = $(this).val()    //获取id为address的input元素的值
      if(textValue=="请输入邮箱地址") {
        $(this).val("")             //满足条件时(获取焦点)，清空输入框
      }
    })

    $('#address').blur(function(){
      var textValue = $(this).val()    //获取id为address的input元素的值
      if(textValue=="") {
        $(this).val("请输入邮箱地址")             //满足条件时(失去焦点)，重新为input输入框填入新的占位值
      }
    })
```

foucs()方法相当于JavaScript中的onfocus()方法，作用是处理获得焦点的事件；blur()方法相当于JavaScript中的onblur()方法，作用是处理获得焦点的事件。

[查看源码](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/index3.html)  
[查看效果](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/index3.html)

上面的例子中我们发现val()方法可以获取元素的值，同时也可以设置元素的值。另外，val()方法在表单的操作中还可以使select(下拉列匡表)、checkout(多选框)、radio(单选框)相应的选项被选中，下面用一个例子来展示val()方法的选中  
HTML

```
<div>
    <select id="test1">
      <option value="option1">1号</option>
      <option value="option2">2号</option>
      <option value="option3">3号</option>
    </select>
  </div> 
  
  <div>
    <input type="checkbox" value="check1">多选1
    <input type="checkbox" value="check2">多选2
    <input type="checkbox" value="check3">多选3
    <input type="checkbox" value="check4">多选4
  </div>

  <div>
    <input type="radio" value="radio1">单选1
    <input type="radio" value="radio2">单选2
    <input type="radio" value="radio3">单选3
  </div>
```

jQuery中val()方法

```
    $('#test1').val("option2")     //选中option中的2号

    $(':checkbox').val(["check2","check3"])   //多选按钮选中2和3
    $(':radio').val(["radio2"])            //单选按钮选中2
```

### 3、jQuery的属性与样式之addClass()、removeClass()和toggleClass()

-   增加样式：addClass(className)  
    在p元素增加一个newClass的样式：

```
<p class="orgClass">

$('p').addClass("newClass")    
```

-   删除样式:removeClass(className)

```
<p class="class1 class2">

$('p').removeClass("class1")     //删除p元素上的class1
```

-   切换样式：toggleClass()  
    下面看一个表格奇数行、偶数行颜色不同的例子

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>toggleClass</title>
  <style>
    table {
      border: 1px solid #ddd;
      margin: 50px auto;
    }
    td {
      padding: 5px;
    }
    .class1 {
      background: red;
    }
    .class2 {
      background: blue;
    }
  </style>
  <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
</head>
<body>
  <table id="table">
        <tr>
            <td>wuqi</td>
            <td>www</td>
        </tr>
        <tr>
            <td>wuqi</td>
            <td>www</td>
        </tr>
        <tr>
            <td>wuqi</td>
            <td>www</td>
        </tr>
        <tr>
            <td>wuqi</td>
            <td>www</td>
        </tr>
        <tr>
            <td>wuqi</td>
            <td>www</td>
        </tr>
    </table>
  
    <script>
      $("#table tr:odd").toggleClass("class1"); //为偶数行切换添加class1属性

      $("#table tr:even").toggleClass("class2") //奇数行切换添加class2属性
    </script>
</body>
</html>
```

### 4、jQuery的属性与样式之css()与addClass()设置样式的区别

我们知道对于样式的设置，我们可以通过css()方法来直接改变；也可以通过addClass()来先为选择的元素添加一个class属性，再在css中设置对应class的样式

-   可维护性：

.addClass()的本质是通过定义个class类的样式规则，给元素添加一个或多个类。css方法是通过JavaScript大量代码进行改变元素的样式

通过.addClass()我们可以批量的给相同的元素设置统一规则，变动起来比较方便，可以统一修改删除。如果通过.css()方法就需要指定每一个元素是一一的修改，日后维护也要一一的修改，比较麻烦

-   灵活性：

通过.css()方式可以很容易动态的去改变一个样式的属性，不需要在去繁琐的定义个class类的规则。一般来说在不确定开始布局规则，通过动态生成的HTML代码结构中，都是通过.css()方法处理的

-   样式值：

.addClass()本质只是针对class的类的增加删除，不能获取到指定样式的属性的值，.css()可以获取到指定的样式值。
