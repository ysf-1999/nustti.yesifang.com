/*
	cookie-parser工具库
*/
const cookie = require('set-cookie-parser');
const axios = require('axios');

cookie.stringify = obj => {
	let str = '';
	for(let i in obj){
		str += `${i}=${obj[i].value}; `
	}
	return str.slice(0,-2)
}

cookie.save = res => {
	let cookie_obj = cookie.parse(res,{map:true});
	for(let i in cookie_obj){
		if(cookie_obj.hasOwnProperty(i)){
			if(!cookie.object) cookie.object = {};
			cookie.object[i] = cookie_obj[i];
		}
	}
}

cookie.init = (cookie_obj={}) => {
	cookie.object = cookie_obj;
	return new Promise((resolve, reject) => {
		axios
		.get("http://zs.nustti.edu.cn/xxxx/stu_login/",{
			headers: {
				Host: 'zs.nustti.edu.cn',
				"Referer": "http://zs.nustti.edu.cn/xxxx/",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
			}
		})
		.then(res => {
			cookie.save(res);
			resolve({ cookie });
		})
		.catch(reject)
	})
}

module.exports = cookie;