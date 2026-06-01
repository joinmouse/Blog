---
title: "ERC20 协议解读"
date: 2026-06-01
slug_yuque: hfafy4ghb12oc51z
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/hfafy4ghb12oc51z"
source_kind: yuque
---

返回文档ERC20 标准提供了一组基础接口，使得代币可以在以太坊生态系统中方便地创建、管理和交换
●[https://eips.ethereum.org/EIPS/eip-20](https://eips.ethereum.org/EIPS/eip-20)

1、区分原生币(Coin)和代币(Token)
以太币（Coin）
●原生币: 以太币（Ether，ETH）是以太坊区块链的原生加密货币。它直接由区块链协议生成和管理。
●用途: 主要用于支付网络上的交易费用（Gas）以及奖励矿工（现在是验证者）。
●特性: 原生币的交易是直接在区块链上进行的，不需要任何智能合约。
●地址: 以太币的交易地址是由以太坊协议生成的。

ERC20 代币（Token）
●智能合约币: ERC20 代币是通过智能合约创建和管理的加密货币。它们不是区块链的原生币，而是构建在区块链之上的。
●用途: 可以代表各种资产或功能，如稳定币、权益证明、治理代币等。
●特性: ERC20 代币遵循以太坊改进提案 20（EIP-20）的标准，实现了一组基本的接口和功能，使其能够在去中心化应用（DApps）之间互操作。
●地址: ERC20 代币的合约地址是由智能合约生成的。

WETH（Wrapped Ether）
●包装以太币: WETH（Wrapped Ether）是将 ETH 包装成 ERC20 代币的形式，使其能够在需要 ERC20 标准的去中心化应用中使用。
●用途: 由于 ETH 不是 ERC20 代币，有些 DApps 需要使用 ERC20 标准，因此 WETH 充当桥梁，使 ETH 可以像其他 ERC20 代币一样使用。
●特性: 1 WETH 始终等于 1 ETH，用户可以随时在 WETH 和 ETH 之间转换。
●WETH 有自己的智能合约地址，用户通过该地址进行 WETH 与 ETH 的转换。

2、ERC20接口协议
标准接口允许以太坊上任何代币被其他的应用程序重复使用：从钱包到去中心化交易
思考：可以结合链上货币的特性想一想，在技术层面需要什么接口
1：代币需要最基础的知道总量是多少
ERC20里面叫 total supply
​Solidity复制代码91function totalSupply() public view virtual returns (uint256)
2、任何代币需要知道余额是多少，余额属于谁（地址）
在ERC20里面叫 balanceOf 它接受一个地址，返回对应的余额（注：balance在英文有余额的含义）

3、场景：你需要想把 1 ETH 等值的代币给朋友
ERC20里面叫 transfer，调用 transfer(A, amount)

4、场景：想用去中心化交易所交易代币
涉及到 ERC里面的approve、transferFrom 、allowance 
先 approve(DEX合约, amount)，然后 DEX 合约调用 transferFrom(你的地址, 买家/合约, amount) 拉走代币执行交易。

ERC20 主要就是 6 个方法

补充：语法说明
●virtual：虚拟的，可被子合约重写（override）
●view：只读/视图函数，不会修改区块链上的状态（不能写入状态变量或发出事件）。通过 eth_call 调用时不消耗 gas

3、实现一个简单的ERC20

event:  事件主要用于“对外发布可检索、低成本的操作/状态变更记录”

4、OpenZeppelin标准协议
我们一般不自己实现，而是基于OpenZeppelin实现。我们可以把OpenZeppelin看成一个我们编码的第三方包即可

OpenZeppelin 是一个开源的区块链开发工具和智能合约库，旨在帮助开发者安全地构建和部署智能合约。它提供了一系列经过审核和验证的智能合约实现，包括代币标准、访问控制、支付通道等，极大地简化了以太坊和其他区块链平台上的开发工作。
OpenZeppelin的主要功能和特点
1安全性: OpenZeppelin 合约经过广泛的审计和验证，确保代码的安全性和可靠性。
2模块化: 提供可重用的模块化合约，使得开发者可以轻松组合和扩展功能。
3标准化: 实现了广泛接受的标准，如 ERC20、ERC721 和 ERC1155 等。
4文档和支持: 提供详尽的文档和活跃的社区支持，帮助开发者快速上手。

ERC20的实现：[https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol)

![](https://cdn.nlark.com/yuque/0/2025/png/158659/1756637318908-75636632-659d-4131-944a-edac898a155e.png)

可以看到我们使用openZeppelin这个包的时候是十分简单的
​若有收获，就点个赞吧