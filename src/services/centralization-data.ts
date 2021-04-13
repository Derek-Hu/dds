import { getTokenWei, keepDecimal, toDisplayNum, toExchangePair } from '../util/ethers';
import { BigNumber } from 'ethers';

export interface IOrderInfoData {
  closePrice: string;
  exFee: string;
  holderFee: string;
  lockFee: string;
  newLockFee: string;
  makerAddress: string;
  margeAmount: string;
  margeFee: string;
  openContractTime: string;
  openNumber: string;
  openPrice: string;
  orderId: string;
  orderType: 'LONG' | 'SHORT';
  poolType: number;
  state: number;
  symbol: IExchangeStr;
  takerAddress: string;
  takerId: string; // orderId
  txId: string;
  createHash: string;
}

export class OrderInfoObject {
  public readonly createHash: string;
  public readonly takerAddress: string;
  public readonly makerAddress: string;
  public readonly orderId: BigNumber;
  public readonly exchangePair: ExchangeCoinPair;
  public readonly openTime: number;
  public readonly orderType: ITradeType;
  public readonly openAmount: CoinNumber;
  public readonly openPrice: CoinNumber;
  public readonly lockFee: CoinNumber;
  public readonly exFee: CoinNumber;
  public readonly status: IOrderStatus;
  public readonly closePrice: CoinNumber;

  public readonly marginAmount: CoinNumber;
  public readonly marginFee: CoinNumber;

  constructor(orderInfoData: IOrderInfoData) {
    this.createHash = orderInfoData.createHash;
    this.takerAddress = orderInfoData.takerAddress;
    this.makerAddress = orderInfoData.makerAddress;
    this.orderId = BigNumber.from(orderInfoData.orderId);
    this.exchangePair = toExchangePair(orderInfoData.symbol);
    this.openTime = BigNumber.from(orderInfoData.openContractTime).toNumber();
    this.orderType = orderInfoData.orderType === 'LONG' ? 'LONG' : 'SHORT';
    this.openAmount = {
      value: BigNumber.from(orderInfoData.openNumber),
      precision: getTokenWei(this.exchangePair.ETH),
    };
    this.openPrice = {
      value: BigNumber.from(orderInfoData.openPrice),
      precision: getTokenWei(this.exchangePair.USD),
    };
    this.lockFee = {
      value: BigNumber.from(orderInfoData.lockFee).add(BigNumber.from(orderInfoData.newLockFee)),
      precision: getTokenWei(this.exchangePair.USD),
    };
    this.exFee = {
      value: BigNumber.from(orderInfoData.exFee),
      precision: getTokenWei(this.exchangePair.USD),
    };
    this.status = orderInfoData.state === 1 ? 'ACTIVE' : 'CLOSED';
    this.closePrice = {
      value: BigNumber.from(orderInfoData.closePrice),
      precision: getTokenWei(this.exchangePair.USD),
    };

    this.marginAmount = {
      value: BigNumber.from(orderInfoData.margeAmount),
      precision: getTokenWei(this.exchangePair.USD),
    };
    this.marginFee = {
      value: BigNumber.from(orderInfoData.margeFee),
      precision: getTokenWei(this.exchangePair.USD),
    };
  }

  public getTakerOrder(curPrice: CoinNumber): ITradeRecord {
    return {
      hash: this.createHash,
      userAddress: this.takerAddress,
      id: this.orderId.toString(),
      time: this.openTime,
      type: this.orderType,
      price: toDisplayNum(this.openPrice, 4),
      closePrice: this.status === 'ACTIVE' ? undefined : toDisplayNum(this.closePrice, 4),
      amount: toDisplayNum(this.openAmount, 4),
      cost: toDisplayNum(this.lockFee, 4),
      costCoin: this.exchangePair.USD,
      fee: toDisplayNum(this.exFee, 4),
      pl: {
        val: Number(keepDecimal(this.getTakerPL(curPrice), 4)),
        percentage: Number(keepDecimal(this.getTakerPLPercent(curPrice), 2)),
      },
      status: this.status,
    };
  }

  public getMakerOrder(): PrivatePoolOrder {
    return {
      hash: this.createHash,
      userAddress: this.makerAddress,
      orderId: this.orderId.toString(),
      time: this.openTime,
      amount: toDisplayNum(this.openAmount, 4),
      lockedAmount: toDisplayNum(this.marginAmount, 4),
      status: this.isActive() ? 'ACTIVE' : 'CLOSED',
      openPrice: toDisplayNum(this.openPrice, 4),
      coin: this.exchangePair.USD,
    };
  }

  public isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  public getPriceDiff(curPrice: CoinNumber): CoinNumber {
    const sign: 1 | -1 = this.orderType === 'SHORT' ? -1 : 1;
    return {
      value: this.getEndPrice(curPrice).value.sub(this.openPrice.value).mul(sign),
      precision: this.openPrice.precision,
    };
  }

  // -----------------------------------------------------------------------

  private getTakerPLPercent(curPrice: CoinNumber): number {
    let rs: number = (100 * toDisplayNum(this.getPriceDiff(curPrice), 4)) / toDisplayNum(this.openPrice, 4);
    if (rs < 0) {
      rs = 0;
    }
    return rs;
  }

  private getTakerPL(curPrice: CoinNumber): number {
    const diff: number = toDisplayNum(this.getPriceDiff(curPrice), 4);
    const count: number = toDisplayNum(this.openAmount, 4);
    let rs = diff * count;
    if (rs < 0) {
      rs = 0;
    }
    return rs;
  }

  private getEndPrice(curPrice: CoinNumber): CoinNumber {
    return this.isActive() ? curPrice : this.closePrice;
  }
}
