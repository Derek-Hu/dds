import { BigNumber } from 'ethers';
import { EthNetwork } from '../constant/network';

export type OrderItemData = {
  hash: string;
  id: string;
  network: EthNetwork;
  takerAddress: string;
  openTime: number;
  tradeDirection: TradeDirection;
  openAmount: BigNumber;
  openPrice: BigNumber;
  closePrice: BigNumber;
  pairSymbol: symbol;
  quoteSymbol: symbol;
  baseSymbol: symbol;
  fundingFee: BigNumber;
  settlementFee: BigNumber;
  orderStatus: OrderStatus;
  positionPNLVal: number | null;
  positionPNLPercent: number | null;
  realizedProfit: number | null;
};
export type PageTradingPair = { quote: symbol; base: symbol };
export type TradeDirection = 'LONG' | 'SHORT';
export type TradeOrderTab = 'ACTIVE' | 'HISTORY';
export type OrderStatus = 'PENDING' | 'ACTIVE' | 'CLOSED';
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
