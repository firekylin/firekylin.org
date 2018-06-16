import Base from './base.js';
// import read from 'node-readability';
import request from 'request-promise-native';

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
    return this.success(resp);

    // const html = await request({
    //   url,
    //   timeout: 1000
    // });
    
    // const article = await read(html);
  }
}