import path from 'path';
import { Dir, File } from './classes';
import fs, { createWriteStream, PathLike, WriteStream } from 'fs';
import { FileInfo } from './zip/fileInfo';
import { EOCD } from './zip/eocd';
import { getCRC32 } from './crc32';

const inputPath1: PathLike = '/home/gorushkin/Webdev/pz/temp/test/folder';
const inputPath2: PathLike = '/home/gorushkin/Webdev/pz/temp/test/test.txt';
const inputPath3: PathLike = '/home/gorushkin/Webdev/pz/temp/test';
const inputPath4: PathLike = '/home/gorushkin/Webdev/pz/temp/test/folder/empty';

const outputPath = './temp/output/test.zip';

async function getTree(
  filename: string,
  acc: (File | Dir)[] = [],
  pathFromTop = ''
) {
  const stat = await fs.promises.stat(filename);
  if (stat.isFile()) {
    const basename = path.basename(filename);
    const name = path.join(pathFromTop, basename);
    const crc32 = await getCRC32(filename);
    acc.push(new File(filename, stat.size, name, crc32));
  }
  if (stat.isDirectory()) {
    const files = await fs.promises.readdir(filename);
    const basename = path.basename(filename);
    const name = path.join(pathFromTop, basename, '/');
    acc.push(new Dir(filename, stat.size, name, 0));
    await Promise.all(
      files.map((item) => getTree(path.join(filename, item), acc, name))
    );
  }
  return acc;
}

async function getFileInfoList(tree: (File | Dir)[], writeable: WriteStream) {
  const fileInfoList = await Promise.all(
    tree.map(async (item) => {
      const { name, size, fileNameLength, crc32 } = item.getFileInfo();
      const fileInfo = new FileInfo(size, fileNameLength, name, crc32);
      const isFileEmpty = !size;
      fileInfo.offset = await fileInfo.writeLFH(
        writeable,
        isFileEmpty,
        item.filePath
      );

      return fileInfo;
    })
  );

  return fileInfoList;
}

function getWrittenSize(writeable: WriteStream): number {
  const CDFHbytesWritten = writeable.bytesWritten;
  const CDFHwritableLength = writeable.writableLength;
  return CDFHbytesWritten + CDFHwritableLength;
}

async function writeFileInfo(fileInfoList: FileInfo[], writeable: WriteStream) {
  for (const item of fileInfoList) {
    item.writeCDFH(writeable);
  }
}
// TODO: методы для записи убрать из классов и перенесть в главную ф-ци.

async function pack(input: string, output: string) {
  const writeable = createWriteStream(output);

  const tree = await getTree(input);

  const fileInfoList = await getFileInfoList(tree, writeable);

  const centralDirectoryOffset = getWrittenSize(writeable);
  const totalCentralDirectoryRecord = tree.length;

  await writeFileInfo(fileInfoList, writeable);

  const sizeOfCentralDirectory =
    getWrittenSize(writeable) - centralDirectoryOffset;

  // fileInfoList.forEach((item) => {
  //   item.printHex();
  // });

  const eocd = new EOCD(
    totalCentralDirectoryRecord,
    sizeOfCentralDirectory,
    centralDirectoryOffset
  );

  await eocd.writeEOCD(writeable);
}

const res = pack(inputPath1, outputPath);
