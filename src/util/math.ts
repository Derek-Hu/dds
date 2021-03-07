import numeral from 'numeral';

export const format = (value: number) => {
    return numeral(value).format('0,0.0000');
}