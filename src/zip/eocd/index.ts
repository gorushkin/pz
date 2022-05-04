import { Note } from '..';
import { EOCD_SIGNATURE } from './constants';

export class EOCD implements Note {
  private signature: number;

  constructor(
    private totalCentralDirectoryRecord: number,
    private sizeOfCentralDirectory: number,
    private centralDirectoryOffset: number
  ) {
    this.signature = EOCD_SIGNATURE;
  }
  get hex(): Buffer {
    throw new Error('Method not implemented.');
  }

  toString() {
    return `${this.signature}:${this.totalCentralDirectoryRecord}:${this.sizeOfCentralDirectory}:${this.centralDirectoryOffset}`;
  }
}
