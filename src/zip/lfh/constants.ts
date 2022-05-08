const LFH_SIGNATURE = 0x04034b50;
const LFH_SIZE = 30;

enum FileInfoParams {
  signature = 'signature',
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
}

export interface IParam {
  offset: number;
  type: 32 | 16;
  name: FileInfoParams;
}

const FileInfoProperties: IParam[] = [
  {
    name: FileInfoParams.signature,
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

export { LFH_SIGNATURE, LFH_SIZE, FileInfoProperties, FileInfoParams };
