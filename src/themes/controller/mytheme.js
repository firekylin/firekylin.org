import fs from 'fs';
import Base from './base';

export default class extends Base {
  /**
   * some base method in here
   */
  async __before(...args){
    await super.__before(...args);

    if(think.isEmpty(this._userInfo)){
      return this.fail('Please log in!');
    }
  }

  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    //auto render template file index_index.html
    let listModel = this.model('list');
    let themelist = await listModel.where({
      theme_authoruid: this._userInfo.user_uid
    }).select();
    this.assign({themelist: themelist,CurrentPageName:'My Theme'});
    return this.display();
  }

  async deleteAction(){
    let useruid = this._userInfo.user_uid;
    if(useruid === this.post('mmuid')){
	let fileSrc = decodeURIComponent(this.post('filesrc'));
    	let listModel = this.model('list');
    	let currentPath = think.RESOURCE_PATH + '/static/theme/' + fileSrc;
    	fs.unlinkSync(currentPath);
    	let affectedRows = await listModel.where({theme_filesrc: fileSrc}).delete();
    	if (affectedRows) this.success();
    	else this.fail();
    }
    else{
        this.fail();
     }
  }

  async rankAction(){
    let markModel = this.model('mark');
    let rank = parseInt(this.post('rank'));
    let themename = this.post('themename');
    let mmuid = this._userInfo.user_uid;
    //let data = await this._listModel.getData(themename);
    let markInfo = await markModel.getData(themename,mmuid);
    //++data.theme_markingnum;
    if(!think.isEmpty(markInfo)){
      return this.fail('You have marked this theme!');
    }
    //rank = (data.theme_marking*data.theme_markingnum+rank)/(data.theme_markingnum);
    //rank = rank.toFixed(1);
    let affectedRows = await markModel.add({themename: themename,mumuid:mmuid,marking: rank});
    let res = await markModel.getMarkInfo(themename);
    await this._listModel.where({theme_name:themename}).update({theme_marking:res.avg});
    this.success(res);
  }
}
