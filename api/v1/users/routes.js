const { Router } = require('express');
const { db, uploadFile, getUser, deleteFile } = require('../../../lib/firebase');

const router = Router();

router.get('/all', async (req, res, next) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    res.json(usersSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data(),
    })));
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  const { user } = req;
  if (!user && !user.id) next(new Error('Bad request'));
  res.json({ data: user });
});

router.post('/signup', async (req, res, next) => {
  const { user, body } = req;
  if (!body) next(new Error('Bad request'));
  try {
    if(user.id) {
      res.json({ data: user });
    }else{
      Object.assign(body, {
        uid: user.uid,
        phone_number: user.phone_number,
      });
      await db.collection('users')
        .doc()
        .set(body, { merge: true });
      console.log("BODY", body)
      res.json({ data: body });
    }
  } catch (e) {
    next(e);
  }
});

router.post('/upload', async (req, res, next) => {
  const { files, user } = req;
  const profile_picture = await uploadFile(files[0], next);
  if(!user.id) Object.assign(user, await getUser(user));
  if(user.profile_picture) deleteFile(user.profile_picture.ref);
  await db.collection('users')
    .doc(user.id)
    .update({
      profile_picture,
    });
  res.json({ data: { profile_picture } });
});

router.put('/', async (req, res, next) => {
  const { user, body } = req;
  if (!body) next(new Error('Bad request'));
  try {
    if(!user.id) user.id = await getUser(user).id;
    await db.collection('users')
      .doc(user.id)
      .update(body);
    res.json({ data: body });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
