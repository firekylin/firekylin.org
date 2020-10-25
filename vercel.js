const path = require('path');
const Application = require('thinkjs');

const Loader = require('thinkjs/lib/loader');

const app = new Application({
  ROOT_PATH: process.cwd(),
  APP_PATH: path.join(process.cwd(), 'src'),
  VIEW_PATH: path.join(process.cwd(), 'view'),
  RUNTIME_PATH: process.cwd(),
  proxy: true, // use proxy
  env: 'vercel',
  external: {
    static: {
      www: path.join(process.cwd(), 'www')
    }
  }
});

const loader = new Loader(app.options);
loader.loadAll('worker');

module.exports = function (req, res) {
  return think.beforeStartServer().catch(err => {
    think.logger.error(err);
  }).then(() => {
    const callback = think.app.callback();
    return callback(req, res);
  }).then(() => {
    think.app.emit('appReady');
  });
};