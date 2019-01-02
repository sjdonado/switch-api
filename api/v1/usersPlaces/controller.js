const {
  sendNotification,
} = require('../../../lib/firebase');

const {
  types,
  acceptOrReject,
  starredPlaces,
} = require('./model');

module.exports.acceptPlace = async (req, res, next) => {
  const { body } = req;
  const { placeId, userId } = body;
  try {
    const data = await acceptOrReject(placeId, userId, types.accepted);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.rejectPlace = async (req, res, next) => {
  const { body } = req;
  const { placeId, userId } = body;
  try {
    const data = await acceptOrReject(placeId, userId, types.rejected);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};
