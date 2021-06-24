import { Select } from 'antd';
import settings from './settings';

const { Option } = Select;

export enum Wallet {
  Metamask = 'Metamask',
  WalletConnect = 'Wallet Connect',
}

export const DefaultKeNetwork: INetworkKey = 'bsctest';

export const NetWork2Coin: Record<INetworkKey, IFromCoins> = {
  bscmain: 'ETH',
  bsctest: 'ETH',
  kovan: 'ETH',
};

export const ddsBasePath = `${window.location.origin}${settings.pathname}/dds.html#`;
export const homeBasePath = `${window.location.origin}${settings.pathname}/index.html#`;

export enum Network {
  homestead = 'homestead',
  morden = 'morden',
  ropsten = 'ropsten',
  rinkeby = 'rinkeby',
  kovan = 'kovan',
  goerli = 'goerli',
}

export const DefaultCoinDatas = {
  DAI: 0,
  USDT: 0,
  USDC: 0,
};

export const DefaultCoinWithdrawDatas = {
  DAI: { total: 0, maxWithdraw: 0 },
  USDT: { total: 0, maxWithdraw: 0 },
  USDC: { total: 0, maxWithdraw: 0 },
};

export const DefaultProgressDatas = {
  DAI: {
    percentage: 0,
    val: null,
  },
  USDT: {
    percentage: 0,
    val: null,
  },
  USDC: {
    percentage: 0,
    val: null,
  },
};
export const SupporttedUSD = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
};

export const SupporttedCoins = {
  ETH: 'ETH',
  WBTC: 'WBTC',
};

export const MyTokenSymbol: ISLD = 'SLD';

export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const SupportedCoins = Object.keys(SupporttedUSD);

export const SupportedWallets = [Wallet.Metamask, Wallet.WalletConnect];

export const CustomTabKey = 'dds-tabs';

export const CoinSelectOption = SupportedCoins.map(coin => <Option value={coin}>{coin}</Option>);
// 合约地址

export const SystemFundingAccount = '0xbfce8288fF225188EEC741aBfaac6BC9163d7a2B';

// 当没有连接metamask钱包的时候，网页默认从哪个网络获取数据
export const DefaultNetwork: Network = Network.kovan;
// 查询数据更新频率
export const DataRefreshInterval: number = 5 * 1000; // 5 seconds

export const ETH_WEIGHT = '1000000000000000000';

export const CoinEthExchange: { [c: string]: IExchangeStr } = {
  DAI: 'ETHDAI',
  USDT: 'EHTUSDT',
  USDC: 'ETHUSDC',
};

export const CoinBTCExchange = new Map<IUSDCoins, IExchangeStr>([
  ['DAI', 'BTCDAI'],
  ['USDT', 'BTCUSDT'],
  ['USDC', 'BTCUSDC'],
]);

export type ISupporttedUSD = keyof typeof SupporttedUSD;
export type ICoins = keyof typeof SupporttedCoins;

// 本地存储的key前缀
export enum LocalStorageKeyPrefix {
  TradeSetting = 'ShieldTradeSetting',
  PendingOrdersHash = 'PendingOrdersHash',
  ReferalCode = 'referalCode',
}
