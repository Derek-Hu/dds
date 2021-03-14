import { BigNumber } from '@ethersproject/bignumber';
import * as _ from 'lodash';

export const ETH_WEI = 18;

export function toEthers(num: BigNumber, decimal: number): string {
  let numStr = num.toString();
  if (numStr.length < ETH_WEI) {
    numStr = _.padStart(numStr, ETH_WEI, '0');
  }
  let decimals: string = numStr.substring(numStr.length - ETH_WEI);
  if (decimal && decimal > 0) {
    decimals = decimals.substring(0, decimal);
  }

  const integers: string = numStr.substring(0, numStr.length - ETH_WEI) || '0';
  const rs = integers + '.' + decimals;

  return _.trimEnd(_.trimEnd(rs, '0'), '.');
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
