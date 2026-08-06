import { formatAmountDraft } from 'shared/utils';

import type { WithdrawDestination } from '../model/types';

export const getWithdrawButtonLabel = ({
  destination,
  connectedAddress,
  amount,
}: {
  destination: WithdrawDestination;
  connectedAddress?: string;
  amount: number;
}) => {
  if (destination === 'wallet' && !connectedAddress) {
    return 'Connect wallet to withdraw';
  }

  return `Withdraw${amount > 0 ? ` ${formatAmountDraft(amount)} TON` : ''}`;
};
