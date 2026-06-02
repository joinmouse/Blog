---
title: "首篇、简单的HTTP协议"
date: 2018-01-12
slug_jianshu: e32214cc94c8
tags: []
state: open
source: "https://www.jianshu.com/p/e32214cc94c8"
source_kind: jianshu
---
### 1 、http协议用于客户端和服务端的通信

看图说话

**在应用HTTP协议的时，必定有一端担任客户端角色，另一端担任服务端角色**

请求和响应

**请求(request)必定是由客户端发出，而服务器端回复响应(respone)**

### 2、http是无状态协议

首先我们需要理解下这里的无状态的含义是：**http是一种不保存状态，即http协议自身不对请求和响应之间的通信状态进行保存**，啦啦，还是看图吧  

无状态协议

**HTTP协议自身不具备保存之前发送过的请求或响应的功能**

当我们使用http协议的时候，每次有新的请求发送，就会有对应新的响应产生。协议本身并不保留之前一切的请求或者响应的报文信息。这是为了更快的处理大量事务，确保了协议的可伸展性，而将http协议设计的这样的简单

### 3、请求URI定位资源

其实这里将URI理解为URL我觉得也是可以的，因为博客的写作主要参考《图解HTTP》这本书，为了保持一致性，我还是使用URI来定位资源，关于URL和URI的区别，建议可以参考下知乎上的这个问答:[https://www.zhihu.com/question/21950864](https://link.jianshu.com?t=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F21950864)

客户端使用URI定位资源

**HTTP协议使用URI让客户端定位到资源**

以请求[http://hackr.com/index.html](https://link.jianshu.com?t=http%3A%2F%2Fhackr.com%2Findex.html)作为请求的例子

```
GET　/index.html  HTTP/1.1
Host: hackr.com
```

这里GET是请求方法，host是请求的主机名(服务器),index.html是对应主机上的资源，HTTP/1.1是协议

### 4、告知服务器意图的HTTP方法

下面的表列举了HTTP/1.0和HTTP/1.1的方法

  

请求方法

**目前大多数WEB应用都是采用的HTTP/1.1中可使用的方法**　下面会重点介绍一下HTTP/1.1中的７个基本请求方法

###### GET:　获取资源

GET

-   请求

```
GET /index.html HTTP/1.1
Host: www.hacker.com
```

-   响应:　返回index.html的页面资源

##### POST: 传输实体主体

POST方法主要用来传输实体主体，GET方法也可以用来传输实体的主体，但一般不采用；虽然POST方法和GET方法功能很相似，但POST主要目的也不是用来获取响应的主体内容。

  

POST方法

-   请求

```
POST /submit.cgi  HTTP/1.1
Host: www.hacker.com
Content-Length: 1560(1560字节数据)
```

-   响应:　返回submit.cgi接受数据的处理结果

**PUT:　传输文件**  
PUT方法用来传输文件，要求在请求报文的主体中包含文件内容，然后保存到请求URI指定的位置。  

PUT方法

-   请求

```
PUT  /example.html HTTP/1.1
Host: www.hacker.com
Content-Type: text/html
Content-Length: 1560 (1560字节的数据)
```

-   响应：响应是请求执行成功了，但无数据返回；响应返回状态码204 No Content

**HEAD: 　获取报文首部**  
HEAD方法和GET方法一样，只是不返回报文主体部分。 用于确认URI的有效性及资源更新的日期时间  

HEAD方法

**GET一样,但不返回报文主体**

-   请求

```
HEAD /index.html HTTP/1.1
Host: www.hacker.com
```

-   响应：返回index.html有关的响应首部

**DELETE: 删除文件**  

DELETEf方法

-   请求

```
DELETE /example.html HTTP/1.1
Host: www.hacker.com
```

-   响应：响应返回状态码204(该html已从该服务器上删除)

**OPTIONS: 询问支持的方法**  

OPTIONS

**OPTIONS方法用来查询针对请求URI指定的资源支持的方法**

-   请求

```
OPTIONS * HTTP/1.1
Host: www.hacker.com
```

-   响应

```
HTTP/1.1 200 OK
Allow: GET, POST, HEAD,OPTIONS
(返回服务器支持的方法)
```

**TRACE: 追踪路径(用的很少)**  
trace方法是让Web服务器端之前的请求通信返回给客户端的方法.

TRACE

-   请求：

```
TRACE  /HTTP/1.1
Host: hacker.com
Max-Forwards: 2
```

-   响应：

```
HTTP/1.1 200 OK
Content-Type: message/http
Content-Length: 1024

TRACE /HTTP/1.1
Host: hacker.com
Max-Forwards: 2　(返回的响应包含请求内容)
```

发送请求时，在Max-Forwards首部字段中填入数值，每次经过一个服务器端就将该数字减１,当数值刚好减到0时，就停止继续传输; 最后接受到请求的服务器端则返回状态码200 OK的响应

**CONNECT：要求用隧道协议连接代理**  
CONNECT方法要求与代理服务器通信时建立隧道，实现用隧道协议进行TCP通信。  

CONNECTf方法

CONNECT方法格式  
`CONNECT 代理服务器名：端口号　HTTP版本`

-   请求

```
CONNECT proxy.hacker.com:8080  HTTP/1.1
Host: proxy.hacker.com
```

-   响应

```
HTTP/1.1 200 OK(之后进入网络隧道)
```

##### 5、 总结

上面主要写了一个简单的HTTP协议的进行分析，重点列举了客户端向服务端发起请求的方法(以HTTP/1.1版本为主)，下篇将重点写HTTP状态码。
