/*
*	根据学号和电话号模拟人工填写验证码，获取用户ID和上次登陆的时间与位置信息
*/
const axios = require('axios');
// 随机验证码
function randomCode(){
	return new Array(4).fill(0).map(i=>Math.floor(Math.random()*10)).join('');
}
module.exports = (info, cookie) => {
	let { stu_num, phone } = info;
	let code = randomCode();
	let createDate = new Date();
	let expires = new Date(createDate.getTime()+300);
	let cookie_obj = {
		'Last_xh_str': { name:'Last_xh_str', value:stu_num, expires, path: '/' },
		'submit_phone': { name:'submit_phone', value:phone, expires, path: '/' },
		'check_code_str': { name:'check_code_str', value:code, expires, path: '/' },
		'wait_t': { name:'wait_t', value:'300', path:'/' },
		'creat_t': { name:'creat_t', value:createDate, path:'/' }
	};
	Object.assign(cookie_obj, cookie.object);
	let cookie_str = cookie.stringify(cookie_obj);
	return new Promise((resolve, reject) => {
		if(stu_num != undefined && phone != undefined){
			axios
			.get(`http://zs.nustti.edu.cn/xxxx/stu_login/default_serv.asp?xh=${stu_num}&phone=${phone}&action=update_data&${cookie.object['cp%5Fsys'].value}&NowTime=${Date.now()}`,{
				headers: {
					Host: 'zs.nustti.edu.cn',
					Referer: "http://zs.nustti.edu.cn/xxxx/stu_login/",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
					Cookie: cookie_str,
				}
			})
			.then(res => {
				cookie.save(res);
				let idMatch = res.data.match(/(?<=,)\d{4,6}(?=,)/);
				let ipMatch = res.data.match(/(?<=,\s*)[^,]+(?=\s*,\s*$)/);
				if(idMatch && ipMatch){
					info.stu_id = idMatch[0];
					info.t_ip = ipMatch[0];
					resolve({
						info,
						cookie
					})
				}else{
					resolve()
				}
			})
			.catch(reject)
		}else{
			resolve()
		}
	})
}