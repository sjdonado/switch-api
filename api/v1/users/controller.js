const {
  uploadFile,
  deleteFile,
} = require('../../../lib/firebase');

const { Model, getUser, getOrCreateUser } = require('../users/model');
const { getOrCreatePlace } = require('../places/model');

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
    const userInfo = await getUser(user.uid);
    if (!userInfo) next(userInfo);
    if (userInfo.profilePicture.ref) await deleteFile(userInfo.profilePicture.ref);
    await Model
      .doc(userInfo.id)
      .update({
        profilePicture,
      });
    res.json({ data: { profilePicture } });
  } catch (e) {
    next(e);
  }
};

module.exports.update = async (req, res, next) => {
  const { user, body } = req;
  if (!body) next(new Error('Bad request'));
  try {
    const userResponse = await getOrCreateUser(user, next);
    if (userResponse instanceof Error) next(userResponse);
    const { id } = userResponse;
    if (body.role) await getOrCreatePlace(id);
    // if (body.location) await updateOrCreateLocation(user.uid, body.location);
    await Model
      .doc(id)
      .update(body);
    res.json({ data: body });
  } catch (e) {
    next(e);
  }
};
