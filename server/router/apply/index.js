/*
*	/api/apply
*	处理自动体温申请
*/
const HumanModel = require('../../db/model/human');
const cookie = require('../../lib/cookie-parser');
const getName = require('../../lib/getName');
const getStudentId = require('../../lib/getStudentId');
const getAddress = require('../../lib/getAddress');
const declareTemperate = require('../../lib/declareTemperate');
const sendEmail = require('../../lib/send-email');

module.exports = (req, res) => {
	let { body:{stu_num, name, phone, email, province, province_id, city, city_id, county, county_id}, session } = req;
	HumanModel
	.findOne({ stu_num })
	.then(doc => {
		if(doc){
			res.send({ code:0,msg:'用户已存在，无须再次申请' });
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
						if(phone != undefined)info.phone = phone;
						if(email != undefined)info.email = email;
						getStudentId(info, cookie)
						.then(result => {
							if(!result){ res.send({ code:0,msg:'信息错误' });return }
							let { info, cookie } = result;
							if(province != undefined && province_id != undefined && city != undefined && city_id != undefined && county != undefined && county_id != undefined){
								info.province = province;
								info.province_id = province_id;
								info.city = city;
								info.city_id = city_id;
								info.county = county;
								info.county_id = county_id;
								declareTemperate(info, cookie)
								.then(result => {
									if(result && result.status == 'ok'){
										let  {info} = result;
										HumanModel
										.create(info)
										.then(doc => {
											if(!session.ids)session.ids = [doc._id];
											else session.ids.push(doc._id);
											let data = doc.toObject();
											delete data._id;
											delete data.stu_id;
											delete data.t_ip;
											delete data.email;
											delete data.province_id;
											delete data.city_id;
											delete data.county_id;
											delete data.__v;
											sendEmail({
												email: info.email,
												status: true,
												temperate: info.temperate,
												name: info.name,
											})
											res.send({code:1,data})
											
										})
										.catch(()=>res.send({code:500}))
									}else{
										res.send({code:500})
									}
								})
								.catch(()=>res.send({code:500}))
							}else{
								getAddress(info, cookie)
								.then(result => {
									if(!result){ res.send({code:0,msg:'信息错误'});return }
									let { info, cookie } = result;
									declareTemperate(info, cookie)
									.then(result => {
										if(result && result.status == 'ok'){
											let { info } = result;
											HumanModel
											.create(info)
											.then(doc => {
												if(!session.ids)session.ids = [doc._id];
												else session.ids.push(doc._id);
												let data = doc.toObject();
												delete data._id;
												delete data.stu_id;
												delete data.t_ip;
												delete data.email;
												delete data.province_id;
												delete data.city_id;
												delete data.county_id;
												delete data.__v;
												sendEmail({
													email: info.email,
													status: true,
													temperate: info.temperate,
													name: info.name,
												})
												res.send({code:1,data})
											})
											.catch(()=>res.send({code:500}))
										}else{
											res.send({code:500})
										}
									})
									.catch(()=>res.send({code:500}))
								})
								.catch(()=>res.send({code:500}))
							}
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