'use strict';

import Base from './base.js';
import path from 'path';
import fs from 'fs';

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
}