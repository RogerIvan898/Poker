import { msg } from '@lingui/core/macro';
import { Plural, useLingui } from '@lingui/react/macro';
import { useNavigate } from '@tanstack/react-router';
import { useUnit } from 'effector-react';
import { Coins, Loader2, Swords, Users } from 'lucide-react';

import { roomJoinModel } from 'features/join-room';

import { cn } from 'shared/utils';

import type { RoomListItem } from '../rooms';

import styles from './room-card.module.css';

export type RoomMode = 'cash' | 'heads-up';

const MODE_LABELS = {
  cash: msg`Cash`,
  'heads-up': msg`Heads-Up`,
} as const;

interface Props {
  room: RoomListItem;
}

export const RoomCard = ({ room }: Props) => {
  const { i18n, t } = useLingui();
  const navigate = useNavigate();

  const [joinRoomFx, joiningRoomId] = useUnit([
    roomJoinModel.joinRoomFx,
    roomJoinModel.$joiningRoomId,
  ]);

  const isFull = room.players >= room.max;
  const occupancy = Math.min(100, (room.players / room.max) * 100);
  const isJoiningRoom = joiningRoomId === String(room.id);
  const isJoiningAny = Boolean(joiningRoomId);
  const isJoinDisabled = isFull || isJoiningAny;
  const isHeadsUp = room.mode === 'heads-up';

  const handleJoin = async () => {
    if (isJoinDisabled) {
      return;
    }

    try {
      const { roomId, wsUrl } = await joinRoomFx(String(room.id));

      void navigate({
        to: '/game/$roomId',
        params: { roomId },
        state: { wsUrl },
      });
    } catch (error) {
      console.error('Failed to join room', error);
    }
  };

  return (
    <article className={cn(styles.card, isFull && styles.cardFull)}>
      <div className={styles.header}>
        <h3 className={styles.name}>{i18n._(room.name)}</h3>
        <div
          className={cn(
            styles.badge,
            isHeadsUp ? styles.badgeHeadsUp : styles.badgeCash
          )}
        >
          {isHeadsUp ? (
            <Swords size={12} strokeWidth={2.5} />
          ) : (
            <Coins size={12} strokeWidth={2.5} />
          )}
          <span>{i18n._(MODE_LABELS[room.mode])}</span>
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t`Blinds`}</span>
          <span className={styles.metaValue}>{room.blinds}</span>
        </div>
        <div className={styles.metaDivider} />
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t`Min buy-in`}</span>
          <span className={styles.metaValue}>{room.minBuy}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.playersSection}>
          <div
            className={cn(styles.playersCount, isFull && styles.playersFull)}
          >
            <Users size={16} className={styles.usersIcon} />
            <span>
              {room.players} / {room.max}{' '}
              <Plural value={room.max} one="player" other="players" />
            </span>
          </div>

          <div className={styles.occupancy}>
            <div
              className={cn(
                styles.occupancyFill,
                isFull && styles.occupancyFull
              )}
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          className={cn(
            styles.playBtn,
            isJoinDisabled && styles.playBtnDisabled
          )}
          disabled={isJoinDisabled}
          onClick={() => void handleJoin()}
        >
          {isFull ? (
            <>
              <Users size={16} />
              {t`Table full`}
            </>
          ) : isJoiningRoom ? (
            <>
              <Loader2 size={16} className={styles.spin} />
              {t`Joining…`}
            </>
          ) : (
            t`Play`
          )}
        </button>
      </div>
    </article>
  );
};
