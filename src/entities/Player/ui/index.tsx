import { PlayerStatus } from 'shared/constants/player';
import type { Player as PlayerType } from 'shared/types/player';
import type { DirectionType } from 'shared/types/primitives';
import { DealerButton } from 'shared/ui/dealer-button';
import { cn } from 'shared/utils';

import { useTurnTimer } from '../hooks/useTurnTimer';

import { BetBadge, type BetBadgeVariant } from './bet-badge';
import { PlayerAvatar } from './player-avatar';
import { PlayerCards } from './player-cards';
import styles from './Player.module.css';
import { StackBadge } from './stack-badge';

interface Props {
  player: PlayerType;
  currentPlayer?: boolean;
  dealer: boolean;
  turnDurationSec?: number;
  timeBankSec?: number;
  onTurnTimeout?: () => void;
  turn: boolean;
  betPosition?: DirectionType;
  betBadgeVariant?: BetBadgeVariant;
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
  betBadgeVariant = 'chips',
}: Props) => {
  const { status, stack, hand, name } = player;

  const isSitOut = status === PlayerStatus.SITTING_OUT;
  const isFolded = status === PlayerStatus.FOLDED;

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
    <section className={cn(styles.player, isSitOut && styles.sitOut)}>
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
          <BetBadge
            amount={player.committed}
            position={betPosition}
            variant={betBadgeVariant}
          />
        )}
      </div>
    </section>
  );
};
