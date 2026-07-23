export const sanitizeNumber = (value: string, maxDecimals: number) => {
  let clean = value.replace(',', '.').replace(/[^0-9.]/g, '');

  if (maxDecimals === 0) {
    return clean.replace(/\./g, '');
  }

  const parts = clean.split('.');

  if (parts.length > 2) {
    clean = `${parts[0]}.${parts.slice(1).join('')}`;
  }

  const [integer, fraction] = clean.split('.');

  if (fraction !== undefined) {
    return `${integer}.${fraction.slice(0, maxDecimals)}`;
  }

  return clean;
};
