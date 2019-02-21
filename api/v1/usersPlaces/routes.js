const { Router } = require('express');

const router = Router();
const controller = require('./controller');

router.post('/accept', controller.acceptPlace);
router.post('/reject', controller.rejectPlace);
router.post('/qualify/:id', controller.qualify);
router.put('/remove/:id', controller.remove);

module.exports = router;
