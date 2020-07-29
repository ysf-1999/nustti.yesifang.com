const router = require('express').Router();

/* 获取信息列表 */
router.get('/humans/:page', require('./humans'))

/* 获取用户总数 */
router.get('/total', require('./total'))

/* 信息校验 */
router.post('/check', require('./check'))

/* 申请自动申报 */
router.post('/apply', require('./apply'))

/* 申请退出自动申报 */
router.post('/quit', require('./quit'))

/* 查找用户 */
router.post('/search', require('./search'))

module.exports = router;