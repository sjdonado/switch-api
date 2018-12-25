const { Router } = require('express');

const router = Router();
const controller = require('./controller');
const { isACompany } = require('../lib/auth');

router.post('/notification', isACompany, controller.sendNotification);
router.get('/', isACompany, controller.get);
router.put('/', isACompany, controller.update);

module.exports = router;
