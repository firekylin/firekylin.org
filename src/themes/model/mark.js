'use strict';
import linq from 'linq';
/**
 * model
 */
export default class extends think.model.base {
	async getData(themename,mmuid){
		let data = await this.where({themename: themename,mumuid:mmuid}).find();
		return data;
	}
	async getMarkInfo(themename){
		let data = await this.where({themename:themename}).select(),avg,num;
		if(!think.isEmpty(data)){
			avg = parseFloat(linq.from(data).average(p=>p.marking)).toFixed(1),
			num = data.length;
		}
		else {
			avg = 0.0;
			num = 0;
		}
		return {avg:avg,num:num};
	}
}
