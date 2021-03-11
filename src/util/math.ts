import numeral from 'numeral';

export const format = (value: any) => {
  if (typeof value !== 'number') {
    return;
  }
  return numeral(value).format('0,0.0000');
};

export const percentage = (fenzi: any, fenmu: any) => {
  if (typeof fenzi !== 'number') {
    return;
  }
  if (typeof fenmu !== 'number') {
    return;
  }
  return Math.floor((100 * fenzi) / fenmu);
};
