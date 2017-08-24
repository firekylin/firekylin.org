'use strict';

import Base from './base.js';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip'

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    this.assign({CurrentPageName:'Upload Your Theme'})
    return this.display();
  }    
  //上传或更新主题
  async themeAction(){
    let themefile = this.file('themename');
    let originalFilename = themefile.originalFilename;
    if(originalFilename.match(/[a-zA-z_0-9_]*\.zip/)){
      let themeList = this.model('list');
      let userList = this.model('user');
      let userInfo = await this.session('userInfo');
      let currentUser = await userList.where({user_loginname:userInfo.user_loginname}).find();//当前用户信息

      let filepath = themefile.path;//为防止上传的时候因文件名重复而覆盖同名已上传文件，path是MD5方式产生的随机名称
      let uploadpath = think.RESOURCE_PATH + '/static/theme';
      //let imgpath = think.RESOURCE_PATH + '/static/img';
      think.mkdir(uploadpath);//如果没有，创建该目录
      //think.mkdir(imgpath);
      //提取出用 ‘/' 隔开的path的最后一部分。
      let zip = await getZip(filepath);
      // let end = originalFilename.length - 4;
      // let themeName = originalFilename.slice(0,end);
      //我觉得不应该用themeName，要不然在上传文件处说明:请将您的主题文件放在一个以您主题名命名文件夹内，并压缩成*.zip格式上传
      //或者在页面里再单独添加一个字段，主题名，单独验证
      //验证是否存在同名主题
      //let aa = true;
      let fileArr =  [/screenshot.png/,/package.json/,/index.html/,/post.html/,/page.html/,/tag.html/,/search.html/,/archive.html/];
      fileArr.forEach((item,index,arr)=>{
        if(think.isEmpty(zip.file(item))) return this.fail(1000,'The necessary files are missing!');
      });
      //if(!aa) return this.fail(1000,'The necessary files are missing!');
      //else {
        //添加数据
        let jsonFile = zip.file(/package.json/)[0];
        let jsonContent = await getFileContent(jsonFile,'string');//读json文件
        let jsonObj = JSON.parse(jsonContent);
        jsonObj.description = jsonObj.description || '';
	jsonObj.tags = jsonObj.tags || '';
	let name =encodeURIComponent(jsonObj.name);
        let theme = await themeList.where({theme_name:name}).find();
        if(!think.isEmpty(theme) && currentUser.user_uid !== theme.theme_authoruid) return this.fail(1000,'The theme has already existed.Please change the name and re-uploaded.');
        let res = 'update';
        let myDate = new Date();
        myDate = themeList.formatDate(myDate);
        if(currentUser.user_uid === theme.theme_authoruid) {
          let insertId = await themeList.where({theme_name:name}).update({theme_authorname:currentUser.user_name,theme_version:jsonObj.version,theme_tags:encodeURIComponent(jsonObj.tags),
          theme_description:encodeURIComponent(jsonObj.description),theme_lastupdated:myDate});
          //return this.success('update');
        }
        //这样子还要重新上传一遍，再进一遍这个方法，干脆想wordpress那样，不进行更新询问，直接更新吧！
        //但是检测一下版本号吧，如果版本号一样，就让用户更新一下？还是不检测算了。。。只有提示。就仅仅在更新成功时判断一下好了。
        else {
          let insertId = await themeList.add({theme_uid:themeList.newGUID(),theme_authoruid:currentUser.user_uid,theme_authorname:currentUser.user_name,
          theme_version:jsonObj.version,theme_filesrc:name+'.zip',theme_name:name,theme_imgsrc:name,theme_marking:0.0,theme_tags:encodeURIComponent(jsonObj.tags),
          theme_description:encodeURIComponent(jsonObj.description),theme_downloadtimes:0,theme_lastupdated:myDate});
          res = 'upload';
          //return this.success('upload');
        } 

        //读取图片信息，图片另存
        let imgFile = zip.file(/screenshot.png/)[0];
        let imgContent = await getFileContent(imgFile,'nodebuffer');
        fs.writeFileSync(think.RESOURCE_PATH + '/static/img/'+name+'.png', imgContent);
        //let basename = themefile.originalFilename;//因为本系统不允许上传同名主题，所以文件名就直接使用主题名
        //将上传的文件（路径为filepath的文件）移动到第二个参数所在的路径，并改为第二个参数的文件名。
        fs.renameSync(filepath, uploadpath + '/' + name+'.zip');
        themefile.path = uploadpath + '/' + name;
        return this.success(res);
      //} 
    }
    else{
      return this.fail(1000,'The format of file should be zip');
    }
  }
}
//获取压缩文件信息
function getZip(path){
  return new Promise(function (resolve,reject){
    fs.readFile(path, function(err, data) {
      if (err) throw err;
      JSZip.loadAsync(data).then(function (zip) {
          resolve(zip);
      });
    });
  });
}
//获取某个文件信息
function getFileContent(zipObject,type){
  return new Promise(function(resolve,reject){
    zipObject.async(type).then(function(content){
      resolve(content);
    });
  });
}
