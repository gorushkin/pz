import fs from 'fs';
import path from 'path';
import { Dir, File, Tree } from './classes';
import { createWriteStream, PathLike } from 'fs';
import { CDFH, EOCD } from './zip';

const inputPath1: PathLike = '/home/gorushkin/Webdev/pz/temp/test/folder';
const inputPath2: PathLike = '/home/gorushkin/Webdev/pz/temp/test/test.txt';
const inputPath3: PathLike = '/home/gorushkin/Webdev/pz/temp/test';

class zipper {
  private static async getTree(filename: string, acc: (File | Dir)[] = []) {
    const stat = await fs.promises.stat(filename);
    if (stat.isFile()) acc.push(new File(filename, stat.size));
    if (stat.isDirectory()) {
      const files = await fs.promises.readdir(filename);
      acc.push(new Dir(filename, stat.size));
      await Promise.all(
        files.map((item) => this.getTree(path.join(filename, item), acc))
      );
    }
    return acc;
  }

  static async pack(path: string) {
    const tree = await this.getTree(path);

    const writeable = createWriteStream('./temp/output/test.zip');

    const filesInfo = await Promise.all(
      tree.map(async (item) => {
        const offset = await item.writeLFH(writeable);
        return new CDFH(item.lfh, offset);
      })
    );

    console.log('filesInfo: ', filesInfo);

    const LFHbytesWritten = writeable.bytesWritten;
    const LFHwritableLength = writeable.writableLength;
    const centralDirectoryOffset = LFHbytesWritten + LFHwritableLength;
    console.log('centralDirectoryOffset: ', centralDirectoryOffset);

    // const eocd = new EOCD();

    //TODO: временная связванность

    // tree.forEach((item) => {
    //   console.log(item);
    // });

    // const LFHList = tree.map((item) => item.getItemProps());

    // tree.forEach((item) => {
    //   item.writeLFH(writeable);
    // });

    // async function processArray(tree) {
    //   for (const item of array) {
    //     await delayedLog(item);
    //   }
    //   console.log('Done!');
    // }

    // console.log(LFHList);
    // const dictionary = await tree.write(writeable);

    // const centralDirectoryOffset = writeable.writableLength;

    // dictionary.map((item) => {
    //   // const cdfh = new CDFH(item.offset, item.filename);
    //   // writeable.write(cdfh.toString());
    //   // return { ...item, cdfh };
    // });

    // const sizeOfCentralDirectory =
    //   writeable.writableLength - centralDirectoryOffset;

    // const eocd = new EOCD(
    //   dictionary.length,
    //   sizeOfCentralDirectory,
    //   centralDirectoryOffset
    // );

    // writeable.write(eocd.toString());

    // fs.promises.readFile('./temp/output/test.zip').then((res) => {
    //   console.log(res.toString('hex'));
    // });
  }
}

const res = zipper.pack(inputPath1);
