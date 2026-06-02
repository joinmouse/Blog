---
title: "深入JS事件冒泡与事件代理(委托)"
date: 2018-05-22
slug_jianshu: 1d781bfdf1b9
tags: []
state: open
source: "https://www.jianshu.com/p/1d781bfdf1b9"
source_kind: jianshu
---
事件作为DOM操作中重要的一个点，好好的理解并运用相当的重要

### 1、事件冒泡

简单的说，就是当一个子元素的事件被触发的时候（如onclick事件），该事件会从事件源（被点击的子元素）开始逐级向上传播，触发父级元素的点击事件。

```
 <div id="parent" style="background-color: #000;height: 400px;width: 400px" data-id="11">  
    <div id="child" style="background-color: #fff;height: 200px;width: 200px" data-id="22"></div>  
 </div> 

document.getElementById('parent').onclick=function () {  
    console.log(this.getAttribute('data-id'));  
};  
document.getElementById('child').onclick=function (e) {  
    console.log(this.getAttribute('data-id'));  
};  
```

在线运行: [http://jsbin.com/ritivosoco/edit?html,js,console,output](http://jsbin.com/ritivosoco/edit?html,js,console,output)

这里我们可以发现，当你点击白色区域(子元素)，父级的click事件也被触发啦(观察控制台的输出)，那么这里就有一个问题啦，可不可以当点击子元素的时候不触发父元素的点击事件啊，这就是接下来要说的啦

### 2、阻止事件冒泡

所谓阻止事件冒泡其实啊，就是我们不让点击这个事件传递给父元素啊，哈哈，这就要用到事件中的一个stopPropagation()方法啦,还是先看代码吧

```
document.getElementById('parent').onclick=function () {  
    console.log(this.getAttribute('data-id'));  
};  
document.getElementById('child').onclick=function (e) {  
    console.log(this.getAttribute('data-id'));  
    e.stopPropagation();  
};  
```

在线运行: [http://jsbin.com/ritivosoco/edit?html,js,console,output](http://jsbin.com/ritivosoco/edit?html,js,console,output)

嘿嘿，此刻你在线上运行的时候是不是发现当我们点击白色区域的时候并没有触发到父元素的点击事件啊，这是因为我们阻止了子元素的事件冒泡啦！

朋友们有可能会觉得事件冒泡真是烦人，写个事件还要阻止冒泡！不过凡事都有双刃剑，事件冒泡同时给我们带来的还有事件委托这一减少DOM操作的神器，接下来介绍哦

### 3、事件委托

事件委托，首先按字面的意思就能看你出来，是将事件交由别人来执行，再联想到上面讲的事件冒泡，是不是想到了？对啦，其实就是将子元素的事件通过冒泡的形式交由父元素来执行。

可能在开发的时候会遇到这种情况：如导航每一个栏目都要加一个事件，你可能会通过遍历来给每个栏目添加事件，首先我们来看一段不使用事件委托的代码, 我们遍历子元素数组:

```
 <ul id="parent">  
   <li>孩子1</li>  
   <li>孩子2</li>  
   <li>孩子3</li>  
   <li>孩子4</li>  
   <li>孩子5</li>
 </ul>
 var ul = document.getElementById('parent')
 var lis = ul.getElementsByTagName('li')
 for (var i = 0; i<lis.length;i++){  
   lis[i].onclick= function() {  
     alert(this.innerHTML);  
   }
 }
```

这种方式看起来直接明了，但需要多次操作dom(每点击一个li都会操作一次dom)，如果子元素较多的话则是一件相当恐怖的事情，而且当我们后面添加一个新的li子元素后，新添加的li没有绑定事件，需要再次给新的li绑定一次，考虑到给新添加的元素绑定事件:

```
<ul id="parent">  
   <li>孩子1</li>  
   <li>孩子2</li>  
   <li>孩子3</li>  
   <li>孩子4</li>  
   <li>孩子5</li>
 </ul>
 var ul = document.getElementById('parent')
 var lis = ul.getElementsByTagName('li')
 function addClick() {
   for (var i = 0; i<lis.length;i++){  
     lis[i].onclick= function() {  
       alert(this.innerHTML);  
     }
   }
}
addClick()

function addElement() {  
   var li = document.createElement('li');  
   li.innerHTML="我是新孩子";  
   ul.appendChild(li);  
   addClick();  
} 
addElement();  
```

上面写的代码确实可以解决新添加子元素的问题，但代码就有点多了，而且本质上并没有改变DOM的操作次数，优化性能，下面我们直接来看事件委托的写法：

```
<ul id="parent">
  <li>孩子1</li>  
  <li>孩子2</li>  
  <li>孩子3</li>  
  <li>孩子4</li>  
  <li>孩子5</li>
</ul>

var ul = document.getElementById('parent');  
ul.onclick = function (e) {  
  //判断只有li触发的才会输出内容  
  if(e.target.nodeName.toLowerCase() === "li"){
    alert(e.target.innerHTML);  
  }  
  e.stopPropagation();                          
}
```

在线运行: [http://jsbin.com/bamonabeda/16/edit?html,js,console,output](http://jsbin.com/bamonabeda/16/edit?html,js,console,output)

因为是监听的父元素，所有即使新添加元素也是可以默认绑定好事件的，这样我们可以看到代码更简洁了，也减少了dom的操作次数，是不是非常的优雅和nice啊！

### 4、总结

最后总结下哈，事件冒泡是个双刃剑，当对我们有负面的影响的时候就显得相当讨厌，不过我们可以用阻止冒泡来达到我们想要的效果；但是在另一方面在特定的场合我们又可以借助于事件冒泡来优化我们的代码，优化性能，**_只有对原理了解于心，才可以突破更多的限制_**。
