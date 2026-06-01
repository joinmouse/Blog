---
title: "ubuntu16.04  下安装网易云音乐"
date: 2017-09-07
slug_jianshu: b0f973012fbf
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/b0f973012fbf"
source_kind: jianshu
---
## 0x00 muisc

* * *

平时都很听音乐一直都在网易云下，这里记录下小编在Ubuntu下安装网易云的过程，可以供其他踩到坑的人参考

## 0x01 下载安装

* * *

下载入口：[网易云音乐](https://link.jianshu.com?t=http://music.163.com/#/download)，或直接用搜索引擎

music

支持的版本

可以看到网易云这里Linux下支持深度的和Ubuntu的，这里我们选择对应的版本下载就好了，小编用的是Ubuntu16.04。

下载完成后我们会发现下载的.deb文件在主文件夹/下载项下面，下面进入Ubuntu终端操作就好了

切换到下载

报错

那么这里到底是怎么回事了，为什么会发生报错，小编刚开始也困惑不解，最后小编通过更换源才解决了这个问题的

## 0x02 更换源再次安装

依次点击系统设置 ==》软件和更新

  

软件和更新

这里我们将下载自改为了阿里云的服务器软件仓库，然后依据提示更新。

```
#重新配置一下依赖
sudo apt-get -f install

#再次安装
sudo dpkg -i netease-cloud-music_1.0.0-2_amd64_ubuntu16.04.deb 
```

下面我们见证奇迹的一刻

```
#运行这样一条命令可以直接帮我们打开网易云音乐的软件
netease-cloud-music
```

当然大家可以将网易云打开后锁定到左边的侧边栏上，像在window下单击图标一样打开就OK，但是你不觉得一条命令启动这个姿势很帅吗？

  

bing

## 0x03 music

相必很多人看到上面已经觉得OK了，但小编就觉得启动的命令太长了，你想啊`netease-cloud-music`这是什么鬼，一般人也记不住，当然大家可以输入一部分后就用tab键补齐.  
但是小编却想直接在命令行中敲下`music`然后启动，这样是不是超好记也超帅，这里为了解锁新操作，要用到alias(别名)这个点，下面我们先看操作，然后再来解释

```
#编辑bash的配置文件(nano是一文字编辑器)
nano .bashrc 
```

alias

  

这里我们按向下箭找到配置文件中的这一栏

2017-09-07 14-39-50屏幕截图.png

你打开后alias别名的配置就是这样的，他的意思是后面一个命令行可以简化为前面的命令行，我们照葫芦画瓢，在后面添加一项`alias music='netease-cloud-music'`,它的作用是你使用`music`或者`netease-cloud-music`的效果是一样的，我们已经知道`netease-cloud-music`命令是打开网易云音乐的..

最后要提示一点的是修改了.bashrc文件后，默认是在用户下次登录系统时才能生效，这里为了使其立刻生效加入一条命令`source .bashrc`,有时小编发现执行完后还需要关闭下终端在重启才有效，总之相信大家试一下就可以搞定的

## 0x04 一句话总结

* * *

### music //打开网易云音乐

### Ctrl+c //关闭

最后大家在实践的过程中有什么疑惑欢迎私信小编(我也是才发现的功能)

参考链接：[http://www.jianshu.com/p/f9acf852d461](https://www.jianshu.com/p/f9acf852d461)  
[http://blog.csdn.net/u011557212/article/details/53234134](https://link.jianshu.com?t=http://blog.csdn.net/u011557212/article/details/53234134)
