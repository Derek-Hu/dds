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

export enum NetworkId {
  kaovan = '42',
  homestead = '1',
}

export const DefaultCoinDatas = {
  DAI: 0,
  USDT: 0,
  USDC: 0,
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

export const TIME_FORMAT = 'YYYY-MM-DD HH mm:ss';

export const SupportedCoins = Object.keys(SupporttedUSD);

export const SupportedWallets = [Wallet.Metamask, Wallet.WalletConnect];

export const CustomTabKey = 'dds-tabs';

export const CoinSelectOption = SupportedCoins.map(coin => <Option value={coin}>{coin}</Option>);
// 合约地址
export const TradeDAIContractAddress = '0x09B20920c4f7d53ED6A5DC69c15776B193C8126e';
export const TradeUSDTContractAddress: string = '';
export const TradeUSDCContractAddress: string = '';
export const Lp1DAIContractAddress = '0xfA463AC1D51CB2bC8B6fE7952456830FD1320301';
export const Lp1USDTContractAddress = '';
export const Lp1USDCContractAddress = '';
export const Lp2DAIContractAddress = '0xd9b87Aff19DF6DE79b77E071DC0831b36FB458c8';
export const Lp2USDTContractAddress = '';
export const Lp2USDCContractAddress = '';
export const MiningRewardContractAddress = '0xa8aA9a758fFE006Fa8D604dc59D43447064c77f1';
export const LiquidatorContractAddress = '0xbB4FFe3F43E32D76eB8F469FE13362c625df59e0';
export const SwapBurnContractAddress = '0xCc7193CF946D4a8D3eeAfBE7572D4b243422BDCa'; // buy back
export const BrokerContractAddress = '0x28209d91c291c351B7DA2bfA313bc1Cb7aC0F97D';

export const ERC20DDSAddress = '0x904bC1433bD601ceB887b0890B9a9536B43A9e80';
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
