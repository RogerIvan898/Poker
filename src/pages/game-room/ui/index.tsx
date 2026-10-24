import { useLingui } from '@lingui/react/macro';
import { useNavigate } from '@tanstack/react-router';
import { useGate, useUnit } from 'effector-react';
import { ArrowLeft } from 'lucide-react';

import { PokerBoard } from 'widgets/poker-table';
import { Preloader } from 'widgets/preloader';

import { PlayerActions } from 'features/player-actions';

import { gameModel } from 'entities/game';

import { GamePageGate } from '../model';

import styles from './game-room.module.css';

export const GameRoomPage = () => {
  const { t } = useLingui();
  useGate(GamePageGate);

  const navigate = useNavigate();
  const [isLoading] = useUnit([gameModel.$isGameLoading]);

  if (isLoading) {
    return <Preloader label={t`Loading…`} />;
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        dir="auto"
        className={styles.backBtn}
        onClick={() => void navigate({ to: '/' })}
      >
        <ArrowLeft size={14} strokeWidth={2.25} />
        {t`Tables`}
      </button>

      <PokerBoard />
      <PlayerActions />
    </div>
  );
};
