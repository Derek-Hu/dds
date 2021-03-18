import { Select } from 'antd';

const { Option } = Select;

export enum Wallet {
  Metamask = 'Metamask',
  WalletConnect = 'Wallet Connect',
}

export const ddsBasePath = `${window.location.origin}/dds/dds.html#`;
export const homeBasePath = `${window.location.origin}/dds/index.html#`;

export enum Network {
  homestead = 'homestead',
  morden = 'morden',
  ropsten = 'ropsten',
  rinkeby = 'rinkeby',
  kovan = 'kovan',
  goerli = 'goerli',
}

export const SupporttedUSD = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
};

export const SupporttedCoins = {
  ETH: 'ETH',
  WBTC: 'WBTC',
};

export const SupportedCoins = Object.keys(SupporttedUSD);

export const SupportedWallets = [Wallet.Metamask, Wallet.WalletConnect];

export const CustomTabKey = 'dds-tabs';

export const CoinSelectOption = SupportedCoins.map((coin) => <Option value={coin}>{coin}</Option>);
// 合约地址
export const TradeDAIContractAddress = '0x0ec108b60051Ec5d424e45F38299c50c339311bf';
export const TradeUSDTContractAddress: string = '';
export const TradeUSDCContractAddress: string = '';
export const Lp1DAIContractAddress = '0x4701492EF93Bef185B0225cEb782EcBA7eE72D65';
export const Lp1USDTContractAddress = '';
export const Lp1USDCContractAddress = '';
export const Lp2DAIContractAddress = '0x3C880894814cB0F4f1AD39989e129f27Acd53D1C';
export const Lp2USDTContractAddress = '';
export const Lp2USDCContractAddress = '';
export const MiningRewardContractAddress = '0x536671b1687b996d3a6F72Cf975CE5Ae1F63a4Ad';
export const LiquidatorContractAddress = '0x9C37F57B687C4149a50B758683AB2104d337bb54';
export const SwapBurnContractAddress = '0x5c0dd03F2fc51aC61FE9c14bbA50341aF95fD00a';

export const ERC20DAIAddress = '0x113587939c8967e61aa2360613951b23ab2af49a';
export const ERC20USDTAddress = '0x97862b9ac658d800710a43286e076eac5e01a228';
export const ERC20USDCAddress = '0xc8c0278b371316fb3629a7c2c4e003cc296b5925';

export const SystemFundingAccount = '0xbfce8288fF225188EEC741aBfaac6BC9163d7a2B';

// 当没有连接metamask钱包的时候，网页默认从哪个网络获取数据
export const DefaultNetwork: Network = Network.kovan;
// 查询数据更新频率
export const DataRefreshInterval: number = 5 * 1000; // 5 seconds

export const ETH_WEIGHT = '1000000000000000000';

export const CoinWeight = new Map<IUSDCoins, string>([
  ['DAI', '1000000000000000000'],
  ['USDT', '1000000'],
  ['USDC', '1000000'],
]);

export const CoinEthExchange: { [c: string]: IExchangePair } = {
  DAI: 'ETHDAI',
  USDT: 'EHTUSDT',
  USDC: 'ETHUSDC',
};

export const CoinBTCExchange = new Map<IUSDCoins, IExchangePair>([
  ['DAI', 'BTCDAI'],
  ['USDT', 'BTCUSDT'],
  ['USDC', 'BTCUSDC'],
]);

export type ISupporttedUSD = keyof typeof SupporttedUSD;
export type ICoins = keyof typeof SupporttedCoins;
