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
};

module.exports.profilePicture = {
  url: 'https://firebasestorage.googleapis.com/v0/b/switch-dev-smartrends.appspot.com/o/default_images%2Fblank-profile-picture-973460_640.png?alt=media&token=94e82a08-98cd-4bd6-8f11-0ced986562a8',
  ref: null,
};
