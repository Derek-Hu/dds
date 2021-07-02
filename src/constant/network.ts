export enum EthNetwork {
  kovan = '42',
  bianTest = '97',
}

export enum EthNetworkKey {
  kovan = 'kovan',
  bsctest = 'bsctest',
  bscmain = 'bscmain',
}

export const NetworkName = {
  [EthNetwork.kovan]: 'Kovan',
  [EthNetwork.bianTest]: 'BSC Test',
};

export const NetworkKey = {
  [EthNetwork.kovan]: EthNetworkKey.kovan,
  [EthNetwork.bianTest]: EthNetworkKey.bsctest,
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
