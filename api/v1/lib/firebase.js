const admin = require('firebase-admin');
const GeoFire = require('geofire');
const { tmpFile } = require('./utils');
const serviceAccount = require('../../../service_account.json');

const PROJECT_NAME = 'switch-dev-smartrends';

admin.initializeApp({
  databaseURL: `https://${PROJECT_NAME}.firebaseio.com`,
  credential: admin.credential.cert(serviceAccount),
});

const storage = admin.storage().bucket(`gs://${PROJECT_NAME}.appspot.com`);

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const firebase = admin.database().ref();
const geoFire = new GeoFire(firebase);

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

module.exports.sendNotification = (topic, data) => {
  const message = {
    data,
    topic,
  };
  return admin.messaging().send(message);
};

module.exports = {
  db,
  firebase,
  geoFire,
};
