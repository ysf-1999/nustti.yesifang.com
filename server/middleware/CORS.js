/**
 *  CORS Middleware: Corss Origin Resource Sharing (跨域资源共享中间件)
*/
module.exports = (req,res,next) => {
	res.header({
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': req.headers.origin || '*',
		'Access-Control-Allow-Headers': 'x-requested-width,Content-Type,Content-Length,Authorization',
		'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
		'Content-Type': 'application/json;charset=utf-8'
	});
	if (req.method == "OPTIONS"){
		res.sendStatus(200);
	}else{
		next();
	}
}