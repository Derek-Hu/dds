import { Select } from 'antd';

const { Option } = Select;

export enum Wallet {
  Metamask = 'Metamask',
  WalletConnect = 'Wallet Connect',
}

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
export const ContractAddress = '0x7cf2AD9Dc15166Af4Edd66f7559E9d6dcd0ccD83';
// 当没有连接metamask钱包的时候，网页默认从哪个网络获取数据
export const DefaultNetwork: Network = Network.kovan;
// 查询数据更新频率
export const DataRefreshInterval: number = 60 * 1000; // 60 seconds

export type ISupporttedUSD = keyof typeof SupporttedUSD;
export type ICoins = keyof typeof SupporttedCoins;
