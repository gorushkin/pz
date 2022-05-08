export interface Note {
  toString(): void;
  get hex(): Buffer;
}

export { LFH } from './fileInfo';
export { CDFH } from './cdfh';
export { EOCD } from './eocd';
