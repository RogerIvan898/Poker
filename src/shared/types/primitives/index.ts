import { Direction } from 'shared/constants/primitives';

export type DirectionType = (typeof Direction)[keyof typeof Direction];
