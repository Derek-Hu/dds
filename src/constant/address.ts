// kovan

import { EthNetwork } from './network';

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
  AirDropContract: string;
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
  AirDropContract: '0x086530B6E7D8a0E94B0eCf9A321183c702b10106',
};
export const BIAN_TEST_ADDRESS: ContractAddress = {
  TradeDAIContract: '0x32C10Ce5f9f47Ab82141D73A136823D3e20408E0', //
  TradeUSDTContract: '0x088EF7a6a8ff54898586cDF0C4098b3c4D5A5Fc7',
  TradeUSDCContract: '0x6A0C9Ded5380f2Ab70A4dAE6152b3949102894a5',
  Lp1DAIContract: '0x67360E519b0d7f4F4F257E22253caC1cd5C8ef12', //
  Lp1USDTContract: '0xd1F2fE3A94400493ab42C7E0b569f6100311e69c',
  Lp1USDCContract: '0x8f662D0d0e1B58242C7a595D5645dF6bb0896A9f',
  Lp2DAIContract: '0x60e2be64528dbe4e5892254D3DaD83809A3F6f3A', //
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
  AirDropContract: '0x0730d4Be6A3d232E40046Dd0156213F0dcd209BD',
};
export const BIAN_TEST_ADDRESS_NEW: ContractAddress = {
  TradeDAIContract: '0x97ccFFFFB15a7Ca99fFC8C1aA0b5F39ABf3cC6A6', //
  TradeUSDTContract: '0x088EF7a6a8ff54898586cDF0C4098b3c4D5A5Fc7',
  TradeUSDCContract: '0x6A0C9Ded5380f2Ab70A4dAE6152b3949102894a5',
  Lp1DAIContract: '0x8d36FF8b4D2D93bD2EcC0F03EF140fa7eC28B84B', //
  Lp1USDTContract: '0xd1F2fE3A94400493ab42C7E0b569f6100311e69c',
  Lp1USDCContract: '0x8f662D0d0e1B58242C7a595D5645dF6bb0896A9f',
  Lp2DAIContract: '0x1F883aAD49D1D22541AA9ef77F5AF9aaC19D4e1c', //
  Lp2USDTContract: '0x0DEc025B86aCd5307FE598495b084FcB5ab7871e',
  Lp2USDCContract: '0xf4551686C5AD07FC955e3150099fB94CA2F883C5',
  MiningRewardContract: '0x2D89d8F9AA1040B12964965573b79441D489d95E', //'0xb995604ded854D2068D57898e157675732C7B378', ////
  LiquidatorContract: '0x2a399B50bC00393342Dd1a9f399E56639EB883A3', //
  SwapBurnContract: '0xDC66cFA0564CcFae33A846F7b048E213F983BFB1', //
  BrokerContract: '0xCa875f67D2C35c2d0a4Da7a23b0Cf7e10222F985', //

  ERC20DDS: '0x8dEaaf2017e3215BCE892C2ADDD98d4F1eD6Dfa5', //
  ERC20DAI: '0x21160DcCF818c5D8df20AbfA1B937ea3Ba1bD451', //
  ERC20USDT: '0x18104cfA6C4d9257040F542D93750b553a102d45',
  ERC20USDC: '0x9E404218898Fb63Cac611D02BAF508A61215B2FE',

  ReceiveTestTokenContract: '0x69FA54869e95f67A9b36f4aFF808B45De6347DE7',
  AirDropContract: '0x0730d4Be6A3d232E40046Dd0156213F0dcd209BD',
};
export const BSC_ADDRESS: ContractAddress = {
  TradeDAIContract: ' ', //
  TradeUSDTContract: ' ',
  TradeUSDCContract: ' ',
  Lp1DAIContract: ' ', //
  Lp1USDTContract: ' ',
  Lp1USDCContract: ' ',
  Lp2DAIContract: ' ', //
  Lp2USDTContract: ' ',
  Lp2USDCContract: ' ',
  MiningRewardContract: ' ', //'0xb995604ded854D2068D57898e157675732C7B378', ////
  LiquidatorContract: ' ', //
  SwapBurnContract: ' ', //
  BrokerContract: ' ', //

  ERC20DDS: ' ', //
  ERC20DAI: ' ', //
  ERC20USDT: ' ',
  ERC20USDC: ' ',

  ReceiveTestTokenContract: ' ',
  AirDropContract: ' ',
};
export const ContractAddressByNetwork = {
  [EthNetwork.bianTest]: BIAN_TEST_ADDRESS,
  [EthNetwork.kovan]: KOVAN_ADDRESS,
  [EthNetwork.bsc]: BSC_ADDRESS,
};

export const CentralProto = window.location.protocol;
export const CentralHost = CentralProto + '//shieldex.io';
export const CentralPort = {
  [EthNetwork.kovan]: '8090',
  [EthNetwork.bianTest]: '8095',
  [EthNetwork.bsc]: '80', //TODO to change to correct port number
};

export const CentralPath: Record<EthNetwork, INetworkKey> = {
  [EthNetwork.kovan]: 'kovan',
  [EthNetwork.bianTest]: 'bsctest',
  [EthNetwork.bsc]: 'bscmain',
};

function genOrderDataUrl(network: EthNetwork): string {
  const basePath =
    CentralProto === 'https:'
      ? CentralHost + '/' + CentralPath[network]
      : CentralHost + ':' + CentralPort[network] + '/' + CentralPath[network];

  return basePath + '/transactions/getTransactionsInfo';
}

export const DatabaseUrl: { [p in EthNetwork]: string } = {
  [EthNetwork.bianTest]: genOrderDataUrl(EthNetwork.bianTest),
  [EthNetwork.bsc]: genOrderDataUrl(EthNetwork.bsc),
  [EthNetwork.kovan]: genOrderDataUrl(EthNetwork.kovan),
};
