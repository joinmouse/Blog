---
title: "ubuntu16.04 下更新node.js和npm"
date: 2017-09-09
slug_jianshu: 75ddca6abd8b
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/75ddca6abd8b"
source_kind: jianshu
---
## 1.node.js版本更新

* * *

node下面有一个模块叫n，是用来专门node.js的版本的

1、这里我们先安装n模块：  
`sudo npm install -g n`

2、升级node.js到最新的稳定版本  
`sudo n stable`

重启一下终端，`node -v`看一下版本，就可以发现我们已经升级到最新版本了

## 2.npm更新

* * *

npm包的更新其实就是自己更新自己  
`sudo npm install -g npm`
