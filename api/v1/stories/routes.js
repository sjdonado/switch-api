const { Router } = require('express');

const router = Router();
const controller = require('./controller');
const { isACompany } = require('../../../lib/auth');


router.get('/', controller.getPlaceStories);
router.get('/all', controller.getAllPlaceStories);

router.post('/', isACompany, controller.createStory);
router.post('/view/:id', controller.viewStory);

router.delete('/:id', isACompany, controller.deleteStory);

module.exports = router;
