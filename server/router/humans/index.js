/*
	/api/humans/:page
	公告列表
*/
const HumanModel = require('../../db/model/human')
const encryptInfo = require('../../lib/encrypt-info')

module.exports = (req, res) => {
	let { session } = req;
	let page = req.params.page || 0;

	HumanModel
	.find({...(session.ids && {_id:{$nin:session.ids}})},'+_id+id+name+phone+time-province-province_id-city-city_id-county-_county_id')
	.skip(page * 10)
	.limit(10)
	.then(docs => {
		let data = docs.map(i=> encryptInfo(i.toObject()));
		if(session.ids && page == 0){
			HumanModel
			.find({_id:{$in:session.ids}})
			.then(humans => {
				data = humans.map(i => i.toObject()).concat(data);
				res.send({ code:1, data })
			})
			.catch(()=>{
				res.send({ code:1, data })
			})
		}else{
			res.send({ code:1, data })
		}
	})
	.catch(()=>res.send({ code:500 }))
}