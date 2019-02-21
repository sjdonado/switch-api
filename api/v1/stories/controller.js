const {
  uploadFile,
} = require('../../../lib/firebase');

const {
  Model,
  createStory,
  getPlaceStories,
  getAllPlaceStories,
  viewStory,
  deleteStory,
} = require('./model');

module.exports.createStory = async (req, res, next) => {
  try {
    const { files, query } = req;
    const { place } = query;
    const profilePicture = await uploadFile('stories/', files[0], next);
    if (profilePicture instanceof Error) next(profilePicture);
    const data = await createStory(place, profilePicture);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.getAllPlaceStories = async (req, res, next) => {
  try {
    const { query } = req;
    const data = await getAllPlaceStories(query.place);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.getPlaceStories = async (req, res, next) => {
  try {
    const { query } = req;
    const data = await getPlaceStories(query.place);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.viewStory = async (req, res, next) => {
  try {
    const { params } = req;
    const { body } = req;

    const data = await viewStory(body.userId, params.id);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports.deleteStory = async (req, res, next) => {
  try {
    const { params } = req;
    await deleteStory(params.id);
    res.json({});
  } catch (e) {
    next(e);
  }
};
