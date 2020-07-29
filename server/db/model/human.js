/*
	用户数据库model
*/
const { model } = require('mongoose');
const humanSchema = require('../schema/human');

const HumanModel = model('human', humanSchema, 'human');

module.exports = HumanModel;