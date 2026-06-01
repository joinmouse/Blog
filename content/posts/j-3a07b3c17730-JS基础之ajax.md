---
title: "JS基础之ajax"
date: 2018-03-11
slug_jianshu: 3a07b3c17730
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/3a07b3c17730"
source_kind: jianshu
---
-   原生JS之四步搞定AJAX：  
    [http://www.cnblogs.com/fenpho/p/6240158.html](https://link.jianshu.com?t=http%3A%2F%2Fwww.cnblogs.com%2Ffenpho%2Fp%2F6240158.html)

###### 固定模板

```
//1、创建一个XMLHttpRequest对象
var xhr = new XMLHttpRequest()
//２、指定服务端接受的内容，怎么处理
xhr.onreadystatechange = function() {
  if(xhr.readyState === 4) {
    div.innerHTML = xhr.responseText
  }
}
//3、创建一个请求
xhr.open("get","url",true)
//4、发生请求
xhr.send(null)
```
