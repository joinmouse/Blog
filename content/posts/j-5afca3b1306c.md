---
title: "Node文档笔记-assert断言"
date: 2017-09-18
slug_jianshu: 5afca3b1306c
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/5afca3b1306c"
source_kind: jianshu
---
assert 模块 提供了断言测试的函数，用于测试不变式。  
一直觉得最直观的学习模式是首先抛出demo，然后通过对demo的诠释来了解用法，这是Node文档笔记的第一篇。

### 1、assert.equal(actual, expected\[, message\])

相信大家一开始看到这个有点懵逼吧，其实如果你有看mdn的习惯就应该看起来不会那么费劲了，使用**相等运算符(==)测试actual参数与expected参数是否相等**

```
const assert = require('assert')

assert.equal(1, 1);
// 测试通过，1 == 1
assert.equal(1, '1');
// 测试通过，1 == '1'

assert.equal(1, 2);
// 抛出 AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// 抛出 AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

若两个值不相等，则抛出一个带有 message 属性的 AssertionError，其中 message 属性的值等于传入的 message 参数的值。

### 2、assert.strictEqual(actual, expected\[, message\])

与`assert.equal`不同的是`assert.strictEqual`使用全等运算符(===)测试actual参数和expected参数是否全等

```
const assert = require('assert')

assert.strictEqual(1, 1);
// 测试通过。

assert.strictEqual(1, 2)
// 抛出 AssertionError: 1 === 2

assert.strictEqual(1, '1');
// 抛出 AssertionError: 1 === '1'
```

### 3、assert.deepEqual(actual, expected\[, message\])

首先还是解释下这里的assert模块的API目的是**测试 actual 参数与 expected 参数是否深度相等,原始值使用相等运算符(==)比较**

```
const assert = require('assert');
//引入断言模块

const obj1 = {
  a: {
    b: 1
  }
};
const obj2 = {
  a: {
    b: 2
  }
};
const obj3 = {
  a: {
    b: 1
  }
};
const obj4 = Object.create(obj1);

assert.deepEqual(obj1, obj1);
// 测试通过，对象与自身相等。

assert.deepEqual(obj1, obj2);
// 抛出 AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }
// 因为 b 属性的值不同。

assert.deepEqual(obj1, obj3);
// 测试通过，两个对象相等。

assert.deepEqual(obj1, obj4);
// 抛出 AssertionError: { a: { b: 1 } } deepEqual {}
// 因为不测试原型。
```

通过这个demo,下面我们总结下`assert.deepEqual`的用法：只测试**可枚举的自身属性，不测试对象的原型、不可枚举的属性**(这种情况使用`assert.deepStrictEqual`)

### 4、assert.deepStrictEqual(actual, expected\[, message\])

这个API的用法与assert.deepEqual()大致相同，区别主要在于对原始值、对象的原型和对象类型标签使用全等运算符(===)比较

```
const assert = require('assert');

assert.deepEqual({ a: 1 }, { a: '1' });
// 测试通过，因为 1 == '1'。

assert.deepStrictEqual({ a: 1 }, { a: '1' });
// 抛出 AssertionError: { a: 1 } deepStrictEqual { a: '1' }
// 因为使用全等运算符 1 !== '1'。

// 以下对象都没有自身属性。
const date = new Date();
const object = {};
const fakeDate = {};

Object.setPrototypeOf(fakeDate, Date.prototype);
//Object.setPrototypeOf()是ECMAScript 6最新草案中的方法，相对于 Object.prototype.__proto__，它被认为是修改对象原型更合适的方法
//参考文档：https://developer.mozilla.org/zhCN/docs/Web/JavaScript/Equality_comparisons_and_sameness

assert.deepEqual(object, fakeDate);
// 测试通过，不测试原型。
assert.deepStrictEqual(object, fakeDate);
// 抛出 AssertionError: {} deepStrictEqual Date {}
// 因为原型不同。

assert.deepEqual(date, fakeDate);
// 测试通过，不测试类型标签。
assert.deepStrictEqual(date, fakeDate);
// 抛出  2017-09-18T11:41:27.747Z deepStrictEqual Date {}
// 因为类型标签不同。

```

### 5、assert.ok(value\[, message\])

用来测试value是否为真值，相当于`assert.equal(!!value, true, message)`

```
const assert = require('assert');

assert.ok(true);
// 测试通过。
assert.ok(1);
// 测试通过。

assert.ok(false);
// 抛出 "AssertionError: false == true"
assert.ok(0);
// 抛出 "AssertionError: 0 == true"
assert.ok(false, '不是真值');
// 抛出 "AssertionError: 不是真值"
```

### 6、assert.ifError(value)

若value为真，则抛出value。可用于测试回调函数的error参数

```
const assert = require('assert');

assert.ifError(0);
// 测试通过。
assert.ifError(1);
// 抛出 1。
assert.ifError('error');
// 抛出 'error'。
assert.ifError(new Error());
// 抛出 Error。
```

### 7、assert.fail(actual, expected\[, message\[, operator\[, stackStartFunction\]\]\])

-   actual **<any>**
-   expected **<any>**
-   message **<any>**
-   operator **<string> 默认为'!='**
-   stackStartFunction **<function> 默认为 assert.fail**

```
const assert = require('assert');

assert.fail()
//抛出 AssertionError [ERR_ASSERTION]: undefined undefined undefined
assert.fail('错误信息');
//抛出 AssertionError [ERR_ASSERTION]: 错误信息
assert.fail('a', 'b');
//抛出 AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// 抛出 AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, '错误信息', '>');
// 抛出 AssertionError [ERR_ASSERTION]: 错误信息
// 上面两个例子的 `actual` 参数、`expected` 参数与 `operator` 参数不影响错误消息。
```

使用 stackStartFunction 参数拦截异常的栈信息：

```
function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
//抛出AssertionError [ERR_ASSERTION]: 'a' !== 'b'
```

### 8、assert.throws(block\[, error\]\[, message\])

-   block **<Function>**
-   error **<RegExp> | <Function> error 参数可以是构造函数、正则表达式、或自定义函数。**

断言block函数会抛出错误

```
//error参数为构造函数
assert.throws(
  () => {
    throw new Error('错误信息');
  },
  Error   
);

//error参数为正则表达式
assert.throws(
  () => {
    throw new Error('错误信息');
  },
  /错误/  
);

//error为自定义函数
assert.throws(
  () => {
    throw new Error('错误信息');
  },
  function(err) {
    if ((err instanceof Error) && /错误/.test(err)) {
      return true;
    }
  },   
  '不是期望的错误'
);
```

### 9、与上面例子相反的使用

[assert.doesNotThrow(block\[, error\]\[, message\])](https://link.jianshu.com?t=http://nodejs.cn/api/assert.html#assert_assert_doesnotthrow_block_error_message)  
[assert.notDeepEqual(actual, expected\[, message\])](https://link.jianshu.com?t=http://nodejs.cn/api/assert.html#assert_assert_notdeepequal_actual_expected_message)  
[assert.notDeepStrictEqual(actual, expected\[, message\])](https://link.jianshu.com?t=http://nodejs.cn/api/assert.html#assert_assert_notdeepstrictequal_actual_expected_message)  
[assert.notEqual(actual, expected\[, message\])](https://link.jianshu.com?t=http://nodejs.cn/api/assert.html#assert_assert_notequal_actual_expected_message)  
[assert.notStrictEqual(actual, expected\[, message\])](https://link.jianshu.com?t=http://nodejs.cn/api/assert.html#assert_assert_notstrictequal_actual_expected_message)

### 10、总结参考

[http://nodejs.cn/api/assert.html](https://link.jianshu.com?t=http://nodejs.cn/api/assert.html)
