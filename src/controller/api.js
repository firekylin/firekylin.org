const Base = require('./base');
const Turndown = require('turndown');
const {gfm} = require('turndown-plugin-gfm');
const request = require('request-promise-native');

const turndown = new Turndown({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});
turndown.use(gfm);

module.exports = class extends Base {
  async spiderAction(){
    const {url} = this.get();

    const resp = await request({
      method: 'GET',
      uri: 'http://url2api.sinaapp.com/article',
      qs: {
        url,
        token: think.config('url2io')
      },
      json: true
    });
    const imgMatch = resp.content.match(/<img.+?src=(['"])?([^"' ]+)\1?[^>]*(?:\/)?>/);
    const firstImageUrl = Array.isArray(imgMatch) && imgMatch.length>2 ? imgMatch[2] : '';
    resp.firstImageUrl = firstImageUrl;

    resp.content = turndown.turndown(resp.content);
    return this.success(resp);
  }
}