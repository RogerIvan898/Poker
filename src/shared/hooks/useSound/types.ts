export interface PlayOptions {
  onStart?: () => void;
}

export interface UseSoundResult {
  play: (options?: PlayOptions) => void;
  ready: boolean;
}
