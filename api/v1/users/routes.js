const { Router } = require('express');

const router = Router();
const controller = require('./controller');
const { isACompany } = require('../lib/auth');

// router
//   .param('id', controller.id);


router.route('/')
  .get(controller.read)
  .put(controller.update);

router.get('/all', controller.all);
router.post('/upload', controller.upload);

router.post('/notification', isACompany, controller.sendNotification);

module.exports = router;
