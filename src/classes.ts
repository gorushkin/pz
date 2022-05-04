import path from 'path';
import { createReadStream, WriteStream } from 'fs';
import {
  IParam,
  LFHParamsNames,
  LFH_OFFSETS,
  LFH_SIGNATURE,
  LFH_SIZE,
  EOCD_SIGNATURE,
  CDFH_SIGNATURE,
} from './constants';

export interface IFileInfo {
  filename: string;
  fileNameLength: number;
  size: number;
  lfh: LFH;
  cdfh?: CDFH;
  offset: number;
}
// const toHex = (string: string): string => Buffer.from(string).toString('hex');

interface Note {
  toString(): void;
  get hex(): Buffer;
}

export class LFH implements Note {
  private [LFHParamsNames.signature]: number;
  private [LFHParamsNames.versionToExtract]: number;
  private [LFHParamsNames.generalPurposeBitFlag]: number;
  private [LFHParamsNames.compressionMethod]: number;
  private [LFHParamsNames.modificationTime]: number;
  private [LFHParamsNames.modificationDate]: number;
  private [LFHParamsNames.crc32]: number;
  private [LFHParamsNames.compressedSize]: number;
  private [LFHParamsNames.uncompressedSize]: number;
  private [LFHParamsNames.filenameLength]: number;
  private [LFHParamsNames.extraFieldLength]: number;
  private [LFHParamsNames.filename]: Buffer;
  private size: number;
  private data: Buffer;

  constructor(size: number, fileNameLength: number, name: string) {
    this.versionToExtract = 20;
    this.generalPurposeBitFlag = 0;
    this.modificationTime = 28021;
    this.modificationDate = 20072;
    this.compressedSize = size;
    this.uncompressedSize = size;
    this.compressionMethod = 0;
    // TODO: CRC32 FIX
    this.crc32 = 0xcbf53a1c;
    this.filenameLength = fileNameLength;
    this.filename = Buffer.from(name);
    this.signature = LFH_SIGNATURE;
    this.data = Buffer.alloc(LFH_SIZE);
  }

  private addDataToBuffer(param: IParam): void {
    const bufferWriteParamMapping = {
      32: (buffer: Buffer, value: number, offset: number) =>
        buffer.writeUInt32LE(value, offset),
      16: (buffer: Buffer, value: number, offset: number) =>
        buffer.writeUInt16LE(value, offset),
    };

    bufferWriteParamMapping[param.type](
      this.data,
      this[param.name] as number,
      param.offset
    );
  }

  get hex(): Buffer {
    for (const param of LFH_OFFSETS) {
      this.addDataToBuffer(param);
    }
    return this.data;
  }

  get name(): Buffer {
    return this.filename;
  }

  toString() {
    return `${this.signature}:${this.size}:${this.filenameLength}:${this.name}:`;
  }
}

export class CDFH implements Note {
  private signature: string;

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

export class EOCD implements Note {
  private signature: string;

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
  abstract write(stream: WriteStream): Promise<IFileInfo[]>;

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
  private checksum: string | Buffer;

  constructor(filePath: string, size: number) {
    super(filePath, size);
    this.fileType = targetTypes.file;
  }

  async write(writeableStream: WriteStream): Promise<IFileInfo[]> {
    const readableStream = createReadStream(this.filePath);

    const lfh = new LFH(
      this.stat.size,
      this.stat.fileNameLength,
      this.stat.name
    );

    const offset = await new Promise<number>((resolve, reject) => {
      readableStream.on('data', (_chunk) => {
        const offset = writeableStream.writableLength;
        writeableStream.write(lfh.hex);
        writeableStream.write(lfh.name);
        // writeableStream.write(lfh.toString());
        // writeableStream.write(chunk.toString('hex'));
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
      resolve(offset);

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
