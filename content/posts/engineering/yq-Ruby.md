---
title: "Ruby"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

’s rubygems, 
Node.js’ npm, or Cocoa’s CocoaPods and Carthage）可以更好的 handle 类似的功能。
主仓库项⽬的合作者并不会 ⾃动地看到⼦模块仓库的更新通知的。所以，更新⼦模块后⼀定要
记得提醒⼀下主仓库项⽬的合作者 git submodule update。最后的话
●
●$ git rm --cached  GWToolkit
$ rm -rf GWToolkit1
Bash
[submodule "GWToolkit"]
        path = GWToolkit
        url = https://github.com/iphysresearch/GWToolkit.git1
3
Plain Text
[submodule "GWToolkit"]
        url = https://github.com/iphysresearch/GWToolkit.git
        active = true1
3
Plain Text
$ rm -rf .git/modules/GWToolkit 1
Bash

91