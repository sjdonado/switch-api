import admin from 'firebase-admin';
import { tmpFile } from './utils';
import serviceAccount from '../service_account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const BUCKET_NAME = 'switch-dev-smartrends';
const storage = admin.storage().bucket(`gs://${BUCKET_NAME}.appspot.com`);

export const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export async function uploadFile(file, next) {
  const fileName = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`;
  const options = {
    destination: storage.file(`profile_pictures/${fileName}`),
    resumable: false,
  };
  return tmpFile(file.buffer)
    .then(async (path) => {
      await storage.upload(path, options)
        .catch(err => next(err));
      return storage.file(`profile_pictures/${fileName}`).getSignedUrl({
        action: 'read',
        expires: '03-09-2491',
      })
        .then(signedUrls => {return { url: signedUrls[0], ref: `profile_pictures/${fileName}` }})
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

export async function deleteFile(filename) {
  return await storage.file(filename).delete()
}

export async function getUser(user, next) {
  try {
    const userInfo = await db.collection('users')
      .where("uid", "==", user.uid)
      .get()
    return userInfo.size > 0 ? Object.assign({ id: userInfo.docs[0].id }, userInfo.docs[0].data()) : user;
  } catch (e) {
    next(e);
  }
}
