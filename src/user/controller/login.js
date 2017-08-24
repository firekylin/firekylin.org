'use strict';

import Base from '../../themestore/controller/base.js';
import request from 'request';
let url = 'https://github.com/login/oauth/access_token';

let uid = new GUID();
export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
	  return this.display();
  }

  async callbackAction(){
    let oauth = Object.assign({}, this.config('github'));
    //auto render template file index_index.html
    oauth.code = this.get('code');
    oauth.state = this.get('state');

    let token = await getAccessToken();
    let userInfo = await getUserInfo(token);//这个userInfo是github返回的用户信息，不是缓存中读到的那个userInfo，自己起的名字别搞混了。。。

    if (userInfo.login) {
    	//将用户信息存入数据库(如果数据库没有的话再添加（thenAdd）)
    	let userList = this.model('user');
      let user = await userList.where({user_loginname: userInfo.login}).find();
      if(think.isEmpty(user)){
        await userList.add({user_uid: uid.newGUID(),user_loginname:userInfo.login});
        user = await userList.where({user_loginname: userInfo.login}).find();
      }
  		//let insertUid = await userList.thenAdd({user_uid: uid.newGUID(),user_loginname: userInfo.login},{user_loginname:userInfo.login});
    	//设置session（从数据库中读取已有信息放到session中）
	    await this.session('userInfo',user);
    	return this.redirect(oauth.state);
    }
    else {
      return this.redirect('/user/login/failed');
    }
  }

  async logoutAction(){
    //清除session
    await this.session('userInfo','');
    this.success();
  }

  async failedAction(){
  	return this.display();
  }
}
function getUserInfo(token){
	return new Promise(function(resolve, reject) {
		return request.get({
			url: "https://api.github.com/user?access_token="+token.access_token+"&scope=public_repo%2Cuser&token_type=bearer",
			headers: {
				"User-Agent": "@KateLee"
			}
		}, function(err, httpResponse, body) {
			if(err) reject(Error(err));
			var res=JSON.parse(body);
			//if(!(res = JSON.parse(body))) reject(Error(body));
			return resolve(res);
		});
	});
}
function getAccessToken(){
	return new Promise(function(resolve, reject) {
		request.post({
			url:url,
			headers: { "Accept": "application/json" },
			form:oauth
	    },function(err,res,body){
	    	if(err) reject(Error(err));
			var res = JSON.parse(body);
			if(res.access_token) resolve(res);
			else reject(Error(res));    	
	    });
	});
}

function GUID() {
 this.date = new Date();
 /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
 if (typeof this.newGUID != 'function') {
   /* 生成GUID码 */
   GUID.prototype.newGUID = function() {
     this.date = new Date();
     var guidStr = '';
     var sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
     var sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
     for (var i = 0; i < 9; i++) {
       guidStr += Math.floor(Math.random()*16).toString(16);
     }
     guidStr += sexadecimalDate;
     guidStr += sexadecimalTime;
     while(guidStr.length < 32) {
       guidStr += Math.floor(Math.random()*16).toString(16);
     }
     return this.formatGUID(guidStr);
   }

   /*
    * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
    * 返回值：返回GUID日期格式的字条串
    */
   GUID.prototype.getGUIDDate = function() {
     return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
   }

   /*
    * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
    * 返回值：返回GUID日期格式的字条串
    */
   GUID.prototype.getGUIDTime = function() {
     return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero( parseInt(this.date.getMilliseconds() / 10 ));
   }

   /*
   * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
    * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
    * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
    */
   GUID.prototype.addZero = function(num) {
     if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
       return '0' + Math.floor(num);
     } else {
       return num.toString();
     }
   }

   /* 
    * 功能：将y进制的数值，转换为x进制的数值
    * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
    * 返回值：返回转换后的字符串
    */
   GUID.prototype.hexadecimal = function(num, x, y) {
     if (y != undefined) {
       return parseInt(num.toString(), y).toString(x);
     } else {
       return parseInt(num.toString()).toString(x);
     }
   }

   /*
    * 功能：格式化32位的字符串为GUID模式的字符串
    * 参数：第1个参数表示32位的字符串
    * 返回值：标准GUID格式的字符串
    */
   GUID.prototype.formatGUID = function(guidStr) {
     var str1 = guidStr.slice(0, 8) + '-',
       str2 = guidStr.slice(8, 12) + '-',
       str3 = guidStr.slice(12, 16) + '-',
       str4 = guidStr.slice(16, 20) + '-',
       str5 = guidStr.slice(20);
     return str1 + str2 + str3 + str4 + str5;
   }
 }
}
