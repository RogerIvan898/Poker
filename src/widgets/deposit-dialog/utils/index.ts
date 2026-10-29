import { toNano } from '@ton/core';

import { DEPOSIT_STEPS_TOTAL } from '../constants';
import type { DepositStep } from '../types';

export const toDepositInputValue = (value: number): string => {
  if (!Number.isFinite(value) || value === 0) {
    return '';
  }

  return String(Number(value.toFixed(9))).replace('.', ',');
};

export const buildTonTransferLink = (
  address: string,
  amount: number,
  memo?: string
): string => {
  const nanotons = toNano(amount.toFixed(9));

  const params = new URLSearchParams({ amount: nanotons.toString() });

  if (memo) {
    params.set('text', memo);
  }

  return `ton://transfer/${encodeURIComponent(address)}?${params}`;
};

export const getDepositStepNumber = (step: DepositStep): number =>
  DEPOSIT_STEPS_TOTAL.indexOf(step) + 1;
