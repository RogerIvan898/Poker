export const formatAmount = (value: number, fractionDigits = 2) =>
  Number.isInteger(value) ? String(value) : value.toFixed(fractionDigits);

export const formatCompactNumber = (value: number): string => {
  if (value >= 1_000_000) {
    const rounded = Math.round(value / 100_000);

    return `${Math.floor(rounded / 10)}.${rounded % 10}M`;
  }

  if (value >= 10_000) {
    const rounded = Math.round(value / 100);

    return `${Math.floor(rounded / 10)}.${rounded % 10}K`;
  }

  return String(value);
};

export const truncateMiddle = (
  value: string,
  chars = 4,
  separator = '...'
): string => {
  if (value.length <= chars * 2 + separator.length) {
    return value;
  }

  return `${value.slice(0, chars)}${separator}${value.slice(-chars)}`;
};

export const getInitialLetter = (value: string, fallback = ''): string =>
  value.trim().charAt(0).toUpperCase() || fallback;
