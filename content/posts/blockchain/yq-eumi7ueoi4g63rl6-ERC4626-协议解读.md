---
title: "ERC4626 协议解读"
date: 2026-06-01
slug_yuque: eumi7ueoi4g63rl6
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/eumi7ueoi4g63rl6"
source_kind: yuque
---

返回文档ERC4626 是一种 Vault 协议，可以用于资产的管理、分红，用户充值某项资产、获取某个凭证，该凭证可以作为分红、退出的依据，主要应用于 Yield Farming/借贷/质押等

我更愿意将其理解成类似银行的一种存款收取利息的协议，它的核心功能就是两个
●充值代币兑换份额
●提取代币份额获取利息
1、链上功能需要实现什么
基础资产代币的方法
​Solidity复制代码9912345678910// asset 资产: 返回金库的基础资产代币地址function asset() external view returns (address assetTokenAddress)
// 返回金库管理的基础代币总额function totalAsset() external view returns (uint256 totalManagedAssets)
// 数量和份额的转化估计function convertToShares(uint256 assets) external view returns (uint256 shares)
function convertToAssets(uint256 shares) external view returns (uint256 assets)
充值资产，获取 shares
​Solidity复制代码991234567891011// previewDesposit 预充值，充值前计算份额function previewDesposit(uint256 assets) external view returns (uint256 shares)// desposit 充值function desposit(uint256 assets, address receiver) external view returns (uint256 shares)// 最大充值，无需传 assets, 取默认最大值即可function maxDesposit(address receiver) external view returns (uint256 maxAssets)
// mint系列是充值份额function previewMint(uint256 shares) external view returns (uint256 assets)function mint(uint256 shares, address receiver) external view returns (uint256 assets)function maxMint(address receiver) external view returns (uint256 maxShares)
提现，拿回资产
​Solidity复制代码991234567891011// withdrawfunction previewWithdraw(uint256 assets) external view returns (uint256 shares)function withdraw(uint256 assets, address receiver, address owner) external view returns (uint256 shares)function maxWithdraw(address owner) external view returns (uint256 maxAssets)
// redeemfunction previewRedeem(uint256 shares) external view returns (uint256 assets)function redeem(uint256 shares, address receiver, address owner) external view returns (uint256 assets)function maxRedeem(address owner) external view returns (uint256 maxShares)
2、实现一个简单的 erc4624功能
​999123456789101112131415161718192021222324252627282930313233343536// SPDX-License-Identifier: MITpragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";import "@openzeppelin/contracts/access/Ownable.sol";import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// @dev 实现ERC4626代币化Vault标准: 允许用户存入基础资产并获得相应的份额代币contract ERC4626 is ERC20, Ownable, ReentrancyGuard {    using SafeERC20 for ERC20; // 安全的ERC20操作
    // 存款事件    event Deposit(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);        // 取款事件    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);
    // 基础资产代币    IERC20 public immutable asset;
    // 构造函数，初始化Vault名称、符号和基础资产    // @param asset_ 基础资产合约地址    constructor(        IERC20 asset_,        string memory name_,        string memory symbol_    ) ERC20(name_, symbol_) Ownable(msg.sender) {        require(address(asset_) != address(0), "ERC4626: asset is zero address");        asset = asset_;    }
    // 基础资产总数量    function totalAssets() public view returns (uint256) {        return asset.balanceOf(address(this));
标准协议参考：[https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/interfaces/IERC4626.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/interfaces/IERC4626.sol)
​若有收获，就点个赞吧