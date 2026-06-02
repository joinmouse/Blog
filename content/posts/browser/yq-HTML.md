---
title: "HTML"
date: 2021-01-01
tags: ["HTML"]
---

1、BOM(浏览器对象模型)
BOM 是 Browser Object Model 的缩写，即浏览器对象模型，当一个浏览器页面初始化时，会在内存创建一个全局的对象，用以描述当前窗口的属性和状态，这个全局对象被称为浏览器对象模型，即BOM。

BOM的核心对象就是 window，包含了浏览器的六个核心模块:
- document - 即文档对象，渲染引擎在解析HTML代码时，会为每一个元素生成对应的DOM对象，由于元素之间有层级关系，因此整个HTML代码解析完以后，会生成一个由不同节点组成的树形结构，俗称DOM树，document 用于描述DOM树的状态和属性，并提供了很多操作DOM的API
- frames - HTML 子框架，即在浏览器里嵌入另一个窗口，父框架和子框架拥有独立的作用域和上下文
- history - 以栈(FIFO)的形式保存着页面被访问的历史记录，页面前进即入栈，页面返回即出栈
- location - 提供了当前窗口中加载的文档相关信息以及一些导航功能
- navigator - 用来描述浏览器本身，包括浏览器的名称、版本、语言、系统平台、用户特性字符串等信息
- screen - 提供了浏览器显示屏幕的相关属性，比如显示屏幕的宽度和高度，可用宽度和高度

2、DOM(文档对象模型)
DOM 是 Document Object Model 的缩写，即 文档对象模型，是所有浏览器公共遵守的标准，DOM 将HTML和XML文档映射成一个由不同节点组成的树型结构，俗称DOM树。其核心对象是document，用于描述DOM树的状态和属性，并提供对应的DOM操作API。

随着历史的发展，DOM 被划分为1级、2级、3级，共3个级别
- 1级DOM - 在1998年10月份成为W3C的提议，由 DOM 核心与 DOM HTML 两个模块组成。DOM核心能映射以XML为基础的文档结构，允许获取和操作文档的任意部分。DOM HTML通过添加HTML专用的对象与函数对DOM核心进行了扩展
- 2级DOM - 鉴于1级DOM仅以映射文档结构为目标，DOM 2级面向更为宽广。通过对原有DOM的扩展，2级DOM通过对象接口增加了对鼠标和用户界面事件（DHTML长期支持鼠标与用户界面事件）、范围、遍历（重复执行DOM文档）和层叠样式表（CSS）的支持。同时也对DOM 1的核心进行了扩展，从而可支持XML命名空间
- 3级DOM - 通过引入统一方式载入和保存文档和文档验证方法对DOM进行进一步扩展，DOM3包含一个名为"DOM载入与保存"的新模块，DOM核心扩展后可支持XML1.0的所有内容，包括XML Infoset、 XPath、和XML Base。

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1609316704919-c8c7aaaa-98da-49db-9bb4-4bcefedd02c3.png)

图中可以看出，移动端常用的 webkit 内核浏览器目前只支持 DOM2，而不支持 DOM3。

3、事件系统
事件是用户与页面交互的基础，到目前为止，DOM事件从PC端的 鼠标事件(mouse) 发展到了 移动端的 触摸事件(touch) 和 手势事件(guesture)，touch事件描述了手指在屏幕操作的每一个细节，guesture 则是描述多手指操作时更为复杂的情况，总结如下：

- 第一根手指放下，触发 touchstart，除此之外什么都不会发生
- 手指滑动时，触发touchmove
- 第二根手指放下，触发 gesturestart 
- 触发第二根手指的 touchstart
- 立即触发 gesturechange 
- 任意手指移动，持续触发 gesturechange
- 第二根手指弹起时，触发 gestureend，以后将不会再触发 gesturechange 
- 触发第二根手指的 touchend
- 触发touchstart (多根手指在屏幕上，提起一根，会刷新一次全局touch)  
- 弹起第一根手指，触发 touchend

DOM2.0 模型将事件处理流程分为三个阶段，即 事件捕获阶段、事件处理阶段、事件冒泡阶段

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1609317176329-59cf11e4-9935-42eb-be32-238838a305be.png)

- 事件捕获：当用户触发点击事件后，顶层对象 document 就会发出一个事件流，从最外层的 DOM 节点向目标元素节点传递，最终到达目标元素。
- 事件处理：当到达目标元素之后，执行目标元素绑定的处理函数。如果没有绑定监听函数，则不做任何处理。
- 事件冒泡：事件流从目标元素开始，向最外层DOM节点传递，途中如果有节点绑定了事件处理函数，这些函数就会被执行。

事件委托机制：就是在父元素上添加事件监听器，用以监听和处理子元素的事件，避免重复为子元素绑定相同的事件。当目标元素的事件被触发以后，这个事件就从目标元素开始，向最外层元素传递，最终冒泡到父元素上，父元素再通过 event.target 获取到这个目标元素，这样做的好处是，父元素只需绑定一个事件监听，就可以对所有子元素的事件进行处理了，从而减少了不必要的事件绑定，对页面性能有一定的提升

4、History
用户访问网页的历史记录都会保存在一个类似栈的对象中，即history对象。访问或者跳入下一页就入栈， 点击就返回出栈，![image.png](https://cdn.nlark.com/yuque/0/2020/png/158659/1609317551963-a2713eb0-eeaf-46b4-9386-cce966e595e5.png) 。它提供了以下的方法来操控页面的前进和后退
- window.history.back( )    // 返回到上一个页面
- window.history.forward( )  // 进入到下一个页面
- window.history.go([delta])  // 跳转到指定页面

HTML5 对History Api 进行了增强，新增了两个Api 和一个事件，分别是 pushState、replaceState 和 onpopstate
- pushState 是往 history 对象里添加一个新的历史记录
- replaceState 是替换 history 对象中的当前历史记录
- onpopstate 当点击浏览器后退按钮或JS调用history.back 都会触发该事件

onpopstate 和 onhashchange 的区别：
onhashchange 本来是用来监听hash变化的，但可以被利用来做客户端前进和后退事件的监听，而 onpopstate 是专门用来监听浏览器前进后退的，不仅可以支持 hash，非 hash 的同源 url 也支持。

5、本地存储
本地存储最原始的方式就是 cookie,cookie 是存放在本地浏览器的一段文本，数据以键值对的形式保存，可以设置过期时间。 但是 cookie 不适合大量数据的存储，因为每请求一次页面，cookie 都会发送给服务器，这使得 cookie 速度很慢而且效率也不高。因此cookie的大小被限制为4k左右(不同浏览器可能不同,分HOST)，如下所示：
- Firefox 和 Safari 允许 cookie 多达 4097 个字节，包括名(name)、值(value) 和 等号。
- Opera 允许 cookie 多达 4096 个字节，包括：名(name)、值(value) 和 等号。
- Internet Explorer 允许 cookie 多达4095个字节，包括：名(name)、值(value) 和 等号。

在所有浏览器中，任何 cookie 大小超过限制都被忽略，且永远不会被设置。

html5 提供了两种在客户端存储数据的新方法：localStorage 和 sessionStorage, 它们都是以 key/value 的形式来存储数据，前者是永久存储，后者的存储期限仅限于浏览器会话(session)，即当浏览器窗口关闭后，sessionStorage中的数据被清除。

localStorage 的存储空间大约5M左右(不同浏览器可能不同，分 HOST)，这个相当于一个5M大小的前端数据库，相比于cookie，可以节约带宽，但localStorage在浏览器隐私模式下是不可读取的，当存储数据超过了localStorage 的存储空间后会抛出异常。

此外，H5还提供了 indexedDB，允许前端以关系型数据库的方式来存储本地数据

6、浏览器缓存机制
浏览器缓存机制是指通过 HTTP 协议头里的 Cache-Control (或 Expires) 和 Last-Modified (或 Etag) 等字段来控制文件缓存的机制。

Cache-Control 用于控制文件在本地缓存有效时长。最常见的，比如服务器回包：Cache-Control:max-age=600 表示文件在本地应该缓存，且有效时长是600秒 (从发出请求算起)。在接下来600秒内，如果有请求这个资源，浏览器不会发出 HTTP 请求，而是直接使用本地缓存的文件。

Last-Modified 是标识文件在服务器上的最新更新时间。下次请求时，如果文件缓存过期，浏览器通过 If-Modified-Since 字段带上这个时间，发送给服务器，由服务器比较时间戳来判断文件是否有修改。如果没有修改，服务器返回304告诉浏览器继续使用缓存；如果有修改，则返回200，同时返回最新的文件。

Cache-Control 通常与 Last-Modified 一起使用。一个用于控制缓存有效时间，一个在缓存失效后，向服务查询是否有更新。

Cache-Control 还有一个同功能的字段：Expires。Expires 的值一个绝对的时间点，如：Expires: Thu, 10 Nov 2015 08:45:11 GMT，表示在这个时间点之前，缓存都是有效的。

Expires 是 HTTP1.0 标准中的字段，Cache-Control 是 HTTP1.1 标准中新加的字段，功能一样，都是控制缓存的有效时间。当这两个字段同时出现时，Cache-Control 是高优化级的。

Etag 也是和 Last-Modified 一样，对文件进行标识的字段。不同的是，Etag 的取值是一个对文件进行标识的特征字串。在向服务器查询文件是否有更新时，浏览器通过 If-None-Match 字段把特征字串发送给服务器，由服务器和文件最新特征字串进行匹配，来判断文件是否有更新。没有更新回包304，有更新回包200。Etag 和 Last-Modified 可根据需求使用一个或两个同时使用。两个同时使用时，只要满足基中一个条件，就认为文件没有更新。

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1609318526050-6a4c093c-ed5b-47c2-b5f8-9db24924e4e5.png)

转载(整理)：https://www.cnblogs.com/onepixel/p/7021506.html

