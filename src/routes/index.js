import express, { Router, Request } from 'express';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

const router = Router()
router.get('/users/', async (req, res, next) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];
        usersnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                data: doc.data()
            });
        });
        res.json(users);
    } catch(e) {
        next(e);
    }
});

router.get('/users/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id is blank');
        const note = await db.collection('users').doc(id).get();
        if (!note.exists) {
            throw new Error('note does not exists');
        }
        res.json({
            id: note.id,
            data: note.data()
        });
    } catch(e) {
        next(e);
    }
})

router.post('/users/', async (req, res, next) => {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = await db.collection('users').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

router.put('/users/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = await db.collection('users').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

router.delete('/users/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id is blank');
        await db.collection('users').doc(id).delete();
        res.json({
            id
        });
    } catch(e) {
        next(e);
    }
});

export default router;