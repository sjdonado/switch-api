const {
  sendNotification,
} = require('../../../lib/firebase');
const {
  Nodel,
  update,
  getOrCreatePlace,
  getPlacesByRadius,
} = require('./model');

module.exports.sendNotification = (req, res, next) => {
  const { body } = req;
  sendNotification('switch', body)
    .then((response) => {
      res.json({ data: { response } });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.get = async (req, res, next) => {
  const { user } = req;
  try {
    const data = await getOrCreatePlace(user.id);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.update = async (req, res, next) => {
  const { user, body } = req;
  try {
    const data = await update(user.id, body);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.search = async (req, res, next) => {
  const { user } = req;
  const { location, radius } = user;
  try {
    const data = await getPlacesByRadius(location, radius / 1000);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};
