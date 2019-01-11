const { configModel } = require('../lib/firebase');
const categories = require('./googleMyBusinessCategories.json');

(async () => {
  console.log(await configModel.add({ name: 'categories', categories }));
  process.exit();
})();
