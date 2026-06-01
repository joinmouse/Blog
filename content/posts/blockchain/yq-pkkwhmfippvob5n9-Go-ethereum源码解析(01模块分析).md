---
title: "Go-ethereum源码解析(01模块分析)"
date: 2026-06-01
slug_yuque: pkkwhmfippvob5n9
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/pkkwhmfippvob5n9"
source_kind: yuque
---

返回文档go ethereum 是最被广泛使用的以太坊客户端， 所以后续的源码分析都从  [https://github.com/ethereum/go-ethereum](https://github.com/ethereum/go-ethereum) 的这份代码进行分析

重要模块功能索引
67%​  以太坊重要的数据结构Package trie implements Merkle Patricia Tries.trie​​实现一个高等级的以太坊账户管理accounts​ 以太坊序列化处理​rlp​编译和构建的一些脚本和配置build​以太坊p2p网络协议p2p​​ 以太坊的多种类型的节点node​​提供了一些公共的工具​utilsabigen​ 合约定义转换为Go包的源代码生成器提供了一个RLP数据的格式化输出​
rlpdump​​以太坊虚拟机开发工具，提供可配置的调试环境​evm​以太坊命令行客户端，最重要的一个工具​gethcmd​ 提供以太坊的区块创建和挖矿miner​提供磁盘计数器​metrics​ 提供了一些公共的工具类​common​日志log​提供了以太坊的一些共识算法，比如ethhash, clique(proof-of-authority)consensus​​处理实时的事件event​以太坊的核心数据结构和算法(虚拟机，状态，区块链，布隆过滤器)core​​ 提供网络状态的报告ethstats​加密和hash算法​crypto​​eth的数据库(包括实际使用的leveldb和供测试使用的内存数据库)ethdb​​ 实现了以太坊的协议eth​提供了以太坊的RPC客户端ethclient​go-ethereumgo-ethereumaccounts​实现一个高等级的以太坊账户管理build​编译和构建的一些脚本和配置cmdabigen​ 合约定义转换为Go包的源代码生成器​evm​以太坊虚拟机开发工具，提供可配置的调试环境​geth​以太坊命令行客户端，最重要的一个工具rlpdump​提供了一个RLP数据的格式化输出​
​utils​提供了一些公共的工具​common​ 提供了一些公共的工具类consensus​提供了以太坊的一些共识算法，比如ethhash, clique(proof-of-authority)core​以太坊的核心数据结构和算法(虚拟机，状态，区块链，布隆过滤器)crypto​加密和hash算法​eth​​ 实现了以太坊的协议ethclient​提供了以太坊的RPC客户端ethdb​​eth的数据库(包括实际使用的leveldb和供测试使用的内存数据库)ethstats​​ 提供网络状态的报告event​​处理实时的事件log​​日志​metrics​提供磁盘计数器miner​ 提供以太坊的区块创建和挖矿node​​ 以太坊的多种类型的节点p2p​​以太坊p2p网络协议​rlp​ 以太坊序列化处理trie​​  以太坊重要的数据结构Package trie implements Merkle Patricia Tries.
                
​若有收获，就点个赞吧