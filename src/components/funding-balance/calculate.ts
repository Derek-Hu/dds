import { isNumberLike, minus } from '../../util/math';

export const getMaxFromCoin = (balanceInfo?: IBalanceInfo) => {
  if (!balanceInfo) {
    return;
  }
  const { available, balance, locked } = balanceInfo;
  if(isNumberLike(available)){
    return available;
  }
  return minus(balance, locked, true);
};
