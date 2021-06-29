export const shortAddress = (address: string, prefixLong: boolean = false) => {
  if (!address) {
    return '';
  }

  return prefixLong
    ? address.replace(/^(.{10})(.*)(.{4})/, '$1...$3')
    : address.replace(/^(.{6})(.*)(.{4})/, '$1...$3');
};
