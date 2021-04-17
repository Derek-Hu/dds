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
  TradeDAIContract: '0x4b8a33Af1668cBAB99C4cF1401bf75e690A5C0ea', //
  TradeUSDTContract: '',
  TradeUSDCContract: '',
  Lp1DAIContract: '0x1064cDe0B7B0B71dabdddCD57acAe3442FEF7539', //
  Lp1USDTContract: '',
  Lp1USDCContract: '',
  Lp2DAIContract: '0xC51B9bcf391B8e3D5cf85AE56C3fc7C2D0297342', //
  Lp2USDTContract: '',
  Lp2USDCContract: '',
  MiningRewardContract: '0xd3aC30353330FA928Aa2926310BB77fE6D21e11D', //
  LiquidatorContract: '0x9E99B0f7be5722a67E7E2805dddC215D51536b9A', //
  SwapBurnContract: '0x2B704446AF5aB018115Cb27250170a2dD8409Af0', //
  BrokerContract: '0x8e131FDe45d825c024D0abc76F40B342F7108144', //

  ERC20DDS: '0xcD1ad28e73d8b37866d02Bc2217b86Eb0da34EaC', //
  ERC20DAI: '0x21160DcCF818c5D8df20AbfA1B937ea3Ba1bD451', //
  ERC20USDT: '',
  ERC20USDC: '',
};

export enum EthNetwork {
  kovan = '42',
  bianTest = '95',
}
