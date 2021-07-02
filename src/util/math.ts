import { Decimal } from 'decimal.js';
import numeral from 'numeral';
import { BigNumber } from 'ethers';

export const format = (value: any) => {
  if (isNumberLike(value)) {
    return numeral(new Decimal(value).toFixed(2)).format('0,0.00');
  }
  return '';
};

export const formatThree = (value: any) => {
  if (isNumberLike(value)) {
    return numeral(new Decimal(value).toFixed(2)).format('0,0.000');
  }
  return '';
};

export const multiple = (one: any, two: any, original?: boolean) => {
  if (isNumberLike(one) && isNumberLike(two)) {
    const val = new Decimal(Number(one)).times(Number(two)).toNumber();
    if (original) {
      return val;
    }
    const res = Number(new Decimal(val).toFixed(2));
    return isNaN(res) ? NaN : res;
  }
  return NaN;
};

export const minus = (one: any, two: any, original?: boolean) => {
  if (isNumberLike(one) && isNumberLike(two)) {
    const val = new Decimal(Number(one)).minus(Number(two)).toNumber();
    if (original) {
      return val;
    }
    const res = Number(new Decimal(val).toFixed(2));
    return isNaN(res) ? NaN : res;
  }
  return NaN;
};

export const divide = (one: any, two: any) => {
  if (isNumberLike(one) && Number(one) === 0) {
    return 0;
  }
  if (isNumberLike(one) && isNumberLike(two)) {
    const value = Number(new Decimal(Number(one)).div(Number(two)).toFixed(2));
    return isNaN(value) ? NaN : value;
  }
  return NaN;
};

export const truncated = (value: any) => {
  if (isNumberLike(value)) {
    return Number(new Decimal(value).toFixed(2));
  }
  return;
};

export const formatInt = (value: any) => {
  if (isNumberLike(value)) {
    return numeral(new Decimal(value).truncated()).format('0,0');
  }
  return '';
};

export const percentage = (fenzi: any, fenmu: any) => {
  if (isNumberLike(fenzi) && isNumberLike(fenmu)) {
    return new Decimal(Number(fenzi)).times(100).div(Number(fenmu)).toFixed(2);
  }
  return '';
};

export const dividedPecent = (fenzi: any, fenmu: any) => {
  if (isNumberLike(fenzi) && isNumberLike(fenmu)) {
    return new Decimal(Number(fenzi)).times(100).div(Number(fenmu)).toNumber();
  }
  return 0;
};

export const isNumberLike = (value: any) => {
  return String(Number(value)) === String(value);
};

export const isNotZeroLike = (value: any) => {
  return isNumberLike(value) && String(value) !== '0';
};

export const isGreaterZero = (value: any) => {
  return isNumberLike(value) && Number(value) > 0;
};

/**
 * BigNumber 乘以任意数字，返回的结果是近似整数
 * @param num - 原始数
 * @param factor - 乘法因数
 */
export const bigNumMultiple = (num: BigNumber, factor: number): BigNumber => {
  const isFloat = (a: number) => Math.floor(a) !== a;

  if (!isFloat(factor)) {
    return num.mul(factor);
  } else {
    let times = 0;
    let cur = factor;
    while (isFloat(cur)) {
      cur = cur * 10;
      times++;
    }

    return num.mul(cur).div(Math.pow(10, times));
  }
};
