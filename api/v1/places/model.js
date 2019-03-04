const {
  db,
  geoFire,
  getDistance,
  configModel,
} = require('../../../lib/firebase');
const { emptyImg } = require('../../../lib/utils');

const User = require('../users/model');
const UsersPlaces = require('../usersPlaces/model');
const Stories = require('../stories/model');

const Model = db.collection('places');

const getResponse = (user, place) => {
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
    description,
    category,
    rate,
    openingTime,
    closingTime,
    stories,
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
    description,
    category,
    rate,
    openingTime,
    closingTime,
    stories,
  };
};

const getPlaceParams = (body) => {
  const {
    nit,
    signboard,
    description,
    category,
    openingTime,
    closingTime,
  } = body;
  return {
    nit,
    signboard,
    description,
    category,
    openingTime,
    closingTime,
  };
};

const getPlace = async (userId) => {
  const data = await Model
    .where('userId', '==', userId)
    .get();
  const rate = await UsersPlaces.getPlaceRate(data.docs[0].id);
  return Object.assign({ id: data.docs[0].id, rate }, data.docs[0].data());
};

const getPlaceMergedWithUser = async (user) => {
  const place = await getPlace(user.id);
  const stories = await Stories.getPlaceStories(place.id);
  return Object.assign(getResponse(
    user,
    place,
  ), {
    stories,
  });
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
      images: [emptyImg, emptyImg, emptyImg, emptyImg],
    }, body));
    return { id: placeResponse.id };
  }
  return updatePlace(userId, body);
};

function updateOrCreateLocation(userId, location) {
  return geoFire.set(userId, [location.lat, location.lng]);
}

const getPlacesByRadius = async (userId, userLoc, radius, categories, filters) => {
  await User.Model.doc(userId).update({ radius, categories, filters });
  const availablePlaces = [];
  const rejectedPlaces = await UsersPlaces.getUserPlaces(userId);
  const open = filters.some(filter => filter === 'open');
  const closed = filters.some(filter => filter === 'closed');
  const date = new Date();
  await Model.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (!rejectedPlaces.some(e => e.placeId === doc.id)) {
        const data = doc.data();
        let accept = true;
        if (categories.length > 0
          && !categories.some(e => data.category === e)) accept = false;
        if (open || closed) {
          const openingTime = date.setHours(data.openingTime.hourOfDay, data.openingTime.minute);
          const closingTime = date.setHours(data.closingTime.hourOfDay, data.closingTime.minute);
          const openTime = Date.now() > openingTime && Date.now() < closingTime;
          if (closed && openTime) accept = false;
          if (open && !openTime) accept = false;
        }
        // if (!open && !closed) accept = false;
        if (accept) availablePlaces.push(Object.assign({ id: doc.id }, data));
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
          const rate = await UsersPlaces.getPlaceRate(place.id);
          const stories = await Stories.getPlaceStories(place.id);
          return Object.assign(
            getResponse(placeUserData, place),
            {
              id: place.id,
              distance,
              rate,
              stories,
            },
          );
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
    const rate = await UsersPlaces.getPlaceRate(userPlace.placeId);
    const { qualify } = userPlace;
    return Object.assign(
      getResponse(user.data(), place.data()),
      {
        id: place.id,
        userPlaceId: userPlace.id,
        distance,
        rate,
        myQualify: qualify,
      },
    );
  }));
};

const getGroupCategories = async () => {
  const data = {};
  const categories = await configModel
    .where('name', '==', 'categories')
    .get();
  categories.docs[0].data().Detalle.forEach((doc) => {
    if (typeof data[doc.Grupo] === 'undefined') data[doc.Grupo] = {};
    if (typeof data[doc.Grupo][doc.Segmento] === 'undefined') data[doc.Grupo][doc.Segmento] = [];
    data[doc.Grupo][doc.Segmento].push(doc.Subsegmento);
  });
  return data;
};

const getAllCategories = async () => {
  const config = await configModel
    .where('name', '==', 'categories')
    .get();
  return config.docs[0].data().Detalle.map(cat => cat.Subsegmento);
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
  getPlaceParams,
  getAllCategories,
  getGroupCategories,
};
