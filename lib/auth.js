const admin = require('firebase-admin');
const { getUser } = require('./firebase');

module.exports.authentication = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) next();
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const user = await getUser(decodedIdToken);
    if (user instanceof Error) next(user);
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports.authorization = async function authorization(req, res, next) {
  return true;
};