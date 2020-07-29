const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const scheduleJob = require('./lib/scheduleJob');



mongoose.connect('mongodb://127.0.0.1:27017/nustti',{
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useFindAndModify:false,
	useCreateIndex:true
})

app.use(express.urlencoded({extended:true})) // url encoded middleware - 解析url中间件（GET请求处理）
app.use(express.json()) // json parser middleware - 解析json中间件（表单数据处理）
app.use(cookieParser()) // cookie parser middleware - 解析cookie中间件（对携带的Cookie进行解析）
app.use(require('./middleware/session')) // session middleware - MongoDB Session存储中间件

app.use(express.static(path.resolve(__dirname, './public')))
app.use(require('./middleware/CORS')) // CORS middleware - 跨域处理中间件（处理主服务器与分服务器间的跨域）

app.use('/api', require('./router')) // api接口

schedule.scheduleJob('30 1 0-13 * * *', scheduleJob) // 定时任务

app.listen(8003,()=>console.log('\033[44;30m YSF \033[40;32m Jesus Server running in port\033[33m',8003)) // app start port - 应用启动，监听端口