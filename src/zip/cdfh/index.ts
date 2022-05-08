import { Note } from '..';
import { LFH } from '../fileInfo';
import { CDFH_SIGNATURE, CDFHParamsNames } from './constants';
import { WriteStream } from 'fs';

export class CDFH implements Note {
  private [CDFHParamsNames.signature]: number;
  private [CDFHParamsNames.versionMadeBy]: number;
  private [CDFHParamsNames.versionToExtract]: number;
  private [CDFHParamsNames.generalPurposeBitFlag]: number;
  private [CDFHParamsNames.compressionMethod]: number;
  private [CDFHParamsNames.modificationTime]: number;
  private [CDFHParamsNames.modificationDate]: number;
  private [CDFHParamsNames.crc32]: number;
  private [CDFHParamsNames.compressedSize]: number;
  private [CDFHParamsNames.uncompressedSize]: number;
  private [CDFHParamsNames.fileCommentLength]: number;
  private [CDFHParamsNames.extraFieldLength]: number;
  private [CDFHParamsNames.fileCommentLength]: number;
  private [CDFHParamsNames.diskNumber]: number;
  private [CDFHParamsNames.internalFileAttributes]: number;
  private [CDFHParamsNames.externalFileAttributes]: number;
  private [CDFHParamsNames.localFileHeaderOffset]: number;
  private [CDFHParamsNames.filename]: Buffer;
  private [CDFHParamsNames.extraField]: number;
  private [CDFHParamsNames.fileComment]: number;

  constructor(lfh: LFH, offset: number) {
    this.signature = CDFH_SIGNATURE;
    this.versionMadeBy = 798;
    const lfhProps = lfh.getProps();
    this.versionToExtract = lfhProps.versionToExtract;
    this.generalPurposeBitFlag = lfhProps.generalPurposeBitFlag;
    this.compressionMethod = lfhProps.compressionMethod;
    this.modificationTime = lfhProps.modificationTime;
    this.modificationDate = lfhProps.modificationDate;
    this.crc32 = lfhProps.crc32;
    this.compressedSize = lfhProps.compressedSize;
    this.uncompressedSize = lfhProps.uncompressedSize;
    this.filename = lfhProps.filename;
    this.fileCommentLength = 0;
    this.diskNumber = 0;
    this.internalFileAttributes = 0;
    this.externalFileAttributes = 2176057344;
    this.localFileHeaderOffset = offset;
  }
  get hex(): Buffer {
    throw new Error('Method not implemented.');
  }
  toString() {
    return `${this.signature}:${this.filename}:`;
  }
}
