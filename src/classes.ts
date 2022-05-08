import path from 'path';

export enum targetTypes {
  dir = 'dir',
  file = 'file',
}

abstract class Entrie {
  name: string;
  dirname: string;
  size: number;
  fileNameLength: number;

  public filePath: string;

  constructor(filePath: string, size: number) {
    this.filePath = filePath;
    this.name = path.basename(filePath);
    this.dirname = path.dirname(filePath);
    this.fileNameLength = this.name.length;
    this.size = size;
  }

  getFileInfo() {
    throw Error('Is not ready!!!');
  }
}

interface FileInfo {
  size: number;
  fileNameLength: number;
  name: string;
}

export class File extends Entrie {
  private fileType: targetTypes;

  constructor(filePath: string, size: number) {
    super(filePath, size);
    this.fileType = targetTypes.file;
  }

  getFileInfo(): FileInfo {
    return {
      size: this.size,
      fileNameLength: this.fileNameLength,
      name: this.name,
    };
  }

  get type(): targetTypes {
    return this.fileType;
  }
}

export class Dir extends Entrie {
  private fileType: targetTypes;

  constructor(filePath: string, size: number) {
    super(filePath, size);
    this.fileType = targetTypes.dir;
  }

  get type(): targetTypes {
    return this.fileType;
  }

  getFileInfo(): FileInfo {
    return {
      size: 0,
      fileNameLength: this.fileNameLength,
      name: this.name,
    };
  }
}
