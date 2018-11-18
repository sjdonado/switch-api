const { db } = require('../lib/firebase');

const profilePicture = {
  url: 'https://firebasestorage.googleapis.com/v0/b/switch-dev-smartrends.appspot.com/o/default_images%2Fblank-profile-picture-973460_640.png?alt=media&token=94e82a08-98cd-4bd6-8f11-0ced986562a8',
  ref: null,
};

module.exports.getOrCreateUser = async (user) => {
  let response;
  try {
    const userInfo = await db.collection('users')
      .where('uid', '==', user.uid)
      .get();
    if (userInfo.empty) {
      const body = {
        uid: user.uid,
        phoneNumber: user.phone_number,
        profilePicture,
      };
      const reference = await db.collection('users')
        .add(body);
      response = Object.assign({ id: reference.id }, body);
    } else {
      response = Object.assign({ id: userInfo.docs[0].id }, userInfo.docs[0].data());
    }
    return response;
  } catch (e) {
    return e;
  }
};
