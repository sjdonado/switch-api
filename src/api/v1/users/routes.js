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
  const { params } = req;
  const { id } = params;
  try {
    if (!id) throw new Error('Id is blank');
    const user = await db.collection('users').doc(id).get();
    if (!user.exists) {
      throw new Error('User does not exists');
    }
    res.json({
      id: user.id,
      data: user.data(),
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
    await db.collection('users').doc(user.uid).set(body);
    res.json(body);
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
      profile_picture: url,
    }, { merge: true });
  res.json({ url });
});

router.put('/', async (req, res, next) => {
  const { user, body } = req;
  if (!user || !body) next(new Error('Bad request'));
  try {
    await db.collection('users')
      .doc(user.uid)
      .set(body, { merge: true });
    res.json(body);
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
    res.json({});
  } catch (e) {
    next(e);
  }
});

export default router;
