'use strict';

export default class extends think.controller.base {
  /**
   * some base method in here
   */
   async __before(){
   	let userInfo = await this.session('userInfo');
   	this.assign('userInfo',userInfo);
   }
}