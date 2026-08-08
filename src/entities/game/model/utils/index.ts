import { getAudioContext, preloadSounds } from 'shared/lib/audio';
import type { Card, CardRank } from 'shared/types/card';
import type { Player } from 'shared/types/player';
import { createSocket } from 'shared/utils/socket';

import { GAME_SOUNDS, SuitMap } from '../constants';
import type { PlayerInfo, ServerGameEvent } from '../types';

export const parseCard = (cardString: string): Card => {
  const rawSuit = cardString.slice(-1) as keyof typeof SuitMap;
  const suit = SuitMap[rawSuit];

  const rank = cardString.slice(0, -1) as CardRank;

  return {
    rank,
    suit,
  };
};

export const mapPlayerInfoToPlayer = (
  playerInfo: PlayerInfo,
  seat: number
): Player => ({
  id: playerInfo.id,
  name: playerInfo.name,
  stack: playerInfo.stack,
  seat,
  status: playerInfo.status,
  committed: 0,
  hand: null,
});

const isServerGameEvents = (data: unknown): data is ServerGameEvent =>
  typeof data === 'object' && data !== null && 'type' in data;

export const initializeAudio = async () => {
  const audioContext = getAudioContext();

  if (audioContext.state == 'suspended') {
    await audioContext.resume();
  }

  return preloadSounds(GAME_SOUNDS);
};

export const createGameSocket = (
  wsUrl: string,
  onMessage: (data: ServerGameEvent) => void
) =>
  createSocket(wsUrl, {
    onMessage: data => {
      if (isServerGameEvents(data)) {
        onMessage(data);
      } else {
        console.warn('[WS] Recived non-game event:', data);
      }
    },
  });
