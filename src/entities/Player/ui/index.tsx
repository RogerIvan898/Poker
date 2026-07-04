import { cn } from 'shared/utils';
import type { Player as PlayerType } from 'shared/types/player';

import { PLAYER_STATUSES } from 'shared/constants/player';
import type { DirectionType } from 'shared/types/primitives';

import { useTurnTimer } from '../hooks/useTurnTimer';

import { DealerButton } from 'shared/ui/dealer-button';

import styles from './Player.module.css';
import { BetBadge } from './bet-badge';
import { PlayerAvatar } from './player-avatar';
import { PlayerCards } from './player-cards';
import { StackBadge } from './stack-badge';

interface Props {
  player: PlayerType;
  currentPlayer?: boolean;
  dealer: boolean;
  turnDurationSec?: number;
  timeBankSec?: number;
  onTurnTimeout?: () => void;
  turn: boolean;
  bet: number | null;
  betPosition?: DirectionType;
}

export const Player = ({
  player,
  currentPlayer = false,
  turnDurationSec = 15,
  timeBankSec = 10,
  onTurnTimeout,
  dealer = false,
  turn = false,
  betPosition = 'top',
}: Props) => {
  const { status, stack, hand, name } = player;

  const isSitOut = status === PLAYER_STATUSES.SITTING_OUT;
  const isFolded = status === PLAYER_STATUSES.FOLDED;

  const { showTimer, usingBank, progress } = useTurnTimer({
    isTurn: turn,
    turnDurationSec,
    timeBankSec,
    onTurnTimeout,
    playSound: currentPlayer,
  });

  const canShowCards =
    hand && hand.length >= 2 && (!isFolded || !currentPlayer);

  const cardsKey =
    hand && hand.length >= 2
      ? `${hand[0].rank}-${hand[0].suit}|${hand[1].rank}-${hand[1].suit}`
      : 'hidden';

  return (
    <section
      className={cn(
        styles.player,
        isFolded && styles.folded,
        isSitOut && styles.sitOut,
        currentPlayer && styles.isCurrentPlayer
      )}
    >
      <div className={styles.mainContainer}>
        <div className={styles.avatarWrap}>
          {canShowCards && (
            <PlayerCards
              key={cardsKey}
              cards={hand}
              needSound={currentPlayer}
            />
          )}

          <PlayerAvatar
            name={name}
            folded={isFolded}
            currentPlayer={currentPlayer}
          />

          {dealer && (
            <div
              className={cn(styles.dealerWrap, styles[`dealer_${betPosition}`])}
            >
              <DealerButton compact />
            </div>
          )}
        </div>

        <StackBadge
          amount={stack}
          name={name}
          folded={isFolded}
          sitOut={isSitOut}
          turnActive={showTimer}
          turnProgress={progress}
          usingBank={usingBank}
        />

        {player.committed > 0 && (
          <BetBadge amount={player.committed} position={betPosition} />
        )}
      </div>
    </section>
  );
};
