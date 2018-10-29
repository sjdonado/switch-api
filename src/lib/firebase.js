import admin from 'firebase-admin';
import uuidv3 from 'uuid/v3';
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

// export async function editUser(uid, body, next) {
//   console.log('UID', uid);
//   await db.collection('users')
//     .where("uid", "==", uid)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         console.log(doc.id, " => ", doc.data());
//       });
//       console.log('QUERY_SNAPSHOT', querySnapshot, querySnapshot.length);
//       if (querySnapshot.exists && querySnapshot[0]) {
//         db.collection('users')
//           .doc(querySnapshot[0].id)
//           .set(body, { merge: true });
//       } else {
//         next(new Error('Do Not Exist In DB'));
//       }
//     })
//     .catch(err => next(err));
// }
