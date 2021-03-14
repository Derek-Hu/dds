import { isNumberLike } from '../../util/math';

export const getMaxFromCoin = (balanceInfo?: IBalanceInfo, price?: number) => {
  if (!balanceInfo) {
    return;
  }
  const { balance, locked } = balanceInfo;

  if (isNumberLike(balance) && isNumberLike(locked) && isNumberLike(price)) {
    // @ts-ignore
    return parseFloat(balance) - parseFloat(locked) / parseFloat(price);
  }
};

export const getFee = (amount: any | undefined, price: any) => {
  if (isNumberLike(amount) && isNumberLike(price)) {
    return (parseFloat(amount) * parseFloat(price)) / 10000;
  }
  return 0;
};

// TODO
export const getLocked = (amount: any | undefined, price: any | undefined) => {
  if (typeof amount !== 'number') {
    return;
  }
  if (typeof price !== 'number') {
    return;
  }
  return (amount * price) / 1000;
};
