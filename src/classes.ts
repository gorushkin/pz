import path from 'path';

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

enum targetTypes {
  dir = 'dir',
  file = 'file',
}

abstract class Entrie {
  abstract get info(): File | (File | Dir)[];
  abstract get type(): targetTypes;
  abstract fileType: targetTypes;

  name: string;
  dirname: string;

  constructor(public filePath: string) {
    this.name = path.basename(filePath);
    this.dirname = path.dirname(filePath);
    this.filePath = filePath;
  }
}

export class File extends Entrie {
  fileType: targetTypes;
  name: string;
  dirname: string;

  constructor(public filePath: string) {
    super(filePath);
    this.fileType = targetTypes.file;
  }

  get info(): File[] {
    return [this];
  }

  get type(): targetTypes {
    return this.fileType;
  }
}
export class Dir extends Entrie {
  fileType: targetTypes;
  name: string;
  dirname: string;

  constructor(public filePath: string, public childrens: Array<File | Dir>) {
    super(filePath);
    this.childrens = childrens;
    this.fileType = targetTypes.dir;
  }

  get type(): targetTypes {
    return this.fileType;
  }

  get info(): (File | Dir)[] {
    const result: (File | Dir)[] = [];

    this.childrens.forEach((file) => {
      if (file instanceof File) result.push(file);
      if (file instanceof Dir) result.push(file, ...file.info);
    });

    return result;
  }
}
