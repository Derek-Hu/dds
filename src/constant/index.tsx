import { Select } from 'antd';
import settings from './settings';

const { Option } = Select;

export enum Wallet {
  Metamask = 'Metamask',
  WalletConnect = 'Wallet Connect',
}

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

export const MyTokenSymbol = 'SLD';

export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const SupportedCoins = Object.keys(SupporttedUSD);

export const SupportedWallets = [Wallet.Metamask, Wallet.WalletConnect];

export const CustomTabKey = 'dds-tabs';

export const CoinSelectOption = SupportedCoins.map(coin => <Option value={coin}>{coin}</Option>);
// 合约地址
export const TradeDAIContractAddress = '0x1d94b6ec592223630dA56eB0Be63611E16a7Ece7';
export const TradeUSDTContractAddress = '';
export const TradeUSDCContractAddress = '';
export const Lp1DAIContractAddress = '0xeCf4C00F93abEcA9d163A2FD26B199ba69Ff2475';
export const Lp1USDTContractAddress = '';
export const Lp1USDCContractAddress = '';
export const Lp2DAIContractAddress = '0x646bc895a5617644dDBA4F054478586dF7Ecb338';
export const Lp2USDTContractAddress = '';
export const Lp2USDCContractAddress = '';
export const MiningRewardContractAddress = '0xFeEB057342a4cCF4a46ba6624Edadcde31d0d6fd';
export const LiquidatorContractAddress = '0x03F4A3EF4befD5e56646A9f110D80193eC61B6e8';
export const SwapBurnContractAddress = '0x3414275C767c2317789D64256254566430b6d1ac'; // buy back
export const BrokerContractAddress = '0x3036EE3F92fa483eE2881081CFF9820F40d48448';

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

export const CentralHost = '135.181.253.54:8090';
