const fs = require('fs');
const tmp = require('tmp');

module.exports.tmpFile = async function tmpFile(buffer) {
  return new Promise((res, rej) => {
    tmp.file((err, path, fd, cleanup) => {
      if (err) rej(err);
      fs.appendFileSync(path, Buffer.from(buffer));
      res(path);
    });
  });
}
