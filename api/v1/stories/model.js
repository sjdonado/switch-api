const { db, deleteFile } = require('../../../lib/firebase');
const User = require('../users/model');
const Place = require('../places/model');

const Model = db.collection('stories');

const reminingStorySeconds = createTime => Math.round((
  Date.now() - createTime.toDate().getTime()) / 1000);

const getAllPlaceStories = async (placeId) => {
  const places = await Model
    .where('placeId', '==', placeId)
    .get();
  return places.docs.map(doc => Object.assign(
    { id: doc.id },
    doc.data(),
    { seconds: reminingStorySeconds(doc.createTime) },
  ));
};

const getPlaceStories = async (placeId) => {
  const placeStories = [];
  await Model
    .where('placeId', '==', placeId)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const seconds = reminingStorySeconds(doc.createTime);
        if (seconds < 86400) {
          placeStories.push(Object.assign(
            { id: doc.id },
            doc.data(),
            { seconds },
          ));
        }
      });
    });
  return placeStories;
};

const createStory = async (placeId, profilePicture) => {
  const views = [];
  const story = await Model.add({
    placeId,
    profilePicture,
    views,
  });
  return Object.assign({
    id: story.id,
    profilePicture,
    views: [],
    seconds: 0,
  });
};

const viewStory = async (userId, storyId) => {
  const story = await Model.doc(storyId).get();
  const data = Object.assign(story.data(), { views: [...story.data().views, userId] });
  Model.doc(storyId).update(data);
  return data;
};

const deleteStory = async (storyId) => {
  const story = await Model.doc(storyId).get();
  if (story.data().profilePicture.ref) await deleteFile(story.data().profilePicture.ref);
  await Model.doc(storyId).delete();
};

module.exports = {
  Model,
  createStory,
  getPlaceStories,
  getAllPlaceStories,
  viewStory,
  deleteStory,
};
