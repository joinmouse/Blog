---
title: "ERC 协议解读"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

ERC4626 是⼀种 Vault 协议，可以⽤于资产的管理、分红， ⽤户充值某项资产、获取某个凭证，该凭证
可以作为分红、退出的依据 ，主要应⽤于 Yield Farming/借贷/质押等
我更愿意将其理解成类似银⾏的⼀种存款收取利息的协议，它的核⼼功能就是两个
充值代币兑换份额
提取代币份额获取利息●
●
1、链上功能需要实现什么
基础资产代币的⽅法
充值资产，获取 shares// asset 资产 : 返回⾦库的基础资产代币地址
function  asset() external  view returns (address assetTokenAddress )
// 返回⾦库管理的基础代币总额
function  totalAsset () external  view returns (uint256 totalManagedAssets )
// 数量和份额的转化估计
function  convertToShares (uint256 assets) external  view returns (uint256 sh
ares)
function  convertToAssets (uint256 shares) external  view returns (uint256 as
sets)1
3
5
7
9
Solidity

29提现，拿回资产// previewDesposit 预充值，充值前计算份额
function  previewDesposit (uint256 assets) external  view returns (uint256 sh
ares)
// desposit 充值
function  desposit (uint256 assets, address receiver ) external  view returns 
(uint256 shares)
// 最⼤充值，⽆需传  assets, 取默认最⼤值即可
function  maxDesposit (address receiver ) external  view returns (uint256 maxA
ssets)
// mint 系列是充值份额
function  previewMint (uint256 shares) external  view returns (uint256 asset
s)
function  mint(uint256 shares, address receiver ) external  view returns (uin
t256 assets)
function  maxMint(address receiver ) external  view returns (uint256 maxShare
s)1
3
5
7
9
11
Solidity
// withdraw
function  previewWithdraw (uint256 assets) external  view returns (uint256 sh
ares)
function  withdraw (uint256 assets, address receiver , address owner) 
external  view returns (uint256 shares)
function  maxWithdraw (address owner) external  view returns (uint256 maxAsse
ts)
// redeem
function  previewRedeem (uint256 shares) external  view returns (uint256 asse
ts)
function  redeem(uint256 shares, address receiver , address owner) 
external  view returns (uint256 assets)
function  maxRedeem (address owner) external  view returns (uint256 maxShare
s)1
3
5
7
9
11
Solidity

302、实现⼀个简单的 erc4624功能

31// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol" ;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol" ;
import "@openzeppelin/contracts/access/Ownable.sol" ;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol" ;
// @dev 实现 ERC4626 代币化 Vault 标准 : 允许⽤户存⼊基础资产并获得相应的份额代币
contract  ERC4626 is ERC20, Ownable, ReentrancyGuard  {
    using SafeERC20  for ERC20; // 安全的 ERC20 操作
    // 存款事件
    event Deposit(address indexed caller, address indexed receiver , uint2
56 assets, uint256 shares);
    
    // 取款事件
    event Withdraw (address indexed caller, address indexed receiver , addr
ess indexed owner, uint256 assets, uint256 shares);
    // 基础资产代币
    IERC20 public immutable  asset;
    // 构造函数，初始化 Vault 名称、符号和基础资产
    // @param asset_ 基础资产合约地址
    constructor (
        IERC20 asset_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender ) {
        require( address(asset_) != address(0), "ERC4626: asset is zero ad
dress");
        asset = asset_;
    }
    // 基础资产总数量
    function  totalAssets () public view returns (uint256) {
        return asset.balance Of(address(this));
    }
    // 计算资产转换为份额的⽐例
    function  convertToShares (uint256 assets) public view returns (uint25
6) {1
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
37
39
Solidity

32        uint256 totalSupply  = totalSupply ();  // 当前 Vault 中所有⽤户持有的
份额代币总和
        uint256 totalAssets  = totalAssets (); // 当前 Vault 中所有⽤户存⼊的
资产总和
        if (supply == 0) {
            // Vault 初始为空时，公式会简化为  shares = assets （ 1:1 兑换）
            return assets;
        } else {
            // 计算份额，使⽤⽐例公式
            return (assets / totalAssets ) * totalSupply ;
        }
    }
    // 计算份额转换为资产的⽐例
    function  convertToAssets (uint256 shares) public view returns (uint25
6) {
        uint256 totalSupply  = totalSupply ();
        if (totalSupply  == 0) {
            return shares;
        } else {
            return (shares / totalSupply ) * totalAssets ();
        }
    }
    // 预览存⼊资产所获得的份额
    function  previewDeposit (uint256 assets) public view returns (uint25
6) {
        return convertToShares (assets);
    }
    // 最⼤可存⼊资产
    function  maxDeposit (address receiver ) public view returns (uint256) {
        return type(uint256).max;
    }
    // 存⼊资产
    function  deposit(uint256 assets, address receiver ) public nonReentran
t returns (uint256) {
        require( assets > 0, "ERC4626: assets is zero" );
        require( receiver  != address(0), "ERC4626: receiver is zero addres
s");
        require( assets <= maxDeposit (receiver ), "ERC4626: deposit exceed
s max");
        uint256 shares = previewDeposit (assets); // 计算份额
        
        // 从发送者转移资产到合约
        asset.safeTransferFrom (msg.sender , address(this), assets);  // 发
送资产到 vault 合约中41
43
45
47
49
51
53
55
57
59
61
63
65
67
69
71
73
75
77
79

33        // 铸造份额给接收者
        _mint(receiver , shares);      // 铸造份额给接收者
        emit Deposit(msg.sender , receiver , assets, shares);  // 事件上报
         
        return shares;
    }
    // 最⼤提取资产
    function  maxWithdraw (address owner) public view returns (uint256) {
        return convertToAssets (balanceOf (owner));
    }
    // 预览提取资产所需的份额
    function  previewWithdraw (uint256 assets) public view returns (uint25
6) {
        return convertToShares (assets);
    }
    // 提取
    function  withdraw (uint256 assets, address receiver , address owner) 
        public 
        nonReentrant  
        returns (uint256) 
    {
        require( assets > 0, "ERC4626: assets is zero" );
        require( receiver  != address(0), "ERC4626: receiver is zero addres
s");
        require( owner != address(0), "ERC4626: owner is zero address" );
        require( assets <= maxWithdraw (owner), "ERC4626: withdraw exceeds 
max");
        uint256 shares = previewWithdraw (assets);  // 预览提取资产所需的份额
        // 检查提取者是否为所有者
        if (msg.sender  != owner) {
            uint256 allowed = allowance (owner, msg.sender );
            require( allowed >= shares, "ERC4626: insufficient allowanc
e");
            _approve (owner, msg.sender , allowed - shares);
        }
        _burn(owner, shares);    // 销毁份额
        // 转移资产给接收者
        asset.safeTransfer (receiver , assets);    // 转移资产给接收者80
82
84
86
88
90
92
94
96
98
100
102
104
106
108
110
112
114
116
118
120
122

34标准协议参考： https://github.com/OpenZeppelin/openzeppelin-
contracts/blob/master/contracts/interfaces/IERC4626. sol        emit Withdraw (msg.sender , receiver , owner, assets, shares);  // 
事件上报
        return shares;
    }123
125
127

35ERC 协议解读
ERC-721 是以太坊上的 NFT 的标准，定义了代币的唯⼀性（每个 t okenId 唯⼀）和基础操作（查询拥
有者、转移、授权等）；tokenId 通过为 uint256，合约需要实现ERC -165接⼝声明
https://eips.ethereum.org/EIPS/eip-7211、简介
2、核⼼操作
2.1 查询 view
2.2 授权（a pprove)// 查询_owner 拥有 TokenId 的数量
function  balanceOf (address _owner) external  view returns (uint256)
// 查询_tokenId 的拥有者
function  ownerOf(uint256 _tokenId ) external  view returns (address)
// 下⾯是可选⽅法
// 查询 NFT 集合的  name
function  name() external  view returns (string _name);
// 查询 NFT 集合的  symbol
function  symbol() external  view returns (string _symbol);
// 查询指定  NFT 的  token uri 信息
function  tokenURI (uint256 _tokenId ) external  view returns (string);1
3
5
7
9
11
13
view Solidity

362.3 转移（t ransfer)
3、实现⼀个简单的 ERC721协议// msg.sender 授权  _tokenId 的操作权限给  _approved 地址
function  approve(address _approved , uint256 _tokenId ) external  payable
// msg.sender 授权 ( 或取消授权 ) _tokenId 其权限给  _operator 地址
function  setApprovalForAll (address _operator , bool _approved ) external ;
// 查询单个  _tokenId 的授权情况，针对 approve （ address, unit256) ⽅法
function  getApproved (uint256 _tokenId ) external  view returns (address);
// 查询拥有者 _owner 地址的授权情况 , 针对 setApprovalForAll ⽅法
function  isApprovedForAll (address _owner, address _operator ) external  view 
returns (bool);1
3
5
7
9
approve Solidity
// 将_tokenId 从 _from 地址转移到  _to 地址 ;
function  TransferFrom (address _form, address _to, unint256  _tokeId)
external  payable;
// safeTransferFrom 是将接收⽅为合约时调⽤  IERC721Receiver.onERC721Received
// 确保合约能接收  NFT ，否则回退。⽬的是避免将  nft 转⼊不⽀持 ERC-721 的合约地址中
// 将_tokenId 从 _from 地址转移到  _to 地址 ; 附加校验 _to 地址是否为合约地址 ; 附加额外数
据data
function  safeTransferFrom (address _form, address _to, unint256  _tokeId, by
tes data)
external  payable;
// 将_tokenId 从 _from 地址转移到  _to 地址 ; 附加校验 _to 地址是否为合约地址 ;
function  safeTransferFrom (address _form, address _to, unint256  _tokeId)
external  payable;1
3
5
7
9
11
13
transfer Solidity

37// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;
contract  ERC721 {
    // Events
    event Transfer (address indexed from, address indexed to, uint256 inde
xed tokenId);
    event Approval (address indexed owner, address indexed approved , uint2
56 indexed tokenId);
    event ApprovalForAll (address indexed owner, address indexed operato
r, bool approved );
    string private _name;  // NFT名称
    string private _symbol; // NFT简称 / 符号
    mapping(uint256 => address) private _owners;    // 存储每个 NFT 的拥有者
    mapping(address => uint256) private _balances ;  // 存储每个地址拥有的 NFT
数量
    // tokenId => approved address 单次授权 : 针对特定代币的临时授权 , 转移后应清
除以避免重复使⽤
    mapping(uint256 => address) private _tokenApprovals ; 
    // owner => operator => approved  全局授权 : 是账户级别的⻓期授权，适⽤于所
有的 NFT, 清除会影响其他代币的操作权限
    mapping(address => mapping(address => bool)) private _operatorApprova
ls; 
    uint256 private _totalSupply ; // NFT总供应量
    constructor (string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }
    // 下⾯三个是可选⽅法
    function  name() public view returns (string memory) {
        return _name;
    }
    function  symbol() public view returns (string memory) {
        return _symbol;
    }
    // 查询指定  NFT 的  token uri 信息1
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
37
NFT Solidity

38    function  tokenURI (uint256 _tokenId ) public view returns (string memor
y) {
        require( _tokenId  < _totalSupply , "Token ID does not exist" );  // 
检查Token ID 是否存在
        return string(abi.encodePacked( "https://api.example.com/metadat
a/", _tokenId ));
    }
    // 统计某个地址拥有的所有  NFT 数量
    function  balanceOf (address _owner) public view returns (uint256) {
        require( _owner != address(0), "Balance query for the zero addres
s");  // 检查地址是否为零地址
        return _balance [_owner];  // 返回该地址拥有的 NFT 数量
    }
    // 查看某个 NFT 的拥有者
    function  ownerOf(uint256 _tokenId ) public view returns (address) {
        require( _tokenId  < _totalSupply , "Token ID does not exist" );
        return _owners[_tokenId ];
    }
    // 单个NFT 授权操作
    function  approve(address _approved , uint256 _tokenId ) external  payabl
e {
        require( _approved  != address(0), "Approval to the zero addres
s"); // 检查授权地址是否为零地址
        require( msg.sender  == _owners[_tokenId ], "Only the owner can appr
ove");  // 检查调⽤者是否为 NFT 的拥有者
        _tokenApprovals [_tokenId ] = _approved ;   // 将tokenId 的授权地址设置
为_approved
    }
    function  getApproved (uint256 _tokenId ) public view returns (address) 
{
        require( _tokenId  < _totalSupply , "Token ID does not exist" ); // 
检查Token ID 是否存在
        return _tokenApprovals [_tokenId ];  // 返回该 tokenId 的授权地址
    }
    // 对所有  NFT 的批量授权，⼀般⽤于交易所⽤ , 注意这⾥授权并没有转移所有权，可以理
解为⼀种中间的状态
    function  setApprovalForAll (address _operator , bool _approved ) externa
l {
        require( _operator  != address(0), "Approval to the zero address" );
        _operatorApprovals [msg.sender ][_operator ] = _approved ;
        emit ApprovalForAll (msg.sender , _operator , _approved );  // 触发批
量授权事件
    }38
40
42
44
46
48
50
52
54
56
58
60
62
64
66
68
70

39    function  isApprovedForAll (address _owner, address _operator ) public v
iew returns (bool) {
        return _operatorApprovals [_owner][_operator ]; // 返回操作员的授权状
态
    }
    // 转移
    // TransferFrom 将 _tokenId 从 _from 地址转移到  _to 地址 ;
    function  TransferFrom (address _from, address _to, uint256 _tokenId ) e
xternal payable {
        // 检查msg.sender 是否为拥有者，或被授权者
        require( _isApprovedOrOwner (msg.sender , _tokenId ), "not approved n
or owner" );
        _transfer (_from, _to, _tokenId );  // 内部转移函数
    }
    // 将_tokenId 从 _from 地址转移到  _to 地址 ; 附加校验 _to 地址是否为合约地址 ;
    function  safeTransferFrom (address _from, address _to, uint256 _tokenI
d) external  payable {
        require( _isApprovedOrOwner (msg.sender , _tokenId ), "not approved n
or owner" );
        _safeTransfer (_from, _to, _tokenId , "");
    }
    // ---------------------------
    // Mint / Burn （内部）
    // ---------------------------
    function  _mint(address to, uint256 tokenId) internal  {
        require( to != address(0), "mint to zero" ); // 检查铸造地址是否为零地
址
        require( !_exists(tokenId), "token already minted" );
        // 更新NFT 拥有者的数量和所有者映射
        _balances [to] += 1;
        _owners[tokenId] = to;
        emit Transfer (address(0), to, tokenId);  // 触发铸造事件
    }
    function  _burn(uint256 tokenId) internal  {
        address owner = ownerOf(tokenId); // 获取tokenId 的拥有者
        require( owner != address(0), "token does not exist" );  // owner 必
须是有效地址
        // 清除授权
        delete _tokenApprovals [tokenId];  // 清除tokenId 的授权72
74
76
78
80
82
84
86
88
90
92
94
96
98
100
102
104
106
108
110

40        // 更新拥有者的数量和所有者映射
        _balances [owner] -= 1;
        delete _owners[tokenId]; // 清除tokenId 的拥有者
        emit Transfer (owner, address(0), tokenId); // 触发销毁事件
    }
    // ---------------------------
    // Internal helpers
    // ---------------------------
    function  _exists(uint256 tokenId) internal  view returns (bool) {
        return _owners[tokenId] != address(0);  // 检查tokenId 是否存在
    }
    function  _isApprovedOrOwner (address spender, uint256 tokenId) interna
l view returns (bool) {
        require( _exists(tokenId), "token does not exist" );
        address owner = ownerOf(tokenId);
        // 检查调⽤者是否为 token 的拥有者或被授权的操作员
        return (spender == owner || getApproved (tokenId) == spender || is
ApprovedForAll (owner, spender));
    }
    // 转移内部实现
    function  _transfer (address from, address to, uint256 tokenId) interna
l {
        require( ownerOf(tokenId) == from, "from is not owner" );  // 检查转
出地址是否为 token 的拥有者
        require( to != address(0), "transfer to zero" ); // 检查转⼊地址是否为
零地址
        // clear approvals
        delete _tokenApprovals [tokenId];   // 清除授权
        // update balances and owner
        _balances [from] -= 1;  // 更新转出地址的 NFT 数量
        _balances [to] += 1;    // 更新转⼊地址的 NFT 数量
        _owners[tokenId] = to; // 更新tokenId 的拥有者
        emit Transfer (from, to, tokenId);  // 触发转账事件
    }
    function  _safeTransfer (address from, address to, uint256 tokenId, byt
es memory data) internal  {
        _transfer (from, to, tokenId);  // 调⽤内部转移函数
        // 如果 to 是合约则调⽤  IERC721Receiver.onERC721Received
        if (_isContract (to)) {
            // 调⽤合约的  onERC721Received ⽅法 , 并检查返回值是否正确112
114
116
118
120
122
124
126
128
130
132
134
136
138
140
142
144
146
148
150

41OpenZeppelin第三⽅实现： https://github.com/OpenZeppelin/openzeppelin-
contracts/blob/master/contracts/token/ERC721/ERC721.sol
资产的核⼼是所有权（Owne rship)，主要通过 ownerOf 和 balanceOf体现
NFT交易的不是 tokenURI，⽽是所有权 的转移，即 ownerOf(tokenId)返回地址的变化
尽管不是强制要求，但实际项⽬中，绝⼤数的 N FT合约会实现 name、symbol和 tokenURI
     1、name和 symbol通常⽤于标识整个 NFT合集（C ollection)
     2、tokenURI(tokenId) 则为每个 tokenId 提供唯⼀的元数据链接（通常指向链下图⽚、属性等信
息）
实际交易流程（以NFT 市场为例）
     1、 ⽤户⾸先调⽤ approve 授权给 nft市场合约（即M arket的 CA)
     2、市场合约在完成交易撮合后，调⽤ tr ansferFrom或safeTransferFrom将 NFT从卖家地址转移到
买家
     3、改过程不涉及 tokenURI的变化， 唯⼀变化的是 NFT的所有权地址4、应⽤场景：以NFT 为例
●
●
●
●            try IERC721Receiver (to).onERC721Received (msg.sender , from, to
kenId, data) returns (bytes4 retval) {
                require( retval == IERC721Receiver .onERC721Received .select
or, "unsafe recipient" );
            } catch {
                revert("unsafe recipient" );
            }
        }
    }
    // 检查地址是否为合约地址
    function  _isContract (address account) internal  view returns (bool) {
        return account.code.length > 0;
    }
}
// @notice 极简  IERC721Receiver 接⼝，⽤于  safeTransfer 检测
interface  IERC721Receiver  {
function onERC721Received (address operator ,address from,uint256 tok152
154
156
158
160
162
164
166
168

42ERC 协议解读
ERC20 标准提供了⼀组基础接⼝，使得代币可以在以太坊⽣态系统中⽅便地创建、管理和交换
https://eips.ethereum.org/EIPS/eip-20
原⽣币 : 以太币（E ther，ETH）是以太坊区块链的原⽣加密货币。它直接由区块 链协议⽣成和
管理。
⽤途: 主要⽤于⽀付⽹络上的交易费⽤（G as）以及奖励矿⼯（现在是验证者） 。
特性: 原⽣币的交易是直接在区块链上进⾏的，不需要任何智能合约。
地址: 以太币的交易地址是由以太坊协议⽣成的。
智能合约币 : ERC20 代币是通过智能合约创建和管理的加密货币。它们不是区块链的 原⽣
币，⽽是构建在区块链之上的。
⽤途: 可以代表各种资产或功能，如稳定币、权益证明、治理代币等。
特性: ERC20 代币遵循以太坊改进提案 20（EIP-20）的标准，实现了⼀组基本的接⼝和功
能，使其能够在去中⼼化应⽤（D Apps）之间互操作。
地址: ERC20 代币的合约地址是由智能合约⽣成的。
包装以太币 : WETH（Wrapped Ether）是将 ETH 包装成 ERC20 代币的形式，使其能够在需
要 ERC20 标准的去中⼼化应⽤中使⽤。●
1、区分原⽣币( Coin)和代币(Token)
以太币（C oin）
●
●
●
●
ERC20 代币（T oken）
●
●
●
●
WETH（Wrapped Ether）
●

43⽤途: 由于 ETH 不是 ERC20 代币，有些  DApps 需要使⽤ E RC20 标准，因此 WE TH 充当
桥梁，使 ETH 可以像其他 ERC20 代币⼀样使⽤。
特性: 1 WETH 始终等于 1 ETH，⽤户可以随时在 WETH 和 ETH 之间转换。
WETH 有⾃⼰的智能合约地址，⽤户通过该地址进⾏ WETH 与 ETH 的转换。
标准接⼝允许以太坊上任何代币被其他的应⽤程序重复使⽤：从钱包到去中⼼化交易
思考：可以结合链上货币的特性想⼀想，在技术层⾯需要什么接⼝
1：代币需要最基础的知道总量是多少
ERC20⾥⾯叫  total supply  
2、任何代币需要知道余额是多少，余 额属于谁（地址）
在ERC20⾥⾯叫  balanceOf   它接受⼀个地址，返回对应的余额（注：b alance在英⽂有余额的
含义）
3、场景：你需要想把 1 ETH 等值的代币 给朋友
ERC20⾥⾯叫  transfer  ，调⽤ transfer(A, amount)●
●
●
2、ERC20接⼝协议
function  totalSupply () public view virtual returns (uint256) 1
Solidity
function  balanceOf (address account) public view virtual returns (unit256) 1
balanceOf Solidity
// 由代币持有者⾃⼰调⽤（ msg.sender ），返回  bool 类型，告知是否转账成功
function  transfer (address to, uint256 value) public virtual returns (bool)1
transfer Solidity

444、场景： 想⽤去中⼼化交易所交易代币
涉及到 ERC⾥⾯的 approve 、 transferFrom   、 allowance   
先 approve(DEX合约, amount)，然后 DEX 合约调⽤ transferFrom(你的地址,  买家/合约,  amount) 拉
⾛代币执⾏交易。
ERC20 主要就是 6 个⽅法
补充：语法说明
virtual：虚拟的，可被⼦合约重写（o verride）
view：只读/视图函数，不会修改区块 链上的状态（不能写⼊状态变量或发出事件）。通过 
eth_call 调⽤时不消耗 gas●
●
3、实现⼀个简单的ER C20// approve 授权
// spender: 被授权⽅
function  approve(address spender, uint256 value) public virtual returns (b
ool)
// allowance: 返回授权额度
function  allowance (address owner, address spender) public view virtual ret
urn (uint256)
// 转账
function  transferFrom (address from, address to, uint256 value)
public virtual return (bool)1
3
5
7
9
Solidity

45// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;
contract  SimpleERC20  {
    string private _name;
    string private _symbol;
    uint256 private _totalSupply ; // 初始供应量
    mapping(address => uint256) private _balances ; // 记录每个地址的代币余额
    mapping(address => mapping(address => uint256)) private _allowances ; 
// 记录每个地址对其他地址的授权额度
    // 事件
    event Transfer (address indexed from, address indexed to, uint256 valu
e); // 触发转账事件
    event Approval (address indexed owner, address indexed spender, uint25
6 value); // 触发授权事件
    // 临时且⾮持久 : memory 中的数据只存在于⼀次外部调⽤ / 内部调⽤的执⾏期间，函数返回
后就会被丢弃，不会写⼊链上持久存储。
    constructor (string memory name_, string memory symbol_, uint256 initia
lSupply_ ) {
        _name = name_;
        _symbol = symbol_;
        _totalSupply  = initialSupply_ ; // 初始化代币总量
        // 初始化的供应量分配给合约的部署者
        _balances [msg.sender ] = _totalSupply ;
    }
    // 代币的全名 , 例如 "USD Coin"
    function  name() public view returns (string memory) {
        return _name;
    }
    // 代币简称 / 符号 , 例如 "USDC"
    function  symbol() public view returns (string memory) {
        return _symbol;
    }
    // 代币总量
    function  totalSupply () public view returns (uint256) {
        return _totalSupply ;
    }1
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
37
39
Solidity

46    // 查询某个地址的代币余额
    function  balanceOf (address account) public view returns (uint256) {
        return _balances [account];
    }
    // transfer 转账
    function  transfer (address to_, uint256 amount_) public returns (bool) 
{
        address owner = msg.sender ; // 获取调⽤者地址
        require( owner != address(0), "Transfer from the zero address" ); 
// 检查调⽤者地址是否为零地址
        require( to_ != address(0), "Transfer to the zero address" ); // 检
查接收者地址是否为零地址
        require( _balances [owner] >= amount_, "Transfer amount exceeds bala
nce"); // 检查调⽤者余额是否⾜够
        _balances [owner] -= amount_; // 从调⽤者余额中扣除转账⾦额
        _balances [to_] += amount_; // 将转账⾦额添加到接收者余额中
        emit Transfer (owner, to_, amount_); // 触发转账事件 , 记录到⽇志中
        return true; // 返回成功标志
    }
    // approve 授权
    function  approve(address spender, uint256 amount) public returns (boo
l) {
        address owner = msg.sender ;  // 获取调⽤者地址
        require( owner != address(0), "Approve from the zero address" );
        require( spender != address(0), "Approve to the zero address" );
        _allowances [owner][spender] = amount;  // 设置授权额度
        emit Approval (owner, spender, amount);
        return true;
    }
    // 查询授权额度
    function  allowance (address owner, address spender) public view return
s (uint256) {
        return _allowances [owner][spender];
    }
    // transferFrom 转账
    function  transferFrom (address from, address to, uint256 amount) publi
c returns (bool) {
        address spender = msg.sender ; // 获取调⽤者地址40
42
44
46
48
50
52
54
56
58
60
62
64
66
68
70
72
74
76
78

47event:  事件主要⽤于“ 对外发布可检索 、低成本的操作/状态变更记录”
我们⼀般不⾃⼰实现，⽽是基于 OpenZeppelin  实现。我们可以把 OpenZeppelin看成⼀个我们
编码的第三⽅包即可
OpenZeppelin 是⼀个开源的区块链开 发⼯具和智能合约库，旨在帮助开发者安全地构建和部署智
能合约。它提供了⼀系列经过审核和验证的智能合约实现，包括代币标准、访问控制、⽀付通道
等，极⼤地简化了以太坊和其他区块链平台上的开发⼯作。
1.安全性 : OpenZeppelin 合约经过⼴泛的审计和验证，确保代码的安全性和可靠性 。
2.模块化 : 提供可重⽤的模块化合约，使得开发者可以轻松组合和扩展功能。
3.标准化 : 实现了⼴泛接受的标准，如 ERC20、ERC721 和 ERC1155 等。
4.⽂档和⽀持 : 提供详尽的⽂档和活跃的社区⽀持，帮助开发者快速上⼿。4、OpenZeppelin标准协议
OpenZeppelin的主要功能和特点        require( from != address(0), "Transfer from the zero address" );  
// 检查发送者地址是否为零地址
        require( to != address(0), "Transfer to the zero address" ); // 检查
接收者地址是否为零地址
        require( _balances [from] >= amount, "Transfer amount exceeds balanc
e"); // 检查发送者余额是否⾜够
        require( _allowances [from][spender] >= amount, "Transfer amount exc
eeds allowance" ); // 检查授权额度是否⾜够
        _balances [from] -= amount;  // 从发送者余额中扣除转账⾦额
        _balances [to] += amount;    // 将转账⾦额添加到接收者余额中
        _allowances [from][spender] -= amount;  // 扣除授权额度
        emit Transfer (from, to, amount);
        return true;
    }
}80
82
84
86
88
90
92
94

48ERC20的实现： https://github.com/OpenZeppelin/openzeppelin-
contracts/blob/master/contracts/token/ERC20/ERC20.sol
可以看到我们使⽤ openZeppelin这个包的时候是⼗分简单 的

49