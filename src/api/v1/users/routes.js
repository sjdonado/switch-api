import { Router } from 'express';
import { db, uploadFile } from '../../../lib/firebase';

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
  if (!user) next(new Error('Bad request'));
  try {
    const userInfo = await db.collection('users').doc(user.uid).get();
    res.json({
      data: userInfo.data(),
    });
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  const { user, body } = req;
  if (!user || !body) next(new Error('Bad request'));
  try {
    // const verifyUser = await db.collection('users')
    //   .where('uid', '==', user.uid)
    //   .get();
    Object.assign(body, {
      phone_number: user.phone_number,
    });
    const userInfo = await db.collection('users')
      .doc(user.uid)
      .set(body, { merge: true });
    res.json({ data: userInfo.data() });
  } catch (e) {
    next(e);
  }
});

router.post('/upload', async (req, res, next) => {
  const { files, user } = req;
  const url = await uploadFile(files[0], next);
  await db.collection('users')
    .doc(user.uid)
    .set({
      profile_picture: url[0],
    }, { merge: true });
  res.json({ data: { profile_picture: url[0] } });
});

router.put('/', async (req, res, next) => {
  const { user, body } = req;
  if (!user || !body) next(new Error('Bad request'));
  try {
    await db.collection('users')
      .doc(user.uid)
      .set(body, { merge: true });
    res.json({ data: body });
  } catch (e) {
    next(e);
  }
});

router.delete('/', async (req, res, next) => {
  const { user } = req;
  if (!user) next(new Error('Bad request'));
  try {
    await db.collection('users')
      .where('uid', '==', user.uid)
      .get()
      .delete();
    res.json({ data: {} });
  } catch (e) {
    next(e);
  }
});

export default router;
