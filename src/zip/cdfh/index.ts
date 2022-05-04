import { Note } from '..';
import { CDFH_SIGNATURE } from './constants';

export class CDFH implements Note {
  private signature: number;

  constructor(private offset: number, private filename: string) {
    this.signature = CDFH_SIGNATURE;
  }
  get hex(): Buffer {
    throw new Error('Method not implemented.');
  }

  toString() {
    return `${this.signature}:${this.offset}:${this.filename}:`;
  }
}
