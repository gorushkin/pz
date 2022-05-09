const EOCD_SIGNATURE = 0x06054b50;
const EOCD_SIZE = 22;

enum EOCDParamsNames {
  signature = 'signature',
  diskNumber = 'diskNumber',
  startDiskNumber = 'startDiskNumber',
  numberCentralDirectoryRecord = 'numberCentralDirectoryRecord',
  totalCentralDirectoryRecord = 'totalCentralDirectoryRecord',
  sizeOfCentralDirectory = 'sizeOfCentralDirectory',
  centralDirectoryOffset = 'centralDirectoryOffset',
  commentLength = 'commentLength',
  comment = 'comment',
}

interface IParam {
  offset: number;
  type: 32 | 16;
  name: EOCDParamsNames;
}

const EOCDParamsInfo: IParam[] = [
  {
    name: EOCDParamsNames.signature,
    offset: 0,
    type: 32,
  },
  {
    name: EOCDParamsNames.diskNumber,
    offset: 4,
    type: 16,
  },
  {
    name: EOCDParamsNames.startDiskNumber,
    offset: 6,
    type: 16,
  },
  {
    name: EOCDParamsNames.numberCentralDirectoryRecord,
    offset: 8,
    type: 16,
  },
  {
    name: EOCDParamsNames.totalCentralDirectoryRecord,
    offset: 10,
    type: 16,
  },
  {
    name: EOCDParamsNames.sizeOfCentralDirectory,
    offset: 12,
    type: 32,
  },
  {
    name: EOCDParamsNames.centralDirectoryOffset,
    offset: 16,
    type: 32,
  },
  {
    name: EOCDParamsNames.commentLength,
    offset: 20,
    type: 16,
  },
];

export { EOCDParamsNames, EOCDParamsInfo, EOCD_SIZE, EOCD_SIGNATURE, IParam };
