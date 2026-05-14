import { cn } from 'shared/utils';

import styles from './turn-timer.module.css';

const TIMER_RADIUS = 45;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

interface Props {
  urgent: boolean;
  remainingSeconds: number;
  progress: number;
}

export const TurnTimer = ({ urgent, remainingSeconds, progress }: Props) => {
  const dashoffset = TIMER_CIRCUMFERENCE * (1 - progress);

  return (
    <div className={cn(styles.turnTimer)} aria-hidden>
      <svg viewBox="0 0 100 100" className={styles.timerSvg}>
        <circle
          cx="50"
          cy="50"
          r={TIMER_RADIUS}
          stroke="var(--timer-bg, rgba(255,255,255,0.08))"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={TIMER_RADIUS}
          stroke={
            urgent ? 'var(--timer-urgent, #ff4d4f)' : 'rgba(0, 255, 204, 0.7)'
          }
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${TIMER_CIRCUMFERENCE} ${TIMER_CIRCUMFERENCE}`}
          strokeDashoffset={dashoffset}
          strokeLinecap="butt"
        />
      </svg>

      <div className={styles.timerLabel}>{remainingSeconds}</div>
    </div>
  );
};
