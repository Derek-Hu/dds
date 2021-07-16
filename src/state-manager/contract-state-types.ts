import { BigNumber } from 'ethers';

export type UserTradeAccountInfo = {
  balance: BigNumber;
  available: BigNumber;
  locked: BigNumber;
};

export type TradeOrderFees = {
  curPrice: BigNumber;
  totalFee: BigNumber;
  settlementFee: BigNumber;
  fundingLocked: BigNumber;
};
