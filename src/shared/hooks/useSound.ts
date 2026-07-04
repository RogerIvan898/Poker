import React from 'react';

let audioContext: AudioContext | null = null;

export const useSound = (url: string) => {
  const bufferRef = React.useRef<AudioBuffer | null>(null);

  const play = React.useCallback(() => {
    if (!audioContext || !bufferRef.current) {
      return;
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(audioContext.destination);

    source.start(0);
  }, []);

  React.useEffect(() => {
    if (!audioContext) {
      audioContext = new AudioContext();
    }

    let isMounted = true;

    const preloadSound = async () => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedData =
        (await audioContext?.decodeAudioData(arrayBuffer)) ?? null;

      if (isMounted) {
        bufferRef.current = decodedData;
      }
    };

    preloadSound();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return play;
};
