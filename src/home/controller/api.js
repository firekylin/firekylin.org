import Base from './base.js';
import Turndown from 'turndown';
// import read from 'node-readability';
import request from 'request-promise-native';
import {gfm} from 'turndown-plugin-gfm';

const turndown = new Turndown({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});
turndown.use(gfm);

// const readAsync = think.promisify(read);
export default class extends Base {
  async spiderAction(){
    const {url} = this.get();

    const resp = await request({
      method: 'GET',
      uri: 'http://api.url2io.com/article',
      qs: {
        url,
        token: think.config('url2io')
      },
      json: true
    });

    const imgMatch = resp.match(/<img\s+(?:^src)*src="([^"]*)"[^>]*(?:\/)?>/);
    const firstImageUrl = Array.isArray(imgMatch) && imgMatch.length ? imgMatch[1] : '';
    resp.firstImageUrl = firstImageUrl;
    
    resp.content = turndown.turndown(resp.content);
    return this.success(resp);

    // const html = await request({
    //   url,
    //   timeout: 1000
    // });
    
    // const article = await read(html);
  }
}