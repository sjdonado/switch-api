import admin from 'firebase-admin';
import { getUser } from './firebase';

export const authentication = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) next();
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = await getUser(decodedIdToken, next);
    next();
  } catch (e) {
    next(e);
  }
};

export async function authorization(req, res, next) {
  return true;
}
