import fs from 'fs';
import path from 'path';
import { Dir, File } from './classes';
import { createWriteStream, PathLike } from 'fs';

const inputPath1: PathLike = '/home/gorushkin/Webdev/pz/temp/test/folder';
// const inputPath2: PathLike = '/home/gorushkin/Webdev/pz/temp/test/test.txt';
// const inputPath3: PathLike = '/home/gorushkin/Webdev/pz/temp/test';

class zipper {
  private static async getFiles(filename: string, acc: (File | Dir)[] = []) {
    const stat = await fs.promises.stat(filename);
    if (stat.isFile()) acc.push(new File(filename, stat.size));
    if (stat.isDirectory()) {
      const files = await fs.promises.readdir(filename);
      acc.push(new Dir(filename, stat.size));
      await Promise.all(
        files.map((item) => this.getFiles(path.join(filename, item), acc))
      );
    }
    return acc;
  }

  static async pack(path: string) {
    const tree = await this.getFiles(path);
    console.log('tree: ', tree);
    // const writeable = createWriteStream('./temp/output/test.zip');

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
