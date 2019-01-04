const admin = require('firebase-admin');
const GeoFire = require('geofire');
const { tmpFile } = require('./utils');
const serviceAccount = require('../service_account.json');

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

const uploadFile = async function uploadFile(storagePath, file) {
  const fileName = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`;
  const options = {
    destination: storage.file(`${storagePath}${fileName}`),
    resumable: false,
  };
  try {
    const path = await tmpFile(file.buffer);
    await storage.upload(path, options);
    const signedUrls = await storage.file(`${storagePath}${fileName}`).getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });
    return { url: signedUrls[0], ref: `${storagePath}${fileName}` };
  } catch (e) {
    return e;
  }
};

const deleteFile = async filename => storage.file(filename).delete();

const getDistance = (userLoc, location) => GeoFire.distance(
  [userLoc.lat, userLoc.lng],
  [location.lat, location.lng],
) * 1000;

const sendNotification = (topic, data) => {
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
  GeoFire,
  uploadFile,
  deleteFile,
  sendNotification,
  getDistance,
};
