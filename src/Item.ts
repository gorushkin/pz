interface FileInfo {
  size: number;
  fileNameLength: number;
  crc32: number;
  name: string;
}

export class Item {
  private name: string;
  private size: number;
  private crc32: number;
  private fileNameLength: number;
  public filePath: string;

  constructor(filePath: string, size: number, name: string, crc32: number) {
    this.filePath = filePath;
    this.name = name;
    this.fileNameLength = this.name.length;
    this.size = size;
    this.crc32 = crc32;
  }

  getFileInfo(): FileInfo {
    return {
      size: this.size,
      fileNameLength: this.fileNameLength,
      name: this.name,
      crc32: this.crc32,
    };
  }
}
