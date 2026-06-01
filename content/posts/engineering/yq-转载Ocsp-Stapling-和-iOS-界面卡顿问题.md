---
title: "转载Ocsp Stapling 和 iOS 界面卡顿问题"
date: 2020-11-05
tags: ["语雀"]
source_kind: yuque
---

这个问题成功的吸引了我的注意。

**起因：** 一个 Flutter 写的 app 在 iOS 上偶尔会发生了界面卡顿甚至冻结 10 多秒，但在 Android 正常。

开始这个问题没太引起重视，觉得是 Flutter 的问题。但后来随着 Dart 的 issue 里面报告的人逐渐多起来，看起来不是那么简单。不过非常令人迷惑的是这个现象只在 iOS 偶尔出现，Android 从来不出现，这种不确定性使得重现和调试非常困难。

在 issue 里面发现报告的人大部分疑似是中国用户，之后发现有人提到更换了阿里云证书之后问题不再重现，这使得我们把问题方向放在 HTTPS 上。最终发现服务器的 OCSP Stapling 失效，造成了 soft failure。之后的行为要看客户端实现，有的浏览器接受 soft failure，不进行客户端检查，一切正常。但有一些客户端比如 Safari 会自己去检查了 OCSP 状态，从而造成界面无响应。检查 nginx log 发现 `ocsp.int-x3.letsencrypt.org` 请求超时，随后确认此域名遭到了 DNS 污染。

在服务器开启 OCSP Stapling 对于提升速度帮助很大。所以无论如何也是应该开启的。

但是仍然有两个问题没有解释：

1. 为什么 Android 没问题，iOS 有问题
2. 为什么有时候可以重现，有时候不可以重现

为了回答这几个问题，顺便找一个解决方案，我顺着读了一圈代码和协议，从 nginx 到 openssl，从 tls 到 ocsp。最后终于能回答这两个问题了。

## 1. Android 没有问题的原因

Google 不满意 OCSP 这个解决方案，所以所有 Google 的产品，无论是 Android 还是 Chrome 都不进行 OCSP 检查。

OCSP 作用是检查证书状态，尤其是是否吊销，Google 认为检查证书状态并不能增加安全性，并且导致 HTTPS 请求时间变长，并且 OCSP 服务器本身也可能会出问题，这不是一个可靠的方案。Google 通过分发一个列表到本地来解决证书检查问题。当然有人提出争议说分发列表这个过程会因为升级服务器被屏蔽而失效，Google 认为如果能屏蔽我们的升级服务器，那么屏蔽 OCSP 服务器岂不是更容易？所以从 2012 年开始，Google 就逐步取消了 OCSP 检查。

## 2. 为什么有时候可以，有时候不可以

读 nginx 代码，发现 nginx 会把 OCSP 请求结果放在内存里面，直到过期之前才会再次请求 OCSP 服务器更新状态。但是如果重启了 nginx，内存里面的结果就丢掉了，下一次就会直接请求 OCSP 服务器。

Let's Encrypt 使用 Akamai CDN 分发 OCSP 状态，实际上遭到 DNS 污染的似乎是 akamai.net 的某一部分节点，应该还有少量没被污染。所以有时候还能取得正确的结果，一旦取得正确的结果之后，在下次 nginx 重启 / OCSP 过期之前就会变得一切正常。这使得重现它更加困难。

## 解决方案

代码读完之后，也就知道了解决方案：

- 使用 `ssl_stapling_file` 配置，从一个外部文件获取 OCSP 信息（ngx_ssl_stapling_file）
- 使用 `ssl_stapling_responder` 配置，nginx 会用这个设置覆盖证书里面的 Authority Information Access 信息，使得请求 OCSP 被发送到设置的服务器

两者之间我更倾向后者，后者灵活的多，也省去了跨机器更新文件的麻烦，顺便还能解决以后其它麻烦。

我首先想按照 OCSP 协议写一个简单的 responder，不过搜索之后发现有人很多年前写过一段非常简单的转发代码，直接把请求转发给指定的服务器。虽然必须要设置一个固定的转发服务器（因为原始的 Authority Information Access 信息被 nginx 覆盖了）。我想更好的解决方案是修改一下 nginx 的代码，在这个 HTTP 请求中把原始的 AIA 放到 header 里面一起发给代理，不过考虑到大部分人都会把所有证书集中在一个供应商，设置一个转发地址完全能解决问题。而且避免每次升级给 nginx 重新打补丁的麻烦。所以就不改了。

我稍微修改了一下这个代码，让程序可以从环境变量获得转发地址，以便于使用 docker 部署。新的代码在这里：https://github.com/virushuo/ocsp-proxy

部署好了之后在 `nginx.conf` 里面增加配置：

```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/ssl/ca-certs.pem;
ssl_stapling_responder http://YOUR_PROXY_IP:8080/;
```

原文链接：https://jhuo.ca/post/ocsp-stapling-letsencrypt/
