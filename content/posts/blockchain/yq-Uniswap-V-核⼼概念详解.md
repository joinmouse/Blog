---
title: "Uniswap V 核⼼概念详解"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

想象⼀下⼀个繁忙的⽕⻋站售票处。如果这个售票处总是有很多⼈排队买票或退票，并且每个⼈都能迅
速买到或卖出他们想要的票⽽不会因为买卖⾏为导致票价发⽣很⼤变化，那么我们可以说这个售票处具
有很⾼的“ 流动性”。
在⾦融市场中，“ 流动性”指的是资产能够快速被买卖⽽不显著影响其价格的能⼒。⾼流动性意味着你可
以很容易地以接近市场价的价格买⼊或卖出资产，⽽不会引起市场价格⼤幅波动 。
继续上⾯的例⼦，假设你是⼀个愿意将⾃⼰⼿中的⽕⻋票暂时借给售票处的⼈，以便于其他⼈可以随时
从这⾥购买到票。作为回报，你会得到⼀部分由售票处收取的服务费。在这个场景下，就相当于⼀个“流
动性提供者” (LP）。在去中⼼化⾦融（D eFi）领域内，L P是指那些向特定池⼦注⼊资⾦或其他形式 资产
的⼈，他们的⽬的是为了帮助其他⽤户更容易地进⾏交易，同时他们也可以从中赚取⼀定的交易费⽤作
为报酬。
传统做市商：
以前，在⽕⻋站外总有⼀些专⻔倒卖⻋票的⼈（⻩⽜），他们会根据市场需求调整⼿头上票的
价格，当很多⼈需要票时就提⾼售价；当需求减少时则降低售价。这些⼈就是传统的“做市
商”，他们通过⾃⼰的专业知识和对市场的理解来设定买卖价格，从⽽为市场提供流动性。
⾃动做市商( AMM)：
 现在，想象有⼀个智能机器⼈代替了⻩⽜的⻆⾊。这个机器⼈使⽤复杂的算法⽽不是个⼈经验
来决定每张票应该值多少钱。它不需要休息也不会受情绪影响，可以24/7不间断⼯作。更重要
的是，任何⼈都可以通过向这个系统贡献资源（⽐如更多的票）成为“做市商”的⼀部分。这就
是AMM（如U niswap）的⼯作⽅式——利⽤智能合约和数学模型来⾃动管理资产交换过程中的
价格发现机制，使得整个过程更加透明、⾼效且⽆需信任第三⽅机构。
通过这样的类⽐，希望能帮助你更好地理解这些⾦融术语背后的含义及其重要性。⼀、核⼼概念介绍
1.1 什么是流动性 (Liquidity)？
1.2 谁是流动性提供者 (LP)？
1.3 做市商( Market Maker) 的演变
●
○
●
○

4恒定乘积公式是 Uniswap V2 的核⼼算 法，其数学表达式为：
符号说明：
x ：池⼦中 token0 的储备量（r eserve0）
y ：池⼦中 token1 的储备量（r eserve1）
k ：恒定乘积常数（在没有添加/移除流动性时保持不变）
1. 初始状态
2. 交易发⽣
假设 Alice 想⽤ ETH 兑换 USDT：
Alice 输⼊：10 ETH
池⼦新的 ETH 数量： x' = 100 + 10 = 110 ETH  
根据 x * y = k  ，计算新的 USDT 数量：
Alice 获得的 USDT：⼆、⼯作机制
2.1 恒定乘积公式（x  * y = k）
📐 数学原理
●
●
●
💡 核⼼原理
●
●
●
●x * y = k1
池⼦：100 ETH + 200,000 USDT
k = 100 * 200,000 = 20,000,000
价格：1 ETH = 2,000 USDT1
3
y' = k / x' = 20,000,000 / 110 = 181,818.18 USDT1
Δy = 200,000 - 181,818.18 = 18,181.82 USDT1

53. 实际价格
注意：实际价格（1, 818.18）低于初始价 格（2, 000），这就是 滑点！
恒定乘积公式形成⼀条 双曲线：
曲线特点：
📈 买⼊越多，价格越⾼（滑点越⼤）
📉 卖出越多，价格越低（滑点越⼤）
🔄 永远不会耗尽某⼀种代币（渐近线）
在任意时刻，池⼦的即时价格为：
示例：📊 价格曲线可视化
●
●
●
🎯 价格发现机制
1. 即时价格（Spot  Price）实际成交价  = 18,181.82 / 10 = 1,818.18 USDT/ETH 1
      y (USDT)
      ↑
400k  |●
      |  ●
200k  |    ●  ← 当前价格点
      |      ●●
100k  |         ●●●
      |             ●●●●●
   0  |___________________●●●●●●●→ x (ETH)
      0   50  100  150  2001
3
5
7
9
Price = y / x = reserve1 / reserve01

6实际交易时的价格会随着交易量变化：
公式推导：
当 Uniswap 价格偏离外部市场时，套利 者会介⼊：
场景：外部市场 1 ETH = 2,100 USDT，Uniswap 价格 = 2,000 USDT2. 边际价格（Ma rginal Price）
3. 套利机制驱动价格平衡池⼦：100 ETH + 200,000 USDT
即时价格 = 200,000 / 100 = 2,000 USDT/ETH1
// 不考虑⼿续费的输出量计算
function  getAmountOut (uint amountIn , uint reserveIn , uint reserveOut ) 
    public pure returns (uint amountOut ) 
{
    uint amountInWithFee  = amountIn  * 997;  // 扣除 0.3% ⼿续费
    uint numerator  = amountInWithFee  * reserveOut ;
    uint denominator  = reserveIn  * 1000 + amountInWithFee ;
    amountOut  = numerator  / denominator ;
}1
3
5
7
9
已知：(x + Δx) * (y - Δy) = x * y = k
求解：Δy = ?
展开：x*y - x*Δy + y*Δx - Δx*Δy = x*y
简化：y*Δx = x*Δy + Δx*Δy
      y*Δx ≈ x*Δy  ( 忽略⼆阶⼩量 )
      Δy = y*Δx / x
加⼊⼿续费（ 0.3% ）：
      Δy = y * (Δx * 0.997) / (x + Δx * 0.997)1
3
5
7
9

7价格平衡公式：
初始状态：
交易 1：Alice ⽤ 10 ETH 换 USDT
交易 2：Bob ⽤ 5,000 USDT 换 ETH🧮 实际计算示例套利步骤：
1. 在 Uniswap ⽤  USDT 买⼊  ETH （ 2,000 USDT/ETH ）
2. 在外部交易所卖出  ETH （ 2,100 USDT/ETH ）
3. 赚取差价： 100 USDT/ETH
结果：
- Uniswap 池⼦中  ETH 减少， USDT 增加
- 价格上涨，逐渐接近  2,100 USDT/ETH
- 套利空间消失，价格达到平衡1
3
5
7
9
Uniswap 价格  ≈ 外部市场价格  ± ⼿续费成本 1
池⼦：100 ETH + 200,000 USDT
k = 20,000,0001
输⼊：10 ETH
扣除⼿续费： 10 * 0.997 = 9.97 ETH
计算输出：
Δy = 200,000 * 9.97 / (100 + 9.97)
   = 1,994,000 / 109.97
   = 18,132.88 USDT
新状态：
- 池⼦：110 ETH + 181,867.12 USDT
- 新价格： 181,867.12 / 110 = 1,653.34 USDT/ETH
- 滑点：(2,000 - 1,813.29) / 2,000 = 9.33%1
3
5
7
9
11

8虽然叫"恒定"乘积，但 K  值实际上会因 为⼿续费⽽ 缓慢增⻓ ：
K 值增⻓ = LP 收益增⻓
LP Token（Liquidity Provider Token）是⼀种 ERC-20 代币，代表流动性提供者在池⼦中的份额凭
证。
类⽐理解：⚠ ⼿续费对 K 值的影响
2.2 LP Token 的作⽤
🎫 什么是 LP Token？输⼊：5,000 USDT
扣除⼿续费： 5,000 * 0.997 = 4,985 USDT
计算输出：
Δx = 110 * 4,985 / (181,867.12 + 4,985)
   = 548,350 / 186,852.12
   = 2.934 ETH
新状态：
- 池⼦：107.066 ETH + 186,867.12 USDT
- 新价格： 186,867.12 / 107.066 = 1,745.36 USDT/ETH1
3
5
7
9
11
交易前：k = 100 * 200,000 = 20,000,000
交易后：k = 110 * 181,867.12 = 20,005,383.2
增⻓：0.027% （这就是  0.3% ⼿续费的⼀部分）1
3
LP Token = 银⾏存款凭证
流动性池 = 银⾏⾦库
赎回流动性  = 凭存款凭证取款1
3

9⾸次添加流动性：
后续添加流动性：
场景 1：Alice ⾸次创建池⼦
场景 2：Bob 添加流动性📊 代表池⼦份额
1. 份额计算公式
2. 实际案例liquidity  = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY 1
liquidity  = min(
    amount0 * totalSupply  / reserve0 ,
    amount1 * totalSupply  / reserve1
)1
3
投⼊：10 ETH + 20,000 USDT
计算：
  liquidity = sqrt(10 * 20,000) - 1000
            = sqrt(200,000) - 1000
            = 447.21 - 1000  // 注意：实际是  447.21 * 10^3
            = 14,142 LP Token
结果：
- Alice 获得： 14,142 LP Token
- 销毁到零地址： 1,000 LP Token （防⽌除零攻击）
- 总供应量： 15,142 LP Token
- Alice 份额： 14,142 / 15,142 = 93.4%1
3
5
7
9
11

10每个 LP Token 的价值：
示例：
LP 可以随时销毁 LP Token 来赎回对应份额的资产：3. 份额价值计算
💰 可赎回性
1. 赎回机制当前池⼦： 10 ETH + 20,000 USDT
LP Token 总量： 15,142
Bob 投⼊： 5 ETH + 10,000 USDT
计算：
  按 ETH：5 * 15,142 / 10 = 7,571 LP
  按 USDT ： 10,000 * 15,142 / 20,000 = 7,571 LP
  取最⼩值： 7,571 LP
结果：
- Bob 获得： 7,571 LP Token
- 新总供应量： 22,713 LP Token
- Bob 份额： 7,571 / 22,713 = 33.33%
- Alice 份额： 14,142 / 22,713 = 62.26%1
3
5
7
9
11
13
15
LP Token 价值  = (reserve0 + reserve1 的总价值 ) / totalSupply 1
池⼦：15 ETH + 30,000 USDT
LP Token 总量： 22,713
ETH 价格： 2,000 USDT
总价值 = 15 * 2,000 + 30,000 = 60,000 USDT
每个 LP Token 价值  = 60,000 / 22,713 = 2.64 USDT1
3
5

11初始状态：
Bob 赎回全部 LP Token：2. 赎回计算示例
3. ⼿续费收益体现function  burn(address to) external  lock returns (uint amount0, uint amount
1) {
    uint liquidity  = balanceOf [address(this)];
    uint _totalSupply  = totalSupply ;
    
    // 按⽐例计算可赎回的代币数量
    amount0 = liquidity  * balance0  / _totalSupply ;
    amount1 = liquidity  * balance1  / _totalSupply ;
    
    // 销毁 LP Token
    _burn(address(this), liquidity );
    
    // 转账给⽤户
    _safeTransfer (token0, to, amount0);
    _safeTransfer (token1, to, amount1);
    
    _update(balance0  - amount0, balance1  - amount1);
}1
3
5
7
9
11
13
15
17
池⼦：15 ETH + 30,000 USDT
LP Token 总量： 22,713
Bob 持有： 7,571 LP Token （ 33.33% ）1
3
可赎回 ETH = 15 * 7,571 / 22,713 = 5 ETH
可赎回 USDT = 30,000 * 7,571 / 22,713 = 10,000 USDT
结果：
- Bob 获得： 5 ETH + 10,000 USDT
- 销毁：7,571 LP Token
- 新池⼦： 10 ETH + 20,000 USDT
- 新总量： 15,142 LP Token1
3
5
7

12LP Token 的价值会随着交易⼿续费累积⽽增⻓：
时间线：
LP Token 完全符合 ERC-20 标准，可 以：
✅ 转账给其他地址
✅ 在其他 DeFi 协议中使⽤（如质押挖矿 ）
✅ 在⼆级市场交易
✅ 作为抵押品借贷🔐 LP Token 的特性
1. ERC-20 标准
●
●
●
●T0 - Bob 添加流动性：
  投⼊：5 ETH + 10,000 USDT
  获得：7,571 LP Token
  每个 LP 价值： 2.64 USDT
T1 - 经过  100 笔交易后：
  池⼦累积⼿续费： 0.5 ETH + 1,000 USDT
  新池⼦：15.5 ETH + 31,000 USDT
  总价值：15.5 * 2,000 + 31,000 = 62,000 USDT
  每个 LP 价值： 62,000 / 22,713 = 2.73 USDT
  增⻓：3.4%
T2 - Bob 赎回：
  可赎回：5.167 ETH + 10,333 USDT
  收益：0.167 ETH + 333 USDT ≈ 667 USDT1
3
5
7
9
11
13
15
// LP Token 继承  ERC-20
contract  UniswapV2Pair  is ERC20 {
    function  transfer (address to, uint value) external  returns (bool);
    function  approve(address spender, uint value) external  returns (bool);
    function  transferFrom (address from, address to, uint value) external  re
turns (bool);
}1
3
5

13LP Token 可以在 DeFi ⽣态中⾃由组合 ：
最⼩流动性锁定（MINIMUM_L IQUIDITY）：
作⽤：
🛡 防⽌除零攻击
🛡 确保池⼦永远不会完全清空
🛡 提⾼⾸次添加流动性的成本（防⽌恶意创建⼤量空池⼦）2. 可组合性
3. 安全机制
●
●
●
📈 LP Token 价值变化图场景：流动性挖矿
1. Alice 在  Uniswap 添加  ETH-USDT 流动性
2. 获得 UNI-V2 LP Token
3. 将 LP Token 质押到  Sushiswap
4. 获得 SUSHI 奖励
5. 同时继续赚取  Uniswap 交易⼿续费
双重收益！1
3
5
7
uint public constant  MINIMUM_LIQUIDITY  = 10**3;
// ⾸次添加流动性时
liquidity  = sqrt(amount0 * amount1);
_mint(address(0), MINIMUM_LIQUIDITY );  // 永久锁定  1000 LP
_mint(to, liquidity  - MINIMUM_LIQUIDITY );1
3
5

14⽆常损失 是指：向流动性池提供资产后，如果代币价格发⽣变化，相⽐于单纯持有这些代币产⽣的 潜在
损失。🎯 总结对⽐表
三、⽆常损失
3.1、⽆常损失是什么
🤔 为什么叫"⽆常"？LP Token 价值
    ↑
2.80|              ●●●●  ← ⼿续费累积
2.70|          ●●●●
2.64|      ●●●●  ← 初始价值
2.60|  ●●●●
2.50|●●
    |_________________________→ 时间
     T0  T1  T2  T3  T4  T5
影响因素：
✅ 交易⼿续费累积（正向）
⚠  ⽆常损失（可能负向）1
3
5
7
9
11
13
特性 传统股票 LP Token
代表权益 公司所有权 池⼦份额
收益来源 分红 + 股价上涨 ⼿续费 + 价格变化
可转让性 ✅ 可交易 ✅ 可交易
赎回机制 ❌ 不能直接赎回 ✅ 随时赎回
价值计算 市场定价 公式计算
⻛险 公司经营⻛险 ⽆常损失 + 智能合约⻛险

15✅ 价格回归初始⽔平时，损失会消失
⚠ 只有赎回时才真正实现损失
🏦 单纯持有： 1 ETH + 2,000 USDT = 6,000 USDT
🏊 提供流动性：0. 707 ETH + 2,828 USDT = 5,657 USDT
📉 ⽆常损失:   -343 USDT (-5.7%)
🏦 单纯持有： 1 ETH + 2,000 USDT = 2,500 USDT
🏊 提供流动性：2 ETH + 1000 USDT = 2000 USDT
📉 ⽆常损失:   -500 USDT (-20%)
📐 ⽆常损失 = 2√(价格⽐率)  / (1 + 价格⽐率) - 1
不同价格变化的损失3.2、直观案例
💡 ETH 价格涨到 4,000 USDT 后，策略交易机器⼈ 🤖会交易到市场⽔平
💡 ETH价格下跌到 500 USDT后，策略交易机器⼈ 🤖会交易到市场⽔平
3.3、损失公式与数据Alice 持有： 1 ETH + 2,000 USDT
ETH 价格： 2,000 USDT
总价值：4,000 USDT1
3
Plain Text
价格变化 ⽆常损失

16📊 价格变化越⼤，损失越⼤
⚖ 上涨和下跌的损失是对称的（2x 和 0. 5x 损失相同）
ETH 涨价 → 套利者⽤ USDT 买⾛便宜 的 ETH 
→ 池⼦中 ETH 减少，U SDT 增加
→ LP 被迫"低卖⾼买"
→ 产⽣⽆常损失
⽆常损失是 AMM 的固有特性，但通过选择合适的池⼦和策略，⼿续费收⼊通 常能够弥补甚⾄超过损
失。1.25x -0.6%
1.5x -2.0%
2x -5.7%
3x -13.4%
5x -25.5%

17