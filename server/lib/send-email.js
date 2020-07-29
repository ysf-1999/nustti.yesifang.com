/*
	邮件发送模块
*/
const nodemailer = require('nodemailer');
const dayjs = require('dayjs');

module.exports = opts => {
	let transporter = nodemailer.createTransport({
		host: "smtp.qq.com",
		secureConnection: true,
		port: 465,
		secure: true,
		auth: {
			user: "email@tag.com",
			pass: "xxxxxxxxxxxxx"
		}
	});
	let mailOptions = {
		from: 'user <email@tag.com>',
		to: opts.email,
		subject: '每日体温申报报告',
		html: `
			<h1>${opts.status ? '<span style="color:#2CB044;">今日体温申报成功 '+opts.temperate+'℃</span>' : '<span style="color:#f00;">今日体温申报失败</span>'}</h1>
			${opts.status ? '' : '<p>非常的抱歉，由于服务器的波动导致今日体温自动申报失败，<a href="http://zs.nustti.edu.cn/xxxx/stu_login/">点击此处进行手动申报</a></p>'}
			<h5 style="color:#25AFF3">用户：${opts.name}</h5>
			<p>${dayjs().format('YYYY/M/D HH:mm:ss')}</p>
			<a style="text-decoration: underline;color: #4ca;">&copy;2020 yesifang.com</a>
		`
	};
	transporter
	.sendMail(mailOptions)
	.then(opts.success||(()=>{}))
	.catch(opts.error||(()=>{}))
}