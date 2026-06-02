---
title: "vue-双向绑定"
date: 2017-11-05
slug_jianshu: cceed71416a5
tags: ["Vue"]
state: open
source: "https://www.jianshu.com/p/cceed71416a5"
source_kind: jianshu
---
##### 1、双向绑定

vue中一个很大的特点就是可以通过v-model创建双向数据绑定，按照官方文档的说法：v-model本质其实是语法糖，它负责监听用户的输入事件以更新数据。

* * *

通过文档，用vue.js添加双向绑定：`<input v-model="text">`，这是一个简单的 [demo](https://link.jianshu.com?t=http://js.jirengu.com/sefoyizucu/3/edit?html,output),我们发现可以通过改变data中的数据来渲染到页面，也可以通过input输入text后，data中的数据会发生改变。

实际上双向绑定的语法糖拆解后，上面的代码等价于`<input v-bind:value="message" @input="message= $event.target.value">`,即双向绑定 = 单向绑定 + UI事件监听 ，可以参考这个 [demo](https://link.jianshu.com?t=http://js.jirengu.com/fijeyujaco/3/edit)

##### 2、双向绑定 vs 单向绑定

双向绑定看起来的确非常的酷炫，因为data和页面的内容是自动同步的，但凡是有利则也必定有其弊端的地方，**自动同步**的另一面也意味着你不知道data上面时候变了(when)，也不知道谁改变了(who)，变了也不会通知你(what)；当然我们可以用watch来监听data的变化，但这样会相当的复杂

单向绑定使得数据流是单向的，对于复杂的应用而言更用利于统一的实现状态管理；  
单向绑定的思路是：  
1、所有的数据只有一份  
2、一旦数据变化，就去更新页面(`data=>页面`)  
3、如果用户在页面上做了变动，那就先手动的收集起来，合并到之前的数据中

##### 3、总结

到现在我们已经知道大概了解双向绑定和单向绑定，如果仔细思考的话会发现单向绑定虽然会牺牲一部分的便捷性，但可以换来更好的控制力。  
我们知道vue生态的vuex是对数据进行状态管理，其实vuex就是一种单向的数据绑定践行，那么我们需要注意当引入vuex的时候我们就不要在页面中使用`v-model`了，关于单向绑定和双向绑定可以参考这个[知乎问答](https://link.jianshu.com?t=https://www.zhihu.com/question/49964363)
