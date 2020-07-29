/**
 * 	使用令牌 & 学生id & 学生位置信息 申报体温
*/
const axios = require('axios');

// 随机正常体温
function randomTemper(){
	return (36.3 + Math.random() * (37.2 - 36.3)).toFixed(1);
}
// 随机运营商
function randomOperator(){
	let num = Math.random() * 10;
	if(num > 6){
		return '电信';
	}else if(num > 3){
		return '移动';
	}else {
		return '联通';
	}
}
// 符合申报体温的时间格式
function R_Time(date) {
	var date = date || new Date();
	var yy = date.getFullYear().toString();
	var mm = '0' + (date.getMonth() + 1).toString();
	var dd = '0' + date.getDate().toString();
	var h = '0' + date.getHours().toString();
	var m = '0' + date.getMinutes().toString();
	var s = '0' + date.getSeconds().toString();
	var t = yy + '-' + right(mm,2) + '-' + right(dd,2) + '|' + right(h,2) + ':' + right(m,2) + ':' + right(s,2);
	return t;
}
// 处理时间格式的函数
function right(mainStr,lngLen) {
	if (mainStr.length-lngLen>=0 && mainStr.length>=0 && mainStr.length-lngLen<=mainStr.length) {
	return mainStr.substring(mainStr.length-lngLen,mainStr.length);}
	else{return null;}
}
module.exports = (info, cookie) => {
	let { stu_num, stu_id, province, province_id, city, city_id, county, county_id } = info;
	let operator = randomOperator();
	let temperate = randomTemper();
	let date = new Date();
	let cookie_str = cookie.stringify(cookie.object);
	return new Promise((resolve, reject) => {
		if(stu_num != undefined && stu_id != undefined && province != undefined && province_id != undefined && city != undefined && city_id != undefined && county != undefined && county_id != undefined){
			axios.post(
				`http://zs.nustti.edu.cn/xxxx/def_serv.asp?action=UpData&NowTime=${date.getTime()}`,
				`data_time=${R_Time(date)}&data_id=${stu_id}_${date.getTime()}&t0=${stu_num}&t1=${temperate}&t2=0&t3=0&t4=0&t5_1=${province}&t5_2=${city}&t5_3=${county}&t6=0&t7=999&t7a=999&t8=9&t9=9&tt_cip=&tt_cid=&tt_cname=&info_ip_Address4=${province}${city}&info_ip_Address5=${province}${city}&info_ip_Address6=${province}${city} ${operator}&info_ip_Address2=${province}${city},${operator}&info_ip_Address3=中国|0|${province}|${city}|${operator}&t5_1_id=${province_id}&t5_2_id=${city_id}&t5_3_id=${county_id}&location1=定位失败,用户拒绝请求地理定位&location2=,,,,,,,,&`,{
				headers: {
					Host: 'zs.nustti.edu.cn',
					Referer: "http://zs.nustti.edu.cn/xxxx/",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
					Cookie: encodeURI(cookie_str),
				}
			}).then(res=>{
				cookie.save(res);
				if(/(?<=Serv_Outp[:：]\s*)\w+(?=\s*(!|！),)/i.test(res.data)){
					let timeMatch = res.data.match(/(?<=,\s*)\d{4}\-\d{1,2}\-\d{1,2}\|[\d\:]+(?=\s*,)/);
					info.time = timeMatch ? new Date(timeMatch[0].replace('|',' ')) : new Date();
					info.temperate = temperate;
					resolve({
						status: 'ok',
						info,
						cookie
					})
				}else{
					resolve()
				}
			})
			.catch(()=>resolve())
		}else{
			resolve()
		}
	})
}