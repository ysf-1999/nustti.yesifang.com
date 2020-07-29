/*
	/api/search
	通过学号查询用户
*/
const HumanModel = require('../../db/model/human');
const encryptInfo = require('../../lib/encrypt-info');

module.exports = (req,res) => {
	let { body:{stu_num} } = req;
	HumanModel
	.findOne({stu_num})
	.then(doc => {
		if(!doc){ res.send({code:0,msg:'用户还未加入自动申报'});return }
		let data = doc.toObject();
		res.send({code:1,data:encryptInfo(data)})
	})
	.catch(()=>res.send({code:500}))
}