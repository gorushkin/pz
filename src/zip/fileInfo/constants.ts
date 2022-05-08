const LFH_SIGNATURE = 0x04034b50;
const CDFH_SIGNATURE = 0x02014b50;
const LFH_SIZE = 30;
const CDFH_SIZE = 46;

enum FileInfoParams {
  lfhSignature = 'lfhSignature',
  cdfhSignature = 'cdfhSignature',
  versionToExtract = 'versionToExtract',
  generalPurposeBitFlag = 'generalPurposeBitFlag',
  compressionMethod = 'compressionMethod',
  modificationTime = 'modificationTime',
  modificationDate = 'modificationDate',
  crc32 = 'crc32',
  compressedSize = 'compressedSize',
  uncompressedSize = 'uncompressedSize',
  filenameLength = 'filenameLength',
  extraFieldLength = 'extraFieldLength',
  filename = 'filename',
  versionMadeBy = 'versionMadeBy',
  fileCommentLength = 'fileCommentLength',
  diskNumber = 'diskNumber',
  internalFileAttributes = 'internalFileAttributes',
  externalFileAttributes = 'externalFileAttributes',
  localFileHeaderOffset = 'localFileHeaderOffset',
  extraField = 'extraField',
  fileComment = 'fileComment',
}

export interface IParam {
  offset: number;
  type: 32 | 16;
  name: FileInfoParams;
}

const LFHProperties: IParam[] = [
  {
    name: FileInfoParams.lfhSignature,
    offset: 0,
    type: 32,
  },
  {
    name: FileInfoParams.versionToExtract,
    offset: 4,
    type: 16,
  },
  {
    name: FileInfoParams.generalPurposeBitFlag,
    offset: 6,
    type: 16,
  },
  {
    name: FileInfoParams.compressionMethod,
    offset: 8,
    type: 16,
  },
  {
    name: FileInfoParams.modificationTime,
    offset: 10,
    type: 16,
  },
  {
    name: FileInfoParams.modificationDate,
    offset: 12,
    type: 16,
  },
  {
    name: FileInfoParams.crc32,
    offset: 14,
    type: 32,
  },
  {
    name: FileInfoParams.compressedSize,
    offset: 18,
    type: 32,
  },
  {
    name: FileInfoParams.uncompressedSize,
    offset: 22,
    type: 32,
  },
  {
    name: FileInfoParams.filenameLength,
    offset: 26,
    type: 16,
  },
  {
    name: FileInfoParams.extraFieldLength,
    offset: 28,
    type: 16,
  },
];

const CDFHProperties: IParam[] = [
  {
    name: FileInfoParams.cdfhSignature,
    offset: 0,
    type: 32,
  },
  {
    name: FileInfoParams.versionMadeBy,
    offset: 4,
    type: 16,
  },
  {
    name: FileInfoParams.versionToExtract,
    offset: 6,
    type: 16,
  },
  {
    name: FileInfoParams.generalPurposeBitFlag,
    offset: 8,
    type: 16,
  },
  {
    name: FileInfoParams.compressionMethod,
    offset: 10,
    type: 16,
  },
  {
    name: FileInfoParams.modificationTime,
    offset: 12,
    type: 16,
  },
  {
    name: FileInfoParams.modificationDate,
    offset: 14,
    type: 16,
  },
  {
    name: FileInfoParams.crc32,
    offset: 16,
    type: 32,
  },
  {
    name: FileInfoParams.compressedSize,
    offset: 20,
    type: 32,
  },
  {
    name: FileInfoParams.uncompressedSize,
    offset: 24,
    type: 32,
  },
  {
    name: FileInfoParams.filenameLength,
    offset: 28,
    type: 16,
  },
  {
    name: FileInfoParams.extraFieldLength,
    offset: 30,
    type: 16,
  },
  {
    name: FileInfoParams.fileCommentLength,
    offset: 32,
    type: 16,
  },
  {
    name: FileInfoParams.diskNumber,
    offset: 34,
    type: 16,
  },
  {
    name: FileInfoParams.internalFileAttributes,
    offset: 36,
    type: 16,
  },
  {
    name: FileInfoParams.externalFileAttributes,
    offset: 38,
    type: 32,
  },
  {
    name: FileInfoParams.localFileHeaderOffset,
    offset: 42,
    type: 32,
  },
];

export {
  LFH_SIGNATURE,
  CDFH_SIGNATURE,
  LFH_SIZE,
  CDFH_SIZE,
  LFHProperties,
  CDFHProperties,
  FileInfoParams,
};
