const LFH_SIGNATURE = 0x04034b50;
const CDFH_SIGNATURE = '504b1020';
const EOCD_SIGNATURE = '504b5060';
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
  // fileName = 'fileName',
}

export interface IParam {
  offset: number;
  type: 32 | 16;
  name: LFHParamsNames;
}

type noteType = Record<LFHParamsNames, IParam>;

const LFH_OFFSETS: noteType = {
  [LFHParamsNames.signature]: {
    name: LFHParamsNames.signature,
    offset: 0,
    type: 32,
  },
  [LFHParamsNames.versionToExtract]: {
    name: LFHParamsNames.versionToExtract,
    offset: 4,
    type: 16,
  },
  [LFHParamsNames.generalPurposeBitFlag]: {
    name: LFHParamsNames.generalPurposeBitFlag,
    offset: 6,
    type: 16,
  },
  [LFHParamsNames.compressionMethod]: {
    name: LFHParamsNames.compressionMethod,
    offset: 8,
    type: 16,
  },
  [LFHParamsNames.modificationTime]: {
    name: LFHParamsNames.modificationTime,
    offset: 10,
    type: 16,
  },
  [LFHParamsNames.modificationDate]: {
    name: LFHParamsNames.modificationDate,
    offset: 12,
    type: 16,
  },
  [LFHParamsNames.crc32]: { name: LFHParamsNames.crc32, offset: 14, type: 32 },
  [LFHParamsNames.compressedSize]: {
    name: LFHParamsNames.compressedSize,
    offset: 18,
    type: 32,
  },
  [LFHParamsNames.uncompressedSize]: {
    name: LFHParamsNames.uncompressedSize,
    offset: 22,
    type: 32,
  },
  [LFHParamsNames.filenameLength]: {
    name: LFHParamsNames.filenameLength,
    offset: 26,
    type: 16,
  },
  [LFHParamsNames.extraFieldLength]: {
    name: LFHParamsNames.extraFieldLength,
    offset: 28,
    type: 16,
  },
  // [LFHParamsNames.fileName]: {
  //   name: LFHParamsNames.fileName,
  //   offset: 30,
  //   type: 32,
  // },
};

const constants = {
  LFH_SIGNATURE,
  CDFH_SIGNATURE,
  EOCD_SIGNATURE,
  LFH_SIZE,
  LFH_OFFSETS,
  LFHParamsNames,
};

export {
  constants,
  LFH_SIGNATURE,
  CDFH_SIGNATURE,
  EOCD_SIGNATURE,
  LFH_SIZE,
  LFH_OFFSETS,
  LFHParamsNames,
  noteType,
};
