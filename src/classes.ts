import path from 'path';
import { createReadStream, WriteStream } from 'fs';
import { LFH } from './zip/lfh';
import { CDFH } from './zip/cdfh';

enum targetTypes {
  dir = 'dir',
  file = 'file',
}

export class Tree extends Array {
  async writeLFH(writeableStream: WriteStream): Promise<void> {
    for (const item of this) {
      await item.writeLFH(writeableStream);
    }
  }
}

class Entrie {
  public stat: {
    name: string;
    dirname: string;
    size: number;
    fileNameLength: number;
  };
  public filePath: string;
  public lfh: LFH;
  public offset: number;

  constructor(filePath: string, size: number) {
    this.filePath = filePath;
    const name = path.basename(filePath);
    const dirname = path.dirname(filePath);
    this.stat = {
      name,
      dirname,
      size,
      fileNameLength: name.length,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async writeLFH(_writeableStream: WriteStream): Promise<void> {
    throw Error('Is not ready!!!');
  }

  toString(): string {
    return JSON.stringify(this, null, 2);
  }
}

export class File extends Entrie {
  private fileType: targetTypes;

  constructor(filePath: string, size: number) {
    super(filePath, size);
    this.fileType = targetTypes.file;
    this.lfh = new LFH(
      this.stat.size,
      this.stat.fileNameLength,
      this.stat.name
    );
  }

  async writeLFH(writeableStream: WriteStream): Promise<void> {
    const readableStream = createReadStream(this.filePath);

    const offset = await new Promise<number>((resolve, reject) => {
      readableStream.on('data', (chunk) => {
        const offset = writeableStream.writableLength;
        writeableStream.write(this.lfh.hex);
        writeableStream.write(this.lfh.name);
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

    this.offset = offset;
  }

  get type(): targetTypes {
    return this.fileType;
  }
}
export class Dir extends Entrie {
  private fileType: targetTypes;

  constructor(filePath: string, size: number) {
    super(filePath, size);
    this.fileType = targetTypes.dir;
    this.lfh = new LFH(0, this.stat.fileNameLength, this.stat.name);
  }

  async writeLFH(writeableStream: WriteStream): Promise<void> {
    const offset = await new Promise<number>((resolve, reject) => {
      const offset = writeableStream.writableLength;
      writeableStream.write(this.lfh.hex);
      writeableStream.write(this.lfh.name);
      resolve(offset);

      writeableStream.on('error', (err) => {
        reject(err);
      });
    });

    this.offset = offset;
  }
  get type(): targetTypes {
    return this.fileType;
  }
}
