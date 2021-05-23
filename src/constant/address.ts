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
};

export const BIAN_TEST_ADDRESS: ContractAddress = {
  TradeDAIContract: '0x525dB7fD7508Cc0e2db36d89C4cA3F5Dd5e7E031', //
  TradeUSDTContract: '0x9B8d771C0D8C9139C32D798D6dC3b3C86a011AC6',
  TradeUSDCContract: '0x740EaEA9Cb81E406780528d77025ea66Ea6Ecb26',
  Lp1DAIContract: '0x0beE42f1f376acCBC674e51E3F1dA2DF6Fc7C36e', //
  Lp1USDTContract: '0x6ffC6C3CBbb4Bb47018d542e96F75973ceDaAb96',
  Lp1USDCContract: '0x68b08BcE9B72aFd295A4d4A3ac11b4731759De99',
  Lp2DAIContract: '0x7A3a1c4C4d9810935387b2Adb3569A47adC2f2d8', //
  Lp2USDTContract: '0xe82f788cE21880C05d289885CF322B4D8f83fb46',
  Lp2USDCContract: '0x3cA89d3A5Abd4B9B844a0075Ed27F2ECcf34A641',
  MiningRewardContract: '0x27069CbaE84e3CF85B61462B6C73b0E21f29F34E', //
  LiquidatorContract: '0x38e53B7A7a530E09Dd1d571110EeCBDbda28526a', //
  SwapBurnContract: '0x133095b719BCdD14c6e5A852Ef336D7465F51bC6', //
  BrokerContract: '0xe841b8D3bF7F3eb2B1B587f4E8d5D008eC2ca1a4', //

  ERC20DDS: '0xcD1ad28e73d8b37866d02Bc2217b86Eb0da34EaC', //
  ERC20DAI: '0x21160DcCF818c5D8df20AbfA1B937ea3Ba1bD451', //
  ERC20USDT: '0x18104cfA6C4d9257040F542D93750b553a102d45',
  ERC20USDC: '0x9E404218898Fb63Cac611D02BAF508A61215B2FE',
};

export enum EthNetwork {
  kovan = '42',
  bianTest = '97',
}

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
