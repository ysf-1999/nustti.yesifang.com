import Vue from 'vue';
import Vuex from 'vuex';
import { getHumans } from '@/api';
import { Notify } from 'vant';

Vue.use(Vuex);

const state = {
	humans: []
};

const mutations = {
	init(state, data){
		state.humans = data
	},
	concat(state, data){
		state.humans = state.humans.concat(data);
	},
	stick(state, data){
		let human = state.humans.find(i=>i.stu_num == data.stu_num);
		if(human){
			state.humans.splice(state.humans.indexOf(human),1);
		}
		state.humans.unshift(data)
	},
	add(state, data){
		state.humans.push(data);
	},
	remove(state, stu_num){
		let human = state.humans.find(i => i.stu_num == stu_num);
		if(human){
			state.humans.splice(state.humans.indexOf(human),1);
		}
	}
};

const actions = {
	update(ctx, cb){
		getHumans(0)
		.then(({data:{code,msg,data}}) => {
			if(code == 0){
				Notify({
					type: 'warning',
					message: msg,
				});
			}
			if(code == 500){
				Notify({
					type: 'danger',
					message: '服务器发生错误请稍后再试~',
				});
			}
			if(code == 1 && data){
				ctx.commit('init',data);
				cb && cb()
			}
		})
		.catch(()=>{
			Notify({
				type: 'danger',
				message: '发生错误，请联系开发人员~',
			});
		})
	}
};

const store = new Vuex.Store({ state, mutations, actions });

export default store;