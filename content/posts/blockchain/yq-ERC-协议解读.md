---
title: "ERC 协议解读"
date: 2024-04-20
tags: ["智能合约", "Solidity"]
---

## ERC4626

ERC4626 是一种 Vault 协议，可以用于资产的管理、分红，用户充值某项资产、获取某个凭证，该凭证可以作为分红、退出的依据，主要应用于 Yield Farming / 借贷 / 质押等。

我更愿意将其理解成类似银行的一种存款收取利息的协议，它的核心功能就是两个：

- 充值代币兑换份额
- 提取代币份额获取利息

### 1、链上功能需要实现什么

#### 基础资产代币的方法

```solidity
// asset 资产：返回金库的基础资产代币地址
function asset() external view returns (address assetTokenAddress)

// 返回金库管理的基础代币总额
function totalAsset() external view returns (uint256 totalManagedAssets)

// 数量和份额的转化估计
function convertToShares(uint256 assets) external view returns (uint256 shares)
function convertToAssets(uint256 shares) external view returns (uint256 assets)
```

#### 充值资产，获取 shares

```solidity
// previewDeposit 预充值，充值前计算份额
function previewDeposit(uint256 assets) external view returns (uint256 shares)

// deposit 充值
function deposit(uint256 assets, address receiver) external view returns (uint256 shares)

// 最大充值，无需传 assets，取默认最大值即可
function maxDeposit(address receiver) external view returns (uint256 maxAssets)

// mint 系列是充值份额
function previewMint(uint256 shares) external view returns (uint256 assets)
function mint(uint256 shares, address receiver) external view returns (uint256 assets)
function maxMint(address receiver) external view returns (uint256 maxShares)
```

#### 提现，拿回资产

```solidity
// withdraw
function previewWithdraw(uint256 assets) external view returns (uint256 shares)
function withdraw(uint256 assets, address receiver, address owner)
    external view returns (uint256 shares)
function maxWithdraw(address owner) external view returns (uint256 maxAssets)

// redeem
function previewRedeem(uint256 shares) external view returns (uint256 assets)
function redeem(uint256 shares, address receiver, address owner)
    external view returns (uint256 assets)
function maxRedeem(address owner) external view returns (uint256 maxShares)
```

### 2、实现一个简单的 ERC4626 功能

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// @dev 实现 ERC4626 代币化 Vault 标准：允许用户存入基础资产并获得相应的份额代币
contract ERC4626 is ERC20, Ownable, ReentrancyGuard {
    using SafeERC20 for ERC20; // 安全的 ERC20 操作

    // 存款事件
    event Deposit(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);

    // 取款事件
    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);

    // 基础资产代币
    IERC20 public immutable asset;

    // 构造函数，初始化 Vault 名称、符号和基础资产
    // @param asset_ 基础资产合约地址
    constructor(
        IERC20 asset_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        require(address(asset_) != address(0), "ERC4626: asset is zero address");
        asset = asset_;
    }

    // 基础资产总数量
    function totalAssets() public view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    // 计算资产转换为份额的比例
    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 totalSupply = totalSupply();   // 当前 Vault 中所有用户持有的份额代币总和
        uint256 totalAssets = totalAssets();    // 当前 Vault 中所有用户存入的资产总和
        if (supply == 0) {
            // Vault 初始为空时，公式会简化为 shares = assets（1:1 兑换）
            return assets;
        } else {
            // 计算份额，使用比例公式
            return (assets / totalAssets) * totalSupply;
        }
    }

    // 计算份额转换为资产的比例
    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 totalSupply = totalSupply();
        if (totalSupply == 0) {
            return shares;
        } else {
            return (shares / totalSupply) * totalAssets();
        }
    }

    // 预览存入资产所获得的份额
    function previewDeposit(uint256 assets) public view returns (uint256) {
        return convertToShares(assets);
    }

    // 最大可存入资产
    function maxDeposit(address receiver) public view returns (uint256) {
        return type(uint256).max;
    }

    // 存入资产
    function deposit(uint256 assets, address receiver) public nonReentrant returns (uint256) {
        require(assets > 0, "ERC4626: assets is zero");
        require(receiver != address(0), "ERC4626: receiver is zero address");
        require(assets <= maxDeposit(receiver), "ERC4626: deposit exceeds max");

        uint256 shares = previewDeposit(assets); // 计算份额

        // 从发送者转移资产到合约
        asset.safeTransferFrom(msg.sender, address(this), assets); // 发送资产到 vault 合约中

        // 铸造份额给接收者
        _mint(receiver, shares);      // 铸造份额给接收者
        emit Deposit(msg.sender, receiver, assets, shares); // 事件上报

        return shares;
    }

    // 最大提取资产
    function maxWithdraw(address owner) public view returns (uint256) {
        return convertToAssets(balanceOf(owner));
    }

    // 预览提取资产所需的份额
    function previewWithdraw(uint256 assets) public view returns (uint256) {
        return convertToShares(assets);
    }

    // 提取
    function withdraw(uint256 assets, address receiver, address owner)
        public
        nonReentrant
        returns (uint256)
    {
        require(assets > 0, "ERC4626: assets is zero");
        require(receiver != address(0), "ERC4626: receiver is zero address");
        require(owner != address(0), "ERC4626: owner is zero address");
        require(assets <= maxWithdraw(owner), "ERC4626: withdraw exceeds max");

        uint256 shares = previewWithdraw(assets); // 预览提取资产所需的份额

        // 检查提取者是否为所有者
        if (msg.sender != owner) {
            uint256 allowed = allowance(owner, msg.sender);
            require(allowed >= shares, "ERC4626: insufficient allowance");
            _approve(owner, msg.sender, allowed - shares);
        }

        _burn(owner, shares);    // 销毁份额

        // 转移资产给接收者
        asset.safeTransfer(receiver, assets);    // 转移资产给接收者
        emit Withdraw(msg.sender, receiver, owner, assets, shares); // 事件上报

        return shares;
    }
}
```

标准协议参考：https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/interfaces/IERC4626.sol

---

## ERC-721

ERC-721 是以太坊上的 NFT 的标准，定义了代币的唯一性（每个 tokenId 唯一）和基础操作（查询拥有者、转移、授权等）；tokenId 通常为 uint256，合约需要实现 ERC-165 接口声明。

https://eips.ethereum.org/EIPS/eip-721

### 1、简介

### 2、核心操作

#### 2.1 查询 view

```solidity
// 查询 _owner 拥有 TokenId 的数量
function balanceOf(address _owner) external view returns (uint256)

// 查询 _tokenId 的拥有者
function ownerOf(uint256 _tokenId) external view returns (address)

// 下面是可选方法
// 查询 NFT 集合的 name
function name() external view returns (string _name);

// 查询 NFT 集合的 symbol
function symbol() external view returns (string _symbol);

// 查询指定 NFT 的 token uri 信息
function tokenURI(uint256 _tokenId) external view returns (string);
```

#### 2.2 授权（approve）

```solidity
// msg.sender 授权 _tokenId 的操作权限给 _approved 地址
function approve(address _approved, uint256 _tokenId) external payable

// msg.sender 授权（或取消授权）_tokenId 其权限给 _operator 地址
function setApprovalForAll(address _operator, bool _approved) external;

// 查询单个 _tokenId 的授权情况，针对 approve(address, uint256) 方法
function getApproved(uint256 _tokenId) external view returns (address);

// 查询拥有者 _owner 地址的授权情况，针对 setApprovalForAll 方法
function isApprovedForAll(address _owner, address _operator) external view returns (bool);
```

#### 2.3 转移（transfer）

```solidity
// 将 _tokenId 从 _from 地址转移到 _to 地址
function TransferFrom(address _form, address _to, uint256 _tokenId)
    external payable;

// safeTransferFrom 是将接收方为合约时调用 IERC721Receiver.onERC721Received
// 确保合约能接收 NFT，否则回退。目的是避免将 NFT 转入不支持 ERC-721 的合约地址中

// 将 _tokenId 从 _from 地址转移到 _to 地址；附加校验 _to 地址是否为合约地址；附加额外数据 data
function safeTransferFrom(address _form, address _to, uint256 _tokenId, bytes data)
    external payable;

// 将 _tokenId 从 _from 地址转移到 _to 地址；附加校验 _to 地址是否为合约地址
function safeTransferFrom(address _form, address _to, uint256 _tokenId)
    external payable;
```

### 3、实现一个简单的 ERC721 协议

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721 {
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    string private _name;  // NFT名称
    string private _symbol; // NFT简称/符号

    mapping(uint256 => address) private _owners;    // 存储每个 NFT 的拥有者
    mapping(address => uint256) private _balances;  // 存储每个地址拥有的 NFT 数量

    // tokenId => approved address 单次授权：针对特定代币的临时授权，转移后应清除以避免重复使用
    mapping(uint256 => address) private _tokenApprovals;

    // owner => operator => approved 全局授权：是账户级别的长期授权，适用于所有的 NFT，清除会影响其他代币的操作权限
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    uint256 private _totalSupply; // NFT总供应量

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    // 下面三个是可选方法
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // 查询指定 NFT 的 token uri 信息
    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        require(_tokenId < _totalSupply, "Token ID does not exist"); // 检查 Token ID 是否存在
        return string(abi.encodePacked("https://api.example.com/metadata/", _tokenId));
    }

    // 统计某个地址拥有的所有 NFT 数量
    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "Balance query for the zero address"); // 检查地址是否为零地址
        return _balance[_owner]; // 返回该地址拥有的 NFT 数量
    }

    // 查看某个 NFT 的拥有者
    function ownerOf(uint256 _tokenId) public view returns (address) {
        require(_tokenId < _totalSupply, "Token ID does not exist");
        return _owners[_tokenId];
    }

    // 单个 NFT 授权操作
    function approve(address _approved, uint256 _tokenId) external payable {
        require(_approved != address(0), "Approval to the zero address"); // 检查授权地址是否为零地址
        require(msg.sender == _owners[_tokenId], "Only the owner can approve"); // 检查调用者是否为 NFT 的拥有者
        _tokenApprovals[_tokenId] = _approved; // 将 tokenId 的授权地址设置为 _approved
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        require(_tokenId < _totalSupply, "Token ID does not exist"); // 检查 Token ID 是否存在
        return _tokenApprovals[_tokenId]; // 返回该 tokenId 的授权地址
    }

    // 对所有 NFT 的批量授权，一般用于交易所用，注意这里授权并没有转移所有权，可以理解为一种中间的状态
    function setApprovalForAll(address _operator, bool _approved) external {
        require(_operator != address(0), "Approval to the zero address");
        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved); // 触发批量授权事件
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return _operatorApprovals[_owner][_operator]; // 返回操作员的授权状态
    }

    // 转移
    // TransferFrom 将 _tokenId 从 _from 地址转移到 _to 地址
    function TransferFrom(address _from, address _to, uint256 _tokenId) external payable {
        // 检查 msg.sender 是否为拥有者，或被授权者
        require(_isApprovedOrOwner(msg.sender, _tokenId), "not approved nor owner");
        _transfer(_from, _to, _tokenId); // 内部转移函数
    }

    // 将 _tokenId 从 _from 地址转移到 _to 地址；附加校验 _to 地址是否为合约地址
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require(_isApprovedOrOwner(msg.sender, _tokenId), "not approved nor owner");
        _safeTransfer(_from, _to, _tokenId, "");
    }

    // ---------------------------
    // Mint / Burn（内部）
    // ---------------------------
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "mint to zero"); // 检查铸造地址是否为零地址
        require(!_exists(tokenId), "token already minted");
        // 更新 NFT 拥有者的数量和所有者映射
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId); // 触发铸造事件
    }

    function _burn(uint256 tokenId) internal {
        address owner = ownerOf(tokenId); // 获取 tokenId 的拥有者
        require(owner != address(0), "token does not exist"); // owner 必须是有效地址
        // 清除授权
        delete _tokenApprovals[tokenId]; // 清除 tokenId 的授权
        // 更新拥有者的数量和所有者映射
        _balances[owner] -= 1;
        delete _owners[tokenId]; // 清除 tokenId 的拥有者
        emit Transfer(owner, address(0), tokenId); // 触发销毁事件
    }

    // ---------------------------
    // Internal helpers
    // ---------------------------
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0); // 检查 tokenId 是否存在
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "token does not exist");
        address owner = ownerOf(tokenId);
        // 检查调用者是否为 token 的拥有者或被授权的操作员
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    // 转移内部实现
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "from is not owner"); // 检查转出地址是否为 token 的拥有者
        require(to != address(0), "transfer to zero"); // 检查转入地址是否为零地址
        // clear approvals
        delete _tokenApprovals[tokenId]; // 清除授权
        // update balances and owner
        _balances[from] -= 1;  // 更新转出地址的 NFT 数量
        _balances[to] += 1;    // 更新转入地址的 NFT 数量
        _owners[tokenId] = to; // 更新 tokenId 的拥有者
        emit Transfer(from, to, tokenId); // 触发转账事件
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal {
        _transfer(from, to, tokenId); // 调用内部转移函数
        // 如果 to 是合约则调用 IERC721Receiver.onERC721Received
        if (_isContract(to)) {
            // 调用合约的 onERC721Received 方法，并检查返回值是否正确
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
                require(retval == IERC721Receiver.onERC721Received.selector, "unsafe recipient");
            } catch {
                revert("unsafe recipient");
            }
        }
    }

    // 检查地址是否为合约地址
    function _isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }
}

// @notice 极简 IERC721Receiver 接口，用于 safeTransfer 检测
interface IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}
```

OpenZeppelin 第三方实现：https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol

### 4、应用场景：以 NFT 为例

- 资产的核心是所有权（Ownership），主要通过 `ownerOf` 和 `balanceOf` 体现
- NFT 交易的不是 tokenURI，而是所有权的转移，即 `ownerOf(tokenId)` 返回地址的变化
- 尽管不是强制要求，但实际项目中，绝大数的 NFT 合约会实现 `name`、`symbol` 和 `tokenURI`
  1. `name` 和 `symbol` 通常用于标识整个 NFT 合集（Collection）
  2. `tokenURI(tokenId)` 则为每个 tokenId 提供唯一的元数据链接（通常指向链下图片、属性等信息）
- 实际交易流程（以 NFT 市场为例）：
  1. 用户首先调用 `approve` 授权给 NFT 市场合约（即 Market 的 CA）
  2. 市场合约在完成交易撮合后，调用 `transferFrom` 或 `safeTransferFrom` 将 NFT 从卖家地址转移到买家
  3. 该过程不涉及 tokenURI 的变化，唯一变化的是 NFT 的所有权地址

---

## ERC-20

ERC20 标准提供了一组基础接口，使得代币可以在以太坊生态系统中方便地创建、管理和交换。

https://eips.ethereum.org/EIPS/eip-20

### 1、区分原生币（Coin）和代币（Token）

**以太币（Coin）**

- **原生币：** 以太币（Ether，ETH）是以太坊区块链的原生加密货币。它直接由区块链协议生成和管理。
- **用途：** 主要用于支付网络上的交易费用（Gas）以及奖励矿工（现在是验证者）。
- **特性：** 原生币的交易是直接在区块链上进行的，不需要任何智能合约。
- **地址：** 以太币的交易地址是由以太坊协议生成的。

**ERC20 代币（Token）**

- **智能合约币：** ERC20 代币是通过智能合约创建和管理的加密货币。它们不是区块链的原生币，而是构建在区块链之上的。
- **用途：** 可以代表各种资产或功能，如稳定币、权益证明、治理代币等。
- **特性：** ERC20 代币遵循以太坊改进提案 20（EIP-20）的标准，实现了一组基本的接口和功能，使其能够在去中心化应用（DApps）之间互操作。
- **地址：** ERC20 代币的合约地址是由智能合约生成的。

**WETH（Wrapped Ether）**

- **包装以太币：** WETH（Wrapped Ether）是将 ETH 包装成 ERC20 代币的形式，使其能够在需要 ERC20 标准的去中心化应用中使用。
- **用途：** 由于 ETH 不是 ERC20 代币，有些 DApps 需要使用 ERC20 标准，因此 WETH 充当桥梁，使 ETH 可以像其他 ERC20 代币一样使用。
- **特性：** 1 WETH 始终等于 1 ETH，用户可以随时在 WETH 和 ETH 之间转换。WETH 有自己的智能合约地址，用户通过该地址进行 WETH 与 ETH 的转换。

### 2、ERC20 接口协议

标准接口允许以太坊上任何代币被其他的应用程序重复使用：从钱包到去中心化交易。

思考：可以结合链上货币的特性想一想，在技术层面需要什么接口。

**1：代币需要最基础的知道总量是多少**

ERC20 里面叫 `totalSupply`：

```solidity
function totalSupply() public view virtual returns (uint256)
```

**2：任何代币需要知道余额是多少，余额属于谁（地址）**

在 ERC20 里面叫 `balanceOf`，它接受一个地址，返回对应的余额（注：balance 在英文有余额的含义）：

```solidity
function balanceOf(address account) public view virtual returns (uint256)
```

**3：场景——你需要想把 1 ETH 等值的代币给朋友**

ERC20 里面叫 `transfer`，调用 `transfer(A, amount)`：

```solidity
// 由代币持有者自己调用（msg.sender），返回 bool 类型，告知是否转账成功
function transfer(address to, uint256 value) public virtual returns (bool)
```

**4：场景——想用去中心化交易所交易代币**

涉及到 ERC 里面的 `approve`、`transferFrom`、`allowance`。

先 `approve(DEX合约, amount)`，然后 DEX 合约调用 `transferFrom(你的地址, 买家/合约, amount)` 拉走代币执行交易。

```solidity
// approve 授权
// spender：被授权方
function approve(address spender, uint256 value) public virtual returns (bool)

// allowance：返回授权额度
function allowance(address owner, address spender) public view virtual return (uint256)

// 转账
function transferFrom(address from, address to, uint256 value)
    public virtual return (bool)
```

ERC20 主要就是 6 个方法。

**补充：语法说明**

- **virtual：** 虚拟的，可被子合约重写（override）
- **view：** 只读/视图函数，不会修改区块链上的状态（不能写入状态变量或发出事件）。通过 `eth_call` 调用时不消耗 gas
- **event：** 事件主要用于"对外发布可检索、低成本的操作/状态变更记录"

### 3、实现一个简单的 ERC20

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleERC20 {
    string private _name;
    string private _symbol;
    uint256 private _totalSupply; // 初始供应量

    mapping(address => uint256) private _balances; // 记录每个地址的代币余额
    mapping(address => mapping(address => uint256)) private _allowances; // 记录每个地址对其他地址的授权额度

    // 事件
    event Transfer(address indexed from, address indexed to, uint256 value); // 触发转账事件
    event Approval(address indexed owner, address indexed spender, uint256 value); // 触发授权事件

    // 临时且非持久：memory 中的数据只存在于一次外部调用/内部调用的执行期间，函数返回后就会被丢弃，不会写入链上持久存储。
    constructor(string memory name_, string memory symbol_, uint256 initialSupply_) {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = initialSupply_; // 初始化代币总量
        // 初始化的供应量分配给合约的部署者
        _balances[msg.sender] = _totalSupply;
    }

    // 代币的全名，例如 "USD Coin"
    function name() public view returns (string memory) {
        return _name;
    }

    // 代币简称/符号，例如 "USDC"
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // 代币总量
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // 查询某个地址的代币余额
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    // transfer 转账
    function transfer(address to_, uint256 amount_) public returns (bool) {
        address owner = msg.sender; // 获取调用者地址
        require(owner != address(0), "Transfer from the zero address"); // 检查调用者地址是否为零地址
        require(to_ != address(0), "Transfer to the zero address"); // 检查接收者地址是否为零地址
        require(_balances[owner] >= amount_, "Transfer amount exceeds balance"); // 检查调用者余额是否足够
        _balances[owner] -= amount_; // 从调用者余额中扣除转账金额
        _balances[to_] += amount_; // 将转账金额添加到接收者余额中
        emit Transfer(owner, to_, amount_); // 触发转账事件，记录到日志中
        return true; // 返回成功标志
    }

    // approve 授权
    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = msg.sender; // 获取调用者地址
        require(owner != address(0), "Approve from the zero address");
        require(spender != address(0), "Approve to the zero address");
        _allowances[owner][spender] = amount; // 设置授权额度
        emit Approval(owner, spender, amount);
        return true;
    }

    // 查询授权额度
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    // transferFrom 转账
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        address spender = msg.sender; // 获取调用者地址
        require(from != address(0), "Transfer from the zero address"); // 检查发送者地址是否为零地址
        require(to != address(0), "Transfer to the zero address"); // 检查接收者地址是否为零地址
        require(_balances[from] >= amount, "Transfer amount exceeds balance"); // 检查发送者余额是否足够
        require(_allowances[from][spender] >= amount, "Transfer amount exceeds allowance"); // 检查授权额度是否足够
        _balances[from] -= amount;  // 从发送者余额中扣除转账金额
        _balances[to] += amount;    // 将转账金额添加到接收者余额中
        _allowances[from][spender] -= amount; // 扣除授权额度
        emit Transfer(from, to, amount);
        return true;
    }
}
```

### 4、OpenZeppelin 标准协议

我们一般不自己实现，而是基于 OpenZeppelin 实现。我们可以把 OpenZeppelin 看成一个我们编码的第三方包即可。

OpenZeppelin 是一个开源的区块链开发工具和智能合约库，旨在帮助开发者安全地构建和部署智能合约。它提供了一系列经过审核和验证的智能合约实现，包括代币标准、访问控制、支付通道等，极大地简化了以太坊和其他区块链平台上的开发工作。

**OpenZeppelin 的主要功能和特点：**

1. **安全性：** OpenZeppelin 合约经过广泛的审计和验证，确保代码的安全性和可靠性。
2. **模块化：** 提供可重用的模块化合约，使得开发者可以轻松组合和扩展功能。
3. **标准化：** 实现了广泛接受的标准，如 ERC20、ERC721 和 ERC1155 等。
4. **文档和支持：** 提供详尽的文档和活跃的社区支持，帮助开发者快速上手。

ERC20 的实现：https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol

可以看到我们使用 OpenZeppelin 这个包的时候是十分简单的。
