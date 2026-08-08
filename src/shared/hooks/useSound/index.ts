import React from 'react';

import { bufferCache, getAudioContext, loadBuffer } from 'shared/lib/audio';

import type { PlayOptions, UseSoundResult } from './types';

export const useSound = (url: string): UseSoundResult => {
  const [ready, setReady] = React.useState(() => bufferCache.has(url));
  const pendingPlaysRef = React.useRef<PlayOptions[]>([]);

  const play = React.useCallback(
    (options?: PlayOptions) => {
      const runPlay = (buffer: AudioBuffer, onStart?: () => void) => {
        const context = getAudioContext();

        if (context.state === 'suspended') {
          void context.resume();
        }

        const source = context.createBufferSource();

        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);
        onStart?.();
      };

      const cached = bufferCache.get(url);

      if (cached) {
        runPlay(cached, options?.onStart);

        return;
      }

      pendingPlaysRef.current.push(options ?? {});

      void loadBuffer(url).then(buffer => {
        const queued = pendingPlaysRef.current.splice(0);

        queued.forEach(({ onStart }) => runPlay(buffer, onStart));
      });
    },
    [url]
  );

  React.useEffect(() => {
    let isMounted = true;

    void loadBuffer(url).then(() => {
      if (isMounted) {
        setReady(true);
      }
    });

    return () => {
      isMounted = false;
      pendingPlaysRef.current = [];
    };
  }, [url]);

  return { play, ready };
};
