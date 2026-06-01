---
title: "升级合约"
date: 2026-06-01
slug_yuque: hzbqo4toy8yngxdq
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/hzbqo4toy8yngxdq"
source_kind: yuque
---

返回文档1、代理模式
Solidity合约部署在链上之后，代码是不可变的（immutable）。这样既有优点，也有缺点
●优点：安全，用户知道会发生什么
●坏处：就算合约中存在bug，也不能修改或升级，只能部署新合约。但新合约的地址与旧的不一样，且合约的数据也需要花费大量gas进行迁移
有没有办法在合约部署后进行修改或升级呢？答案是有的，那就是代理模式。

![](https://cdn.nlark.com/yuque/0/2025/png/158659/1759926207792-55a31ca8-be65-4538-858d-34012cce172b.png)

代理模式将合约数据和逻辑分开，分别保存在不同合约中。我们拿上图中简单的代理合约为例，数据（状态变量）存储在代理合约中，而逻辑（函数）保存在另一个逻辑合约中。
代理合约(Proxy)通过delegatecall，将函数调用全权委托给逻辑合约执行，再将最终结果告诉调用者

2、代理合约
​soliditySolidity复制代码99123456789101112131415161718192021222324252627282930313233343536// SPDX-License-Identifier: MIT// wtf.academypragma solidity ^0.8.21;
/** * @dev Proxy合约的所有调用都通过`delegatecall`操作码委托给另一个合约执行。后者被称为逻辑合约（Implementation）。 * * 委托调用的返回值，会直接返回给Proxy的调用者 */contract Proxy {  address public implementation; // 逻辑合约地址。implementation合约同一个位置的状态变量类型必须和Proxy合约的相同，不然会报错。
  /**     * @dev 初始化逻辑合约地址     */  constructor(address implementation_){    implementation = implementation_;  }
  /**     * @dev 回调函数，调用`_delegate()`函数将本合约的调用委托给 `implementation` 合约     */  fallback() external payable {    _delegate();  }
  /**     * @dev 将调用委托给逻辑合约运行     */  function _delegate() internal {    assembly {      // Copy msg.data. We take full control of memory in this inline assembly      // block because it will not return to Solidity code. We overwrite the      // 读取位置为0的storage，也就是implementation地址。      let _implementation := sload(0)

3、可升级合约
如果理解了代理合约，就很容易理解可升级合约。它就是一个可以更改逻辑合约的代理合约。
![](https://cdn.nlark.com/yuque/0/2025/png/158659/1759927509481-9f521fc5-426f-4ff3-94b2-3b976c2a7e14.png)

​Upgrade Contract991234567891011121314151617181920212223242526272829// SPDX-License-Identifier: MIT// wtf.academypragma solidity ^0.8.21;
// 简单的可升级合约，管理员可以通过升级函数更改逻辑合约地址，从而改变合约的逻辑。// 教学演示用，不要用在生产环境contract SimpleUpgrade {    address public implementation; // 逻辑合约地址    address public admin; // admin地址    string public words; // 字符串，可以通过逻辑合约的函数改变
    // 构造函数，初始化admin和逻辑合约地址    constructor(address _implementation){        admin = msg.sender;        implementation = _implementation;    }
    // fallback函数，将调用委托给逻辑合约    fallback() external payable {        (bool success, bytes memory data) = implementation.delegatecall(msg.data);    }
    // 升级函数，改变逻辑合约地址，只能由admin调用    function upgrade(address newImplementation) external {        require(msg.sender == admin);        implementation = newImplementation;    }}
上面介绍了一个简单的可升级合约。它是一个可以改变逻辑合约的代理合约，给不可更改的智能合约增加了升级功能。但是这个合约有选择器冲突的问题，存在安全隐患。之后我们会介绍解决这一隐患的可升级合约标准：透明代理和UUPS

4、函数选择器冲突
函数选择器（selector）是函数签名的哈希的前4个字节。例如mint(address account)的选择器为bytes4(keccak256("mint(address)"))，也就是0x6a627842
由于函数选择器仅有4个字节，范围很小，因此两个不同的函数可能会有相同的选择器，例如下面两个函数
![](https://cdn.nlark.com/yuque/0/2025/png/158659/1759937035522-5c37bc52-9cda-4fb8-9221-ff2f9bc6f06b.png)
由于代理合约和逻辑合约是两个合约，就算他们之间存在“选择器冲突”也可以正常编译，这可能会导致很严重的安全事故。举个例子，如果逻辑合约的a函数和代理合约的升级函数的选择器相同，那么管理人就会在调用a函数的时候，将代理合约升级成一个黑洞合约，后果不堪设想。
目前，有两个可升级合约标准解决了这一问题：透明代理Transparent Proxy和通用可升级代理UUPS
5、透明代理
透明代理的逻辑非常简单：管理员可能会因为“函数选择器冲突”，在调用逻辑合约的函数时，误调用代理合约的可升级函数。那么限制管理员的权限，不让他调用任何逻辑合约的函数，就能解决冲突

透明代理的逻辑简单：通过限制管理员调用逻辑合约解决“选择器冲突”问题。它也有缺点，每次用户调用函数时，都会多一步是否为管理员的检查，消耗更多gas。但瑕不掩瑜，透明代理仍是大多数项目方选择的方案
6、UUPS
通用可升级代理(UUPS，universal upgradeable proxy standard)，UUPS是将升级函数放在逻辑合约中。这样一来，如果有其它函数与升级函数存在“选择器冲突”，编译时就会报错。

如果用户A通过合约B（代理合约）去delegatecall合约C（逻辑合约），上下文仍是合约B的上下文，msg.sender仍是用户A而不是合约B。UUPS合约可以将升级函数放在逻辑合约中，并检查调用者是否为管理员

![](https://cdn.nlark.com/yuque/0/2025/png/158659/1759937516694-ee86fc84-c56c-447b-8507-967ef7944922.png)

与透明代理不同，UUPS将升级函数放在了逻辑合约中，从而使得"选择器冲突"不能通过编译。相比透明代理，UUPS更省gas，但也更复杂。
7、总结
![](https://cdn.nlark.com/yuque/0/2025/png/158659/1759937415681-a06a40e6-8312-4457-ba1c-175cfa9f9ed4.png)

参考
1、[https://www.wtf.academy/zh/course/solidity103/ProxyContract](https://www.wtf.academy/zh/course/solidity103/ProxyContract)
2、[https://www.wtf.academy/zh/course/solidity103/Upgrade](https://www.wtf.academy/zh/course/solidity103/Upgrade)
3、[https://www.wtf.academy/zh/course/solidity103/UUPS](https://www.wtf.academy/zh/course/solidity103/UUPS)
4、[https://www.wtf.academy/zh/course/solidity103/UUPS](https://www.wtf.academy/zh/course/solidity103/UUPS)
​若有收获，就点个赞吧