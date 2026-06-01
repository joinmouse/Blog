---
title: "Monorepo 探索"
date: 2022-12-10
tags: ["语雀"]
source_kind: yuque
---

Monorepo 可以理解为一种基于仓库 的代码管理策略，它提出将多个代码工程" 独立"的放在一个仓
库里的管理模式。
这里的独立是指的每个代码工程在逻辑上是可以独立运行开发以及维护管理的，目前很多大型的互
联网公司都在采取这样的代码管理策略，比如Google，Facebook，Uber，MicroSoft等，我们熟
知的React、Vue、Vite、Babel等也采用了多包。
假设有这样一个前端场景： 有两个可以逻辑上被分割的项目 Project1 和 Project2 以及他们共用
的一个公共库 lib。
大型单仓( Single-repo Monolith)
Project 和 lib 都会被组织在一个仓库 当中，并会将两个 Projects 中代码进行杂糅，放在同一个代
码工程当中（当然这个组织形式可以有很多种，具体根据实际场景以及架构师对模块的设计理
念）; 而 lib 代码会放在该工程目录下，两个 Projects 可以简单的通过路径去引用，也可以通过工
具设置绝对地址 alias 来方便引入。1、Monorepo概念
1.1、仓库组织对比
- 

92独立多仓( Multi-repo)
这是我们非常熟悉的代码组织方式， 两个 Project 会单独成立代码工程放入 两个仓库当中。而 l ib 
也会独立成库进行开发，并通过构建后进行NPM发包，两个 Projects 需要通过 NPM 的形式安装
和更新 lib。●.
├── package.json
├── src/
│   ├── views/
|   | ├── project1 /
|   | ├── project2 /
│   ├── router/
|   | ├── project1 /
|   | ├── project2 /
|   ├── ...
│   └── lib/
└── README.md
// 代码共享  package1/example.js
import {method} from '../../lib' ;
// script 引入共享
&lt;script src="@static/lib/index.js" &gt;&lt;/script&gt;1
Repository - monolith JavaScript

93独立单仓 Monorepo
在 Monorepo 这个策略下，将会把两个 Projects 和 一个 lib 统一放到 p ackages 目录下面，每
个都会作为独立的包进行开发运行，公用依赖可以放在一级的n ode_module中，各个p ackage也
可以有自己独有的依赖。这里以 Pnpm 为例来展示，在 p npm-workspace.yaml 里配置把 ●// Repository - project1
.
├── node_modules /
├── package.json
├── src/
│   ├── views/
│   ├── router/
|   ├── ...
├── README.md
// Repository - project2
.
├── node_modules /
├── package.json
├── src/
│   ├── views/
│   ├── router/
|   ├── ...
├── README.md
// Repository - lib
.
├── node_modules /
├── package.json
├── src
|   ├── ...
├── README.md
// 代码共享
- lib进行发包，比如包名为  @my-scope/lib
- 进入Package1 或 Package2 进行npm install 或 npm update
- 在代码中引入
import {method} from '@my-scope/lib' ;1
多仓 JavaScript

94packages 下的所有包视为子项目，纳入包管理。在 lib 目录下的p acakge.json 中为其添加
name，同时添加到一级目录的 package.json 当中，即可被两个Projects引用，而无需进行发包
操作。
Monolith 时期 
我们的Mo nolith 这种模式是最早开发人员所使用的仓库架构模式，当时的前端功能还很简单，还
没有过多的框架出现，仅仅是 HTML , CSS 的编写以及加上简单的 J S 逻辑。后面随着Web 的能// Repository - monorepo
.
├── node_modules /
├── package.json
├── packages /
│   ├── pacakge1 /
|   | ├── src/
|   | ├── README.md
|   | ├── node_modules /
|   | ├── pacakge.json
│   ├── package2 /
|   | ├── src/
|   | ├── README.md
|   | ├── node_modules /
|   | ├── pacakge.json
│   └── lib/
|   | ├── src/
|   | ├── README.md
|   | ├── node_modules /
|   | ├── pacakge.json
├── README.md
├── pnpm-workspace .yaml
// pnpm-workspace.yaml
packages :
  - 'packages/*'
// 代码共享
- 假设 lib 的包名为 @my-scope/lib，无需发包至 NPM
- 在一级目录的  package.json 添加包名 @my-scope/lib: "workspace:*"
- 在两个 projects 中的代码中引入
import {method} from '@my-scope/lib' ;1
Repository - monorepo JavaScript

95力越来越复杂，开始将项目拆分成不同的包
Multi-repo 时期
Multi-repo 的流行很大程度上是为了解决这种模块高度耦合，代码臃肿的 情况，开发者们开始更
加倾向将整个业务项目进行拆分，独立进行管理。每个业务模块建立单独的库由各自团队负责开发
以及维护，各种包都通过 npm 来进行共享。
然而随着模块拆分不断的增多，开发者们⼜发现过多的仓库加大了维护的成本，新的项目环境搭
建，和涉及整体业务的重构和依赖同步都将变得繁琐，此时回归单 re po 的概念⼜开始兴起。因
此，已经被提出很久的 Monorepo 开始浮出水面，应运而生的工具也开始出现了。
Monorepo ？
Monorepo 的出现开始解决环境及依 赖统一的问题，代码之间的共享也不再强依赖于 NPM 来进
行。既保留了 Monolith 单仓环境维护 的便利性，同时满足 Mu lti-repo 对于项目解耦的独立开发
管理。
后类似 lerna + yarn 的包管理方案的 出现让 Monorepo 拥有了较为完整的解决方案，并伴随着新
兴的技术 pnpm，Changesets，Turborepo 的不断推出，Mo norepo 的整个管理流程变得越来越
完善和简单，也逐渐被很多开发者所采用
使用 Monorepo 的优势
统一管理：  由于只有一个仓库，所有的配置都可以统一进行管理，而无需为不同项目重复构
建环境，包括通用的代码规范检测，相同的测试框架，以及统一的 CI/CD 构建流程等。
原子提交：  这一点也是建立在统一管理的基础之上，使用原子提交轻松重构全局特性，而无
需为每个 repo 执行拉取请求找出构建 更改的顺序。这样可以简单的保持所有项目的全局特性
是统一的，并且交由专人进行维护升级，而各个代码工程的开发者无需过度关注。
简单依赖：  多个代码工程的相同依赖可以提升至根目录进行管理，大大减少重复安装所带来
的空间浪费。同时，代码工程之间也可以在保持隔离的同时相互引用，而无需在构建时依次构
建相关依赖包并重新发布。1.2、优劣分析总结
- 
- 
- 

96文化开放：  由于使用相同的代码库，所有开发者都能够浏览以及提交代码，在一定程度上也
会激励团队成员共建可复用的组件及工具方法
使用 Monorepo 带来的问题
限问题：  由于单仓的管理模式，使用 Monorepo 将无法简单的控制各个模块代码的访问限
制，任何有权限访问该仓库的人员将有权限访问所有的代码工程，这可能会导致部分安全问
题。
性能问题：  当仓库的代码规模非常的巨大，达到G B/TB的级别，会增大开发环境的代码下载
成本，以及本地硬盘的压力，执行 git status 也可能需要花费数秒甚至数分钟的时间。并且，
当代码工程很多且活跃数量也很多的情况，会加大分支管理策略和各个代码工程版本管理的压
力
Yarn
Yarn 是一个包管理工具，它提供安全，稳定的管理机制，它在很早的时候就提出了 w orkspace 
的概念来支持 Monorepo 的解决方案，用户也仅仅需要在p ackage.json 中配置 workspace 的目
录即可将其纳入 Yarn 的包管理当中。 Yarn 本身的设计是为了弥补 n pm 的一些缺陷而出现的，包
括安装速度、l ockfile 等。当然目前为 止 npm 也解决了部分这些方面的问题。
而随着 yarn2.x, yarn3.x 的版本更迭， 相较以前添加了诸多特性譬如 p npm 的 linker 机制，g it 
workspaces等，吸收了竞争对手的优 点，并开辟了许多有趣的功能特性，这使得它长期成为开发
者们的选择
pnpm
Pnpm 是一个快速的，节省磁盘空间的包管理工具，并天然支持 Monorepo 的解决方案。
pnpm 在包依赖管理的机制上有着独特的成果，包括 symlink 和 hard link机制，既极大的缩小了
安装包的体积，同时也解决了幽灵依赖的问题，这里就不展开描述，有机会再单独聊一聊。●
- 
- 
2、Monorepo技术方案
2.1、包管理方案
- 
- 

97pnpm 在使用习惯上保留了 npm 的所有命令，开发者可以无痛的进行切换 。而使用 m onorepo 的
功能，仅仅需要在根目录创建一个 pnpm-workspace.yaml 文件，并填写需要管理的目录，而之
后这些目录将自动纳入 pnpm 的工作空间，并由它进行管理
除了包依赖的管理以外，如何去管理众多项目的版本也是完善 Monorepo 工具链的重要部分，而其中最
为出名的就是 Lerna，它通常会配合 Yarn 一起使用，另外一个则是新兴的版本管理工具 Changesets，
它拥有自己的一套工作流程来契合 Mon orepo 的场景
Lerna
Lerna 是一个管理工具，用于管理包含多个软件包（p ackage）的 JavaScript 项目，其功能非常
复杂和完善，它拥有包管理的功能，同时还兼顾版本管理，并支持全量发布和单独发布等功能。在
业界实践中通常采用 Yarn 来处理依赖 安装和用 w orkspace 来管理项目中各个包，用 Lerna 来处
理依赖的更新和发布问题。这套技术组合完整的实现了 Mo norepo 中项目的包管理，更新到发布
的全流程。
Lerna 的工作流可以非常完善，它包含了包管理的流程以及各项参数配置，这里仅使用它的版本管
理功能来描述它的一个发布过程：
Changesets2.2、包版本方案
- 
- 

98Changesets 是一个用于 Monorepo 项目下版本以及 Changelog 文件管理的工具，它也是 
pnpm 官方所推荐使用的版本管理工具，它所做的工作相较于 Lerna 而言更加专一。
Changesets 的工作流会将开发者分为两类人，一类是项目的维护者，还有 一类为项目的开发者，
开发者在 Monorepo 项目下进行开发，开发完成后，给对应的子项目添加一个 cha ngeset 文件。
项目的维护者后面会通过 changeset 来消耗掉这些文件并自动修改掉对应包的版本以及生成 
CHANGELOG 文件，最后将对应的包 发布出去。
某些场景下， Monorepo 的规模较大，包之间拥有拓扑式的依赖结构，而此时进行项目构建往往
会需要依照依赖的链式逐步进行，过程将会耗费大量时间。而为了解决这样的构建痛点，也有相应
的技术浮出水面，比如 Turborepo。
Turborepo
Turborepo 是一个用于 JavaScript/TypeScript monorepos 的快速构建系统。目的是为了解决大
型 monorepo 项目构建速度缓慢的一大痛点。2.3、包构建方案
- 

99turbo 的核心是永远不会重新构建已经 构建过的内容。t urbo 会把每次构建的产物与日志缓存起
来，下次构建时只有文件发生变动的部分才会重新构建，没有变动的直接命中缓存并重现日志。
turbo 拥有更智能的任务调度程序，充 分利用空闲 CPU，使得整体构建速度更快。另外，tu rbo 还
具有远程缓存功能，可以与团队和 CI/CD 共享构建缓存。
简单的示例来辅助理解 Turborepo 在构建中的优势，假设有如下的包依赖结构，其中我们要对
app E 进行构建，它依赖4 个lib包的构建，而l ib包之间也有相互的依赖，特别l ib B 还同时依赖 l ib 
A 和 lib C
正常的构建过程将会依照顺序依次执行，而 Turb orepo 会在这个基础上通过它的缓存机制来确定
哪些包需要进行构建，同时通过它的任务调度机制来进行并行构建，从而加快整个构建流程。
ESLint
Eslint 是目前最受欢迎的 Javascript 代码质量校验工具，它可以通过静态分析代码来发现语言规
范问题，多数问题可以被自动修复，Eslin t 修复程序具有语法意识，因此不用担心修复后而引入错
误。
Prettier
Prettier 可以理解为一个代码格式化工 具，它提供一套完整的代码风格方案，它通过解析代码并使
用自己的规则强制重新打印代码，从而使得代码能够保证一致性。使用它可能不会让项目的代码完
全符合开发者想要的格式规范，但却在一定程度上是最通用和便捷的团队规范方案。并且，通过 
plugin 的形式 prettier 可以被集成到  Eslint 当中，使得两者的结合使用会更加便利。
同时，由于 Monorepo 的规模性，每次修改代码都进行全量的规范校验带来时间上的消耗，此时
可以利用 husky 和 lint-staged 两个工具在进行 g it 提交时进行增量代码的校验
Commitlint
Commitlint 是一个提交规范校验工具 ，它将帮助团队遵守一定的提交信息格式约定，默认采用 
Convenional 提交规范  ，它也提供一定的配置允许使用者更改校验规则。同时，通过 Husky 添加
相应的 git hook，来达到提交自动校 验的提示的功能
Commitizen 2.4、规范工具
- 
- 
- 
- (lib A -> lib B) -> lib D -> app E
(lib C -> lib B)1
JavaScript

100是一个提交日志工具，辅助开发者使用提交规则，再使用它进行 git 提交操作时，将自动提示填写
Commit Messsage 所必须的字段，并获取有关提交信息格式的及时反馈， 使用者只需按提示输入
相关内容信息即可。通常，上面两者技术也可以配合进行使用，既提供相应脚手架工具来辅助提交
信息填写，同时保证提交时规范的校验
pnpm： 包依赖管理工具
changesets： 包版本管理工具
eslint，pretter: 代码规范工具
commitizen，commitlint： 提交规范工具
husky，lint-staged： git hook相关工具
vitepress： 文档服务工具3、Monorepo 项目实践
- 
- 
- 
- 
- 
- 

101Ruby
数据库相关
MVC操作相关
单元测试相关功能 命令 解释
连接数据库 psql -h 172.18.0.2 -p 5432 -U 
mangosteen -d mangosteen_dev主机名称d ocker内的
删除表 DROP TABLE &lt;table_name&gt;
创建数据表的映射 bin/rails g model 
user email:string name:string生成u ser的表内有ema il、name
字段
同步到数据库 bin/rails db:migrate 数据库操作工具  
ActiveRecord::Migration
回滚数据库操作 bin/rails db:rollback step=1
创建数据库 rails db:create RAILS_ENV=test测试环境创建数据库
功能 命令 解释
创建m odel bin/rails g model 
ValidationCode email:string 
kind:string used_at:datetime生成m odel和数据库的映射关系
创建c ontroller bin/rails g controller user 
create show生成/u ser有create, show方法

102master.key + keys => .enc文件;  .enc文件 + master.key => keys
命令： bin/rails credentials:edit  (--environment production)
开发环境
生产环境密钥管理功能 命令 解释
生成R Spec配置文件 rails generate rspec:install
创建测试文件 rails g rspec:model user user测试文件
执行测试 bundle exec rspec
开发环境 master.key、 credentials.yml.encey
生产环境 production.key、 production.yml.encey

1031、创建m odel，运行d b:migrate
2、创建c ontroller
3、✍写单元测试
4、✍写代码
5、✍写文档编写常见API顺序
