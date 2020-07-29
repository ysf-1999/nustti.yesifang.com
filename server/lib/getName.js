/*
	根据学号获取姓名
*/
const axios = require('axios');

module.exports = (info, cookie) => {
	let { stu_num } = info
	let cookie_str = cookie.stringify(cookie.object);
	return new Promise((resolve, reject) => {
		if(stu_num != undefined){
			axios
			.get(`http://zs.nustti.edu.cn/xxxx/stu_login/default_serv.asp?xh=${stu_num}&action=check_xh&${cookie.object['cp%5Fsys'].value}&NowTime=${Date.now()}`,{
				headers: {
					Host: 'zs.nustti.edu.cn',
					Referer: "http://zs.nustti.edu.cn/xxxx/stu_login/",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
					Cookie: cookie_str,
				}
			})
			.then(res => {
				cookie.save(res);
				let nameMatch = res.data.match(/(?<=,\s*)[\u4e00-\u9fa5]+(?=\s*,)/)
				if(nameMatch){
					info.name = nameMatch[0]
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