export interface IFileInfo {
  filename: string;
  fileNameLength: number;
  size: number;
  lfh: LFH;
  cdfh?: CDFH;
  offset: number;
}

const LFH_SIGNATURE = '504b0304';
const CDFH_SIGNATURE = '504b1020';
const EOCD_SIGNATURE = '504b5060';

interface Note {
  toString(): void;
}

export class LFH implements Note {
  private signature: string;

  constructor(private size: number, private fileNameLength: number) {
    this.signature = LFH_SIGNATURE;
  }

  toString() {
    return `${this.signature}:${this.size}:${this.fileNameLength}`;
  }
}

export class CDFH implements Note {
  private signature: string;

  constructor(private offset: number, private filename: string) {
    this.signature = CDFH_SIGNATURE;
  }

  toString() {
    return `${this.signature}:${this.offset}:${this.filename}`;
  }
}

export class EOCD implements Note {
  private signature: string;

  constructor(
    private totalCentralDirectoryRecord: number,
    private sizeOfCentralDirectory: number,
    private centralDirectoryOffset: number
  ) {
    this.signature = EOCD_SIGNATURE;
  }

  toString() {
    return `${this.signature}:${this.totalCentralDirectoryRecord}:${this.sizeOfCentralDirectory}:${this.centralDirectoryOffset}`;
  }
}
