import path from 'path';
import { Item } from './Item';
import fs, {
  createWriteStream,
  PathLike,
  WriteStream,
  createReadStream,
} from 'fs';
import { FileInfo } from './zip/fileInfo';
import { EOCD } from './zip/eocd';
import { getCRC32 } from './crc32';

const inputPath1: PathLike = '/home/gorushkin/Webdev/pz/temp/test/folder';
const inputPath2: PathLike = '/home/gorushkin/Webdev/pz/temp/test/test.txt';
const inputPath3: PathLike = '/home/gorushkin/Webdev/pz/temp/test';
const inputPath4: PathLike = '/home/gorushkin/Webdev/pz/temp/test/folder/empty';

const outputPath = './temp/output/test.zip';

async function getFiles(filename: string, acc: Item[] = [], pathFromTop = '') {
  const stat = await fs.promises.stat(filename);
  if (stat.isFile()) {
    const basename = path.basename(filename);
    const name = path.join(pathFromTop, basename);
    const crc32 = await getCRC32(filename);
    acc.push(new Item(filename, stat.size, name, crc32));
  }
  if (stat.isDirectory()) {
    const files = await fs.promises.readdir(filename);
    const basename = path.basename(filename);
    const name = path.join(pathFromTop, basename, '/');
    acc.push(new Item(filename, 0, name, 0));
    await Promise.all(
      files.map((item) => getFiles(path.join(filename, item), acc, name))
    );
  }
  return acc;
}

async function writeFileLFH(
  writeableStream: WriteStream,
  filePath: string,
  fileInfo: FileInfo
): Promise<number> {
  const readableStream = createReadStream(filePath);
  const offset = await new Promise<number>((resolve, reject) => {
    readableStream.on('data', (chunk) => {
      const writableLength = writeableStream.writableLength;
      const bytesWritten = writeableStream.bytesWritten;
      const offset = bytesWritten + writableLength;
      writeableStream.write(fileInfo.lfh);
      writeableStream.write(fileInfo.filename);
      writeableStream.write(chunk);
      resolve(offset);
    });
    readableStream.on('error', (err) => {
      reject(err);
    });
    writeableStream.on('error', (err) => {
      reject(err);
    });
  });
  return offset;
}

async function writeDirLFH(
  writeableStream: WriteStream,
  fileInfo: FileInfo
): Promise<number> {
  const offset = await new Promise<number>((resolve, reject) => {
    const offset = writeableStream.writableLength;
    writeableStream.write(fileInfo.lfh);
    writeableStream.write(fileInfo.filename);
    resolve(offset);
    writeableStream.on('error', (err) => {
      reject(err);
    });
  });
  return offset;
}

async function getFileInfoList(tree: Item[], writeable: WriteStream) {
  const fileInfoList = await Promise.all(
    tree.map(async (item) => {
      const { name, size, fileNameLength, crc32 } = item.getFileInfo();
      const fileInfo = new FileInfo(size, fileNameLength, name, crc32);
      const isFileEmpty = !size;
      fileInfo.offset = await (isFileEmpty
        ? writeDirLFH(writeable, fileInfo)
        : writeFileLFH(writeable, item.filePath, fileInfo));

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

async function writeCDFH(fileInfoList: FileInfo[], writeable: WriteStream) {
  for (const item of fileInfoList) {
    await new Promise<void>((resolve, reject) => {
      writeable.write(item.cdfh);
      writeable.write(item.filename);

      writeable.on('error', (err) => {
        reject(err);
      });

      resolve();
    });
  }
}

async function writeEOCD(
  writeableStream: WriteStream,
  eocd: EOCD
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    writeableStream.write(eocd.eocd);

    writeableStream.on('error', (err) => {
      reject(err);
    });

    resolve();
  });
}

async function pack(input: string, output: string) {
  const writeable = createWriteStream(output);

  const files = await getFiles(input);

  const fileInfoList = await getFileInfoList(files, writeable);

  const centralDirectoryOffset = getWrittenSize(writeable);
  const totalCentralDirectoryRecord = files.length;

  await writeCDFH(fileInfoList, writeable);

  const sizeOfCentralDirectory =
    getWrittenSize(writeable) - centralDirectoryOffset;

  const eocd = new EOCD(
    totalCentralDirectoryRecord,
    sizeOfCentralDirectory,
    centralDirectoryOffset
  );
  await writeEOCD(writeable, eocd);
}

const res = pack(inputPath1, outputPath);
