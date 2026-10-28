export const formatChipAmount = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

export const formatCompactNumber = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}K`;

  return String(value);
};
