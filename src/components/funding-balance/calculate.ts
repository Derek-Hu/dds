import { isNumberLike, format } from '../../util/math';

export const getMaxFromCoin = (balanceInfo?: IBalanceInfo, price?: number) => {
  if (!balanceInfo) {
    return;
  }
  const { available } = balanceInfo;

  if (isNumberLike(available) && isNumberLike(price)) {
    // @ts-ignore
    return available / price;
  }
};

export const getFee = (amount: any | undefined, price: any) => {
  if (isNumberLike(amount) && isNumberLike(price)) {
    return (parseFloat(amount) * parseFloat(price)) / 1000;
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
