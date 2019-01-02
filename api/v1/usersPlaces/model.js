const { db, geoFire, GeoFire } = require('../../../lib/firebase');
const User = require('../users/model');
const Place = require('../places/model');

const Model = db.collection('usersPlaces');

const types = { accepted: 0, rejected: 1 };

const getUsersPlacesByType = async (userId, type) => {
  const response = await Model.where('userId', '==', userId).where('type', '==', type).get();
  return response.docs.map(doc => doc.data());
};

const acceptOrReject = async (placeId, userId, type) => {
  // const place = await Place.Model
  //   .doc(placeId)
  //   .get();
  const userPlace = await Model.add({ placeId, userId, type });
  return userPlace;
};

const rejectedPlaces = async userId => getUsersPlacesByType(userId, types.rejected);

const getUserPlaces = async (userId) => {
  const response = await Model.where('userId', '==', userId).get();
  return response.docs.map(doc => doc.data());
};

module.exports = {
  Model,
  types,
  getUsersPlacesByType,
  getUserPlaces,
  acceptOrReject,
  rejectedPlaces,
};
