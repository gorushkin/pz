import path from 'path';
import { createReadStream, WriteStream, ReadStream } from 'fs';
import { LFH } from './zip/lfh';
import { CDFH } from './zip/cdfh';

export interface IFileInfo {
  filename: string;
  fileNameLength: number;
  size: number;
  lfh: LFH;
  cdfh?: CDFH;
  offset?: number;
  stream?: ReadStream;
  writeLFH(writeableStream: WriteStream): Promise<void>;
}
// const toHex = (string: string): string => Buffer.from(string).toString('hex');

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
  abstract getDictionary(): IFileInfo[];
  abstract writeCDFH(stream: WriteStream): Promise<IFileInfo[]>;

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
  writeCDFH(_stream: WriteStream): Promise<IFileInfo[]> {
    throw new Error('Method not implemented.');
  }
  private fileType: targetTypes;

  constructor(filePath: string, size: number) {
    super(filePath, size);
    this.fileType = targetTypes.file;
  }

  getDictionary(): IFileInfo[] {
    const readableStream = createReadStream(this.filePath);

    const lfh = new LFH(
      this.stat.size,
      this.stat.fileNameLength,
      this.stat.name
    );

    const fileInfo: IFileInfo = {
      filename: this.stat.name.toString(),
      fileNameLength: this.stat.fileNameLength,
      size: this.stat.size,
      lfh: lfh,
      writeLFH: async function (writeableStream: WriteStream): Promise<void> {
        const offset = await new Promise<number>((resolve, reject) => {
          readableStream.on('data', (chunk) => {
            const offset = writeableStream.writableLength;
            writeableStream.write(lfh.hex);
            writeableStream.write(lfh.name);
            writeableStream.write(chunk);
            resolve(offset);
          });

          readableStream.on('error', (err) => {
            reject(err);
          });

          writeableStream.on('error', (err) => {
            reject(err);
          });
        });

        this.offset = offset;
      },
    };

    return [fileInfo];
  }

  get info(): File[] {
    return [this];
  }

  get type(): targetTypes {
    return this.fileType;
  }
}
export class Dir extends Entrie {
  writeCDFH(_stream: WriteStream): Promise<IFileInfo[]> {
    throw new Error('Method not implemented.');
  }
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

  getDictionary(): IFileInfo[] {
    const lfh = new LFH(0, this.stat.fileNameLength, this.stat.name);

    const childrensFileInfo = this.childrens.map((item) =>
      item.getDictionary()
    );

    const dirInfo: IFileInfo = {
      filename: this.stat.name.toString(),
      fileNameLength: this.stat.fileNameLength,
      size: this.stat.size,
      lfh: lfh,
      writeLFH: async function (writeableStream: WriteStream): Promise<void> {
        const offset = await new Promise<number>((resolve, reject) => {
          const offset = writeableStream.writableLength;
          writeableStream.write(lfh.toString());
          resolve(offset);

          writeableStream.on('error', (err) => {
            reject(err);
          });
        });

        this.offset = offset;
      },
    };

    const dictionary: IFileInfo[] = [dirInfo];
    childrensFileInfo.forEach((item) => {
      return Array.isArray(item)
        ? dictionary.push(...item)
        : dictionary.push(item);
    });

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
