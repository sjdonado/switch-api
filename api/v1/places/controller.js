const {
  sendNotification,
  uploadFile,
  deleteFile,
} = require('../../../lib/firebase');
const { emptyImg } = require('../../../lib/utils');
const {
  getPlace,
  getPlaceMergedWithUser,
  getPlacesByRadius,
  starredPlaces,
  updatePlace,
  getAllCategories,
} = require('./model');

module.exports.sendNotification = (req, res, next) => {
  const { body } = req;
  sendNotification('switch', body)
    .then((response) => {
      res.json({ data: { response } });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.get = async (req, res, next) => {
  const { user } = req;
  try {
    const data = await getPlaceMergedWithUser(user);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.update = async (req, res, next) => {
  const { user, body } = req;
  try {
    const data = await updatePlace(user.id, body);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.search = async (req, res, next) => {
  const { user, query } = req;
  const { location, id } = user;
  const { radius, categories, filters } = query;
  try {
    const data = await getPlacesByRadius(
      id,
      location,
      radius,
      categories.length > 0 ? categories.split(',') : [],
      filters.length > 0 ? filters.split(',') : [],
    );
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.starredPlaces = async (req, res, next) => {
  const { user } = req;
  const { id, location } = user;
  try {
    const data = await starredPlaces(id, location);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.uploadImage = async (req, res, next) => {
  try {
    const { files, user, params } = req;
    const place = await getPlace(user.id);
    const position = parseInt(params.position, 10);
    if (!place.images) place.images = [];
    const image = await uploadFile('images/', files[0]);
    if (image instanceof Error) next(image);
    if (place.images[position].ref) await deleteFile(place.images[position].ref);
    place.images[position] = Object.assign(image);
    const data = await updatePlace(user.id, place);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.deleteImage = async (req, res, next) => {
  const { user, body } = req;
  const { position } = body;
  const place = await getPlace(user.id);
  try {
    await deleteFile(place.images[position].ref);
    place.images[position] = emptyImg;
    const data = await updatePlace(user.id, place);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.getAllCategories = async (req, res, next) => {
  const data = await getAllCategories();
  res.json({ data });
};
