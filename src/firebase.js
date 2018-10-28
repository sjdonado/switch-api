import admin from 'firebase-admin';
import uuidv3 from 'uuid/v3';
import { tmpFile } from './utils';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const BUCKET_NAME = 'switch-dev-smartrends';
const storage = admin.storage().bucket(`gs://${BUCKET_NAME}.appspot.com`);

export const db = admin.firestore();

export async function uploadFile(file, next) {
  const fileName = `${uuidv3.URL}.${file.mimetype.split('/')[1]}`;
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
        .then(signedUrls => signedUrls)
        .catch(err => next(err));
    })
    .catch(err => next(err));
}
