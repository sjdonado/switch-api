const { Router } = require('express');

const router = Router();
const controller = require('./controller');

// router
//   .param('id', controller.id);

router.route('/')
  .get(controller.read)
  .put(controller.update);

router.get('/all', controller.all);
router.post('/upload', controller.upload);

module.exports = router;
