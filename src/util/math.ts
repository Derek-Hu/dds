import numeral from 'numeral';

export const format = (value: number) => {
    return numeral(value).format('0,0.0000');
}

export const percentage = (fenzi: number, fenmu: number) => {
    return Math.floor(100 * fenzi / fenmu);
}