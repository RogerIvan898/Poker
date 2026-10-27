export type PreAction = 'check' | 'check_fold' | 'call';

export type PreActionDecision = 'check' | 'fold' | 'call';

export interface PreActionOptions {
  canCheck: boolean;
  canCall: boolean;
}

const PRE_ACT_STATUSES = new Set(['IN_GAME', 'RAISE']);

export const canPreAct = (status: string | undefined) =>
  Boolean(status && PRE_ACT_STATUSES.has(status));

export const chipsToCall = (
  currentBet: number,
  committed: number,
  stack: number
) => Math.min(Math.max(0, stack), Math.max(0, currentBet - committed));

export const formatCallBb = (amount: number, bigBlind: number) => {
  if (bigBlind <= 0) {
    return String(amount);
  }

  const blinds = amount / bigBlind;
  const rounded = Math.round(blinds * 10) / 10;

  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

export const isPreActionStale = (preAction: PreAction, toCall: number) => {
  if (preAction === 'check') {
    return toCall > 0;
  }

  if (preAction === 'call') {
    return toCall === 0;
  }

  return false;
};

export const decidePreAction = (
  preAction: PreAction,
  allowed: PreActionOptions
): PreActionDecision | null => {
  if (preAction === 'check') {
    return allowed.canCheck ? 'check' : null;
  }

  if (preAction === 'check_fold') {
    return allowed.canCheck ? 'check' : 'fold';
  }

  return allowed.canCall ? 'call' : null;
};
