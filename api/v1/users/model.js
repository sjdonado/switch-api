const { db } = require('../../../lib/firebase');
const { defaultProfilePicture } = require('../../../lib/utils');

const Model = db.collection('users');

const getUser = async (uid) => {
  const userResponse = await Model.where('uid', '==', uid).get();
  if (userResponse.empty) return null;
  return Object.assign({ id: userResponse.docs[0].id }, userResponse.docs[0].data());
};

const createUser = async (body) => {
  const reference = await Model.add(body);
  return Object.assign({ id: reference.id }, body);
};

const createEmptyUser = async (user) => {
  const body = {
    uid: user.uid,
    phoneNumber: user.phone_number,
    profilePicture: defaultProfilePicture,
    radius: 500,
    categories: [],
    filters: [],
  };
  const reference = await createUser(body);
  return Object.assign({ id: reference.id }, body);
};

const getOrCreateUser = async (user) => {
  try {
    const userResponse = await getUser(user.uid);
    if (!userResponse) {
      return createEmptyUser(user);
    }
    return userResponse;
  } catch (e) {
    return e;
  }
};

module.exports = {
  Model,
  getUser,
  getOrCreateUser,
  createEmptyUser,
  createUser,
};
