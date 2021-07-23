import { OrderItemData, TradeSetting } from '../state-types';
import { BigNumber } from 'ethers';
import { TOKEN_SYMBOL_MAP, TRADE_PAIR_SYMBOL_MAP } from '../../constant/tokens';

export function orderSerializer(orders: OrderItemData[] | null): string | null {
  if (orders === null) {
    return null;
  }

  const normalArr = orders.map((one: OrderItemData) => {
    const normal = Object.assign({}, one, {
      network: one.network.toString(),
      openAmount: one.openAmount.toString(),
      openPrice: one.openPrice.toString(),
      closePrice: one.closePrice.toString(),
      pairSymbol: one.pairSymbol.description,
      quoteSymbol: one.quoteSymbol.description,
      baseSymbol: one.baseSymbol.description,
      fundingFee: one.fundingFee.toString(),
      settlementFee: one.settlementFee.toString(),
    });

    return normal;
  });

  return JSON.stringify(normalArr);
}

export function orderParser(cache: string | null): OrderItemData[] | null {
  if (cache === null) {
    return null;
  }

  try {
    const normalArr: any = JSON.parse(cache);
    if (normalArr instanceof Array) {
      console.log('cache array', normalArr);
      const orders: OrderItemData[] = normalArr.map(normal => {
        return {
          id: normal.id,
          hash: normal.hash,
          network: normal.network,
          takerAddress: normal.takerAddress,
          openTime: normal.openTime,
          tradeDirection: normal.tradeDirection,
          openAmount: BigNumber.from(normal.openAmount),
          openPrice: BigNumber.from(normal.openPrice),
          closePrice: BigNumber.from(normal.closePrice),
          pairSymbol: TRADE_PAIR_SYMBOL_MAP.get(normal.pairSymbol),
          quoteSymbol: TOKEN_SYMBOL_MAP.get(normal.quoteSymbol),
          baseSymbol: TOKEN_SYMBOL_MAP.get(normal.baseSymbol),
          fundingFee: BigNumber.from(normal.fundingFee),
          settlementFee: BigNumber.from(normal.settlementFee),
          orderStatus: normal.orderStatus,
          positionPNLVal: normal.positionPNLVal,
          positionPNLPercent: normal.positionPNLPercent,
          realizedProfit: normal.realizedProfit,
        } as OrderItemData;
      });
      return orders;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export function orderPatcher(
  oldOrders: OrderItemData[] | null,
  newOrders: OrderItemData[] | null
): OrderItemData[] | null {
  if (oldOrders === null && newOrders === null) {
    return null;
  }

  if (oldOrders === null) {
    return newOrders;
  }

  if (newOrders === null) {
    return oldOrders;
  }

  return [...newOrders, ...oldOrders];
}

export function tradeSettingSerializer(setting: TradeSetting | null): string | null {
  if (setting === null) {
    return null;
  }

  return JSON.stringify(setting);
}

export function tradeSettingParser(cache: string | null): TradeSetting | null {
  if (cache === null) {
    return null;
  }

  try {
    return JSON.parse(cache);
  } catch (err) {
    return null;
  }
}
