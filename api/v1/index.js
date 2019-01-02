const { Router } = require('express');

const users = require('./users/routes');
const places = require('./places/routes');
const usersPlaces = require('./usersPlaces/routes');

const router = Router();

router.use('/users', users);
router.use('/places', places);
router.use('/users-places', usersPlaces);

module.exports = router;
