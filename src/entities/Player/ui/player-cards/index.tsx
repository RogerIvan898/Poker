import React from 'react';

import { Card } from 'entities/card';

import { useSound } from 'shared/hooks/useSound';
import type { Player } from 'shared/types/player';
import { cn } from 'shared/utils';

import styles from './player-cards.module.css';

interface Props {
  cards: Player['hand'];
  needSound?: boolean;
}

const SECOND_CARD_DELAY_MS = 450;

export const PlayerCards = ({ cards, needSound = false }: Props) => {
  const { play: playCardSound, ready } = useSound(cardDealSound);

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

  if (!cards || cards.length < 2) {
    return null;
  }

  return (
    <div className={styles.cards}>
      <div className={cn(styles.cardSlot, showFirst && styles.visible)}>
        <Card card={cards[0]} flat />
      </div>

      <div className={cn(styles.cardSlot, showSecond && styles.visible)}>
        <Card card={cards[1]} flat />
      </div>
    </div>
  );
};
