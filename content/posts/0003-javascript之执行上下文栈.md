---
title: "JavaScript之执行上下文栈"
date: 2018-12-03
issue_number: 3
tags: ["JS深入浅出"]
state: open
source: "https://github.com/joinmouse/Blog/issues/3"
---
### JS的可执行代码
JS的可执行代码分为3种: 全局代码、函数代码、eval代码， 这里我们重点讨论下执行一个函数的情况

### 执行上下文
其实这里的执行上下文简单的理解就是当我们执行函数的时候会先进入一个环境，这个环境就是执行上下文，然后再去执行；JS会用一个栈来放置这些上下文的环境(执行上下文栈)

### 执行上下文栈
JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文，我们模拟执行上下文是一个数组: 
```
ECStack = [];
```
 当JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先就会向执行上下文栈压入一个全局执行上下文，我们用 globalContext 表示它，并且只有当整个应用程序结束的时候，ECStack 才会被清空。
```
ECStack = [
    globalContext
];
```

我们来看一个例子1
```
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

我们看一下这段代码执行上下文的变化
```
ECStack.push(<checkscope> functionContext);
ECStack.push(<f> functionContext);
ECStack.pop();
ECStack.pop();
```

接着看它的一个和它很相似的例子2
```
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

执行上下文的变化
```
ECStack.push(<checkscope> functionContext);
ECStack.pop();
ECStack.push(<f> functionContext);
ECStack.pop();
```

我们可以看到上面的例子虽然结果都是相同的，但是实际的过程中执行上下文栈的变化不同的


参考链接:  https://github.com/mqyqingfeng/Blog/issues/4


