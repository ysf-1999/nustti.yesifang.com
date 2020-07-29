/*
	/api/total
	用户总数
*/
const HumanModel = require('../../db/model/human')

module.exports = (req, res) => {
	HumanModel
	.find({})
	.countDocuments()
	.then(data=>{
		res.send({ code:1, data})
	})
	.catch(()=>res.send({ code:500 }))
}