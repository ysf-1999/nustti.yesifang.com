/*
	用户数据库schema
*/
const Schema = require('mongoose').Schema;

module.exports = Schema({
	stu_num: {
		type: String,
		required:true,
		trim:true,
		set: value => value.toString(),
		validate: value => /^\d{8,10}$/.test(value),
		unique: true
	},
	stu_id: {
		type: String,
		set: value => String(value),
		validate: value => /^\d{4,6}$/.test(value)
	},
	name: String,
	phone: {
		type: String,
		set: value => String(value),
		validate: value => /^\d{9,11}$/.test(value)
	},
	email: {
		type: String,
		trim: true,
		match: /^(\s*)|(([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4})$/
	},
	province: String,
	province_id: {
		type: String,
		set: value => String(value),
		validate: value => /^\d{6}$/.test(value)
	},
	city: String,
	city_id: {
		type: String,
		set: value => String(value),
		validate: value => /^\d{6}$/.test(value)
	},
	county: String,
	county_id: {
		type: String,
		set: value => String(value),
		validate: value => /^\d{6}$/.test(value)
	},
	temperate:String,
	time: {
		type: Date,
		set: value => new Date(value),
		default: ()=> new Date()
	},
	t_ip: String
})