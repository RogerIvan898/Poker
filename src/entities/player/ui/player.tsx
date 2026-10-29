import { cn } from 'shared/utils';

import { useTurnTimer } from '../hooks';
import {
  isBlindBadge,
  resolveSeatActionBadge,
  shouldShowHoleCards,
} from '../lib';
import {
  PlayerStatus,
  type BetPosition,
  type BlindRole,
  type Player as PlayerType,
} from '../model';

import { ActionBadge } from './action-badge';
import { BetBadge } from './bet-badge';
import { DealerButton } from './dealer-button';
import { PlayerAvatar } from './player-avatar';
import { PlayerCards } from './player-cards';
import styles from './player.module.css';
import { StackBadge } from './stack-badge';

interface Props {
  player: PlayerType;
  currentPlayer?: boolean;
  dealer: boolean;
  blindRole?: BlindRole | null;
  turnDurationSec?: number;
  timeBankSec?: number;
  onTurnTimeout?: () => void;
  turn: boolean;
  betPosition?: BetPosition;
  /** Bets are flying into the pot: hide seat badges and animate bet chips. */
  collecting?: boolean;
  reveal?: boolean;
  winAmount?: number;
  winId?: number;
}

export const Player = ({
  player,
  currentPlayer = false,
  turnDurationSec = 15,
  timeBankSec = 10,
  onTurnTimeout,
  dealer = false,
  blindRole = null,
  turn = false,
  betPosition = 'top',
  reveal = false,
  winAmount,
  winId,
  collecting = false,
}: Props) => {
  const { status, stack, hand, name } = player;

  const isSitOut = status === PlayerStatus.SITTING_OUT;
  const isFolded = status === PlayerStatus.FOLDED;

  const seatActionBadge = resolveSeatActionBadge(
    player.lastAction,
    player.status,
    blindRole
  );

  const { showTimer, usingBank, progress } = useTurnTimer({
    isTurn: turn,
    turnDurationSec,
    timeBankSec,
    onTurnTimeout,
    playSound: currentPlayer,
  });

  const showCards = shouldShowHoleCards({
    hand,
    status,
    currentPlayer,
    reveal,
  });

  const cardsKey =
    hand && hand.length >= 2
      ? `${hand[0].rank}-${hand[0].suit}|${hand[1].rank}-${hand[1].suit}`
      : 'hidden';

  return (
    <section className={cn(styles.player, isSitOut && styles.sitOut)}>
      <div className={styles.mainContainer}>
        <div className={styles.avatarWrap}>
          {showCards && (
            <PlayerCards
              key={cardsKey}
              cards={hand}
              needSound={currentPlayer && Boolean(hand)}
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

        <div className={styles.stackArea}>
          {seatActionBadge && !collecting && (
            <ActionBadge
              action={seatActionBadge}
              amount={
                isBlindBadge(seatActionBadge)
                  ? undefined
                  : (player.lastActionAmount ?? undefined)
              }
            />
          )}

          <StackBadge
            amount={stack}
            name={name}
            folded={isFolded}
            sitOut={isSitOut}
            turnActive={showTimer}
            turnProgress={progress}
            usingBank={usingBank}
            winAmount={winAmount}
            winId={winId}
          />
        </div>

        {player.committed > 0 && (
          <BetBadge
            amount={player.committed}
            position={betPosition}
            seat={player.seat}
            collecting={collecting}
          />
        )}
      </div>
    </section>
  );
};
