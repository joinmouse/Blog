---
title: "Monorepo 探索"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

Monorepo 可以理解为⼀种基于仓库 的代码管理策略，它提出将多个代码⼯程" 独⽴"的放在⼀个仓
库⾥的管理模式。
这⾥的独⽴是指的每个代码⼯程在逻辑上是可以独⽴运⾏开发以及维护管理的，⽬前很多⼤型的互
联⽹公司都在采取这样的代码管理策略，⽐如Goo gle，Facebook，Uber，MicroSoft等，我们熟
知的R eact、Vue、Vite、Babel等也采⽤了多包。
假设有这样⼀个前端场景： 有两个可以逻辑上被分割的项⽬ Project1 和 Project2 以及他们共⽤
的⼀个公共库 lib。
⼤型单仓( Single-repo Monolith)
Project 和 lib 都会被组织在⼀个仓库 当中，并会将两个 P rojects 中代码进⾏杂糅，放在同⼀个代
码⼯程当中（当然这个组织形式可以有很多种，具体根据实际场景以及架构师对模块的设计理
念）; ⽽ lib 代码会放在该⼯程⽬录下，两个 P rojects 可以简单的通过路径去引⽤，也可以通过⼯
具设置绝对地址 alias 来⽅便引⼊。1、Monorepo概念
1.1、仓库组织对⽐
●

92独⽴多仓( Multi-repo)
这是我们⾮常熟悉的代码组织⽅式， 两个 Project 会单独成⽴代码⼯程放⼊ 两个仓库当中。⽽ l ib 
也会独⽴成库进⾏开发，并通过构建后进⾏NPM发包，两个 P rojects 需要通过 N PM 的形式安装
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
// script 引⼊共享
&lt;script src="@static/lib/index.js" &gt;&lt;/script&gt;1
3
5
7
9
11
13
15
17
Repository - monolith JavaScript

93独⽴单仓 Monorepo
在 Monorepo 这个策略下，将会把两个 Projects 和 ⼀个 lib 统⼀放到 p ackages ⽬录下⾯，每
个都会作为独⽴的包进⾏开发运⾏，公⽤依赖可以放在⼀级的n ode_module中，各个p ackage也
可以有⾃⼰独有的依赖。这⾥以 Pnpm 为例来展示，在 p npm-workspace.yaml ⾥配置把 ●// Repository - project1
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
- lib进⾏发包，⽐如包名为  @my-scope/lib
- 进⼊Package1 或 Package2 进⾏npm install 或 npm update
- 在代码中引⼊
import {method} from '@my-scope/lib' ;1
3
5
7
9
11
13
15
17
19
21
23
25
27
29
31
33
35
多仓 JavaScript

94packages 下的所有包视为⼦项⽬，纳⼊包管理。在 lib ⽬录下的p acakge.json 中为其添加
name，同时添加到⼀级⽬录的 package.json 当中，即可被两个P rojects引⽤，⽽⽆需进⾏发包
操作。
Monolith 时期 
我们的Mo nolith 这种模式是最早开发⼈员所使⽤的仓库架构模式，当时的前端功能还很简单，还
没有过多的框架出现，仅仅是 HTML , CSS 的编写以及加上简单的 J S 逻辑。后⾯随着Web 的能// Repository - monorepo
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
- 假设 lib 的包名为 @my-scope/lib，⽆需发包⾄ NPM
- 在⼀级⽬录的  package.json 添加包名 @my-scope/lib: "workspace:*"
- 在两个 projects 中的代码中引⼊
import {method} from '@my-scope/lib' ;1
3
5
7
9
11
13
15
17
19
21
23
25
27
29
31
33
Repository - monorepo JavaScript

95⼒越来越复杂，开始将项⽬拆分成不同的包
Multi-repo 时期
Multi-repo 的流⾏很⼤程度上是为了解决这种模块⾼度耦合，代码臃肿的 情况，开发者们开始更
加倾向将整个业务项⽬进⾏拆分，独⽴进⾏管理。每个业务模块建⽴单独的库由各⾃团队负责开发
以及维护，各种包都通过 npm 来进⾏共享。
然⽽随着模块拆分不断的增多，开发者们⼜发现过多的仓库加⼤了维护的成本，新的项⽬环境搭
建，和涉及整体业务的重构和依赖同步都将变得繁琐，此时回归单 re po 的概念⼜开始兴起。因
此，已经被提出很久的 Monorepo 开始浮出⽔⾯，应运⽽⽣的⼯具也开始出现了。
Monorepo ？
Monorepo 的出现开始解决环境及依 赖统⼀的问题，代码之间的共享也不再强依赖于 N PM 来进
⾏。既保留了 Monolith 单仓环境维护 的便利性，同时满⾜ Mu lti-repo 对于项⽬解耦的独⽴开发
管理。
后类似 lerna + yarn 的包管理⽅案的 出现让 Monorepo 拥有了较为完整的解决⽅案，并伴随着新
兴的技术 pnpm，Changesets，Turborepo 的不断推出，Mo norepo 的整个管理流程变得越来越
完善和简单，也逐渐被很多开发者所采⽤
使⽤ Monorepo 的优势
统⼀管理：  由于只有⼀个仓库，所有的配置都可以统⼀进⾏管理，⽽⽆需为不同项⽬重复构
建环境，包括通⽤的代码规范检测，相同的测试框架，以及统⼀的 CI/CD 构建流程等。
原⼦提交：  这⼀点也是建⽴在统⼀管理的基础之上，使⽤原⼦提交轻松重构全局特性，⽽⽆
需为每个 repo 执⾏拉取请求找出构建 更改的顺序。这样可以简单的保持所有项⽬的全局特性
是统⼀的，并且交由专⼈进⾏维护升级，⽽各个代码⼯程的开发者⽆需过度关注。
简单依赖：  多个代码⼯程的相同依赖可以提升⾄根⽬录进⾏管理，⼤⼤减少重复安装所带来
的空间浪费。同时，代码⼯程之间也可以在保持隔离的同时相互引⽤，⽽⽆需在构建时依次构
建相关依赖包并重新发布。1.2、优劣分析总结
●
●
●

96⽂化开放：  由于使⽤相同的代码库，所有开发者都能够浏览以及提交代码，在⼀定程度上也
会激励团队成员共建可复⽤的组件及⼯具⽅法
使⽤ Monorepo 带来的问题
限问题：  由于单仓的管理模式，使⽤ Monorepo 将⽆法简单的控制各个模块代码的访问限
制，任何有权限访问该仓库的⼈员将有权限访问所有的代码⼯程，这可能会导致部分安全问
题。
性能问题：  当仓库的代码规模⾮常的巨⼤，达到G B/TB的级别，会增⼤开发环境的代码下载
成本，以及本地硬盘的压⼒，执⾏ git status 也可能需要花费数秒甚⾄数分钟的时间。并且，
当代码⼯程很多且活跃数量也很多的情况，会加⼤分⽀管理策略和各个代码⼯程版本管理的压
⼒
Yarn
Yarn 是⼀个包管理⼯具，它提供安全，稳定的管理机制，它在很早的时候就提出了 w orkspace 
的概念来⽀持 Monorepo 的解决⽅案，⽤户也仅仅需要在p ackage.json 中配置 workspace 的⽬
录即可将其纳⼊ Yarn 的包管理当中。 Yarn 本身的设计是为了弥补 n pm 的⼀些缺陷⽽出现的，包
括安装速度、l ockfile 等。当然⽬前为 ⽌ npm 也解决了部分这些⽅⾯的问题。
⽽随着 yarn2.x, yarn3.x 的版本更迭， 相较以前添加了诸多特性譬如 p npm 的 linker 机制，g it 
workspaces等，吸收了竞争对⼿的优 点，并开辟了许多有趣的功能特性，这使得它⻓期成为开发
者们的选择
pnpm
Pnpm 是⼀个快速的，节省磁盘空间的包管理⼯具，并天然⽀持 Monorepo 的解决⽅案。
pnpm 在包依赖管理的机制上有着独特的成果，包括 symlink 和 hard link机制，既极⼤的缩⼩了
安装包的体积，同时也解决了幽灵依赖的问题，这⾥就不展开描述，有机会再单独聊⼀聊。●
●
●
2、Monorepo技术⽅案
2.1、包管理⽅案
●
●

97pnpm 在使⽤习惯上保留了 npm 的所有命令，开发者可以⽆痛的进⾏切换 。⽽使⽤ m onorepo 的
功能，仅仅需要在根⽬录创建⼀个 pnpm-workspace.yaml ⽂件，并填写需要管理的⽬录，⽽之
后这些⽬录将⾃动纳⼊ pnpm 的⼯作空间，并由它进⾏管理
除了包依赖的管理以外，如何去管理众多项⽬的版本也是完善 M onorepo ⼯具链的重要部分，⽽其中最
为出名的就是 Lerna，它通常会配合 Yarn ⼀起使⽤，另外⼀个则是新兴的版本管理⼯具 C hangesets，
它拥有⾃⼰的⼀套⼯作流程来契合 Mon orepo 的场景
Lerna
Lerna 是⼀个管理⼯具，⽤于管理包含多个软件包（p ackage）的 JavaScript 项⽬，其功能⾮常
复杂和完善，它拥有包管理的功能，同时还兼顾版本管理，并⽀持全量发布和单独发布等功能。在
业界实践中通常采⽤ Yarn 来处理依赖 安装和⽤ w orkspace 来管理项⽬中各个包，⽤ L erna 来处
理依赖的更新和发布问题。这套技术组合完整的实现了 Mo norepo 中项⽬的包管理，更新到发布
的全流程。
Lerna 的⼯作流可以⾮常完善，它包含了包管理的流程以及各项参数配置，这⾥仅使⽤它的版本管
理功能来描述它的⼀个发布过程：
Changesets2.2、包版本⽅案
●
●

98Changesets 是⼀个⽤于 Monorepo 项⽬下版本以及 Changelog ⽂件管理的⼯具，它也是 
pnpm 官⽅所推荐使⽤的版本管理⼯具，它所做的⼯作相较于 Lerna ⽽⾔更加专⼀。
Changesets 的⼯作流会将开发者分为两类⼈，⼀类是项⽬的维护者，还有 ⼀类为项⽬的开发者，
开发者在 Monorepo 项⽬下进⾏开发，开发完成后，给对应的⼦项⽬添加⼀个 cha ngeset ⽂件。
项⽬的维护者后⾯会通过 changeset 来消耗掉这些⽂件并⾃动修改掉对应包的版本以及⽣成 
CHANGELOG ⽂件，最后将对应的包 发布出去。
某些场景下， Monorepo 的规模较⼤，包之间拥有拓扑式的依赖结构，⽽此时进⾏项⽬构建往往
会需要依照依赖的链式逐步进⾏，过程将会耗费⼤量时间。⽽为了解决这样的构建痛点，也有相应
的技术浮出⽔⾯，⽐如 Turborepo。
Turborepo
Turborepo 是⼀个⽤于 JavaScript/TypeScript monorepos 的快速构建系统。⽬的是为了解决⼤
型 monorepo 项⽬构建速度缓慢的⼀⼤痛点。2.3、包构建⽅案
●

99turbo 的核⼼是永远不会重新构建已经 构建过的内容。t urbo 会把每次构建的产物与⽇志缓存起
来，下次构建时只有⽂件发⽣变动的部分才会重新构建，没有变动的直接命中缓存并重现⽇志。
turbo 拥有更智能的任务调度程序，充 分利⽤空闲 C PU，使得整体构建速度更快。另外，tu rbo 还
具有远程缓存功能，可以与团队和 CI/CD 共享构建缓存。
简单的示例来辅助理解 Turborepo 在构建中的优势，假设有如下的包依赖结构，其中我们要对
app E 进⾏构建，它依赖4 个lib包的构建，⽽l ib包之间也有相互的依赖，特别l ib B 还同时依赖 l ib 
A 和 lib C
正常的构建过程将会依照顺序依次执⾏，⽽ Turb orepo 会在这个基础上通过它的缓存机制来确定
哪些包需要进⾏构建，同时通过它的任务调度机制来进⾏并⾏构建，从⽽加快整个构建流程。
ESLint
Eslint 是⽬前最受欢迎的 Javascript 代码质量校验⼯具，它可以通过静态分析代码来发现语⾔规
范问题，多数问题可以被⾃动修复，Eslin t 修复程序具有语法意识，因此不⽤担⼼修复后⽽引⼊错
误。
Prettier
Prettier 可以理解为⼀个代码格式化⼯ 具，它提供⼀套完整的代码⻛格⽅案，它通过解析代码并使
⽤⾃⼰的规则强制重新打印代码，从⽽使得代码能够保证⼀致性。使⽤它可能不会让项⽬的代码完
全符合开发者想要的格式规范，但却在⼀定程度上是最通⽤和便捷的团队规范⽅案。并且，通过 
plugin 的形式 prettier 可以被集成到  Eslint 当中，使得两者的结合使⽤会更加便利。
同时，由于 Monorepo 的规模性，每次修改代码都进⾏全量的规范校验带来时间上的消耗，此时
可以利⽤ husky 和 lint-staged 两个⼯具在进⾏ g it 提交时进⾏增量代码的校验
Commitlint
Commitlint 是⼀个提交规范校验⼯具 ，它将帮助团队遵守⼀定的提交信息格式约定，默认采⽤ 
Convenional 提交规范  ，它也提供⼀定的配置允许使⽤者更改校验规则。同时，通过 H usky 添加
相应的 git hook，来达到提交⾃动校 验的提示的功能
Commitizen 2.4、规范⼯具
●
●
●
●(lib A -> lib B) -> lib D -> app E
(lib C -> lib B)1
JavaScript

100是⼀个提交⽇志⼯具，辅助开发者使⽤提交规则，再使⽤它进⾏ git 提交操作时，将⾃动提示填写
Commit Messsage 所必须的字段，并获取有关提交信息格式的及时反馈， 使⽤者只需按提示输⼊
相关内容信息即可。通常，上⾯两者技术也可以配合进⾏使⽤，既提供相应脚⼿架⼯具来辅助提交
信息填写，同时保证提交时规范的校验
pnpm： 包依赖管理⼯具
changesets： 包版本管理⼯具
eslint，pretter: 代码规范⼯具
commitizen，commitlint： 提交规范⼯具
husky，lint-staged： git hook相关⼯具
vitepress： ⽂档服务⼯具3、Monorepo 项⽬实践
●
●
●
●
●
●

101Ruby
数据库相关
MVC操作相关
单元测试相关功能 命令 解释
连接数据库 psql -h 172.18.0.2 -p 5432 -U 
mangosteen -d mangosteen_dev主机名称d ocker内的
删除表 DROP TABLE &lt;table_name&gt;
创建数据表的映射 bin/rails g model 
user email:string name:string⽣成u ser的表内有ema il、name
字段
同步到数据库 bin/rails db:migrate 数据库操作⼯具  
ActiveRecord::Migration
回滚数据库操作 bin/rails db:rollback step=1
创建数据库 rails db:create RAILS_ENV=test测试环境创建数据库
功能 命令 解释
创建m odel bin/rails g model 
ValidationCode email:string 
kind:string used_at:datetime⽣成m odel和数据库的映射关系
创建c ontroller bin/rails g controller user 
create show⽣成/u ser有create, show⽅法

102master.key + keys => .enc⽂件;  .enc⽂件 + master.key => keys
命令： bin/rails credentials:edit  (--environment production)
开发环境
⽣产环境密钥管理功能 命令 解释
⽣成R Spec配置⽂件 rails generate rspec:install
创建测试⽂件 rails g rspec:model user user测试⽂件
执⾏测试 bundle exec rspec
开发环境 master.key、 credentials.yml.encey
⽣产环境 production.key、 production.yml.encey

1031、创建m odel，运⾏d b:migrate
2、创建c ontroller
3、✍写单元测试
4、✍写代码
5、✍写⽂档编写常⻅A PI顺序

104