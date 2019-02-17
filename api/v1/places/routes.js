const { Router } = require('express');

const router = Router();
const controller = require('./controller');
const { isACompany } = require('../../../lib/auth');

router.get('/', isACompany, controller.get);
router.get('/search', controller.search);
router.get('/starred', controller.starredPlaces);
router.get('/categories/all', controller.getAllCategories);

router.post('/notification', isACompany, controller.sendNotification);
router.post('/image/:position', isACompany, controller.uploadImage);
router.post('/story/:position', isACompany, controller.uploadStory);

router.put('/', isACompany, controller.update);

router.delete('/image', isACompany, controller.deleteImage);
router.delete('/story', isACompany, controller.deleteStory);

module.exports = router;
