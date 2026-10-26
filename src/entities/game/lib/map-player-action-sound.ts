import { PlayerAction, PlayerStatus } from 'entities/player/model/constants';
import type {
  PlayerActionType,
  PlayerStatusType,
} from 'entities/player/model/types';

import type { PokerSoundAction } from './poker-sound-engine';

const ACTION_SOUNDS: Record<PlayerActionType, PokerSoundAction> = {
  [PlayerAction.FOLD]: 'fold',
  [PlayerAction.CHECK]: 'check',
  [PlayerAction.CALL]: 'call',
  [PlayerAction.BET]: 'bet',
  [PlayerAction.RAISE]: 'raise',
};

export const mapPlayerActedToSound = (
  action: PlayerActionType,
  status: PlayerStatusType
): PokerSoundAction =>
  status === PlayerStatus.ALL_IN ? 'all-in' : ACTION_SOUNDS[action];
