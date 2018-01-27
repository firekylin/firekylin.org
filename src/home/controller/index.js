'use strict';

import Base from './base.js';
import path from 'path';
import fs from 'fs';
import request from 'request-promise-native';
import xmljs from 'xml-js';
import md5 from 'md5';

const readFileAsync = think.promisify(fs.readFile, fs);

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let release = path.join(think.RESOURCE_PATH, 'release/.latest');
    let version = false;
    let themeModel = this.model('theme');
    version = await readFileAsync(release).catch(() => false);
    this.assign({latest: version,state:encodeURIComponent(this.http.url)});


    //auto render template file index_index.html

    //读用户缓存
    let userInfo = await this.session('userInfo');
    this._clientId = 'efaf9351830c99050b36';
    this.assign({userInfo:userInfo});
    this.assign('clientId',this._clientId);
    return this.display();
  }

  async userAction() {
    let users = await request('https://gist.githubusercontent.com/lizheming/1264dae9921a1c0495b5bfdc9d21ce32/raw/d926028eb36006f72171d6f0f7377e2ae49665ef/users.json');
    users = JSON.parse(users);
    this.success(await this.getAllRssData(users));
  }

  async getAllRssData(urls) {
    const key = md5(JSON.stringify(urls));
    return think.cache(key, async () => {
      let data = await Promise.all(urls.map(url => this.getRssData(url).catch(() => [])));
      data = data.reduce((a, b) => a.concat(b), []);
      
      data = data.sort((a, b) => {
        const timeA = (new Date(a.pubDate)).getTime();
        const timeB = (new Date(b.pubDate)).getTime();
        return timeB - timeA;
      });
      return data;
    }, {
      timeout: 3600
    });
    
  }

  async getRssData(url) {
    const rssUrl = url + '/rss.html';
    const rssText = await request({
      url: rssUrl,
      timeout: 1000
    });
    const data = xmljs.xml2js(rssText);
    const res = data.elements[0].elements[0].elements
      .filter(obj => obj.name === 'item')
      .map(obj => {
        const result = {};
        const elements = obj.elements;
        for(let i = 0; i < elements.length; i++) {
          const name = elements[i].name;
          const els = elements[i].elements[0];
          result[name] = els[els.type];
        }
        return result;
      });
    return res;
  }
}