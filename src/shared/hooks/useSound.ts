import React from 'react';

type PlayOptions = {
  onStart?: () => void;
};

type UseSoundResult = {
  play: (options?: PlayOptions) => void;
  ready: boolean;
};

let audioContext: AudioContext | null = null;

const bufferCache = new Map<string, AudioBuffer>();
const loadPromises = new Map<string, Promise<AudioBuffer>>();

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
};

const loadBuffer = (url: string): Promise<AudioBuffer> => {
  const cached = bufferCache.get(url);

  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = loadPromises.get(url);

  if (pending) {
    return pending;
  }

  const promise = (async () => {
    const context = getAudioContext();

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const decoded = await context.decodeAudioData(arrayBuffer);

    bufferCache.set(url, decoded);

    return decoded;
  })();

  loadPromises.set(url, promise);

  return promise;
};

export const preloadAllSounds = async (urls: string[]): Promise<void> => {
  const results = await Promise.allSettled(urls.map(url => loadBuffer(url)));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(`[Audio] ${urls[index]}`, result.reason);
    }
  });
};

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
