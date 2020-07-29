/*
	/api/check
	认领/加入
*/
const cookie = require('../../lib/cookie-parser');
const getName = require('../../lib/getName');
const getStudentId = require('../../lib/getStudentId');
const getAddress = require('../../lib/getAddress');
const HumanModel = require('../../db/model/human');
const encryptInfo = require('../../lib/encrypt-info');

module.exports = (req, res) => {
	let { body:{stu_num, name, phone, email } } = req;

	HumanModel
	.findOne({ stu_num })
	.then(doc => {
		if(doc){
			if(doc.name == name && doc.phone == phone && doc.email == email){
				if(!session.ids)session.ids = [doc._id];
				else session.ids.push(doc._id);
				let data = doc.toObject();
				delete data._id;
				delete data.__v;
				delete data.stu_id;
				delete data.province_id;
				delete data.city_id;
				delete data.county_id;
				delete data.t_ip;
				res.send({code:2,data})
			}else{
				res.send({ code:0,msg:'用户已存在，无须再次申请' });
			}
		}else{
			cookie
			.init()
			.then(({cookie}) => {
				getName({ stu_num }, cookie)
				.then(result => {
					if(!result){ res.send({ code:0,msg:'学号错误' });return }
					let { info, cookie } = result;
					if(info.name != name){
						res.send({ code:0, msg:'姓名错误，不要冒充同学哦~' })
					}else{
						getStudentId({ stu_num, phone }, cookie)
						.then(result => {
							if(!result){ res.send({ code:0,msg:'信息错误' });return }
							let { info, cookie } = result;
							getAddress(info, cookie)
							.then(result => {
								if(!result){ res.send({code:0,msg:'信息错误'});return }
								let { info } = result;
								info.name = name;
								res.send({code:1,data:encryptInfo(info)})
							})
							.catch(()=>res.send({code:500}))
						})
						.catch(()=>res.send({code:500}))
					}
				})
				.catch(()=>res.send({code:500}))
			})
			.catch(()=>res.send({code:500}))
		}
	})
	.catch(()=>res.send({code:500}))
}