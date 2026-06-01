---
title: "Ruby"
date: 2022-10-15
tags: ["语雀"]
source_kind: yuque
---

’s rubygems, 
Node.js’ npm, or Cocoa’s CocoaPods and Carthage）可以更好的 handle 类似的功能。
主仓库项目的合作者并不会 自动地看到子模块仓库的更新通知的。所以，更新子模块后一定要
记得提醒一下主仓库项目的合作者 git submodule update。最后的话
- 
- $ git rm --cached  GWToolkit
$ rm -rf GWToolkit1
Bash
[submodule "GWToolkit"]
        path = GWToolkit
        url = https://github.com/iphysresearch/GWToolkit.git1
Plain Text
[submodule "GWToolkit"]
        url = https://github.com/iphysresearch/GWToolkit.git
        active = true1
Plain Text
$ rm -rf .git/modules/GWToolkit 1
Bash
