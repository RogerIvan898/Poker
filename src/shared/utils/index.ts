export const getSymbol = (suit: string) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
    default: return '';
  }
};

export const cn = (...classes: (string | undefined | boolean)[]) => 
  classes.filter(Boolean).join(' ');

export const getInitialLetter = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');
