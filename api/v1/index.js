const { Router } = require('express');

const users = require('./users/routes');
const places = require('./places/routes');

const router = Router();

router.use('/users', users);
router.use('/places', places);

module.exports = router;
