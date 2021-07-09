export enum EthNetwork {
  kovan = '42',
  bianTest = '97',
  bsc = '56',
}

export enum EthNetworkKey {
  kovan = 'kovan',
  bsctest = 'bsctest',
  bscmain = 'bscmain',
}

export const NetworkName = {
  [EthNetwork.kovan]: 'Kovan',
  [EthNetwork.bianTest]: 'BSC Test',
  [EthNetwork.bsc]: 'BSC',
};

export const NetworkKey = {
  [EthNetwork.kovan]: EthNetworkKey.kovan,
  [EthNetwork.bianTest]: EthNetworkKey.bsctest,
  [EthNetwork.bsc]: EthNetworkKey.bscmain,
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
  [EthNetwork.bsc]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
};

export const SupportedNetwork: EthNetwork[] = [EthNetwork.bianTest, EthNetwork.kovan];
