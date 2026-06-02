---
title: "Proxy & Reflect初探"
date: 2021-01-01
tags: ["Vue", "Proxy"]
---

Proxy字面是"代理"的意思，Proxy用于修改某些操作的默认行为，等同于在语言层面做出了修改，银日属于一种"元编程"(meta progrraming)，即对编程语言进行编程。Vue3中的双向绑定就是利用了Proxy实现滴，因次掌握Proxy还是很重要滴.

语法
JavaScriptRun CodeCopy912345/** target 是proxy包装的目标对象(可以是任意类型的对象)* 一个对象，属性是操作当执行一个操作时定义代理的行为的函数*/let p = new Proxy(target, handler)
Proxy可以理解在目标对象之前设立了一层"拦截"，外界对该对象的访问，必须先经过这层拦截，因而我们可以通过这种机制，实现对外界对象的过滤和改写。

无操作拦截

JavaScriptRun CodeCopy912345var target = {};var handler = {};var proxy = new Proxy(target, handler);proxy.a = 'b';target.a  // "b"
上面代码中，handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target了

Proxy实例方法
1、get()
用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和Proxy实例本身(可选)

JavaScriptRun CodeCopy9912345678910111213141516let person = {	name: "joinmouse"}
let proxy = new Proxy(person, {	get: function(target, name) {  	if(name in target) {    	return target[name]    }else {    	throw Error()    }  }})
proxy.name  // "joinmouse"proxy.age   // 抛出一个错误
2、set()
set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

JavaScriptRun CodeCopy991234567891011121314151617181920212223let person = {	age: 100}
let proxy = new Proxy(person, {	set: function(target, name, value) {  	if(name === 'age') {    	if (!Number.isInteger(value)) {        throw new TypeError('The age is not an integer');      }      if (value > 200) {        throw new RangeError('The age seems invalid');      }    }        // 满足条件的直接保存    obj[name] = value  }})
proxy.age  //100porxy.age = 300  //报错proxy.age = "young" //报错

Proxy & Reflect 使用
9912345678910111213141516171819202122const proxyData = new Proxy(data, {    get(target, key, receiver) {        // 只处理本身（非原型的）属性        const ownKeys = Reflect.ownKeys(target)        if (ownKeys.includes(key)) {            console.log('get', key) // 监听        }        const result = Reflect.get(target, key, receiver)        return result // 返回结果    },    set(target, key, val, receiver) {        // 重复的数据，不处理        if (val === target[key]) {            return true        }        const result = Reflect.set(target, key, val, receiver)        console.log('set', key, val)        // console.log('result', result) // true        return result // 是否设置成功    },    deleteProperty(target, key) {        const result = Reflect.deleteProperty(target, key)
Reflect作用
- 和Proxy能力一一对应
- 规范化、标准化、函数式

Object.defineProperty的缺点
- 深度监听需要一次性递归
- 无法监听新增属性和删除属性(Vue.set/Vue.delete)
- 无法监听原生的数组，需要特殊处理

Proxy优点
- 深度见监听，性能更好
- 可监听 新增/删除 属性
- 可监听数组变化
