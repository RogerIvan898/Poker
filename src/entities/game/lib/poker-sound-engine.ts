import { getAudioContext } from 'shared/lib/audio';

export type PokerSoundAction = 'fold' | 'check' | 'call' | 'bet' | 'raise';

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

  async playSoftCollection(volume = 0.55) {
    try {
      await this.resume();

      if (!this.context || !this.masterGain) {
        return;
      }

      const gain = this.context.createGain();
      gain.gain.value = volume;
      gain.connect(this.masterGain);
      playSoftCollection(this.context, gain, this.context.currentTime + 0.01);
      window.setTimeout(() => gain.disconnect(), 380);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
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

const createNoiseBuffer = (context: AudioContext, duration: number) => {
  const buffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * duration),
    context.sampleRate
  );
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    const white = Math.random() * 2 - 1;
    channel[index] = white * (0.76 + 0.24 * Math.sin(index * 0.19));
  }

  return buffer;
};

const addNoiseLayer = (
  context: AudioContext,
  destination: AudioNode,
  startTime: number,
  config: {
    duration: number;
    frequency: number;
    q?: number;
    type?: BiquadFilterType;
    level: number;
    attack?: number;
    pan?: number;
  }
) => {
  const {
    duration,
    frequency,
    q = 0.8,
    type = 'bandpass',
    level,
    attack = 0.001,
    pan = 0,
  } = config;
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context, duration + 0.01);

  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(frequency, startTime);
  filter.Q.setValueAtTime(q, startTime);

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, startTime);
  envelope.gain.exponentialRampToValueAtTime(
    Math.max(0.0002, level),
    startTime + attack
  );
  envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  let output: AudioNode = envelope;

  if (typeof context.createStereoPanner === 'function') {
    const panner = context.createStereoPanner();
    panner.pan.setValueAtTime(pan, startTime);
    envelope.connect(panner);
    output = panner;
  }

  source.connect(filter);
  filter.connect(envelope);
  output.connect(destination);
  source.start(startTime);
  source.stop(startTime + duration + 0.015);
};

const addShortSlide = (
  context: AudioContext,
  destination: AudioNode,
  startTime: number,
  duration: number,
  level = 0.035,
  pan = 0
) => {
  addNoiseLayer(context, destination, startTime, {
    duration,
    frequency: 1350 + Math.random() * 650,
    q: 0.35,
    type: 'lowpass',
    level,
    attack: 0.008,
    pan,
  });
};

const addChipClack = (
  context: AudioContext,
  destination: AudioNode,
  startTime: number,
  intensity = 1,
  pan = 0
) => {
  const variation = 0.86 + Math.random() * 0.28;

  addNoiseLayer(context, destination, startTime, {
    duration: 0.012 + Math.random() * 0.008,
    frequency: 2600 + Math.random() * 1700,
    q: 0.65 + Math.random() * 0.8,
    level: 0.19 * intensity * variation,
    attack: 0.0006,
    pan,
  });
  addNoiseLayer(context, destination, startTime + 0.0007, {
    duration: 0.026 + Math.random() * 0.018,
    frequency: 850 + Math.random() * 850,
    q: 0.55 + Math.random() * 0.6,
    level: 0.11 * intensity * variation,
    attack: 0.0012,
    pan: pan * 0.7,
  });
  addNoiseLayer(context, destination, startTime + 0.001, {
    duration: 0.018 + Math.random() * 0.012,
    frequency: 520 + Math.random() * 420,
    q: 0.45,
    type: 'lowpass',
    level: 0.07 * intensity * variation,
    attack: 0.001,
    pan: pan * 0.5,
  });
};

const playSoftCollection = (
  context: AudioContext,
  destination: AudioNode,
  now: number
) => {
  addShortSlide(context, destination, now, 0.085, 0.027, -0.12);
  addChipClack(context, destination, now + 0.012, 0.72, -0.1);
  addChipClack(context, destination, now + 0.067, 0.55, 0.12);
};

export const pokerSoundEngine = new PokerSoundEngine();
