import { PlayerAction, PlayerStatus } from 'entities/player/model/constants';
import type {
  PlayerActionType,
  PlayerStatusType,
} from 'entities/player/model/types';

import { getAudioContext } from 'shared/lib/audio';

export type PokerSoundAction =
  | 'fold'
  | 'check'
  | 'call'
  | 'bet'
  | 'raise'
  | 'all-in';

export const mapPlayerActedToSound = (
  action: PlayerActionType,
  status: PlayerStatusType
): PokerSoundAction => {
  if (status === PlayerStatus.ALL_IN) {
    return 'all-in';
  }

  switch (action) {
    case PlayerAction.FOLD:
      return 'fold';
    case PlayerAction.CHECK:
      return 'check';
    case PlayerAction.CALL:
      return 'call';
    case PlayerAction.BET:
      return 'bet';
    case PlayerAction.RAISE:
      return 'raise';
    default:
      return 'call';
  }
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

      switch (action) {
        case 'fold':
          this.playSingleSwoosh();
          break;
        case 'check':
          this.playSingleClick(1.0, 1.0, true);
          break;
        case 'call':
          this.playSingleClick(1.0, 0.8, false);
          break;
        case 'bet':
          this.playSingleClick(1.25, 0.9, false);
          break;
        case 'raise':
          this.playSingleClick(1.6, 1.0, false);
          break;
        case 'all-in':
          this.playSingleClick(0.6, 1.3, false);
          this.playSingleSwoosh();
          break;
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }
}

export const pokerSoundEngine = new PokerSoundEngine();
