/*
	根据用户ID和上次登陆的时间位置获取历史填写的地址信息
*/
const axios = require('axios');
const { province_list, city_list, county_list } = require('./area')

module.exports = (info, cookie) => {
	let { stu_id, t_ip } = info;
	let cookie_str = cookie.stringify(cookie.object);
	return new Promise((resolve, reject) => {
		if(stu_id != undefined && t_ip != undefined){
			axios.get(`http://zs.nustti.edu.cn/xxxx/def_serv.asp?action=check_tlogin&stu_id=${stu_id}${t_ip ? ('&tlogin='+t_ip) : ''}&NowTime=${Date.now()}`,{
				headers: {
					Host: 'zs.nustti.edu.cn',
					Referer: "http://zs.nustti.edu.cn/xxxx/",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
					Cookie: encodeURI(cookie_str),
				}
			})
			.then(res => {
				cookie.save(res);
				let ipMath = res.data.match(/(?<=,)\d{6}(?=,)/g);
				if(ipMath && ipMath.length == 3){
					info.province_id = ipMath[0];
					info.province = province_list[ipMath[0]];
					info.city_id = ipMath[1];
					info.city = city_list[ipMath[1]];
					info.county_id = ipMath[2];
					info.county = county_list[ipMath[2]];
					resolve({
						info,
						cookie
					});
				}else{
					resolve();
				}
			})
			.catch(reject);
		}else{
			resolve();
		}
	})
}