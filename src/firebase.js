import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const db = admin.firestore();
export const storage = admin.storage().bucket('switch-dev-smartrends');
