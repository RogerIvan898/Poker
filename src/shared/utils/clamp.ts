export const clamp: (value: number, min: number, max: number) => number = (
  value,
  min,
  max
) => Math.min(max, Math.max(min, value));
