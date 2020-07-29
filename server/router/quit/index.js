/*
	/api/quit
	退出自动申报
*/
const HumanModel = require('../../db/model/human');

module.exports = (req, res) => {
	let { body:{ stu_num, name, phone, email, province, province_id, city, city_id, county, county_id } } = req;

	if(!stu_num){ res.send({code:0,msg:'缺少学号，退出失败'});return }
	if(!name){ res.send({code:0,msg:'缺少姓名，退出失败'});return }
	if(!phone){ res.send({code:0,msg:'缺少联系电话，退出失败'}) }
	if(!province || !province_id || !city || !city_id || !county || !county_id){ res.send({code:0,msg:'地址信息不完整，退出失败'});return }
	
	HumanModel
	.findOne({ stu_num })
	.then(doc => {
		if(!doc){ res.send({code:0,msg:'用户不存在，退出失败'});return }
		if(doc.name != name){ res.send({code:0,msg:'用户姓名错误，退出失败'});return }
		if(doc.phone != phone){ res.send({code:0,msg:'用户联系电话错误，退出失败'});return }
		if(doc.email && doc.email != email){ res.send({code:0,msg:'用户电子邮箱错误，退出失败'});return }
		if(doc.province != province || doc.province_id != province_id || doc.city != city || doc.city_id != city_id || doc.county != county || doc.county_id != county_id){ res.send({code:0,msg:'地址信息错误，退出失败'});return }
		doc
		.remove()
		.then(()=>{
			res.send({code:1,data:doc.stu_num})
		})
		.catch(()=>res.send({code:500}))
	})
	.catch(()=>res.send({code:500}))
}