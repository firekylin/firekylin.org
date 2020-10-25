const path = require('path');
const view = require('think-view');
const cache = require('think-cache');

module.exports = [
  view, // make application support view
  cache,
  {
    think: {
      RESOURCE_PATH: path.join(process.cwd(), 'www'),
    }
  }
];
