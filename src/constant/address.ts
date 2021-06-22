// kovan

export type ContractAddress = {
  TradeDAIContract: string;
  TradeUSDTContract: string;
  TradeUSDCContract: string;
  Lp1DAIContract: string;
  Lp1USDTContract: string;
  Lp1USDCContract: string;
  Lp2DAIContract: string;
  Lp2USDTContract: string;
  Lp2USDCContract: string;
  MiningRewardContract: string;
  LiquidatorContract: string;
  SwapBurnContract: string;
  BrokerContract: string;

  ERC20DDS: string;
  ERC20DAI: string;
  ERC20USDT: string;
  ERC20USDC: string;

  ReceiveTestTokenContract: string;
};

export const KOVAN_ADDRESS: ContractAddress = {
  TradeDAIContract: '0x1d94b6ec592223630dA56eB0Be63611E16a7Ece7',
  TradeUSDTContract: '',
  TradeUSDCContract: '',
  Lp1DAIContract: '0xeCf4C00F93abEcA9d163A2FD26B199ba69Ff2475',
  Lp1USDTContract: '',
  Lp1USDCContract: '',
  Lp2DAIContract: '0x646bc895a5617644dDBA4F054478586dF7Ecb338',
  Lp2USDTContract: '',
  Lp2USDCContract: '',
  MiningRewardContract: '0xFeEB057342a4cCF4a46ba6624Edadcde31d0d6fd',
  LiquidatorContract: '0x03F4A3EF4befD5e56646A9f110D80193eC61B6e8',
  SwapBurnContract: '0x3414275C767c2317789D64256254566430b6d1ac', // buy back
  BrokerContract: '0x3036EE3F92fa483eE2881081CFF9820F40d48448',

  ERC20DDS: '0x904bC1433bD601ceB887b0890B9a9536B43A9e80',
  ERC20DAI: '0x113587939c8967e61aa2360613951b23ab2af49a',
  ERC20USDT: '0x97862b9ac658d800710a43286e076eac5e01a228',
  ERC20USDC: '0xc8c0278b371316fb3629a7c2c4e003cc296b5925',

  ReceiveTestTokenContract: '',
};

export const BIAN_TEST_ADDRESS: ContractAddress = {
  TradeDAIContract: '0x7125E80fF9c5ae3073bf30769d0963B6d0B57515', //
  TradeUSDTContract: '0x088EF7a6a8ff54898586cDF0C4098b3c4D5A5Fc7',
  TradeUSDCContract: '0x6A0C9Ded5380f2Ab70A4dAE6152b3949102894a5',
  Lp1DAIContract: '0xb3F55De3a56F15d6C94cF74753F52e447519E563', //
  Lp1USDTContract: '0xd1F2fE3A94400493ab42C7E0b569f6100311e69c',
  Lp1USDCContract: '0x8f662D0d0e1B58242C7a595D5645dF6bb0896A9f',
  Lp2DAIContract: '0xaDea523A790b34CF6D0989a803262b2A38FD7cdA', //
  Lp2USDTContract: '0x0DEc025B86aCd5307FE598495b084FcB5ab7871e',
  Lp2USDCContract: '0xf4551686C5AD07FC955e3150099fB94CA2F883C5',
  MiningRewardContract: '0x225CC02e4bCe7f6C40A2A1Bc8d30931C9D3d9E8b', //'0xb995604ded854D2068D57898e157675732C7B378', ////
  LiquidatorContract: '0x223B7E1d8B671ef8E32452821c6FdbA63E766926', //
  SwapBurnContract: '0xa4c039D6e22aE06373CAE3C1e652D4f36cd654C6', //
  BrokerContract: '0x51dB4Ee3B8eB198968ef05D08211eBBE282be3F6', //

  ERC20DDS: '0xcD1ad28e73d8b37866d02Bc2217b86Eb0da34EaC', //
  ERC20DAI: '0x21160DcCF818c5D8df20AbfA1B937ea3Ba1bD451', //
  ERC20USDT: '0x18104cfA6C4d9257040F542D93750b553a102d45',
  ERC20USDC: '0x9E404218898Fb63Cac611D02BAF508A61215B2FE',

  ReceiveTestTokenContract: '0x69FA54869e95f67A9b36f4aFF808B45De6347DE7',
};

export enum EthNetwork {
  kovan = '42',
  bianTest = '97',
}

export const ContractAddressByNetwork = {
  [EthNetwork.bianTest]: BIAN_TEST_ADDRESS,
  [EthNetwork.kovan]: KOVAN_ADDRESS,
};

export const NetworkParam = {
  [EthNetwork.bianTest]: {
    chainId: '0x61',
    chainName: 'BSC Test Network',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-2-s3.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
};

export const CentralProto = window.location.protocol;
export const CentralHost = CentralProto + '//shieldex.io';
export const CentralPort = {
  [EthNetwork.kovan]: '8090',
  [EthNetwork.bianTest]: '8095',
};
export const CentralPath: Record<EthNetwork, INetworkKey> = {
  [EthNetwork.kovan]: 'kovan',
  [EthNetwork.bianTest]: 'bsctest',
};
