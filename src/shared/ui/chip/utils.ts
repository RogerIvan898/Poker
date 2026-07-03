export type ChipColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'black'
  | 'purple'
  | 'orange';

export interface ChipDenomination {
  value: number;
  color: ChipColor;
  label: string;
}

const DENOM_CONFIG: { value: number; color: ChipColor; label: string }[] = [
  { value: 1000, color: 'black', label: '1K' },
  { value: 100, color: 'green', label: '100' },
  { value: 50, color: 'blue', label: '50' },
  { value: 10, color: 'red', label: '10' },
  { value: 1, color: 'orange', label: '1' },
];

export const CHIP_DENOMINATIONS = DENOM_CONFIG;

export const CHIP_LAYER_STEP = 6;
export const MAX_STACK_CHIPS = 8;

export function formatChipLabel(value: number): string {
  if (value >= 1000) {
    return value % 1000 === 0
      ? `${value / 1000}K`
      : `${(value / 1000).toFixed(1)}K`;
  }
  return String(value);
}

/** Разбивает сумму ставки на отдельные фишки (крупные номиналы внизу стопки). */
export function breakdownBet(amount: number): ChipDenomination[] {
  if (amount <= 0) return [];

  let remaining = amount;
  const chips: ChipDenomination[] = [];

  for (const denom of CHIP_DENOMINATIONS) {
    const count = Math.floor(remaining / denom.value);
    for (let i = 0; i < count; i++) {
      chips.push(denom);
    }
    remaining %= denom.value;
  }

  if (!chips.length) {
    chips.push({
      value: amount,
      color: 'purple',
      label: formatChipLabel(amount),
    });
  }

  if (chips.length <= MAX_STACK_CHIPS) {
    return chips;
  }

  // Слишком много фишек — снизу реальные номиналы, сверху одна с полной суммой
  const base = chips.slice(0, MAX_STACK_CHIPS - 1);
  base.push({
    value: amount,
    color: 'black',
    label: formatChipLabel(amount),
  });

  return base;
}

export function stackHeight(
  chipCount: number,
  chipSize: number,
  step = CHIP_LAYER_STEP
): number {
  return chipSize + Math.max(0, chipCount - 1) * step;
}
