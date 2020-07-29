/*
	学生信息加密处理
*/
module.exports = info => {
	let entryInfo = {};
	if(info.temperate)entryInfo.temperate = info.temperate;
	if(info.time)entryInfo.time = info.time;
	if(info.stu_num){
		entryInfo.stu_num = info.stu_num.replace(/(?<=^\d{2,})\d(?=\d{4,}$)/g,'*')
	}
	if(info.name){
		entryInfo.name = [].map.call(info.name, (i,j,k) => k.length > 2 ? (j%2 == 0 ? i : '*') : (j%2 == 1 ? i : '*')).join('');
	}
	if(info.phone){
		entryInfo.phone = info.phone.replace(/(?<=^\d{3,})\d(?=\d{4,}$)/g,'*');
	}
	if(info.province){
		entryInfo.province = [].map.call(info.province, (i,j,k) => j%2 == 0 ? i : '*').join('');
	}
	if(info.city){
		entryInfo.city = [].map.call(info.city, (i,j,k) => j%2 == 0 ? i : '*').join('');
	}
	if(info.county){
		entryInfo.county = [].map.call(info.county, (i,j,k) => j%2 == 0 ? i : '*').join('');
	}
	if(info.email){
		let split = info.email.split('@')
		entryInfo.email = (split[1] ? split[1] : '') + [].map.call(split[0], (i,j,k) => j%2 == 0 ? i : '*').join('');
	}
	return entryInfo;
}