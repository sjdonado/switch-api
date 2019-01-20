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
    const data = Object.assign(userPlace.data(), { qualify });
    await Model.doc(id).update(data);
    const rate = await getPlaceRate(userPlace.data().placeId);
    res.json({ data: { rate, qualify } });
  } catch (e) {
    next(e);
  }
};

module.exports.remove = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userPlace = await Model.where('placeId', '==', id).get();
    const data = Object.assign(userPlace.docs[0].data(), { visibility: false });
    await Model.doc(userPlace.docs[0].id).update({ visibility: false });
    res.json({ data });
  } catch (e) {
    next(e);
  }
};
