export enum targetTypes {
  dir = 'dir',
  file = 'file',
}

abstract class Entrie {
  name: string;
  size: number;
  crc32: number;
  fileNameLength: number;

  public filePath: string;

  constructor(filePath: string, size: number, name: string, crc32: number) {
    this.filePath = filePath;
    this.name = name;
    this.fileNameLength = this.name.length;
    this.size = size;
    this.crc32 = crc32;
  }

  getFileInfo() {
    throw Error('Is not ready!!!');
  }
}

interface FileInfo {
  size: number;
  fileNameLength: number;
  crc32: number;
  name: string;
}

export class File extends Entrie {
  private fileType: targetTypes;

  constructor(filePath: string, size: number, name: string, crc32: number) {
    super(filePath, size, name, crc32);
    this.fileType = targetTypes.file;
  }

  getFileInfo(): FileInfo {
    return {
      size: this.size,
      fileNameLength: this.fileNameLength,
      name: this.name,
      crc32: this.crc32,
    };
  }

  get type(): targetTypes {
    return this.fileType;
  }
}

export class Dir extends Entrie {
  private fileType: targetTypes;

  constructor(
    filePath: string,
    size: number,
    relativePath: string,
    crc32: number
  ) {
    super(filePath, size, relativePath, crc32);
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
      crc32: 0,
    };
  }
}
