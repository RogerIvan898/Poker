import { getAudioContext } from 'shared/lib/audio';

export type PokerSoundAction =
  | 'fold'
  | 'check'
  | 'call'
  | 'bet'
  | 'raise'
  | 'all-in';

interface ClickRecipe {
  pitch: number;
  volume: number;
  soft: boolean;
}

interface SoundRecipe {
  clicks: ClickRecipe[];
  swoosh: boolean;
}

const ACTION_SOUND_RECIPES: Record<PokerSoundAction, SoundRecipe> = {
  fold: { clicks: [], swoosh: true },
  check: { clicks: [{ pitch: 1, volume: 1, soft: true }], swoosh: false },
  call: { clicks: [{ pitch: 1, volume: 0.8, soft: false }], swoosh: false },
  bet: { clicks: [{ pitch: 1.25, volume: 0.9, soft: false }], swoosh: false },
  raise: { clicks: [{ pitch: 1.6, volume: 1, soft: false }], swoosh: false },
  'all-in': {
    clicks: [{ pitch: 0.6, volume: 1.3, soft: false }],
    swoosh: true,
  },
};

export class PokerSoundEngine {
  private context: AudioContext | null = null;

  private masterGain: GainNode | null = null;

  private noiseBuffer: AudioBuffer | null = null;

  private masterVolume = 0.65;

  init(context = getAudioContext()) {
    if (this.context) {
      return true;
    }

    this.context = context;
    this.masterGain = context.createGain();
    this.masterGain.gain.value = this.masterVolume;
    this.masterGain.connect(context.destination);

    const length = context.sampleRate * 0.5;
    this.noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return true;
  }

  async resume() {
    if (!this.context) {
      this.init();
    }

    if (this.context && this.context.state !== 'running') {
      await this.context.resume();
    }
  }

  setVolume(value: number) {
    this.masterVolume = Math.max(0, Math.min(1, value));

    if (this.masterGain && this.context) {
      this.masterGain.gain.setTargetAtTime(
        this.masterVolume,
        this.context.currentTime,
        0.01
      );
    }
  }

  playSingleClick(pitchOffset = 1, volume = 1, isSoft = false) {
    if (!this.context || !this.masterGain || !this.noiseBuffer) {
      return;
    }

    const time = this.context.currentTime + 0.01;
    const osc = this.context.createOscillator();
    const oscGain = this.context.createGain();
    osc.type = 'sine';

    const startFreq = isSoft ? 350 : 800 * pitchOffset;
    const endFreq = isSoft ? 80 : 100 * pitchOffset;

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.02);

    oscGain.gain.setValueAtTime(0, time);
    oscGain.gain.linearRampToValueAtTime(1.0 * volume, time + 0.002);
    oscGain.gain.exponentialRampToValueAtTime(
      0.001,
      time + (isSoft ? 0.05 : 0.035)
    );

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.06);

    if (!isSoft) {
      const noiseSrc = this.context.createBufferSource();
      noiseSrc.buffer = this.noiseBuffer;

      const noiseFilter = this.context.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 4000;

      const noiseGain = this.context.createGain();
      noiseGain.gain.setValueAtTime(0, time);
      noiseGain.gain.linearRampToValueAtTime(0.35 * volume, time + 0.001);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noiseSrc.start(time);
      noiseSrc.stop(time + 0.02);
    }
  }

  playSingleSwoosh() {
    if (!this.context || !this.masterGain || !this.noiseBuffer) {
      return;
    }

    const time = this.context.currentTime + 0.01;
    const noiseSrc = this.context.createBufferSource();
    noiseSrc.buffer = this.noiseBuffer;

    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.2, time + 0.03);
    gain.gain.linearRampToValueAtTime(0, time + 0.12);

    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSrc.start(time);
    noiseSrc.stop(time + 0.12);
  }

  async playAction(action: PokerSoundAction) {
    try {
      await this.resume();
      const recipe = ACTION_SOUND_RECIPES[action];

      recipe.clicks.forEach(({ pitch, volume, soft }) => {
        this.playSingleClick(pitch, volume, soft);
      });

      if (recipe.swoosh) {
        this.playSingleSwoosh();
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }
}

export const pokerSoundEngine = new PokerSoundEngine();
