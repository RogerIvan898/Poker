export const formatChipAmount = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

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
