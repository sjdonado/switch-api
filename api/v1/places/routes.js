const { Router } = require('express');

const router = Router();
const controller = require('./controller');
const { isACompany } = require('../../../lib/auth');

router.get('/', isACompany, controller.get);
router.get('/search', controller.search);
router.get('/starred', controller.starredPlaces);
router.post('/notification', isACompany, controller.sendNotification);
router.post('/image/:position', isACompany, controller.uploadImage);
router.put('/', isACompany, controller.update);
router.delete('/image', isACompany, controller.deleteImage);

module.exports = router;
