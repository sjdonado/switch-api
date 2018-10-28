import fs from 'fs';
import tmp from 'tmp';

export const juan = '';

export async function tmpFile(buffer) {
  return new Promise((res, rej) => {
    tmp.file((err, path, fd, cleanup) => {
      if (err) rej(err);
      fs.appendFileSync(path, Buffer.from(buffer));
      res(path);
    });
  });
}
