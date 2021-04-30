import { BigNumber } from '@ethersproject/bignumber';
import * as _ from 'lodash';
import { MyTokenSymbol } from '../constant';

export const ETH_WEI = 18;
export const USD_WEI = 6;

export function toEthers(
  num: BigNumber,
  decimal: number,
  coin: number | ISLD | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'
): string {
  if (num === undefined) {
    console.warn('number value is undefined.');
    return '0';
  }

  let numStr = num.toString();
  const wei = typeof coin === 'number' ? coin : getTokenWei(coin);

  if (numStr.length < wei) {
    numStr = _.padStart(numStr, wei, '0');
  }
  let decimals: string = numStr.substring(numStr.length - wei);
  if (decimal && decimal > 0) {
    decimals = decimals.substring(0, decimal);
  }

  const integers: string = numStr.substring(0, numStr.length - wei) || '0';
  const rs = integers + '.' + decimals;

  return _.trimEnd(_.trimEnd(rs, '0'), '.');
}

export function toEtherNumber(num: BigNumber, decimal: number, coin: ISLD | IUSDCoins | IReUSDCoins | IFromCoins) {
  return Number(toEthers(num, decimal, coin));
}

export function toDisplayNum(coinNum: CoinNumber, decimal: number): number {
  return Number(toEthers(coinNum.value, decimal, coinNum.precision));
}

//
export function keepDecimal(num: number, decimal: number): string {
  const numStr: string = num.toString();
  if (numStr.indexOf('.') >= 0) {
    const parts = numStr.split('.');
    decimal = decimal > parts[1].length ? parts[1].length : decimal;
    return parts[0] + '.' + parts[1].substring(0, decimal);
  } else {
    return numStr;
  }
}

export function tokenBigNumber(amount: number, coin: ISLD | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'): BigNumber {
  const wei = getTokenWei(coin);

  if (amount % 1) {
    const str = amount.toString();
    const parts = str.split('.');
    const append: number = wei - parts[1].length;
    const int: string = parts[0] + parts[1] + new Array(append).fill('0').join('');

    return BigNumber.from(int);
  }
  return BigNumber.from(amount.toString() + new Array(wei).fill('0').join(''));
}

export function toExchangePair(pair: IExchangeStr): ExchangeCoinPair {
  switch (pair) {
    case 'ETHDAI': {
      return { USD: 'DAI', ETH: 'ETH' };
    }
    case 'BNBDAI': {
      return { USD: 'DAI', ETH: 'BNB' };
    }
    case 'BTCDAI': {
      return { USD: 'DAI', ETH: 'BTC' };
    }
    case 'BTCUSDC': {
      return { USD: 'USDC', ETH: 'BTC' };
    }
    case 'BTCUSDT': {
      return { USD: 'USDT', ETH: 'BTC' };
    }
    case 'EHTUSDT': {
      return { USD: 'USDT', ETH: 'ETH' };
    }
    case 'ETHUSDC': {
      return { USD: 'USDC', ETH: 'ETH' };
    }
  }
}

export function fromExchangePair(exchange: ExchangeCoinPair): IExchangeStr {
  return (exchange.ETH + exchange.USD) as IExchangeStr;
}

export function getTokenWei(coin: ISLD | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'): number {
  return ['ETH', MyTokenSymbol, 'BTC', 'DAI', 'reDAI'].indexOf(coin) >= 0 ? ETH_WEI : USD_WEI;
}
