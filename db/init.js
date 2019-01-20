const { configModel } = require('../lib/firebase');
const data = require('./googleMyBusinessCategories.json');

(async () => {
  console.log(data);
  console.log(await configModel.add(Object.assign(data, { name: 'categories' })));
  process.exit();
})();
