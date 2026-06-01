---
title: "git⼦模块"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

有种情况我们经常会遇到：某个⼯作中的项⽬需要包含并使⽤另⼀个项⽬。 也许是第三⽅库，或者你独
⽴开发的，⽤于多个⽗项⽬的库。 现在问题来了：你想要把它们当做两个独⽴的项⽬，同时⼜想在⼀个
项⽬中使⽤另⼀个。
Git 通过⼦模块来解决这个问题。 ⼦模块允许你将⼀个 G it 仓库作为另⼀个 G it 仓库的⼦⽬录。 
它能让你将另⼀个仓库克隆到⾃⼰的项⽬中，同时还保持提交的独⽴。
添加⼀个远程仓库项⽬  https://github.com/iphysresearch/GWToolkit.git ⼦模块到⼀个已有主仓库项
⽬中。代码形式是  git submodule add &lt;url&gt; &lt;repo_name&gt;， 如下⾯的例⼦：
这时，你会看到⼀个名为  GWToolkit 的⽂件夹在你的主仓库⽬录中。
如果你是旧版 Git 的话，你会发现  ./GWToolkit ⽬录中是空的，你还需要在执⾏⼀步「更新⼦模
块」，才可以把远程仓库项⽬中的内容下载下来。
如果你不⼩⼼把路径写错了，可以⽤下⾯的代码来删掉，详细可查阅  git help submodule。添加⼦模块
$ git submodule add https://github.com/iphysresearch/GWToolkit.git GWToolki
t1
Bash
$ git submodule update --init --recursive 1
Bash
$ git rm --cached  GWToolkit 1
Bash

87添加⼦模块后，若运⾏  git status，可以看到主仓库⽬录中会增加⼀个⽂件  .gitmodules，这个⽂件
⽤来保存⼦模块的信息。
另外，在  .git/config 中会多出⼀块关于⼦模块信息的内容：
该配置⽂件保存了项⽬ URL 与已经拉取的本地⽬录之间的映射。如果有多个⼦模块，该⽂件中就
会有多条记录。 要重点注意的是，该 ⽂件也像  .gitignore ⽂件⼀样受到（通过）版本控制。 它会
和该项⽬的其他部分⼀同被拉取推送。 这就是克隆该项⽬的⼈知道去哪获得⼦模块的原因。
新⽣成的还有相关⼦模块的⽂件： .git/modules/GWToolkit/。
此时若把上述「添加⼦模块」的修改更新到主仓库的 Gi tHub 上去的话，会看到相应⼦模块仓库的
⽂件夹图标会有些不同：$ git status
位于分⽀ main
您的分⽀与上游分⽀  'origin/main'  ⼀致。
要提交的变更：
  （使⽤ "git restore --staged < ⽂件 >..." 以取消暂存）
新⽂件：   .gitmodules
新⽂件：   GWToolkit1
3
5
7
Bash
[submodule "GWToolkit"]
        url = https://github.com/iphysresearch/GWToolkit.git
        active = true1
3
Plain Text

88此时还要留意的是，在终端 Git 命令操作下，位于主仓库⽬录中除了⼦模块外的任何⼦⽬录下进
⾏的 commit 操作，都会记到主仓库 下。只有在⼦模块⽬录内的任何 c ommit 操作，才会记到⼦
模块仓库下。如下⾯的示例：
更新项⽬内⼦模块到最新版本：
更新⼦模块为远程项⽬的最新版本查看⼦模块
更新⼦模块$ cd ~/projects/&lt;module&gt;
$ git log # log shows commits from Project &lt;module&gt;
$ cd ~/projects/&lt;module&gt;/&lt;sub_dir&gt;
$ git log # still commits from Project &lt;module&gt;
$ cd ~/projects/&lt;module&gt;/&lt;submodule&gt;
$ git log # commits from &lt;submodule&gt;1
3
5
Bash
$ git submodule
 13fe233bb134e25382693905cfb982fe58fa94c9 GWToolkit (heads/main)1
Bash
$ git submodule update 1
Bash

89对于你的主仓库项⽬合作者来说，如果只是  git clone 去下载主仓库的内容，那么你会发现⼦模块
仓库的⽂件夹内是空的！
此时，你可以像上⾯「添加⼦模块」中说到的使⽤  git submodule update --init --recursive 来递归
的初始化并下载⼦模块仓库的内容。
也可以分初始化和更新⼦模块两步⾛的⽅式来下载⼦模块仓库的内容：
但是，如果你是第⼀次使⽤  git clone 下载主仓库的所有项⽬内容的话，我建议你可以使⽤如下的
代码格式来把主仓库和其中⼦模块的所有内容，都 ⼀步到位 的下载下来：
以后可以在⼦模块仓库⽬录下使⽤  git pull origin main 或者 git push 等来进⾏更新与合并等操作。
删除⼦模块⽐较麻烦，需要⼿动删除相关的⽂件，否则在添加⼦模块时有可能出现错误  同样以删
除 GWToolkit ⼦模块仓库⽂件夹为例：
1.删除⼦模块⽂件夹Clone 包含⼦模块的项⽬
删除⼦模块$ git submodule update --remote 1
Bash
$ git submodule init # 初始化⼦模块
$ git submodule update # 更新⼦模块1
Bash
$ git clone --recursive  &lt;project url&gt; 1
Bash

902.删除 .gitmodules ⽂件中相关⼦模块的信息，类似于：
3.删除 .git/config 中相关⼦模块信息，类似于：
4.删除 .git ⽂件夹中的相关⼦模块⽂件
虽然 Git 提供的⼦模块功能已⾜够⽅ 便好⽤，但仍请在为主仓库项⽬添加⼦模块之前确保这是
⾮常必要的。毕竟有很多编程语⾔（如  Go）或其他依赖管理⼯具（如