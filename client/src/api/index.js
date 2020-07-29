import axios from 'axios';

axios.defaults.baseURL = 'https://nustti.yesifang.com/xxxx'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content_Type'] = 'application/x-www-form-urlencoded'

/* 获取用户列表 */
export const getHumans = page => axios.get(`/humans/${page}`);
/* 获取总用户数 */
export const getTotal = () => axios.get('/total');
/* 用户信息校验 */
export const checkInfo = body => axios.post('/check',body);
/* 加入申报 */
export const submitApply = body => axios.post('/apply',body);
/* 退出申报 */
export const submitQuit = body => axios.post('/quit',body);
/* 学号搜索 */
export const search = body => axios.post('/search',body)