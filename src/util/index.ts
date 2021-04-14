export const shortAddress = (address: string) => (address ? address.replace(/^(.{6})(.*)(.{4})/, '$1...$3') : '');
