import { Note } from '..';
import {
  IParam,
  LFHParamsNames,
  LFHParamsInfo,
  LFH_SIGNATURE,
  LFH_SIZE,
} from './constants';

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
    for (const param of LFHParamsInfo) {
      this.addDataToBuffer(param);
    }
    return this.data;
  }

  get name(): Buffer {
    return this.filename;
  }
  getProps() {
    return {
      [LFHParamsNames.versionToExtract]: this.versionToExtract,
      [LFHParamsNames.generalPurposeBitFlag]: this.generalPurposeBitFlag,
      [LFHParamsNames.compressionMethod]: this.compressionMethod,
      [LFHParamsNames.modificationTime]: this.modificationTime,
      [LFHParamsNames.modificationDate]: this.modificationDate,
      [LFHParamsNames.crc32]: this.crc32,
      [LFHParamsNames.uncompressedSize]: this.uncompressedSize,
      [LFHParamsNames.compressedSize]: this.compressedSize,
      [LFHParamsNames.filename]: this.filename,
    };
  }
}
