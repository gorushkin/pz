console.log('start');
import fs from 'fs';
import path from 'path';

const inputPath = './temp/test';

class File {
  public type: string;

  constructor(public filename: string) {
    this.filename = filename;
    this.type = 'file';
  }
}
class Dir {
  public type: string;

  constructor(
    public filename: string,
    public childrens: Array<File | Dir | undefined>
  ) {
    this.filename = filename;
    this.childrens = childrens;
    this.type = 'dir';
  }
}

class zipper {
  private static async getTree(input: string) {
    const getPathInfo = async function (filename: string): Promise<File | Dir> {
      try {
        const stat = await fs.promises.stat(filename);
        if (stat.isFile()) return new File(filename);
        if (stat.isDirectory()) {
          const childrens = await getDirContent(filename);
          return new Dir(filename, childrens);
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
          files.map(
            async (filename) => await getPathInfo(path.join(input, filename))
          )
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
    if (tree instanceof Dir) console.log(tree.childrens);
    console.log(JSON.stringify(tree, null, 2));
  }
}

const res = zipper.pack(inputPath);
