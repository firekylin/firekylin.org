'use strict';
/**
 * model
 */
export default class extends think.model.base {
  //根据themename获取单条数据（详情页用）
  async getData(themename){
    let data = await this.where({theme_name: themename}).find();
    let d = new Date(data.theme_lastupdated);  
    data.tagsExist =!(data.theme_tags == null || data.theme_tags == '');  
    data.descriptionExist =!(data.theme_description == undefined || data.theme_description == '');
    data.theme_description = decodeURIComponent(data.theme_description);
    data.theme_lastupdated = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
    data.theme_tags = decodeURIComponent(data.theme_tags).split(',');
    data.theme_lastTags = data.theme_tags.pop();//方便页面上显示时，用逗号隔开，且不显示最后一个的逗号
    //data.theme_filesrc = data.theme_filesrc;
    return data;
  }
  formatDate(d){
    d = new Date(d);
    d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
    return d;
  }
	/* 生成GUID码 */
    newGUID() {
      let date = new Date();
      let guidStr = '',
        sexadecimalDate = this.hexadecimal(this.getGUIDDate(date), 16),
        sexadecimalTime = this.hexadecimal(this.getGUIDTime(date), 16);
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
    getGUIDDate(date) {
      return date.getFullYear() + this.addZero(date.getMonth() + 1) + this.addZero(date.getDay());
    }
	/*
     * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
     * 返回值：返回GUID日期格式的字条串
     */
	getGUIDTime(date){
	      return this.addZero(date.getHours()) + this.addZero(date.getMinutes()) + this.addZero(date.getSeconds()) + this.addZero( parseInt(date.getMilliseconds() / 10 ));
	}
	/*
     * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
     * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
     * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
     */
	addZero(num){
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
	hexadecimal(num,x,y){
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
	formatGUID(guidStr){
		var str1 = guidStr.slice(0, 8) + '-',
	        str2 = guidStr.slice(8, 12) + '-',
	        str3 = guidStr.slice(12, 16) + '-',
	        str4 = guidStr.slice(16, 20) + '-',
	        str5 = guidStr.slice(20);
	      return str1 + str2 + str3 + str4 + str5;
	}
}
