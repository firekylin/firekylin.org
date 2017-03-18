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

    version = await readFileAsync(release).catch(() => false);
    this.assign({latest: version});
    //auto render template file index_index.html
    return this.display();
  }
}