import path from 'path';
import { createReadStream, WriteStream } from 'fs';

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

  constructor(
    private size: number,
    private fileNameLength: number,
    private name: string
  ) {
    this.signature = LFH_SIGNATURE;
  }

  toString() {
    return `${this.signature}:${this.size}:${this.fileNameLength}:${this.name}:`;
  }
}

export class CDFH implements Note {
  private signature: string;

  constructor(private offset: number, private filename: string) {
    this.signature = CDFH_SIGNATURE;
  }

  toString() {
    return `${this.signature}:${this.offset}:${this.filename}:`;
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
  public stat: {
    name: string;
    dirname: string;
    size: number;
    fileNameLength: number;
  };
  public filePath: string;
  abstract get info(): File | (File | Dir)[];
  abstract get type(): targetTypes;
  abstract write(stream: WriteStream): Promise<IFileInfo | IFileInfo[]>;

  constructor(filePath: string, size: number) {
    this.filePath = filePath;
    const name = path.basename(filePath);
    const dirname = path.dirname(filePath);
    this.stat = {
      name,
      dirname,
      size,
      fileNameLength: name.length,
    };
  }

  toString(): string {
    return JSON.stringify(this, null, 2);
  }
}

export class File extends Entrie {
  private fileType: targetTypes;

  constructor(filePath: string, size: number) {
    super(filePath, size);
    this.fileType = targetTypes.file;
  }

  async write(writeableStream: WriteStream): Promise<IFileInfo> {
    const readableStream = createReadStream(this.filePath);

    const lfh = new LFH(
      this.stat.size,
      this.stat.fileNameLength,
      this.stat.name
    );

    const offset = await new Promise<number>((resolve, reject) => {
      readableStream.on('data', (chunk) => {
        const offset = writeableStream.writableLength;
        writeableStream.write(lfh.toString());
        writeableStream.write(chunk);
        writeableStream.write('\n');
        console.log(this.stat.name, offset);
        resolve(offset);
      });

      readableStream.on('error', (err) => {
        reject(err);
      });

      writeableStream.on('error', (err) => {
        reject(err);
      });
    });

    const fileInfo: IFileInfo = {
      filename: this.stat.name.toString(),
      fileNameLength: this.stat.fileNameLength,
      size: this.stat.size,
      lfh: lfh,
      offset,
    };

    return fileInfo;
  }

  get info(): File[] {
    return [this];
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
    private childrens: Array<File | Dir>
  ) {
    super(filePath, size);
    this.childrens = childrens;
    this.fileType = targetTypes.dir;
  }

  async write(writeableStream: WriteStream): Promise<IFileInfo[]> {
    const lfh = new LFH(0, this.stat.fileNameLength, this.stat.name);

    const childrensFileInfo = await Promise.all(
      this.childrens.map(async (item) => {
        const pup = await item.write(writeableStream);
        return pup;
      })
    );

    const offset = await new Promise<number>((resolve, reject) => {
      const offset = writeableStream.writableLength;
      writeableStream.write(lfh.toString());
      writeableStream.write('\n');
      resolve(offset);

      console.log(this.stat.name, offset);

      writeableStream.on('error', (err) => {
        reject(err);
      });
    });

    const dirInfo: IFileInfo = {
      filename: this.stat.name.toString(),
      fileNameLength: this.stat.fileNameLength,
      size: this.stat.size,
      lfh: lfh,
      offset,
    };

    const dictionary: IFileInfo[] = [dirInfo];
    childrensFileInfo.forEach((item) =>
      Array.isArray(item) ? dictionary.push(...item) : dictionary.push(item)
    );

    return dictionary;
  }

  get type(): targetTypes {
    return this.fileType;
  }

  get info(): (File | Dir)[] {
    const result: (File | Dir)[] = [];

    this.childrens.forEach((file) => {
      if (file instanceof File) result.push(file);
      if (file instanceof Dir) result.push(...file.info);
    });

    return result;
  }
}
