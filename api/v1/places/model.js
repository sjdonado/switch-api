const { db, geoFire, getDistance } = require('../../../lib/firebase');
const { emptyImg } = require('../../../lib/utils');

const User = require('../users/model');
const UsersPlaces = require('../usersPlaces/model');

const Model = db.collection('places');

const getResponse = async (user, place) => {
  const {
    name,
    phoneNumber,
    profilePicture,
    location,
  } = user;
  const {
    id,
    nit,
    signboard,
    images,
  } = place;
  return {
    id,
    name,
    phoneNumber,
    profilePicture,
    images,
    location,
    nit,
    signboard,
  };
};

const getPlace = async (userId) => {
  const data = await Model
    .where('userId', '==', userId)
    .get();
  return Object.assign({ id: data.docs[0].id }, data.docs[0].data());
};

const getPlaceMergedWithUser = async (user) => {
  const placeRespone = await Model
    .where('userId', '==', user.id)
    .get();
  return getResponse(
    user,
    Object.assign({ id: placeRespone.docs[0].id }, placeRespone.docs[0].data()),
  );
};

const updatePlace = async (userId, body) => {
  const place = await getPlace(userId);
  await Model
    .doc(place.id)
    .update(Object.assign(place, body));
  return Object.assign(place, body);
};

const createOrUpdatePlace = async (userId, body) => {
  const placeRespone = await Model
    .where('userId', '==', userId)
    .get();
  if (placeRespone.empty) {
    const placeResponse = await Model.add(Object.assign({
      userId,
      images: [emptyImg, emptyImg, emptyImg],
    }, body));
    return { id: placeResponse.id };
  }
  return updatePlace(userId, body);
};

function updateOrCreateLocation(userId, location) {
  return geoFire.set(userId, [location.lat, location.lng]);
}

const getPlacesByRadius = async (userId, userLoc, radius) => {
  await User.Model.doc(userId).update({ radius });
  const availablePlaces = [];
  const rejectedPlaces = await UsersPlaces.getUserPlaces(userId);
  await Model.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (!rejectedPlaces.some(e => e.placeId === doc.id)) {
        availablePlaces.push(Object.assign({ id: doc.id }, doc.data()));
      }
    });
  });
  if (userLoc.lat && userLoc.lng) {
    return Promise.all(availablePlaces.map(async (place) => {
      const placeUser = await User.Model.doc(place.userId).get();
      const placeUserData = placeUser.data();
      if (placeUserData) {
        const { location } = placeUserData;
        const distance = getDistance(userLoc, location);
        if (distance <= radius) {
          return Object.assign(placeUserData, { distance, id: place.id }, place);
        }
      }
      return null;
    })).then(res => res.filter(elem => elem));
  }
  return [];
};

const starredPlaces = async (userId, userLoc) => {
  const userPlaces = await UsersPlaces.getUsersPlacesByType(userId, UsersPlaces.types.accepted);
  return Promise.all(userPlaces.map(async (userPlace) => {
    const place = await Model.doc(userPlace.placeId).get();
    const user = await User.Model.doc(place.data().userId).get();
    const distance = getDistance(userLoc, user.data().location);
    return Object.assign({ id: place.id, distance }, user.data(), place.data());
  }));
};

module.exports = {
  Model,
  getPlace,
  getPlaceMergedWithUser,
  updatePlace,
  createOrUpdatePlace,
  updateOrCreateLocation,
  getPlacesByRadius,
  starredPlaces,
};
