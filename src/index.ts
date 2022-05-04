import fs from 'fs';
import path from 'path';
import { CDFH, Dir, File, EOCD } from './classes';
import { createWriteStream, PathLike } from 'fs';

const inputPath1: PathLike = '/home/gorushkin/Webdev/pz/temp/test/folder';
const inputPath2: PathLike = '/home/gorushkin/Webdev/pz/temp/test/test.txt';

class zipper {
  private static async getTree(input: string) {
    const getPathInfo = async function (filename: string): Promise<File | Dir> {
      try {
        const stat = await fs.promises.stat(filename);
        if (stat.isFile()) return new File(filename, stat.size);
        if (stat.isDirectory()) {
          const childrens = await getDirContent(filename);
          return new Dir(filename, stat.size, childrens);
        }
        throw new Error('There is an error in getPathInfo');
      } catch (error) {
        throw new Error('There is an error in getPathInfo');
      }
    };

    const getDirContent = async function (
      input: string
    ): Promise<(File | Dir)[]> {
      try {
        const files = await fs.promises.readdir(input);
        const fileStats = await Promise.all(
          files.map((filename) => getPathInfo(path.join(input, filename)))
        );
        return fileStats;
      } catch (error) {
        throw new Error('There is an error in getDirContent');
      }
    };

    return getPathInfo(input);
  }

  static async pack(path: string) {
    const tree = await this.getTree(path);
    const writeable = createWriteStream('./temp/output/test.zip');

    const dictionary = await tree.write(writeable);

    const centralDirectoryOffset = writeable.writableLength;

    dictionary.map((item) => {
      const cdfh = new CDFH(item.offset, item.filename);
      // writeable.write(cdfh.toString());
      return { ...item, cdfh };
    });

    const sizeOfCentralDirectory =
      writeable.writableLength - centralDirectoryOffset;

    const eocd = new EOCD(
      dictionary.length,
      sizeOfCentralDirectory,
      centralDirectoryOffset
    );

    // writeable.write(eocd.toString());

    // fs.promises.readFile('./temp/output/test.zip').then((res) => {
    //   console.log(res.toString('hex'));
    // });
  }
}

const res = zipper.pack(inputPath2);
