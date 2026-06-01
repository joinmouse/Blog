---
title: "ERC721 协议解读"
date: 2026-06-01
slug_yuque: srsclw41epxogthn
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/srsclw41epxogthn"
source_kind: yuque
---

返回文档1、简介
ERC-721 是以太坊上的 NFT 的标准，定义了代币的唯一性（每个 tokenId 唯一）和基础操作（查询拥有者、转移、授权等）；tokenId 通过为 uint256，合约需要实现ERC-165接口声明
[https://eips.ethereum.org/EIPS/eip-721](https://eips.ethereum.org/EIPS/eip-721)
2、核心操作
2.1 查询 view
​viewSolidity复制代码9912345678910111213// 查询_owner拥有TokenId的数量function balanceOf(address _owner) external view returns (uint256)
// 查询_tokenId的拥有者function ownerOf(uint256 _tokenId) external view returns (address)
// 下面是可选方法// 查询 NFT 集合的 namefunction name() external view returns (string _name);// 查询 NFT 集合的 symbolfunction symbol() external view returns (string _symbol);// 查询指定 NFT 的 token uri信息function tokenURI(uint256 _tokenId) external view returns (string);2.2 授权（approve)
​approveSolidity复制代码9123456789// msg.sender 授权 _tokenId 的操作权限给 _approved 地址function approve(address _approved, uint256 _tokenId) external payable// msg.sender 授权(或取消授权) _tokenId 其权限给 _operator地址function setApprovalForAll(address _operator, bool _approved) external;
// 查询单个 _tokenId的授权情况，针对approve（address, unit256) 方法function getApproved(uint256 _tokenId) external view returns (address);// 查询拥有者_owner地址的授权情况, 针对setApprovalForAll方法function isApprovedForAll(address _owner, address _operator) external view returns (bool);2.3 转移（transfer)
​transferSolidity复制代码9912345678910111213// 将_tokenId 从_from地址转移到 _to 地址;function TransferFrom(address _form, address _to, unint256 _tokeId)external payable;
// safeTransferFrom是将接收方为合约时调用 IERC721Receiver.onERC721Received// 确保合约能接收 NFT，否则回退。目的是避免将 nft 转入不支持ERC-721的合约地址中
// 将_tokenId 从_from地址转移到 _to 地址; 附加校验_to地址是否为合约地址; 附加额外数据datafunction safeTransferFrom(address _form, address _to, unint256 _tokeId, bytes data)external payable;// 将_tokenId 从_from地址转移到 _to 地址; 附加校验_to地址是否为合约地址;function safeTransferFrom(address _form, address _to, unint256 _tokeId)external payable;
3、实现一个简单的 ERC721协议
​NFTSolidity复制代码999123456789101112131415161718192021222324252627282930313233343536// SPDX-License-Identifier: MITpragma solidity ^0.8.0;
contract ERC721 {    // Events    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    string private _name;  // NFT名称    string private _symbol; // NFT简称/符号
    mapping(uint256 => address) private _owners;    // 存储每个NFT的拥有者    mapping(address => uint256) private _balances;  // 存储每个地址拥有的NFT数量
    // tokenId => approved address 单次授权: 针对特定代币的临时授权, 转移后应清除以避免重复使用    mapping(uint256 => address) private _tokenApprovals;     // owner => operator => approved  全局授权: 是账户级别的长期授权，适用于所有的 NFT, 清除会影响其他代币的操作权限    mapping(address => mapping(address => bool)) private _operatorApprovals; 
    uint256 private _totalSupply; // NFT总供应量

    constructor(string memory name_, string memory symbol_) {        _name = name_;        _symbol = symbol_;    }
    // 下面三个是可选方法    function name() public view returns (string memory) {        return _name;    }    function symbol() public view returns (string memory) {        return _symbol;    }    // 查询指定 NFT 的 token uri信息
OpenZeppelin第三方实现：[https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol)
4、应用场景：以NFT为例
●资产的核心是所有权（Ownership)，主要通过 ownerOf 和 balanceOf体现
●NFT交易的不是 tokenURI，而是所有权的转移，即 ownerOf(tokenId)返回地址的变化
●尽管不是强制要求，但实际项目中，绝大数的 NFT合约会实现 name、symbol和 tokenURI
     1、name和 symbol通常用于标识整个 NFT合集（Collection)
     2、tokenURI(tokenId) 则为每个 tokenId 提供唯一的元数据链接（通常指向链下图片、属性等信息）
●实际交易流程（以NFT市场为例）
     1、 用户首先调用 approve 授权给 nft市场合约（即Market的 CA)
     2、市场合约在完成交易撮合后，调用 transferFrom或safeTransferFrom将 NFT从卖家地址转移到买家
     3、改过程不涉及 tokenURI的变化，唯一变化的是 NFT的所有权地址
​若有收获，就点个赞吧