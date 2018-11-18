const admin = require('firebase-admin');
const { getOrCreateUser } = require('../users/model');

module.exports.authentication = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) next();
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const user = await getOrCreateUser(decodedIdToken);
    if (user instanceof Error) next(user);
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports.isACompany = async function authorization(req, res, next) {
  if (req.user.userType) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
};
