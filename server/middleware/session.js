/**
 *  session middleware
 *  存储session至MongoDB数据库
*/
const session = require('express-session')
const mongodb = require('connect-mongo')(session)

module.exports = session({
	name:'authorization',
	secret: 'xxxxxxxx', // 密钥
	cookie: {maxAge: 7*24*60*60*1000}, // cookie时效
	rolling: true, // 更新时效
	resave: true, // 重新存储
	saveUninitialized: false, // 初始化
	store: new mongodb({url:'mongodb://127.0.0.1:27017/nustti'}) // 数据库
})
