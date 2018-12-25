const { db, geoFire } = require('../lib/firebase');
const { getUser } = require('../users/model');

const Model = db.collection('places');


async function getOrCreatePlace(userId) {
  const placeRespone = await Model
    .where('userId', '==', userId)
    .get();
  if (placeRespone.empty) {
    const placeResponse = await Model.add({ userId });
    return { id: placeResponse.id };
  }
  return Object.assign({ id: placeRespone.docs[0].id }, placeRespone.docs[0].data());
}

function updateOrCreateLocation(userId, location) {
  return geoFire.set(userId, [location.lat, location.lng]);
}

function getPlacesByRadius(location, radius) {
  return geoFire.query({
    center: [location.lat, location.lng],
    radius,
  });
}

module.exports.update = async (userId, body) => {
  const place = await getOrCreatePlace(userId);
  if (place.id) {
    await Model
      .doc(place.id)
      .update(Object.assign(place, body));
  }
  return body;
};

module.exports = {
  Model,
  getOrCreatePlace,
  updateOrCreateLocation,
};
