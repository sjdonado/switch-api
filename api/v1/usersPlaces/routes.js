const { Router } = require('express');

const router = Router();
const controller = require('./controller');
// const { isACompany } = require('../../../lib/auth');

router.post('/accept', controller.acceptPlace);
router.post('/reject', controller.rejectPlace);

module.exports = router;
