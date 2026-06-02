---
title: "升级合约"
date: 2024-05-10
tags: []
source_kind: yuque
---

Solidity 合约部署在链上之后，代码是不可变的（immutable）。这样既有优点，也有缺点：

- **优点：** 安全，用户知道会发生什么
- **坏处：** 就算合约中存在 bug，也不能修改或升级，只能部署新合约。但新合约的地址与旧的不一样，且合约的数据也需要花费大量 gas 进行迁移

有没有办法在合约部署后进行修改或升级呢？答案是有的，那就是**代理模式**。

## 1、代理模式

代理模式将合约数据和逻辑分开，分别保存在不同合约中。我们拿上图中简单的代理合约为例，数据（状态变量）存储在代理合约中，而逻辑（函数）保存在另一个逻辑合约中。

代理合约（Proxy）通过 `delegatecall`，将函数调用全权委托给逻辑合约执行，再将最终结果告诉调用者。

## 2、代理合约

```solidity
// SPDX-License-Identifier: MIT
// wtf.academy
pragma solidity ^0.8.21;

/**
 * @dev Proxy 合约的所有调用都通过 `delegatecall` 操作码委托给另一个合约执行。后者被称
 * 为逻辑合约（Implementation）。
 *
 * 委托调用的返回值，会直接返回给 Proxy 的调用者
 */
contract Proxy {
  address public implementation; // 逻辑合约地址。implementation 合约同一个位置
  // 的状态变量类型必须和 Proxy 合约的相同，不然会报错。

  /**
   * @dev 初始化逻辑合约地址
   */
  constructor(address implementation_) {
    implementation = implementation_;
  }

  /**
   * @dev 回调函数，调用 `_delegate()` 函数将本合约的调用委托给 `implementation` 合约
   */
  fallback() external payable {
    _delegate();
  }

  /**
   * @dev 将调用委托给逻辑合约运行
   */
  function _delegate() internal {
    assembly {
      // Copy msg.data. We take full control of memory in this inline assembly
      // block because it will not return to Solidity code. We overwrite the
      // 读取位置为 0 的 storage，也就是 implementation 地址。
      let _implementation := sload(0)
      calldatacopy(0, 0, calldatasize())

      // 利用 delegatecall 调用 implementation 合约
      // delegatecall 操作码的参数分别为：gas, 目标合约地址，input mem 起始位置，
      // input mem 长度，output area mem 起始位置，output area mem 长度
      // output area 起始位置和长度位置，所以设为 0
      // delegatecall 成功返回 1，失败返回 0
      let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

      // 将起始位置为 0，长度为 returndatasize() 的 returndata 复制到 mem 位置 0
      returndatacopy(0, 0, returndatasize())

      switch result
      // 如果 delegatecall 失败，revert
      case 0 {
        revert(0, returndatasize())
      }
      // 如果 delegatecall 成功，返回 mem 起始位置为 0，长度为 returndatasize() 的数据（格式为 bytes）
      default {
        return(0, returndatasize())
      }
    }
  }
}

/**
 * @dev 逻辑合约，执行被委托的调用
 */
contract Logic {
  address public implementation; // 与 Proxy 保持一致，防止插槽冲突
  uint public x = 99;
  event CallSuccess();

  // 这个函数会释放 LogicCalled 并返回一个 uint。
  // 函数 selector: 0xd09de08a
  function increment() external returns(uint) {
    emit CallSuccess();
    return x + 1;
  }
}

/**
 * @dev Caller 合约，调用代理合约，并获取执行结果
 */
contract Caller {
  address public proxy; // 代理合约地址

  constructor(address proxy_) {
    proxy = proxy_;
  }

  // 通过代理合约调用 increase() 函数
  function increase() external returns(uint) {
    (, bytes memory data) = proxy.call(abi.encodeWithSignature("increment()"));
    return abi.decode(data, (uint));
  }
}
```

## 3、可升级合约

如果理解了代理合约，就很容易理解可升级合约。它就是一个可以更改逻辑合约的代理合约。

```solidity
// SPDX-License-Identifier: MIT
// wtf.academy
pragma solidity ^0.8.21;

// 简单的可升级合约，管理员可以通过升级函数更改逻辑合约地址，从而改变合约的逻辑。
// 教学演示用，不要用在生产环境
contract SimpleUpgrade {
    address public implementation; // 逻辑合约地址
    address public admin; // admin 地址
    string public words; // 字符串，可以通过逻辑合约的函数改变

    // 构造函数，初始化 admin 和逻辑合约地址
    constructor(address _implementation) {
        admin = msg.sender;
        implementation = _implementation;
    }

    // fallback 函数，将调用委托给逻辑合约
    fallback() external payable {
        (bool success, bytes memory data) = implementation.delegatecall(msg.data);
    }

    // 升级函数，改变逻辑合约地址，只能由 admin 调用
    function upgrade(address newImplementation) external {
        require(msg.sender == admin);
        implementation = newImplementation;
    }
}
```

## 4、函数选择器冲突

上面介绍了一个简单的可升级合约。它是一个可以改变逻辑合约的代理合约，给不可更改的智能合约增加了升级功能。但是这个合约**有选择器冲突**的问题，存在安全隐患。之后我们会介绍解决这一隐患的可升级合约标准：透明代理和 UUPS。

函数选择器（selector）是函数签名的哈希的前 4 个字节。例如 `mint(address account)` 的选择器为 `bytes4(keccak256("mint(address)"))`，也就是 `0x6a627842`。

由于函数选择器仅有 4 个字节，范围很小，因此两个不同的函数可能会有相同的选择器，例如下面两个函数：

```solidity
// 选择器冲突的例子
contract Foo {
    function burn(uint256) external {}
    function collate_propagate_storage(bytes16) external {}
}
```

由于代理合约和逻辑合约是两个合约，就算他们之间存在"选择器冲突"也可以正常编译，这可能会导致很严重的安全事故。举个例子，如果逻辑合约的 a 函数和代理合约的升级函数的选择器相同，那么管理人就会在调用 a 函数的时候，将代理合约升级成一个黑洞合约，后果不堪设想。

目前，有两个可升级合约标准解决了这一问题：透明代理 Transparent Proxy 和通用可升级代理 UUPS。

## 5、透明代理

透明代理的逻辑非常简单：管理员可能会因为"函数选择器冲突"，在调用逻辑合约的函数时，误调用代理合约的可升级函数。那么限制管理员的权限，不让他调用任何逻辑合约的函数，就能解决冲突。

```solidity
// 透明可升级合约的教学代码，不要用于生产。
contract TransparentProxy {
    address implementation; // logic 合约地址
    address admin; // 管理员
    string public words; // 字符串，可以通过逻辑合约的函数改变

    // 构造函数，初始化 admin 和逻辑合约地址
    constructor(address _implementation) {
        admin = msg.sender;
        implementation = _implementation;
    }

    // fallback 函数，将调用委托给逻辑合约
    // 不能被 admin 调用，避免选择器冲突引发意外
    fallback() external payable {
        require(msg.sender != admin);
        (bool success, bytes memory data) = implementation.delegatecall(msg.data);
    }

    // 升级函数，改变逻辑合约地址，只能由 admin 调用
    function upgrade(address newImplementation) external {
        if (msg.sender != admin) revert();
        implementation = newImplementation;
    }
}
```

透明代理的逻辑简单：通过限制管理员调用逻辑合约解决"选择器冲突"问题。它也有缺点，每次用户调用函数时，都会多一步是否为管理员的检查，消耗更多 gas。但瑕不掩瑜，透明代理仍是大多数项目方选择的方案。

## 6、UUPS

通用可升级代理（UUPS，universal upgradeable proxy standard），UUPS 是将升级函数放在逻辑合约中。这样一来，如果有其它函数与升级函数存在"选择器冲突"，编译时就会报错。

如果用户 A 通过合约 B（代理合约）去 `delegatecall` 合约 C（逻辑合约），上下文仍是合约 B 的上下文，`msg.sender` 仍是用户 A 而不是合约 B。UUPS 合约可以将升级函数放在逻辑合约中，并检查调用者是否为管理员。

```solidity
// SPDX-License-Identifier: MIT
// wtf.academy
pragma solidity ^0.8.21;

// UUPS 的 Proxy，跟普通的 proxy 像。
// 升级函数在逻辑函数中，管理员可以通过升级函数更改逻辑合约地址，从而改变合约的逻辑。
// 教学演示用，不要用在生产环境
contract UUPSProxy {
    address public implementation; // 逻辑合约地址
    address public admin; // admin 地址
    string public words; // 字符串，可以通过逻辑合约的函数改变

    // 构造函数，初始化 admin 和逻辑合约地址
    constructor(address _implementation) {
        admin = msg.sender;
        implementation = _implementation;
    }

    // fallback 函数，将调用委托给逻辑合约
    fallback() external payable {
        (bool success, bytes memory data) = implementation.delegatecall(msg.data);
    }
}

// UUPS 逻辑合约（升级函数写在逻辑合约内）
contract UUPS1 {
    // 状态变量和 proxy 合约一致，防止插槽冲突
    address public implementation;
    address public admin;
    string public words; // 字符串，可以通过逻辑合约的函数改变

    // 改变 proxy 中状态变量，选择器：0xc2985578
    function foo() public {
        words = "old";
    }

    // 升级函数，改变逻辑合约地址，只能由 admin 调用。选择器：0x0900f010
    // UUPS 中，逻辑函数中必须包含升级函数，不然就不能再升级了。
    function upgrade(address newImplementation) external {
        require(msg.sender == admin);
        implementation = newImplementation;
    }
}

// 新的 UUPS 逻辑合约
contract UUPS2 {
    // 状态变量和 proxy 合约一致，防止插槽冲突
    address public implementation;
    address public admin;
    string public words; // 字符串，可以通过逻辑合约的函数改变

    // 改变 proxy 中状态变量，选择器：0xc2985578
    function foo() public {
        words = "new";
    }

    // 升级函数，改变逻辑合约地址，只能由 admin 调用。选择器：0x0900f010
    // UUPS 中，逻辑函数中必须包含升级函数，不然就不能再升级了。
    function upgrade(address newImplementation) external {
        require(msg.sender == admin);
        implementation = newImplementation;
    }
}
```

## 7、总结

与透明代理不同，UUPS 将升级函数放在了逻辑合约中，从而使得"选择器冲突"不能通过编译。相比透明代理，UUPS 更省 gas，但也更复杂。

**参考：**

1. https://www.wtf.academy/zh/course/solidity103/ProxyContract
2. https://www.wtf.academy/zh/course/solidity103/Upgrade
3. https://www.wtf.academy/zh/course/solidity103/UUPS
4. https://www.wtf.academy/zh/course/solidity103/UUPS
