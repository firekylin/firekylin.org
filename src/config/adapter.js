const os = require('os');
const path = require('path');
const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
const {Console} = require('think-logger3');

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(os.tmpdir(), 'cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 60 * 60 * 1000 // gc interval
  }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: 'console',
  console: {
    handle: Console
  }
};
