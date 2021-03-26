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

export const getFee = (amount: any | undefined, price: any) => {
  if (isNumberLike(amount) && isNumberLike(price)) {
    return (parseFloat(amount) * parseFloat(price)) / 1000;
  }
  return 0;
};
