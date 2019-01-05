const { Router } = require('express');

const router = Router();
const controller = require('./controller');
// const { isACompany } = require('../../../lib/auth');

router.post('/accept', controller.acceptPlace);
router.post('/reject', controller.rejectPlace);
router.post('/qualify/:id', controller.qualify);

module.exports = router;
