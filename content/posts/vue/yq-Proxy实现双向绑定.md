---
title: "Proxy实现双向绑定"
date: 2021-01-01
tags: ["Vue", "Proxy"]
---

关于Proxy的初探我们在上篇文章中已经写过了，接下来我们这里就将实现Proxy双向绑定的实现

## Proxy直接监听对象

```html
<div>
  <p>请输入:</p>
  <input type="text" id="input">
  <p id="content"></p>
</div>
<script>
const input = document.querySelector('#input')
const p = document.querySelector('#content')

const newObj = new Proxy({}, {
  get: function(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set: function(target, key, value, receiver) {
    if(key === 'text') {
      input.value = value
      p.innerText = value
    }
    return Reflect.set(target, key, value, receiver);
  }
})

input.addEventListener('keyup', function(e) {
  newObj.text = e.target.value;
});
</script>
```

在线代码的可以直接访问：https://codepen.io/wuqi/pen/MWYWeKy?editors=1010

通过代码我们可以看到Proxy直接劫持的是整个对象，并返回一个新的对象，不管在操作的便利还是底层功能上都比Object.defineProperty要强

## Proxy实现对数组变化的监听

```html
<div>
  <ul id="list"></ul>
  <button id="btn">添加列表项</button>
</div>
<script>
const list = document.querySelector('#list')
const btn = document.querySelector('#btn')

// 渲染列表
const Render = {
  init: function(arr){
    const fragment = document.createDocumentFragment()
    arr.forEach(function(item, index) {
      const li = document.createElement('li')
      li.textContent = index
      fragment.appendChild(li)
    })
    list.appendChild(fragment)
  },
  // 增加元素
  add: function(val) {
    const li = document.createElement('li')
    li.textContent = val
    list.appendChild(li)
  }
}

// 初始数组
const arr = [0,1,2,3,4]

const newArr = new Proxy(arr, {
  get: function(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set: function(target, key, value, receiver) {
    // ...
  }
})
</script>
```

在线代码的可以直接访问 https://codepen.io/wuqi/pen/rNaNLwm?editors=1010
