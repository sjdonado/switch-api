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
  const { body } = req;
  try {
    if (!body) throw new Error('Wrong params');
    const ref = await db.collection('users').add(body);
    res.json({
      id: ref.id,
      body,
    });
  } catch (e) {
    next(e);
  }
});

router.put('/upload', async (req, res, next) => {
  const { files } = req;
  const url = await uploadFile(files[0], next);
  res.json({
    url,
  });
});

router.put('/', async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;
  try {
    if (!id) throw new Error('Id is blank');
    if (!body) throw new Error('Wrong params');
    const ref = await db.collection('users').doc(id).set(body, { merge: true });
    res.json({
      id,
      ref,
    });
  } catch (e) {
    next(e);
  }
});

router.put('/', async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;
  try {
    if (!id) throw new Error('Id is blank');
    if (!body) throw new Error('Wrong params');
    const ref = await db.collection('users').doc(id).set(body, { merge: true });
    res.json({
      id,
      ref,
    });
  } catch (e) {
    next(e);
  }
});

router.delete('/', async (req, res, next) => {
  const { params } = req;
  const { id } = params;
  try {
    if (!id) throw new Error('Wrong params');
    await db.collection('users').doc(id).delete();
    res.json({
      id,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
