---
title: "Monorepo 探索"
date: 2022-12-10
tags: []
source_kind: yuque
---

## 1、Monorepo 概念

Monorepo 可以理解为一种基于仓库的代码管理策略，它提出将多个代码工程"独立"的放在一个仓库里的管理模式。

这里的独立是指的每个代码工程在逻辑上是可以独立运行开发以及维护管理的，目前很多大型的互联网公司都在采取这样的代码管理策略，比如 Google、Facebook、Uber、MicroSoft 等，我们熟知的 React、Vue、Vite、Babel 等也采用了多包。

假设有这样一个前端场景：有两个可以逻辑上被分割的项目 Project1 和 Project2 以及他们共用的一个公共库 lib。

### 1.1、仓库组织对比

#### 大型单仓（Single-repo Monolith）

Project 和 lib 都会被组织在一个仓库当中，并会将两个 Projects 中代码进行杂糅，放在同一个代码工程当中（当然这个组织形式可以有很多种，具体根据实际场景以及架构师对模块的设计理念）；而 lib 代码会放在该工程目录下，两个 Projects 可以简单的通过路径去引用，也可以通过工具设置绝对地址 alias 来方便引入。

```text
.
├── package.json
├── src/
│   ├── views/
│   │   ├── project1/
│   │   ├── project2/
│   ├── router/
│   │   ├── project1/
│   │   ├── project2/
│   ├── ...
│   └── lib/
└── README.md
```

```javascript
// 代码共享 package1/example.js
import {method} from '../../lib';

// script 引入共享
&lt;script src="@static/lib/index.js"&gt;&lt;/script&gt;
```

#### 独立多仓（Multi-repo）

这是我们非常熟悉的代码组织方式，两个 Project 会单独成立代码工程放入两个仓库当中。而 lib 也会独立成库进行开发，并通过构建后进行 NPM 发包，两个 Projects 需要通过 NPM 的形式安装和更新 lib。

```text
// Repository - project1
.
├── node_modules/
├── package.json
├── src/
│   ├── views/
│   ├── router/
│   ├── ...
├── README.md

// Repository - project2
.
├── node_modules/
├── package.json
├── src/
│   ├── views/
│   ├── router/
│   ├── ...
├── README.md

// Repository - lib
.
├── node_modules/
├── package.json
├── src
│   ├── ...
├── README.md
```

```javascript
// 代码共享
// - lib 进行发包，比如包名为 @my-scope/lib
// - 进入 Package1 或 Package2 进行 npm install 或 npm update
// - 在代码中引入
import {method} from '@my-scope/lib';
```

#### 独立单仓 Monorepo

在 Monorepo 这个策略下，将会把两个 Projects 和一个 lib 统一放到 packages 目录下面，每个都会作为独立的包进行开发运行，公用依赖可以放在一级的 node_modules 中，各个 package 也可以有自己独有的依赖。这里以 Pnpm 为例来展示，在 `pnpm-workspace.yaml` 里配置把 packages 下的所有包视为子项目，纳入包管理。在 lib 目录下的 `package.json` 中为其添加 name，同时添加到一级目录的 `package.json` 当中，即可被两个 Projects 引用，而无需进行发包操作。

```text
// Repository - monorepo
.
├── node_modules/
├── package.json
├── packages/
│   ├── package1/
│   │   ├── src/
│   │   ├── README.md
│   │   ├── node_modules/
│   │   ├── package.json
│   ├── package2/
│   │   ├── src/
│   │   ├── README.md
│   │   ├── node_modules/
│   │   ├── package.json
│   └── lib/
│       ├── src/
│       ├── README.md
│       ├── node_modules/
│       ├── package.json
├── README.md
├── pnpm-workspace.yaml
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

```javascript
// 代码共享
// - 假设 lib 的包名为 @my-scope/lib，无需发包至 NPM
// - 在一级目录的 package.json 添加包名 @my-scope/lib: "workspace:*"
// - 在两个 projects 中的代码中引入
import {method} from '@my-scope/lib';
```

### 1.2、优劣分析总结

#### Monolith 时期

我们的 Monolith 这种模式是最早开发人员所使用的仓库架构模式，当时的前端功能还很简单，还没有过多的框架出现，仅仅是 HTML、CSS 的编写以及加上简单的 JS 逻辑。后面随着 Web 的能力越来越复杂，开始将项目拆分成不同的包。

#### Multi-repo 时期

Multi-repo 的流行很大程度上是为了解决这种模块高度耦合，代码臃肿的情况，开发者们开始更加倾向将整个业务项目进行拆分，独立进行管理。每个业务模块建立单独的库由各自团队负责开发以及维护，各种包都通过 npm 来进行共享。

然而随着模块拆分不断的增多，开发者们又发现过多的仓库加大了维护的成本，新的项目环境搭建，和涉及整体业务的重构和依赖同步都将变得繁琐，此时回归单 repo 的概念又开始兴起。因此，已经被提出很久的 Monorepo 开始浮出水面，应运而生的工具也开始出现了。

#### Monorepo

Monorepo 的出现开始解决环境及依赖统一的问题，代码之间的共享也不再强依赖于 NPM 来进行。既保留了 Monolith 单仓环境维护的便利性，同时满足 Multi-repo 对于项目解耦的独立开发管理。

后类似 lerna + yarn 的包管理方案的出现让 Monorepo 拥有了较为完整的解决方案，并伴随着新兴的技术 pnpm、Changesets、Turborepo 的不断推出，Monorepo 的整个管理流程变得越来越完善和简单，也逐渐被很多开发者所采用。

#### 使用 Monorepo 的优势

- **统一管理：** 由于只有一个仓库，所有的配置都可以统一进行管理，而无需为不同项目重复构建环境，包括通用的代码规范检测，相同的测试框架，以及统一的 CI/CD 构建流程等。
- **原子提交：** 这一点也是建立在统一管理的基础之上，使用原子提交轻松重构全局特性，而无需为每个 repo 执行拉取请求找出构建更改的顺序。这样可以简单的保持所有项目的全局特性是统一的，并且交由专人进行维护升级，而各个代码工程的开发者无需过度关注。
- **简单依赖：** 多个代码工程的相同依赖可以提升至根目录进行管理，大大减少重复安装所带来的空间浪费。同时，代码工程之间也可以在保持隔离的同时相互引用，而无需在构建时依次构建相关依赖包并重新发布。
- **文化开放：** 由于使用相同的代码库，所有开发者都能够浏览以及提交代码，在一定程度上也会激励团队成员共建可复用的组件及工具方法。

#### 使用 Monorepo 带来的问题

- **权限问题：** 由于单仓的管理模式，使用 Monorepo 将无法简单的控制各个模块代码的访问限制，任何有权限访问该仓库的人员将有权限访问所有的代码工程，这可能会导致部分安全问题。
- **性能问题：** 当仓库的代码规模非常的巨大，达到 GB/TB 的级别，会增大开发环境的代码下载成本，以及本地硬盘的压力，执行 `git status` 也可能需要花费数秒甚至数分钟的时间。并且，当代码工程很多且活跃数量也很多的情况，会加大分支管理策略和各个代码工程版本管理的压力。

## 2、Monorepo 技术方案

### 2.1、包管理方案

#### Yarn

Yarn 是一个包管理工具，它提供安全，稳定的管理机制，它在很早的时候就提出了 workspace 的概念来支持 Monorepo 的解决方案，用户也仅仅需要在 `package.json` 中配置 workspace 的目录即可将其纳入 Yarn 的包管理当中。Yarn 本身的设计是为了弥补 npm 的一些缺陷而出现的，包括安装速度、lockfile 等。当然目前为止 npm 也解决了部分这些方面的问题。

而随着 yarn 2.x、yarn 3.x 的版本更迭，相较以前添加了诸多特性譬如 pnpm 的 linker 机制、git workspaces 等，吸收了竞争对手的优点，并开辟了许多有趣的功能特性，这使得它长期成为开发者们的选择。

#### pnpm

Pnpm 是一个快速的，节省磁盘空间的包管理工具，并天然支持 Monorepo 的解决方案。pnpm 在包依赖管理的机制上有着独特的成果，包括 symlink 和 hard link 机制，既极大的缩小了安装包的体积，同时也解决了幽灵依赖的问题。

pnpm 在使用习惯上保留了 npm 的所有命令，开发者可以无痛的进行切换。而使用 monorepo 的功能，仅仅需要在根目录创建一个 `pnpm-workspace.yaml` 文件，并填写需要管理的目录，而之后这些目录将自动纳入 pnpm 的工作空间，并由它进行管理。

### 2.2、包版本方案

除了包依赖的管理以外，如何去管理众多项目的版本也是完善 Monorepo 工具链的重要部分，而其中最为出名的就是 Lerna，它通常会配合 Yarn 一起使用，另外一个则是新兴的版本管理工具 Changesets，它拥有自己的一套工作流程来契合 Monorepo 的场景。

#### Lerna

Lerna 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目，其功能非常复杂和完善，它拥有包管理的功能，同时还兼顾版本管理，并支持全量发布和单独发布等功能。在业界实践中通常采用 Yarn 来处理依赖安装和用 workspace 来管理项目中各个包，用 Lerna 来处理依赖的更新和发布问题。这套技术组合完整的实现了 Monorepo 中项目的包管理，更新到发布的全流程。

Lerna 的工作流可以非常完善，它包含了包管理的流程以及各项参数配置，这里仅使用它的版本管理功能来描述它的一个发布过程。

#### Changesets

Changesets 是一个用于 Monorepo 项目下版本以及 Changelog 文件管理的工具，它也是 pnpm 官方所推荐使用的版本管理工具，它所做的工作相较于 Lerna 而言更加专一。

Changesets 的工作流会将开发者分为两类人，一类是项目的维护者，还有一类为项目的开发者，开发者在 Monorepo 项目下进行开发，开发完成后，给对应的子项目添加一个 changeset 文件。项目的维护者后面会通过 changeset 来消耗掉这些文件并自动修改掉对应包的版本以及生成 CHANGELOG 文件，最后将对应的包发布出去。

### 2.3、包构建方案

某些场景下，Monorepo 的规模较大，包之间拥有拓扑式的依赖结构，而此时进行项目构建往往会需要依照依赖的链式逐步进行，过程将会耗费大量时间。而为了解决这样的构建痛点，也有相应的技术浮出水面，比如 Turborepo。

#### Turborepo

Turborepo 是一个用于 JavaScript/TypeScript monorepos 的快速构建系统。目的是为了解决大型 monorepo 项目构建速度缓慢的一大痛点。

turbo 的核心是永远不会重新构建已经构建过的内容。turbo 会把每次构建的产物与日志缓存起来，下次构建时只有文件发生变动的部分才会重新构建，没有变动的直接命中缓存并重现日志。

turbo 拥有更智能的任务调度程序，充分利用空闲 CPU，使得整体构建速度更快。另外，turbo 还具有远程缓存功能，可以与团队和 CI/CD 共享构建缓存。

简单的示例来辅助理解 Turborepo 在构建中的优势，假设有如下的包依赖结构，其中我们要对 app E 进行构建，它依赖 4 个 lib 包的构建，而 lib 包之间也有相互的依赖，特别 lib B 还同时依赖 lib A 和 lib C：

```javascript
(lib A -> lib B) -> lib D -> app E
(lib C -> lib B)
```

正常的构建过程将会依照顺序依次执行，而 Turborepo 会在这个基础上通过它的缓存机制来确定哪些包需要进行构建，同时通过它的任务调度机制来进行并行构建，从而加快整个构建流程。

### 2.4、规范工具

#### ESLint

ESLint 是目前最受欢迎的 JavaScript 代码质量校验工具，它可以通过静态分析代码来发现语言规范问题，多数问题可以被自动修复，ESLint 修复程序具有语法意识，因此不用担心修复后而引入错误。

#### Prettier

Prettier 可以理解为一个代码格式化工具，它提供一套完整的代码风格方案，它通过解析代码并使用自己的规则强制重新打印代码，从而使得代码能够保证一致性。使用它可能不会让项目的代码完全符合开发者想要的格式规范，但却在一定程度上是最通用和便捷的团队规范方案。并且，通过 plugin 的形式 Prettier 可以被集成到 ESLint 当中，使得两者的结合使用会更加便利。

同时，由于 Monorepo 的规模性，每次修改代码都进行全量的规范校验带来时间上的消耗，此时可以利用 husky 和 lint-staged 两个工具在进行 git 提交时进行增量代码的校验。

#### Commitlint

Commitlint 是一个提交规范校验工具，它将帮助团队遵守一定的提交信息格式约定，默认采用 Conventional 提交规范，它也提供一定的配置允许使用者更改校验规则。同时，通过 Husky 添加相应的 git hook，来达到提交自动校验的提示的功能。

#### Commitizen

Commitizen 是一个提交日志工具，辅助开发者使用提交规则，再使用它进行 git 提交操作时，将自动提示填写 Commit Message 所必须的字段，并获取有关提交信息格式的及时反馈，使用者只需按提示输入相关内容信息即可。通常，上面两者技术也可以配合进行使用，既提供相应脚手架工具来辅助提交信息填写，同时保证提交时规范的校验。

## 3、Monorepo 项目实践

- **pnpm：** 包依赖管理工具
- **changesets：** 包版本管理工具
- **eslint、prettier：** 代码规范工具
- **commitizen、commitlint：** 提交规范工具
- **husky、lint-staged：** git hook 相关工具
- **vitepress：** 文档服务工具
