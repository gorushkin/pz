import { Note } from '..';
import {
  IParam,
  FileInfoParams,
  FileInfoProperties,
  LFH_SIGNATURE,
  LFH_SIZE,
} from './constants';

export class LFH implements Note {
  private [FileInfoParams.signature]: number;
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
    for (const param of FileInfoProperties) {
      this.addDataToBuffer(param);
    }
    return this.data;
  }

  get name(): Buffer {
    return this.filename;
  }
  getProps() {
    return {
      [FileInfoParams.versionToExtract]: this.versionToExtract,
      [FileInfoParams.generalPurposeBitFlag]: this.generalPurposeBitFlag,
      [FileInfoParams.compressionMethod]: this.compressionMethod,
      [FileInfoParams.modificationTime]: this.modificationTime,
      [FileInfoParams.modificationDate]: this.modificationDate,
      [FileInfoParams.crc32]: this.crc32,
      [FileInfoParams.uncompressedSize]: this.uncompressedSize,
      [FileInfoParams.compressedSize]: this.compressedSize,
      [FileInfoParams.filename]: this.filename,
    };
  }
}
