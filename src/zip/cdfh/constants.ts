const CDFH_SIGNATURE = 0x02014b50;
const CDFH_SIZE = 46;

enum CDFHParamsNames {
  signature = 'signature',
  versionMadeBy = 'versionMadeBy',
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
  fileCommentLength = 'fileCommentLength',
  diskNumber = 'diskNumber',
  internalFileAttributes = 'internalFileAttributes',
  externalFileAttributes = 'externalFileAttributes',
  localFileHeaderOffset = 'localFileHeaderOffset',
  filename = 'filename',
  extraField = 'extraField',
  fileComment = 'fileComment',
}

interface IParam {
  offset: number;
  type: 32 | 16;
  name: CDFHParamsNames;
}

const CDFHParamsInfo: IParam[] = [
  {
    name: CDFHParamsNames.signature,
    offset: 0,
    type: 32,
  },
  {
    name: CDFHParamsNames.versionMadeBy,
    offset: 4,
    type: 16,
  },
  {
    name: CDFHParamsNames.versionToExtract,
    offset: 6,
    type: 16,
  },
  {
    name: CDFHParamsNames.generalPurposeBitFlag,
    offset: 8,
    type: 16,
  },
  {
    name: CDFHParamsNames.compressionMethod,
    offset: 10,
    type: 16,
  },
  {
    name: CDFHParamsNames.modificationTime,
    offset: 12,
    type: 16,
  },
  {
    name: CDFHParamsNames.modificationDate,
    offset: 14,
    type: 16,
  },
  {
    name: CDFHParamsNames.crc32,
    offset: 16,
    type: 32,
  },
  {
    name: CDFHParamsNames.compressedSize,
    offset: 20,
    type: 32,
  },
  {
    name: CDFHParamsNames.uncompressedSize,
    offset: 24,
    type: 32,
  },
  {
    name: CDFHParamsNames.filenameLength,
    offset: 28,
    type: 16,
  },
  {
    name: CDFHParamsNames.extraFieldLength,
    offset: 30,
    type: 16,
  },
  {
    name: CDFHParamsNames.fileCommentLength,
    offset: 32,
    type: 16,
  },
  {
    name: CDFHParamsNames.diskNumber,
    offset: 34,
    type: 16,
  },
  {
    name: CDFHParamsNames.internalFileAttributes,
    offset: 36,
    type: 16,
  },
  {
    name: CDFHParamsNames.externalFileAttributes,
    offset: 38,
    type: 32,
  },
  {
    name: CDFHParamsNames.localFileHeaderOffset,
    offset: 42,
    type: 32,
  },
];

export { CDFH_SIGNATURE, CDFHParamsNames, CDFHParamsInfo, CDFH_SIZE };
