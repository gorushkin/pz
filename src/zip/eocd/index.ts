import {
  EOCD_SIGNATURE,
  EOCDParamsNames,
  EOCD_SIZE,
  EOCDParamsInfo,
  IParam,
} from './constants';
import { WriteStream } from 'fs';

export class EOCD {
  private [EOCDParamsNames.signature]: number;
  private [EOCDParamsNames.diskNumber]: number;
  private [EOCDParamsNames.startDiskNumber]: number;
  private [EOCDParamsNames.numberCentralDirectoryRecord]: number;
  private [EOCDParamsNames.totalCentralDirectoryRecord]: number;
  private [EOCDParamsNames.sizeOfCentralDirectory]: number;
  private [EOCDParamsNames.centralDirectoryOffset]: number;
  private [EOCDParamsNames.commentLength]: number;
  private [EOCDParamsNames.comment]: number;
  private eocdRawData: Buffer;
  private eocdFields: IParam[] = EOCDParamsInfo;

  constructor(
    totalCentralDirectoryRecord: number,
    sizeOfCentralDirectory: number,
    centralDirectoryOffset: number
  ) {
    this.signature = EOCD_SIGNATURE;
    this.totalCentralDirectoryRecord = totalCentralDirectoryRecord;
    this.sizeOfCentralDirectory = sizeOfCentralDirectory;
    this.centralDirectoryOffset = centralDirectoryOffset;
    this.numberCentralDirectoryRecord = totalCentralDirectoryRecord;
    this.eocdRawData = Buffer.alloc(EOCD_SIZE);
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

  get eocd(): Buffer {
    for (const param of this.eocdFields) {
      this.addDataToBuffer(param, this.eocdRawData);
    }
    return this.eocdRawData;
  }

  async writeEOCD(writeableStream: WriteStream): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      writeableStream.write(this.eocd);

      writeableStream.on('error', (err) => {
        reject(err);
      });

      resolve();
    });
  }
}
