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
