const {
  db,
  uploadFile,
  deleteFile,
  sendNotification,
} = require('../lib/firebase');

const { getOrCreateUser } = require('../users/model');

module.exports.all = async (req, res, next) => {
  try {
    const usersSnapshot = await db.collection('users').get();
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
    await db.collection('users')
      .doc(user.id)
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
    if (!user.id) user.id = await getOrCreateUser(user).id;
    await db.collection('users')
      .doc(user.id)
      .update(body);
    res.json({ data: body });
  } catch (e) {
    next(e);
  }
};

module.exports.sendNotification = (req, res, next) => {
  const { body } = req;
  sendNotification('switch', body)
    .then((response) => {
      res.json({ data: { response } });
    })
    .catch((e) => {
      next(e);
    });
};
