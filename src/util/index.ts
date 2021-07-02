export const shortAddress = (address: string) => (address ? address.replace(/^(.{4})(.*)(.{4})/, '$1...$3') : '');
