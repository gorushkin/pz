export interface Note {
  toString(): void;
  get hex(): Buffer;
}

export { LFH } from './lfh';
export { CDFH } from './cdfh';
export { EOCD } from './eocd';
