import React from 'react';

import { Card } from 'entities/card';
import { Sound } from 'shared/assets/sounds';
import { useSound } from 'shared/hooks/useSound';
import { cn } from 'shared/utils';

import type { Player } from '../../model/types';

import styles from './player-cards.module.css';

interface Props {
  cards: Player['hand'];
  needSound?: boolean;
}

const SECOND_CARD_DELAY_MS = 450;

export const PlayerCards = ({ cards, needSound = false }: Props) => {
  const { play: playCardSound, ready } = useSound(Sound.CARD_REVEAL);

  const [showFirst, setShowFirst] = React.useState(false);
  const [showSecond, setShowSecond] = React.useState(false);

  const cardsKey =
    cards && cards.length >= 2
      ? `${cards[0].rank}-${cards[0].suit}|${cards[1].rank}-${cards[1].suit}`
      : '';

  React.useEffect(() => {
    if (!cardsKey) {
      setShowFirst(false);
      setShowSecond(false);

      return;
    }

    if (needSound && !ready) {
      return;
    }

    setShowFirst(false);
    setShowSecond(false);

    const revealFirst = () => setShowFirst(true);
    const revealSecond = () => setShowSecond(true);

    if (needSound) {
      playCardSound({ onStart: revealFirst });
    } else {
      revealFirst();
    }

    const showSecondTimer = window.setTimeout(() => {
      if (needSound) {
        playCardSound({ onStart: revealSecond });
      } else {
        revealSecond();
      }
    }, SECOND_CARD_DELAY_MS);

    return () => {
      window.clearTimeout(showSecondTimer);
    };
  }, [cardsKey, needSound, ready, playCardSound]);

  const faceUp = Boolean(cards && cards.length >= 2);
  const leftCard = faceUp && cards ? cards[0] : null;
  const rightCard = faceUp && cards ? cards[1] : null;

  return (
    <div className={styles.cards}>
      <div
        className={cn(
          styles.cardSlot,
          (showFirst || !faceUp) && styles.visible
        )}
      >
        <Card card={leftCard} flat />
      </div>

      <div
        className={cn(
          styles.cardSlot,
          (showSecond || !faceUp) && styles.visible
        )}
      >
        <Card card={rightCard} flat />
      </div>
    </div>
  );
};
