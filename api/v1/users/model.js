const { db } = require('../lib/firebase');

const profilePicture = {
  url: 'https://firebasestorage.googleapis.com/v0/b/switch-dev-smartrends.appspot.com/o/default_images%2Fblank-profile-picture-973460_640.png?alt=media&token=94e82a08-98cd-4bd6-8f11-0ced986562a8',
  ref: null,
};

const Model = db.collection('users');

function getUser(uid) {
  return Model
    .where('uid', '==', uid)
    .get();
}

module.exports.getOrCreateUser = async (user) => {
  try {
    const userResponse = await getUser(user.uid);
    if (userResponse.empty) {
      const body = {
        uid: user.uid,
        phoneNumber: user.phone_number,
        profilePicture,
      };
      const reference = await Model.add(body);
      return Object.assign({ id: reference.id }, body);
    }
    return Object.assign({ id: userResponse.docs[0].id }, userResponse.docs[0].data());
  } catch (e) {
    return e;
  }
};

module.exports.getUser = getUser;
module.exports.Model = Model;
