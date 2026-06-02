---
title: "同源策略 | 跨域"
date: 2021-01-01
tags: ["跨域"]
---

同源策略(same-origin-policy)
说道跨域，不得不提同源策略，因为同源策略是浏览器安全的基石

含义
A网站设置的Cookie，B网页不能获取，除非他们"同源"，这里的同源是指的：
- 协议相同
- 域名相同
- 端口相同

假设有一个网站的网址是：http://www.example.com/dir/page.html ，我们看以下的情况
JavaScriptRun CodeCopy91234http://www.example.com/dir2/other.html：同源http://example.com/dir/other.html：不同源（域名不同）http://v2.www.example.com/dir/other.html：不同源（域名不同）http://www.example.com:81/dir/other.html：不同源（端口不同）
目的
同源策略的目的，也是为了保护用户的信息安全，防止恶意的网址的窃取数据。同源策略的限制主要有三种，不同源的话以下信息不可以被读取。
JavaScriptRun CodeCopy9123Cookie、LocalStorage 和 IndexDB 无法读取DOM 无法获得AJAX 请求不能发送
而我们用的最多的场景就是ajax请求有时候会跨域的去发送，除了架设服务器代理(浏览器请求同源服务器，再由后者请求外部服务)，还有三种方式可以摆脱这个限制

