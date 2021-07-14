import { BigNumber } from 'ethers';

export type UserTradeAccountInfo = {
  balance: BigNumber;
  available: BigNumber;
  locked: BigNumber;
};
