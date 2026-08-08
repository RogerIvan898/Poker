let audioContext: AudioContext | null = null;

export const bufferCache = new Map<string, AudioBuffer>();
const loadPromises = new Map<string, Promise<AudioBuffer>>();

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
};

export const loadBuffer = (url: string) => {
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

export const preloadSounds = async (urls: string[]) => {
  const results = await Promise.allSettled(urls.map(url => loadBuffer(url)));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(`[Audio] ${urls[index]}`, result.reason);
    }
  });
};
