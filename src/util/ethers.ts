import { BigNumber } from '@ethersproject/bignumber';
import * as _ from 'lodash';

export const ETH_WEI = 18;
export const USD_WEI = 6;

export function toEthers(
  num: BigNumber,
  decimal: number,
  coin: number | IDDS | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'
): string {
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

export function toEtherNumber(num: BigNumber, decimal: number, coin: IDDS | IUSDCoins | IReUSDCoins | IFromCoins) {
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

//
export function toBigNumber(num: number, weight: number): BigNumber {
  const a = (num * 1000000).toString();
  const by = '1' + new Array(weight - 6).fill('0').join('');

  return BigNumber.from(a).mul(by);
}

export function tokenBigNumber(amount: number, coin: IDDS | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'): BigNumber {
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

export function toExchangePair(pair: IExchangePair): ExchangeCoinPair {
  const eth: IFromCoins = pair.startsWith('ETH') ? 'ETH' : 'BTC';
  const usd: IUSDCoins = pair.substr(eth.length) as IUSDCoins;

  return {
    USD: usd,
    ETH: eth,
  };
}

export function getTokenWei(coin: IDDS | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'): number {
  return ['ETH', 'DDS', 'BTC', 'DAI', 'reDAI'].indexOf(coin) >= 0 ? ETH_WEI : USD_WEI;
}
