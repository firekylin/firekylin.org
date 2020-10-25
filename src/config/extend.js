const path = require('path');
const view = require('think-view');

module.exports = [
  view, // make application support view
  {
    think: {
      RESOURCE_PATH: path.join(__dirname, 'www'),
    }
  }
];
