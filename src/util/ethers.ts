import { BigNumber } from '@ethersproject/bignumber';
import * as _ from 'lodash';
import { MyTokenSymbol } from '../constant';
import { TOKEN_SYMBOL } from '../constant/tokens';

export const ETH_WEI = 18;
export const USD_WEI = 6;

export function toEthers(
  num: BigNumber | null | undefined,
  decimal: number,
  coin: number | symbol | ISLD | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'
): string {
  if (num === null) {
    return '0';
  }

  if (num === undefined) {
    return '0';
  }

  const sign: 1 | -1 = num.lt(0) ? -1 : 1;
  if (sign < 0) {
    num = num.mul(-1);
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
  let rs = integers + '.' + decimals;
  rs = _.trimEnd(_.trimEnd(rs, '0'), '.');

  if (sign < 0) {
    rs = '-' + rs;
  }

  return rs;
}

export function toEtherNumber(
  num: BigNumber | null | undefined,
  decimal: number,
  coin: symbol | ISLD | IUSDCoins | IReUSDCoins | IFromCoins
): string {
  return Number(toEthers(num, decimal, coin)).toFixed(decimal);
}

export function toRoundNumber(num: BigNumber | null | undefined, decimal: number, coin: symbol): string {
  return Number(toEthers(num, decimal + 1, coin)).toFixed(decimal);
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

export function tokenBigNumber(
  amount: number,
  coin: symbol | ISLD | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'
): BigNumber {
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

export function getTokenWei(coin: symbol | ISLD | IUSDCoins | IReUSDCoins | IFromCoins = 'ETH'): number {
  if (typeof coin === 'symbol') {
    return [TOKEN_SYMBOL.ETH, TOKEN_SYMBOL.SLD, TOKEN_SYMBOL.BTC, TOKEN_SYMBOL.DAI, TOKEN_SYMBOL.reDAI].indexOf(coin) >=
      0
      ? ETH_WEI
      : USD_WEI;
  } else {
    const coinStr: Exclude<typeof coin, symbol> = coin;
    return ['ETH', MyTokenSymbol, 'BTC', 'DAI', 'reDAI'].indexOf(coinStr) >= 0 ? ETH_WEI : USD_WEI;
  }
}
