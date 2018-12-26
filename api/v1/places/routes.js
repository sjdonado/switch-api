const { Router } = require('express');

const router = Router();
const controller = require('./controller');
const { isACompany } = require('../../../lib/auth');

router.get('/', isACompany, controller.get);
router.get('/search', controller.search);
router.post('/notification', isACompany, controller.sendNotification);
router.put('/', isACompany, controller.update);

module.exports = router;
