const LFH_SIGNATURE = 0x04034b50;
const LFH_SIZE = 30;

enum LFHParamsNames {
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
  name: LFHParamsNames;
}

const LFHParamsInfo: IParam[] = [
  {
    name: LFHParamsNames.signature,
    offset: 0,
    type: 32,
  },
  {
    name: LFHParamsNames.versionToExtract,
    offset: 4,
    type: 16,
  },
  {
    name: LFHParamsNames.generalPurposeBitFlag,
    offset: 6,
    type: 16,
  },
  {
    name: LFHParamsNames.compressionMethod,
    offset: 8,
    type: 16,
  },
  {
    name: LFHParamsNames.modificationTime,
    offset: 10,
    type: 16,
  },
  {
    name: LFHParamsNames.modificationDate,
    offset: 12,
    type: 16,
  },
  {
    name: LFHParamsNames.crc32,
    offset: 14,
    type: 32,
  },
  {
    name: LFHParamsNames.compressedSize,
    offset: 18,
    type: 32,
  },
  {
    name: LFHParamsNames.uncompressedSize,
    offset: 22,
    type: 32,
  },
  {
    name: LFHParamsNames.filenameLength,
    offset: 26,
    type: 16,
  },
  {
    name: LFHParamsNames.extraFieldLength,
    offset: 28,
    type: 16,
  },
];

export { LFH_SIGNATURE, LFH_SIZE, LFHParamsInfo, LFHParamsNames };
