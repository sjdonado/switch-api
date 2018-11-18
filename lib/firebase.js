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

module.exports.getOrCreateUser = async (user) => {
  let response;
  try {
    const userInfo = await db.collection('users')
      .where('uid', '==', user.uid)
      .get();
    if (userInfo.empty) {
      const body = {
        uid: user.uid,
        phone_number: user.phone_number,
      };
      const reference = await db.collection('users')
        .add(body);
      response = Object.assign({ id: reference.id }, body);
    } else {
      response = Object.assign({ id: userInfo.docs[0].id }, userInfo.docs[0].data());
    }
    return response;
  } catch (e) {
    return e;
  }
};

module.exports.sendNotification = (topic, data) => {
  const message = {
    data,
    topic,
  };
  return admin.messaging().send(message);
};

module.exports.db = db;
