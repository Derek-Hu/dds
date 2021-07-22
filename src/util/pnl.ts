import { BigNumber } from 'ethers';
import { getPairTokenSymbols } from '../constant/tokens';
import { toEtherNumber } from './ethers';

export function computePositionPNL(
  openPrice: BigNumber,
  lastPrice: BigNumber,
  positionAmount: BigNumber,
  tradePair: symbol
): { pnl: number; percent: number } {
  const tokens = getPairTokenSymbols(tradePair);
  if (!tokens) {
    return { pnl: 0, percent: 0 };
  }

  const { quote, base } = tokens;
  const deltaPrice: number = Number(toEtherNumber(lastPrice.sub(openPrice), 2, quote));
  const amountNum: number = Number(toEtherNumber(positionAmount, 2, base));
  const openPriceNum: number = Number(toEtherNumber(openPrice, 2, quote));
  const pnl: number = Number((deltaPrice * amountNum).toFixed(2));
  const pnlPercent: number = Number(((deltaPrice * 100) / openPriceNum).toFixed(2));

  return { pnl, percent: pnlPercent };
}
