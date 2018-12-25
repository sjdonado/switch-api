const {
  uploadFile,
  deleteFile,
} = require('../lib/firebase');

const { getOrCreateUser, Model } = require('../users/model');
const { updateOrCreateLocation } = require('../places/model');

module.exports.all = async (req, res, next) => {
  try {
    const usersSnapshot = await Model.get();
    res.json(usersSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data(),
    })));
  } catch (e) {
    next(e);
  }
};

module.exports.read = async (req, res, next) => {
  const { user } = req;
  if (!user && !user.id) next(new Error('Bad request'));
  res.json({ data: user });
};

module.exports.upload = async (req, res, next) => {
  try {
    const { files, user } = req;
    const profilePicture = await uploadFile(files[0], next);
    if (profilePicture instanceof Error) next(profilePicture);
    const userInfo = await getOrCreateUser(user);
    if (userInfo instanceof Error) next(userInfo);
    if (!user.id) Object.assign(user, userInfo);
    if (user.profilePicture && user.profilePicture.ref) await deleteFile(user.profilePicture.ref);
    await Model
      .doc(user.id)
      .update({
        profilePicture,
      });
    res.json({ data: { profilePicture } });
  } catch (e) {
    next(e);
  }
};

module.exports.getPlaces = async (req, res, next) => {
  const { user, body } = req;
};

module.exports.update = async (req, res, next) => {
  const { user, body } = req;
  if (!body) next(new Error('Bad request'));
  try {
    const { id } = await getOrCreateUser(user);
    if (!user.id) user.id = id;
    if (body.location) await updateOrCreateLocation(user.uid, body.location);
    await Model
      .doc(user.id)
      .update(body);
    res.json({ data: body });
  } catch (e) {
    next(e);
  }
};
