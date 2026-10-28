import { toNano } from '@ton/core';

export const buildTonTransferLink = (
  address: string,
  amount: number,
  memo?: string
) => {
  const params = new URLSearchParams({
    amount: toNano(amount.toString()).toString(),
  });

  if (memo) {
    params.set('text', memo);
  }

  return `ton://transfer/${address}?${params.toString()}`;
};
