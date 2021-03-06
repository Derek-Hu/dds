
```js
Funding Balance 下单
// 入参：
export interface IRecord {
    amount: number;
    type: 'long' | 'short';
    referal: string;
    coin: 'DAI' | 'USDT' | 'USDC'
}


// Funding Balance Query
// 入参：
export interface IRecord {
  balance: number;
  locked: number
}

// Funding Balance Deposit
// 入参：
export interface IRecord {
  coin: 'DAI' | 'USDT' | 'USDC'
  amount: number;
}

// Funding Balance Withdraw
// 入参：
export interface IRecord {
  coin: 'DAI' | 'USDT' | 'USDC'
  amount: number;
}

// Orders: 分页支持 
// 入参：page, pageSize
export interface IRecord {
  id: string;
  time: number;
  type: string;
  price: number;
  amount: number;
  cost: number;
  costCoin: string;
  fee: number;
  pl: {
    val: number;
    percentage: number;
  };
  status: IStatus;
}

// Liquidity Pool, 
// 入参 coin: DAI/USDC/USDT
// 出参
export interface IPoolInfo{
    public: {
        value: number;
        total: number;
    },
    private: {
        value: number;
        total: number;
    }
}

// Trade Page Info, 
// 入参 coin: DAI/USDC/USDT
// 出参 Array<IInfo>
export interface IInfo{
    label: string;
    value: string;
}

// 行情图数据
// 入参
export interface IIN{
    duration: 'day' | 'week' | 'month';
}
export interface IOutput{
    price: number;
    percentage: number;
    range: number;
    data: Array<{
        value: number;
        timestamp: number;
    }>
}

// LIQUIDITY POOL COLLABORATIVE - ARP
// 出参
export interface IOutput{
    percentage: number;
}

// LIQUIDITY POOL COLLABORATIVE - Deposit
// 入参
export interface IIn{
    amount: number;
    coin: 'DAI' | 'USDT' | 'USDC'
    pool: 'public' | 'private';
}

// LIQUIDITY POOL COLLABORATIVE - 计算reDAI
// 入参
export interface IIn{
    amount: number;
    coin: 'DAI' | 'USDT' | 'USDC'
}

// LIQUIDITY POOL COLLABORATIVE - 已登录 Your Share In The Pool & Liquidity Balance
// 出参 Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
    total: number;
}

// LIQUIDITY POOL COLLABORATIVE - 已登录 Net P&L
// 出参 Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
}

// LIQUIDITY POOL COLLABORATIVE - Liquidity Withdraw
// 入参 Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
    pool: 'public' | 'private';
}

// LIQUIDITY POOL COLLABORATIVE - 未登录 Liquidity Provided
// 入参 Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
}

// LIQUIDITY POOL COLLABORATIVE - Liquidity reDai 2 Dai计算
// 入参 Array<IOutput>
export interface IIn{
    coin: 'DAI' | 'USDT' | 'USDC',
    isReCoin: boolean; // true: reDai-> Dai
    amount: number;
}
// 出参
export interface IOutput{
    amount: number;
}


// LIQUIDITY POOL COLLABORATIVE - Liquidity Balance Record
// 入参 page, pageSize, coin
// 出参 Array<IOutput> 
export interface IOutput{
    time: 'DAI' | 'USDT' | 'USDC'
    type: 'widthdraw' | 'deposit'
    amount: number;
    balance: number;
    pool: 'public' | 'private';
}


// LIQUIDITY POOL Private - Available Liquidity & Liquidity Balance
// 出参 Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
    total: number;
    public: boolean; // true 未登录，false 个人账户
}

// LIQUIDITY POOL Private - 未登录，公共Liquidity Provided
// 出参 Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
}

// LIQUIDITY POOL Private - Net P&L
// 出参 Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
    percentage: number; // -90, +11.2
}

// LIQUIDITY POOL Private - LIQUIDITY LOCKED DETAIL 查询
// 入参 page, pageSize
// 出参 Array<IOutput>
export interface IOutput{
    id: string;
    time: number;
    amount: number;
    locked: number;
    coin: 'DAI' | 'USDT' | 'USDC'
    fee: number;
    status: string;
}

// LIQUIDITY POOL Private - LIQUIDITY LOCKED DETAIL 补仓
// 出参 Array<IOutput>
export interface IOutput{
    id: string;
    amount: number;
    coin: 'DAI' | 'USDT' | 'USDC'
}


// MINING - LIQUIDITY： Your Liquidity Mining Reward
export interface IOutput{
    amount: number;
    public: boolean; // true 未登录，false 个人账户
}

// MINING - LIQUIDITY： 已登录  Claim 触发
export interface IOutput{
    type: 'LIQUIDITY' | 'LIQUIDITY LOCKED'
}

// MINING - LIQUIDITY：已登录  Your reToken Balance
// 出参 Array<IOutput>
export interface IOutput{
    amount: number;
    coin: 'reDAI' | 'reUSDT' | 'reUSDC'
}

// MINING - LIQUIDITY： 已登录  Your Liauidity Mining Share
// 出参 Array<IOutput>
export interface IOutput{
    amount: number;
    coin: 'DAI' | 'USDT' | 'USDC'
    total: number;
}

// MINING - LIQUIDITY LOCKED - Your Liquidity Locked Rewards
// 出参 Array<IOutput>
export interface IOutput{
    amount: number;
    public: boolean; // true 未登录，false 个人账户
}

// MINING - LIQUIDITY LOCKED -已登录  Reward Record
// 出参 Array<IOutput>
export interface IOutput{
    amount: number;
    time: number;
    price: number;
    reward: number;
}

// MINING - LIQUIDITOR - Reward Record
// 出参 Array<IOutput>
export interface IOutput{
    campaign: number;
    compensate: number;
    public: boolean; // true 未登录，false 个人账户
}

// MINING - LIQUIDITOR -未登录 Ranking
// 出参 Array<String> 3个排名
export interface IOutput{
    top: Array<string>
    current: number;
}

// MINING - LIQUIDITOR -System Fund Balance
// 出参 Array<IOutput>
export interface IOutput{
    amount: number;
    coin: 'DAI' | 'USDT' | 'USDC'
}

// SWAP & BURN
// 出参 
export interface IOutput{
    usd: number;
    dds: number;
    rate: number;
}

// SWAP & BURN 兑换
// 出参 
export interface IOutput{
    dds: number;
    coin: 'DAI' | 'USDT' | 'USDC'
}

// BROKER - 邀请码
export interface IOutput{
    string
}


// BROKER - SPARK PROGRAM
export interface IOutput{
    bonus: number;
}

// BROKER - MY REFERRAL
export interface IOutput{
    bonus: number;
    level: string;
    ranking: number;
    referals: number;
}

// BROKER - MY REFERRAL Claim
export interface IOutput{
   
}

// BROKER - MY REFERRAL Commission
// Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
}

// BROKER - MY REFERRAL Commission Record
// Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
    id: string;
}

// BROKER - MY REFERRAL - Campaign Rewards Pool
export interface IOutput{
    nextDistribution: number;
    coins: Array<{
        coin: 'DAI' | 'USDT' | 'USDC'
        amount: number;
        total: number;
    }>
}


// BROKER - MY REFERRAL Campaign Rewards
// Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
}

// BROKER - MY REFERRAL Campaign Rewards Record
// Array<IOutput>
export interface IOutput{
    coin: 'DAI' | 'USDT' | 'USDC'
    amount: number;
    id: string;
}

```

Claim操作确认
Pool页面reDai确认

