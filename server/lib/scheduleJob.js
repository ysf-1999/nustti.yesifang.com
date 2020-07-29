/*
	定时申报任务
*/
const HumanModel = require('../db/model/human');
const cookie = require('./cookie-parser');
const getStudentId = require('./getStudentId');
const declareTemperate = require('./declareTemperate');
const sendEmail = require('./send-email');

function isToday(date){
	return new Date().getDate() == new Date(date).getDate();
}

function sendError(info){
	if(new Date().getHours() > 12 && info.email){
		sendEmail({
			email: info.email,
			status: false,
			name: info.name,
		})
	}
}

module.exports = () => {
	HumanModel
	.find({})
	.then(docs => {
		(async ()=>{
			for(let index = 0; index < docs.length; index++){
				let human = docs[index];
				if(!isToday(human.time)){
					let info = human.toObject();
					await new Promise((resolve,reject) => {
						cookie.init()
						.then(({cookie})=>{
							getStudentId(info, cookie)
							.then(result => {
								if(result){
									let { info, cookie } = result;
									declareTemperate(info, cookie)
									.then(result => {
										if(result){
											let {status, info} = result;
											if(status == 'ok'){
												human.temperate = info.temperate;
												human.time = info.time;
												human
												.save(()=>{
													info.email && sendEmail({
														email: info.email,
														status: true,
														temperate: info.temperate,
														name: info.name,
													});
													resolve()
												})
											}else{
												sendError(info);
												reject();
											}
										}else{
											sendError(info);
											reject();
										}
									})
									.catch(()=>{
										sendError(info);
										reject();
									})
								}else{
									sendError(info);
									reject();
								}
							})
							.catch(()=>{
								sendError(info);
								reject();
							})
						})
						.catch(()=>{
							sendError(info);
							reject();
						})
					})
				}
			}
		})();
	})
}