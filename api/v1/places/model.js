const { db, geoFire, GeoFire } = require('../../../lib/firebase');
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

async function getPlacesByRadius(userId, userLoc, radius) {
  const places = await Model.get();
  await user.Model.doc(userId).update({ radius });
  return Promise.all(places.docs.map(async (place) => {
    const placeUser = await user.Model.doc(place.data().userId).get();
    const { location } = placeUser.data();
    const distance = GeoFire.distance(
      [userLoc.lat, userLoc.lng],
      [location.lat, location.lng],
    ) * 1000;
    if (distance <= radius) return Object.assign(placeUser.data(), { distance });
    return null;
  })).then(res => res.filter(elem => elem));
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
