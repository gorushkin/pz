import { WriteStream, createReadStream } from 'fs';
import {
  IParam,
  FileInfoParams,
  LFHProperties,
  CDFHProperties,
  CDFH_SIZE,
  LFH_SIGNATURE,
  LFH_SIZE,
  CDFH_SIGNATURE,
} from './constants';

export class FileInfo {
  private [FileInfoParams.lfhSignature]: number;
  private [FileInfoParams.cdfhSignature]: number;
  private [FileInfoParams.versionToExtract]: number;
  private [FileInfoParams.generalPurposeBitFlag]: number;
  private [FileInfoParams.compressionMethod]: number;
  private [FileInfoParams.modificationTime]: number;
  private [FileInfoParams.modificationDate]: number;
  private [FileInfoParams.crc32]: number;
  private [FileInfoParams.compressedSize]: number;
  private [FileInfoParams.uncompressedSize]: number;
  private [FileInfoParams.filenameLength]: number;
  private [FileInfoParams.extraFieldLength]: number;
  private [FileInfoParams.filename]: Buffer;
  private [FileInfoParams.versionMadeBy]: number;
  private [FileInfoParams.fileCommentLength]: number;
  private [FileInfoParams.diskNumber]: number;
  private [FileInfoParams.internalFileAttributes]: number;
  private [FileInfoParams.externalFileAttributes]: number;
  private [FileInfoParams.localFileHeaderOffset]: number;
  private [FileInfoParams.extraField]: number;
  private [FileInfoParams.fileComment]: number;
  private lfhRawData: Buffer;
  private cdfhRawData: Buffer;
  private lfhFields: IParam[] = LFHProperties;
  private cdfhFields: IParam[] = CDFHProperties;

  constructor(
    size: number,
    fileNameLength: number,
    name: string,
    crc32: number
  ) {
    this.versionToExtract = 20;
    this.generalPurposeBitFlag = 0;
    this.modificationTime = 28021;
    this.modificationDate = 20072;
    this.compressedSize = size;
    this.uncompressedSize = size;
    this.compressionMethod = 0;
    this.crc32 = crc32;
    this.filenameLength = fileNameLength;
    this.filename = Buffer.from(name);
    this.lfhSignature = LFH_SIGNATURE;
    this.cdfhSignature = CDFH_SIGNATURE;
    this.lfhRawData = Buffer.alloc(LFH_SIZE);
    this.cdfhRawData = Buffer.alloc(CDFH_SIZE);
    this.versionMadeBy = 20;
    this.fileCommentLength = 0;
    this.diskNumber = 0;
    this.internalFileAttributes = 0;
    this.externalFileAttributes = 2176057344;
  }

  private addDataToBuffer(param: IParam, buffer: Buffer): void {
    const bufferWriteParamMapping = {
      32: (buffer: Buffer, value: number, offset: number) =>
        buffer.writeUInt32LE(value, offset),
      16: (buffer: Buffer, value: number, offset: number) =>
        buffer.writeUInt16LE(value, offset),
    };

    bufferWriteParamMapping[param.type](
      buffer,
      this[param.name] as number,
      param.offset
    );
  }

  get lfh(): Buffer {
    for (const param of this.lfhFields) {
      this.addDataToBuffer(param, this.lfhRawData);
    }
    return this.lfhRawData;
  }

  get cdfh(): Buffer {
    for (const param of this.cdfhFields) {
      this.addDataToBuffer(param, this.cdfhRawData);
    }
    return this.cdfhRawData;
  }

  set offset(offset: number) {
    this.localFileHeaderOffset = offset;
  }

  async writeFileLFH(
    writeableStream: WriteStream,
    filePath: string
  ): Promise<number> {
    const readableStream = createReadStream(filePath);
    const offset = await new Promise<number>((resolve, reject) => {
      readableStream.on('data', (chunk) => {
        const writableLength = writeableStream.writableLength;
        const bytesWritten = writeableStream.bytesWritten;
        const offset = bytesWritten + writableLength;
        writeableStream.write(this.lfh);
        writeableStream.write(this.filename);
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
    return offset;
  }

  async writeDirLFH(writeableStream: WriteStream): Promise<number> {
    const offset = await new Promise<number>((resolve, reject) => {
      const offset = writeableStream.writableLength;
      writeableStream.write(this.lfh);
      writeableStream.write(this.filename);
      resolve(offset);
      writeableStream.on('error', (err) => {
        reject(err);
      });
    });
    return offset;
  }

  async writeLFH(
    writeableStream: WriteStream,
    isFileEmpty: boolean,
    filepath: string
  ): Promise<number> {
    return isFileEmpty
      ? this.writeDirLFH(writeableStream)
      : this.writeFileLFH(writeableStream, filepath);
  }

  async writeCDFH(writeableStream: WriteStream): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      writeableStream.write(this.cdfh);
      writeableStream.write(this.filename);

      writeableStream.on('error', (err) => {
        reject(err);
      });

      resolve();
    });
  }
  private formatHexString(buffer: Buffer): string {
    type Row = string;
    type List = Row[];

    const stringReducer = (
      acc: string[],
      item: string,
      index: number,
      array: string[]
    ) => (index % 2 === 0 ? [...acc, item + array[index + 1]] : acc);

    const fromatReducer = (acc: List, item: string, index: number) => {
      const itemRow = Math.floor(index / 16) + 1;
      if (acc.length < itemRow) acc.push('');
      const isElementLastInRow = index === 15;
      const element = isElementLastInRow ? `${item}` : `${item}  `;
      acc[itemRow - 1] += element;
      return acc;
    };

    const string = buffer.toString('hex');
    const reducedString = string.split('').reduce(stringReducer, []);
    const formattedString = reducedString.reduce(fromatReducer, []);

    return formattedString.join('\n');
  }

  printHex(): void {
    const result = this.formatHexString(this.lfhRawData);
    console.log(result);
  }
}
