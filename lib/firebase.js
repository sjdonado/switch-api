const admin = require('firebase-admin');
const { tmpFile } = require('./utils');
const serviceAccount = require('../service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const BUCKET_NAME = 'switch-dev-smartrends';
const storage = admin.storage().bucket(`gs://${BUCKET_NAME}.appspot.com`);

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

module.exports.uploadFile = async function uploadFile(file) {
  const fileName = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`;
  const options = {
    destination: storage.file(`profile_pictures/${fileName}`),
    resumable: false,
  };
  try {
    const path = await tmpFile(file.buffer);
    await storage.upload(path, options);
    const signedUrls = await storage.file(`profile_pictures/${fileName}`).getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });
    return { url: signedUrls[0], ref: `profile_pictures/${fileName}` };
  } catch (e) {
    return e;
  }
};

module.exports.deleteFile = async filename => storage.file(filename).delete();

module.exports.getUser = async (user) => {
  try {
    const userInfo = await db.collection('users')
      .where('uid', '==', user.uid)
      .get();
    if (userInfo.size > 0 && userInfo.docs) {
      return Object.assign({ id: userInfo.docs[0].id }, userInfo.docs[0].data());
    }
    return user;
  } catch (e) {
    return e;
  }
};

module.exports.db = db;
