const { db, geoFire } = require('../../../lib/firebase');
const user = require('../users/model');

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

async function getPlacesByRadius(userLoc, radius) {
  const places = await Model.get();
  return places.docs.map(async (place) => {
    const placeUser = await user.Model.doc(place.data().userId).get();
    const { location } = placeUser.data();
    const distance = geoFire.distance([userLoc.lat, userLoc.lng], [location.lat, location.lng]);
    return distance <= radius;
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
  getPlacesByRadius,
};
