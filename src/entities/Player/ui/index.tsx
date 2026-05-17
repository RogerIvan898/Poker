import { cn } from 'shared/utils';
import type { Player as PlayerType } from 'shared/types/player';

import { PLAYER_STATUSES } from 'shared/constants/player';

import { useTurnTimer } from '../hooks/useTurnTimer';

import styles from './Player.module.css';
import { BetBadge } from './bet-badge';
import { PlayerAvatar } from './player-avatar';
import { TurnTimer } from './turn-timer';
import { PlayerCards } from './player-cards';
import { StackBadge } from './stack-badge';

type CardPosition = 'top' | 'bottom' | 'left' | 'right';

interface Props {
  player: PlayerType;
  cardsPosition?: CardPosition;
  currentPlayer?: boolean;
  dealer: boolean;
  turnDurationSec?: number;
  timeBankSec?: number;
  onTurnTimeout?: () => void;
  turn: boolean;
  bet: number | null;
  betPosition?: CardPosition;
  debug?: boolean;
}

export const Player = ({
  player,
  cardsPosition = 'top',
  currentPlayer = false,
  turnDurationSec = 15,
  timeBankSec = 10,
  onTurnTimeout,
  dealer = false,
  turn = false,
  debug = true,
}: Props) => {
  const { status, stack, hand, name } = player;

  const isSitOut = status === PLAYER_STATUSES.SITTING_OUT;
  const isFolded = status === PLAYER_STATUSES.FOLDED;

  const { remainingSeconds, showTimer, urgent, progress } = useTurnTimer({
    isTurn: turn,
    turnDurationSec,
    timeBankSec,
    onTurnTimeout,
  });

  const canShowCards =
    hand && hand.length >= 2 && (!isFolded || !currentPlayer);

  return (
    <section
      className={cn(
        styles.player,
        isFolded && styles.folded,
        isSitOut && styles.sitOut
      )}
    >
      <div className={styles.name}>{name}</div>

      <div className={styles.mainContainer}>
        <div className={styles.avatarWrap}>
          {showTimer && (
            <TurnTimer
              urgent={urgent}
              remainingSeconds={remainingSeconds}
              progress={progress}
            />
          )}

          <PlayerAvatar
            name={name}
            folded={isFolded}
            turn={turn}
            currentPlayer={currentPlayer}
            hideBorder={showTimer}
          />

          {dealer && <div className={styles.dealerBadge}>D</div>}
        </div>

        <BetBadge bet={100} position={'top'} />

        {canShowCards && (
          <PlayerCards
            cards={hand}
            position={cardsPosition}
            reveal={currentPlayer || debug}
          />
        )}
      </div>

      <StackBadge amount={stack} />
    </section>
  );
};
