---
title: "git子模块"
date: 2026-06-01
slug_yuque: lu35i5lqrrv0ncow
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/lu35i5lqrrv0ncow"
source_kind: yuque
---

返回文档有种情况我们经常会遇到：某个工作中的项目需要包含并使用另一个项目。 也许是第三方库，或者你独立开发的，用于多个父项目的库。 现在问题来了：你想要把它们当做两个独立的项目，同时又想在一个项目中使用另一个。
Git 通过子模块来解决这个问题。 子模块允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。
添加子模块
添加一个远程仓库项目 https://github.com/iphysresearch/GWToolkit.git 子模块到一个已有主仓库项目中。代码形式是 git submodule add <url> <repo_name>， 如下面的例子：

​Bash运行代码复制代码91$ git submodule add https://github.com/iphysresearch/GWToolkit.git GWToolkit这时，你会看到一个名为 GWToolkit 的文件夹在你的主仓库目录中。
如果你是旧版 Git 的话，你会发现 ./GWToolkit 目录中是空的，你还需要在执行一步「更新子模块」，才可以把远程仓库项目中的内容下载下来。

​Bash运行代码复制代码91$ git submodule update --init --recursive如果你不小心把路径写错了，可以用下面的代码来删掉，详细可查阅 git help submodule。

​Bash运行代码复制代码91$ git rm --cached GWToolkit添加子模块后，若运行 git status，可以看到主仓库目录中会增加一个文件 .gitmodules，这个文件用来保存子模块的信息。

​Bash运行代码复制代码912345678$ git status位于分支 main您的分支与上游分支 'origin/main' 一致。
要提交的变更：  （使用 "git restore --staged <文件>..." 以取消暂存）	新文件：   .gitmodules	新文件：   GWToolkit另外，在 .git/config 中会多出一块关于子模块信息的内容：

​Plain Text复制代码9123[submodule "GWToolkit"]        url = https://github.com/iphysresearch/GWToolkit.git        active = true该配置文件保存了项目 URL 与已经拉取的本地目录之间的映射。如果有多个子模块，该文件中就会有多条记录。 要重点注意的是，该文件也像 .gitignore 文件一样受到（通过）版本控制。 它会和该项目的其他部分一同被拉取推送。 这就是克隆该项目的人知道去哪获得子模块的原因。
新生成的还有相关子模块的文件：.git/modules/GWToolkit/。
此时若把上述「添加子模块」的修改更新到主仓库的 GitHub 上去的话，会看到相应子模块仓库的文件夹图标会有些不同：
![](https://cdn.nlark.com/yuque/0/2023/png/158659/1698845239985-485a60b5-0578-43fd-a059-ed97aec6d4c4.png)
此时还要留意的是，在终端 Git 命令操作下，位于主仓库目录中除了子模块外的任何子目录下进行的 commit 操作，都会记到主仓库下。只有在子模块目录内的任何 commit 操作，才会记到子模块仓库下。如下面的示例：

查看子模块

更新子模块
更新项目内子模块到最新版本：

更新子模块为远程项目的最新版本

Clone 包含子模块的项目
对于你的主仓库项目合作者来说，如果只是 git clone 去下载主仓库的内容，那么你会发现子模块仓库的文件夹内是空的！
此时，你可以像上面「添加子模块」中说到的使用 git submodule update --init --recursive 来递归的初始化并下载子模块仓库的内容。
也可以分初始化和更新子模块两步走的方式来下载子模块仓库的内容：

但是，如果你是第一次使用 git clone 下载主仓库的所有项目内容的话，我建议你可以使用如下的代码格式来把主仓库和其中子模块的所有内容，都一步到位的下载下来：

以后可以在子模块仓库目录下使用 git pull origin main 或者 git push 等来进行更新与合并等操作。
删除子模块
删除子模块比较麻烦，需要手动删除相关的文件，否则在添加子模块时有可能出现错误 同样以删除 GWToolkit 子模块仓库文件夹为例：
1删除子模块文件夹
2删除 .gitmodules 文件中相关子模块的信息，类似于：
3删除 .git/config 中相关子模块信息，类似于：
4删除 .git 文件夹中的相关子模块文件
最后的话
●虽然 Git 提供的子模块功能已足够方便好用，但仍请在为主仓库项目添加子模块之前确保这是非常必要的。毕竟有很多编程语言（如 [Go](https://golang.org/)）或其他依赖管理工具（如 Ruby’s [rubygems](http://guides.rubygems.org/), Node.js’ [npm](https://docs.npmjs.com/getting-started/what-is-npm), or Cocoa’s [CocoaPods](https://cocoapods.org/about) and [Carthage](https://github.com/Carthage/Carthage)）可以更好的 handle 类似的功能。
●主仓库项目的合作者并不会自动地看到子模块仓库的更新通知的。所以，更新子模块后一定要记得提醒一下主仓库项目的合作者 git submodule update。
​若有收获，就点个赞吧