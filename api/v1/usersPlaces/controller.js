const {
  sendNotification,
} = require('../../../lib/firebase');

const {
  Model,
  types,
  acceptOrReject,
  getPlaceRate,
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

module.exports.qualify = async (req, res, next) => {
  const { body, params } = req;
  const { qualify } = body;
  const { id } = params;
  try {
    const userPlace = await Model.doc(id).get();
    const rate = await getPlaceRate(userPlace.data().placeId);
    const data = Object.assign(userPlace.data(), { qualify });
    await Model.doc(id).update(data);
    res.json({ data: Object.assign({ rate }, data) });
  } catch (e) {
    next(e);
  }
};
