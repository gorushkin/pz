const LFH_SIGNATURE = 0x04034b50;
const CDFH_SIGNATURE = '504b1020';
const EOCD_SIGNATURE = '504b5060';
const LFH_SIZE = 30;

enum LFHNames {
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
  name: LFHNames;
}

const LFH_OFFSETS: IParam[] = [
  {
    name: LFHNames.signature,
    offset: 0,
    type: 32,
  },
  {
    name: LFHNames.versionToExtract,
    offset: 4,
    type: 16,
  },
  {
    name: LFHNames.generalPurposeBitFlag,
    offset: 6,
    type: 16,
  },
  {
    name: LFHNames.compressionMethod,
    offset: 8,
    type: 16,
  },
  {
    name: LFHNames.modificationTime,
    offset: 10,
    type: 16,
  },
  {
    name: LFHNames.modificationDate,
    offset: 12,
    type: 16,
  },
  {
    name: LFHNames.crc32,
    offset: 14,
    type: 32,
  },
  {
    name: LFHNames.compressedSize,
    offset: 18,
    type: 32,
  },
  {
    name: LFHNames.uncompressedSize,
    offset: 22,
    type: 32,
  },
  {
    name: LFHNames.filenameLength,
    offset: 26,
    type: 16,
  },
  {
    name: LFHNames.extraFieldLength,
    offset: 28,
    type: 16,
  },
];

export {
  LFH_SIGNATURE,
  CDFH_SIGNATURE,
  EOCD_SIGNATURE,
  LFH_SIZE,
  LFH_OFFSETS,
  LFHNames as LFHParamsNames,
};
