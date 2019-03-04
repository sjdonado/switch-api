const { db, geoFire, GeoFire } = require('../../../lib/firebase');
const User = require('../users/model');
const Place = require('../places/model');

const Model = db.collection('usersPlaces');

const types = { accepted: 0, rejected: 1 };

const getUsersPlacesByType = async (userId, type) => {
  const response = await Model
    .where('userId', '==', userId)
    .where('type', '==', type)
    .where('visibility', '==', true)
    .get();
  return response.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
};

const acceptOrReject = async (placeId, userId, type) => {
  const userPlace = await Model.add({
    placeId,
    userId,
    type,
    visibility: true,
  });
  return userPlace;
};

const rejectedPlaces = async userId => getUsersPlacesByType(userId, types.rejected);

const getUserPlaces = async (userId) => {
  const response = await Model.where('userId', '==', userId).get();
  return response.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
};

const getPlaceRate = async placeId => Model.where('placeId', '==', placeId)
  .get()
  .then((querySnapshot) => {
    if (querySnapshot.size === 0) return { value: 0, size: 0, comments: [] };
    let value = 0;
    let size = 0;
    const comments = [];
    return Promise.all(querySnapshot.docs.map(async (doc) => {
      const { qualify, userId } = doc.data();
      if (qualify) {
        value += qualify.value;
        const user = await User.Model.doc(userId).get();
        const { profilePicture, name } = user.data();
        comments.push({ profilePicture, name, comment: qualify.comment });
        size += 1;
      }
    })).then(() => ({ value: value / size, size, comments }));
  });

module.exports = {
  Model,
  types,
  getUsersPlacesByType,
  getUserPlaces,
  acceptOrReject,
  rejectedPlaces,
  getPlaceRate,
};
