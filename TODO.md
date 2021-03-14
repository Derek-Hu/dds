1. Home页面
* (Done) Banner位图片更新
* Read Docs链接
* 首页文案更新
* Non-Risk Perpetual数据对接
* Non-Risk Perpetual点击Trade按钮，跳转至Trade页面带参数
* Footer链接更新
* Contact DDerivatives链接&Logo更新

2. Trade页面
* Liquidity Pool数据对接
* Info模块数据对接
* 行情图数据对接
* 行情图切换时间区间
* Funding Balance(DAI)
    未登录时，Deposit/Withdraw点击不可用，按钮Open改为Connect Wallet
    已登录 Settlements Fee : DAI计算
* Orders数据对接、分页
* Orders Close订单

3. Pool页面
* COLLABORATIVE Tab
    * ARP 数据对接
    * 已登录
        * Deposit 功能
        * Your Share In The Pool 数据对接
        * Liquidity Balance 数据对接、分页
        * Liquidity Balance Withdraw对接
        * Liquidity Balance Record 对接

    * 未登录
        * Liquidity Provided数据对接

* Private Tab
    * 已登录
        * Deposit
        * Available Liquidity 数据对接
        * Liquidity Balance 数据对接
        * Liquidity Balance Withdraw对接
        * Liquidity Balance Record 对接、分页
        * LIQUIDITY LOCKED DETAIL表格数据对接\分页
        * LIQUIDITY LOCKED DETAIL补仓
        * LIQUIDITY LOCKED DETAIL停止接单

    * 未登录
        * Available Liquidity数据对接

4. Swap & Burn页面
* Current Swap Price数据对接
* Swap功能

5. Broker页面
* Copy referal link提示
* 从address映射至referal link
* Become DDerivatives's Spark数据对接
* My Referal数据对接
* My Referal Claim功能

* My Referal Commission数据对接
* My Referal Commission Record数据对接、分页

* My Referal Campaign Rewards数据对接、分页
* My Referal Campaign Rewards Record数据对接、分页

* My Referal Campaign Rewards Pool数据对接

6. Ming页面


------------------
d. Trade按钮跳转到Trade页面相应交易对
e. Why Choose DDerivatives文案
f. What is DDerivatives文案
Security Borderless Privacy增加标题
We are Community Drived背景色白色
Contact DDerivatives Logo及链接确定。 
Telegram Logo
Read Liquiditor Docs链接
About Blog 跳转Medium
Read Liquiditor Docs 链接


Orders Close
Funding Balance
Price Graph


Tab选中颜色高亮
弹窗一一过

Install MetaMask 跳转官网
检测是否安装  
连接钱包没有地址选择
Deposit / Withdraw未登录点击时自动弹出连接钱包, 出现Loading后轮询

Orders 自动下拉刷新数据
Liquidity Balance Record自动下拉刷新数据

-------------------------------
Support 菜单交互

下单：
    Settlements Fee 固定值 千分之一
    Max = (Balance - Locked) / Price


MINING页面 
    Available Liquidity Value = - （Private Poll -> Liquidity Balance） -（LIQUIDITY LOCKED DETAIL 所有Active订单分币种的Liquidity Locked累加）
    Available Liquidity 比例 = Available Liquidity Value / Liquidity Balance

Net P&L
    Liquidity Balance - Liquidity Balance Record 存取累计差额


Liquidity Balance： 文案更新
Private Liquidity Withdraw : XXX reDAI you need to pay
LIQUIDITY： Claim一次性提取

MINING -> LIQUIDITY：全部接口

LIQUIDITY LOCKED --》 Private Pool Locked

Claim 余额为0 ，提示余额不足
Open余额不足，提示


图表增加刷新功能
LIQUIDITY LOCKED DETAIL
    Liquidity Locked Settlements Fee单位一致
    Reward(DDS)为整数

Your Share In The Pool 中第一个值 等于 Liquidity Balance中的值

Funding Balance Deposit存，账户多少，都需刷新钱包余额
Funding Balance Withdraw取，从合约取， 都需刷新钱包余额
切换交易对，Liquidity Pool，Info，Funding Balance信息更新
补仓操作，可补仓数量 ===  Available Liquidity
邀请码 编码/解码，下单传递邀请码
Pool Withdraw 按钮控制14天，获取上一次保存时间，截至时间+1分钟