import { DIRECTIONS } from 'shared/constants/primitives';

export type DirectionType = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];
