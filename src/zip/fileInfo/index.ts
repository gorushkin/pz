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
  public [FileInfoParams.filename]: Buffer;
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

  get isEmpty(): boolean {
    return !this.uncompressedSize;
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
}
