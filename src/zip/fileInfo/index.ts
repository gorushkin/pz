import { WriteStream, createReadStream } from 'fs';
import { targetTypes } from 'src/classes';
import {
  IParam,
  FileInfoParams,
  LFHProperties,
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
  private lfhFields: IParam[] = LFHProperties;

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
    this.lfhSignature = LFH_SIGNATURE;
    this.cdfhSignature = CDFH_SIGNATURE;
    this.lfhRawData = Buffer.alloc(LFH_SIZE);
    this.versionMadeBy = 798;
    this.fileCommentLength = 0;
    this.diskNumber = 0;
    this.internalFileAttributes = 0;
    this.externalFileAttributes = 2176057344;
  }

  private addDataToBuffer(param: IParam): void {
    const bufferWriteParamMapping = {
      32: (buffer: Buffer, value: number, offset: number) =>
        buffer.writeUInt32LE(value, offset),
      16: (buffer: Buffer, value: number, offset: number) =>
        buffer.writeUInt16LE(value, offset),
    };

    bufferWriteParamMapping[param.type](
      this.lfhRawData,
      this[param.name] as number,
      param.offset
    );
  }

  get lfh(): Buffer {
    for (const param of this.lfhFields) {
      this.addDataToBuffer(param);
    }
    return this.lfhRawData;
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
        const offset = writeableStream.writableLength;
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
      writeableStream.write(this.lfhRawData);
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
    type: targetTypes,
    filepath: string
  ): Promise<number> {
    const typeMappging = {
      dir: this.writeDirLFH.bind(this),
      file: this.writeFileLFH.bind(this),
    };

    return await typeMappging[type](writeableStream, filepath);
  }
}
