export const getSymbol = (suit: string) => {
  switch (suit) {
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    case 'spades':
      return '♠';
    default:
      return '';
  }
};

export function cn(
  ...args: (string | number | boolean | undefined | null)[]
): string {
  let result = '';

  for (const value of args) {
    if (!value) continue;

    if (result) result += ' ';

    result += value;
  }

  return result;
}

export const getInitialLetter = (name: string) =>
  name ? name.charAt(0).toUpperCase() : '?';

export { clamp } from './clamp';
export { formatAddress } from './format-address';
export { formatAmountDraft } from './format-amount-draft';
export { isTonAddress } from './is-ton-address';
