---
title: "Uniswap V 核心概念详解"
date: 2024-06-15
tags: ["语雀"]
source_kind: yuque
---

## 一、核心概念介绍

想象一下一个繁忙的火车站售票处。如果这个售票处总是有很多人排队买票或退票，并且每个人都能迅速买到或卖出他们想要的票而不会因为买卖行为导致票价发生很大变化，那么我们可以说这个售票处具有很高的"流动性"。

在金融市场中，"流动性"指的是资产能够快速被买卖而不显著影响其价格的能力。高流动性意味着你可以很容易地以接近市场价的价格买入或卖出资产，而不会引起市场价格大幅波动。

### 1.1 什么是流动性 (Liquidity)？

继续上面的例子，假设你是一个愿意将自己手中的火车票暂时借给售票处的人，以便于其他人可以随时从这里购买到票。作为回报，你会得到一部分由售票处收取的服务费。在这个场景下，就相当于一个"流动性提供者"(LP)。

### 1.2 谁是流动性提供者 (LP)？

在去中心化金融（DeFi）领域内，LP 是指那些向特定池子注入资金或其他形式资产的人，他们的目的是为了帮助其他用户更容易地进行交易，同时他们也可以从中赚取一定的交易费用作为报酬。

### 1.3 做市商 (Market Maker) 的演变

**传统做市商：**

以前，在火车站外总有一些专门倒卖车票的人（黄牛），他们会根据市场需求调整手头上票的价格，当很多人需要票时就提高售价；当需求减少时则降低售价。这些人就是传统的"做市商"，他们通过自己的专业知识和对市场的理解来设定买卖价格，从而为市场提供流动性。

**自动做市商 (AMM)：**

现在，想象有一个智能机器人代替了黄牛的角色。这个机器人使用复杂的算法而不是个人经验来决定每张票应该值多少钱。它不需要休息也不会受情绪影响，可以 24/7 不间断工作。更重要的是，任何人都可以通过向这个系统贡献资源（比如更多的票）成为"做市商"的一部分。这就是 AMM（如 Uniswap）的工作方式——利用智能合约和数学模型来自动管理资产交换过程中的价格发现机制，使得整个过程更加透明、高效且无需信任第三方机构。

通过这样的类比，希望能帮助你更好地理解这些金融术语背后的含义及其重要性。

## 二、工作机制

### 2.1 恒定乘积公式（x * y = k）

#### 数学原理

恒定乘积公式是 Uniswap V2 的核心算法，其数学表达式为：

```
x * y = k
```

**符号说明：**

- x：池子中 token0 的储备量（reserve0）
- y：池子中 token1 的储备量（reserve1）
- k：恒定乘积常数（在没有添加/移除流动性时保持不变）

#### 核心原理

**1. 初始状态**

```
池子：100 ETH + 200,000 USDT
k = 100 * 200,000 = 20,000,000
价格：1 ETH = 2,000 USDT
```

**2. 交易发生**

假设 Alice 想用 ETH 兑换 USDT：

- Alice 输入：10 ETH
- 池子新的 ETH 数量：x' = 100 + 10 = 110 ETH
- 根据 x * y = k，计算新的 USDT 数量：

```
y' = k / x' = 20,000,000 / 110 = 181,818.18 USDT
```

- Alice 获得的 USDT：

```
Δy = 200,000 - 181,818.18 = 18,181.82 USDT
```

**3. 实际价格**

```
实际成交价 = 18,181.82 / 10 = 1,818.18 USDT/ETH
```

> 注意：实际价格（1,818.18）低于初始价格（2,000），这就是**滑点**！

#### 价格曲线可视化

恒定乘积公式形成一条**双曲线**：

```
      y (USDT)
      ↑
400k  |●
      |  ●
200k  |    ●  ← 当前价格点
      |      ●●
100k  |         ●●●
      |             ●●●●●
   0  |___________________●●●●●●●→ x (ETH)
      0   50  100  150  200
```

曲线特点：
- 买入越多，价格越高（滑点越大）
- 卖出越多，价格越低（滑点越大）
- 永远不会耗尽某一种代币（渐近线）

#### 价格发现机制

**1. 即时价格（Spot Price）**

在任意时刻，池子的即时价格为：

```
Price = y / x = reserve1 / reserve0
```

**2. 边际价格（Marginal Price）**

实际交易时的价格会随着交易量变化：

```solidity
// 不考虑手续费的输出量计算
function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut)
    public pure returns (uint amountOut)
{
    uint amountInWithFee = amountIn * 997;  // 扣除 0.3% 手续费
    uint numerator = amountInWithFee * reserveOut;
    uint denominator = reserveIn * 1000 + amountInWithFee;
    amountOut = numerator / denominator;
}
```

**公式推导：**

```
已知：(x + Δx) * (y - Δy) = x * y = k
求解：Δy = ?
展开：x*y - x*Δy + y*Δx - Δx*Δy = x*y
简化：y*Δx = x*Δy + Δx*Δy
      y*Δx ≈ x*Δy (忽略二阶小量)
      Δy = y*Δx / x
加入手续费（0.3%）：
      Δy = y * (Δx * 0.997) / (x + Δx * 0.997)
```

**3. 套利机制驱动价格平衡**

当 Uniswap 价格偏离外部市场时，套利者会介入：

**场景：** 外部市场 1 ETH = 2,100 USDT，Uniswap 价格 = 2,000 USDT

套利步骤：
1. 在 Uniswap 用 USDT 买入 ETH（2,000 USDT/ETH）
2. 在外部交易所卖出 ETH（2,100 USDT/ETH）
3. 赚取差价：100 USDT/ETH

结果：
- Uniswap 池子中 ETH 减少，USDT 增加
- 价格上涨，逐渐接近 2,100 USDT/ETH
- 套利空间消失，价格达到平衡

**价格平衡公式：**

```
Uniswap 价格 ≈ 外部市场价格 ± 手续费成本
```

#### 实际计算示例

**初始状态：**

```
池子：100 ETH + 200,000 USDT
k = 20,000,000
```

**交易 1：Alice 用 10 ETH 换 USDT**

```
输入：10 ETH
扣除手续费：10 * 0.997 = 9.97 ETH
计算输出：
Δy = 200,000 * 9.97 / (100 + 9.97)
   = 1,994,000 / 109.97
   = 18,132.88 USDT
新状态：
- 池子：110 ETH + 181,867.12 USDT
- 新价格：181,867.12 / 110 = 1,653.34 USDT/ETH
- 滑点：(2,000 - 1,813.29) / 2,000 = 9.33%
```

**交易 2：Bob 用 5,000 USDT 换 ETH**

```
输入：5,000 USDT
扣除手续费：5,000 * 0.997 = 4,985 USDT
计算输出：
Δx = 110 * 4,985 / (181,867.12 + 4,985)
   = 548,350 / 186,852.12
   = 2.934 ETH
新状态：
- 池子：107.066 ETH + 186,867.12 USDT
- 新价格：186,867.12 / 107.066 = 1,745.36 USDT/ETH
```

#### 手续费对 K 值的影响

虽然叫"恒定"乘积，但 K 值实际上会因为手续费而**缓慢增长**：

```
交易前：k = 100 * 200,000 = 20,000,000
交易后：k = 110 * 181,867.12 = 20,005,383.2
增长：0.027%（这就是 0.3% 手续费的一部分）
```

K 值增长 = LP 收益增长

### 2.2 LP Token 的作用

#### 什么是 LP Token？

LP Token（Liquidity Provider Token）是一种 ERC-20 代币，代表流动性提供者在池子中的份额凭证。

**类比理解：**

```
LP Token = 银行存款凭证
流动性池 = 银行金库
赎回流动性 = 凭存款凭证取款
```

#### 代表池子份额

**1. 份额计算公式**

首次添加流动性：

```solidity
liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY
```

后续添加流动性：

```solidity
liquidity = min(
    amount0 * totalSupply / reserve0,
    amount1 * totalSupply / reserve1
)
```

**2. 实际案例**

**场景 1：Alice 首次创建池子**

```
投入：10 ETH + 20,000 USDT
计算：
  liquidity = sqrt(10 * 20,000) - 1000
            = sqrt(200,000) - 1000
            = 447.21 - 1000  // 注意：实际是 447.21 * 10^3
            = 14,142 LP Token
结果：
- Alice 获得：14,142 LP Token
- 销毁到零地址：1,000 LP Token（防止除零攻击）
- 总供应量：15,142 LP Token
- Alice 份额：14,142 / 15,142 = 93.4%
```

**场景 2：Bob 添加流动性**

```
当前池子：10 ETH + 20,000 USDT
LP Token 总量：15,142
Bob 投入：5 ETH + 10,000 USDT
计算：
  按 ETH：5 * 15,142 / 10 = 7,571 LP
  按 USDT：10,000 * 15,142 / 20,000 = 7,571 LP
  取最小值：7,571 LP
结果：
- Bob 获得：7,571 LP Token
- 新总供应量：22,713 LP Token
- Bob 份额：7,571 / 22,713 = 33.33%
- Alice 份额：14,142 / 22,713 = 62.26%
```

**3. 份额价值计算**

每个 LP Token 的价值：

```
LP Token 价值 = (reserve0 + reserve1 的总价值) / totalSupply
```

示例：

```
池子：15 ETH + 30,000 USDT
LP Token 总量：22,713
ETH 价格：2,000 USDT
总价值 = 15 * 2,000 + 30,000 = 60,000 USDT
每个 LP Token 价值 = 60,000 / 22,713 = 2.64 USDT
```

#### 可赎回性

LP 可以随时销毁 LP Token 来赎回对应份额的资产：

**1. 赎回机制**

```solidity
function burn(address to) external lock returns (uint amount0, uint amount1) {
    uint liquidity = balanceOf[address(this)];
    uint _totalSupply = totalSupply;

    // 按比例计算可赎回的代币数量
    amount0 = liquidity * balance0 / _totalSupply;
    amount1 = liquidity * balance1 / _totalSupply;

    // 销毁 LP Token
    _burn(address(this), liquidity);

    // 转账给用户
    _safeTransfer(token0, to, amount0);
    _safeTransfer(token1, to, amount1);

    _update(balance0 - amount0, balance1 - amount1);
}
```

**2. 赎回计算示例**

初始状态：

```
池子：15 ETH + 30,000 USDT
LP Token 总量：22,713
Bob 持有：7,571 LP Token（33.33%）
```

Bob 赎回全部 LP Token：

```
可赎回 ETH = 15 * 7,571 / 22,713 = 5 ETH
可赎回 USDT = 30,000 * 7,571 / 22,713 = 10,000 USDT
结果：
- Bob 获得：5 ETH + 10,000 USDT
- 销毁：7,571 LP Token
- 新池子：10 ETH + 20,000 USDT
- 新总量：15,142 LP Token
```

**3. 手续费收益体现**

LP Token 的价值会随着交易手续费累积而增长：

```
时间线：
T0 - Bob 添加流动性：
  投入：5 ETH + 10,000 USDT
  获得：7,571 LP Token
  每个 LP 价值：2.64 USDT

T1 - 经过 100 笔交易后：
  池子累积手续费：0.5 ETH + 1,000 USDT
  新池子：15.5 ETH + 31,000 USDT
  总价值：15.5 * 2,000 + 31,000 = 62,000 USDT
  每个 LP 价值：62,000 / 22,713 = 2.73 USDT
  增长：3.4%

T2 - Bob 赎回：
  可赎回：5.167 ETH + 10,333 USDT
  收益：0.167 ETH + 333 USDT ≈ 667 USDT
```

#### LP Token 的特性

**1. ERC-20 标准**

LP Token 完全符合 ERC-20 标准，可以：
- 转账给其他地址
- 在其他 DeFi 协议中使用（如质押挖矿）
- 在二级市场交易
- 作为抵押品借贷

```solidity
// LP Token 继承 ERC-20
contract UniswapV2Pair is ERC20 {
    function transfer(address to, uint value) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}
```

**2. 可组合性**

LP Token 可以在 DeFi 生态中自由组合：

**场景：流动性挖矿**
1. Alice 在 Uniswap 添加 ETH-USDT 流动性
2. 获得 UNI-V2 LP Token
3. 将 LP Token 质押到 Sushiswap
4. 获得 SUSHI 奖励
5. 同时继续赚取 Uniswap 交易手续费

双重收益！

**3. 安全机制**

最小流动性锁定（MINIMUM_LIQUIDITY）：

```solidity
uint public constant MINIMUM_LIQUIDITY = 10**3;
// 首次添加流动性时
liquidity = sqrt(amount0 * amount1);
_mint(address(0), MINIMUM_LIQUIDITY);  // 永久锁定 1000 LP
_mint(to, liquidity - MINIMUM_LIQUIDITY);
```

作用：
- 防止除零攻击
- 确保池子永远不会完全清空
- 提高首次添加流动性的成本（防止恶意创建大量空池子）

#### LP Token 价值变化图

```
LP Token 价值
    ↑
2.80|              ●●●●  ← 手续费累积
2.70|          ●●●●
2.64|      ●●●●  ← 初始价值
2.60|  ●●●●
2.50|●●
    |_________________________→ 时间
     T0  T1  T2  T3  T4  T5
```

影响因素：
- 交易手续费累积（正向）
- 无常损失（可能负向）

#### 总结对比表

| 特性 | 传统股票 | LP Token |
|------|----------|----------|
| 代表权益 | 公司所有权 | 池子份额 |
| 收益来源 | 分红 + 股价上涨 | 手续费 + 价格变化 |
| 可转让性 | 可交易 | 可交易 |
| 赎回机制 | 不能直接赎回 | 随时赎回 |
| 价值计算 | 市场定价 | 公式计算 |
| 风险 | 公司经营风险 | 无常损失 + 智能合约风险 |

## 三、无常损失

### 3.1 无常损失是什么

无常损失是指：向流动性池提供资产后，如果代币价格发生变化，相比于单纯持有这些代币产生的潜在损失。

**为什么叫"无常"？**
- 价格回归初始水平时，损失会消失
- 只有赎回时才真正实现损失

### 3.2 直观案例

初始状态：

```
Alice 持有：1 ETH + 2,000 USDT
ETH 价格：2,000 USDT
总价值：4,000 USDT
```

**ETH 价格涨到 4,000 USDT 后，策略交易机器人会交易到市场水平：**

```
🏦 单纯持有：1 ETH + 2,000 USDT = 6,000 USDT
🏊 提供流动性：0.707 ETH + 2,828 USDT = 5,657 USDT
📉 无常损失：-343 USDT (-5.7%)
```

**ETH 价格下跌到 500 USDT 后，策略交易机器人会交易到市场水平：**

```
🏦 单纯持有：1 ETH + 2,000 USDT = 2,500 USDT
🏊 提供流动性：2 ETH + 1000 USDT = 2000 USDT
📉 无常损失：-500 USDT (-20%)
```

### 3.3 损失公式与数据

```
无常损失 = 2√(价格比率) / (1 + 价格比率) - 1
```

不同价格变化的损失：

| 价格变化 | 无常损失 |
|----------|----------|
| 1.25x | -0.6% |
| 1.5x | -2.0% |
| 2x | -5.7% |
| 3x | -13.4% |
| 5x | -25.5% |

- 价格变化越大，损失越大
- 上涨和下跌的损失是对称的（2x 和 0.5x 损失相同）

**无常损失的根本原因：**

ETH 涨价 → 套利者用 USDT 买走便宜的 ETH → 池子中 ETH 减少，USDT 增加 → LP 被迫"低卖高买" → 产生无常损失

无常损失是 AMM 的固有特性，但通过选择合适的池子和策略，手续费收入通常能够弥补甚至超过损失。
