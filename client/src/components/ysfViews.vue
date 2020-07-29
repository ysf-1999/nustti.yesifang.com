<template>
	<div class="view-wrap" @scroll="$emit('scroll',$event)">
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" head-height="100px">
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text="我也是有底线的哦..."
				@load="onLoad"
			>
				<van-cell-group v-for="(item,index) in humans" :key="'human'+index">
					<van-cell center :title="item.name">
						<div slot="label">学号 {{item.stu_num}}</div>
						<div slot="label">电话 {{item.phone}}</div>
						<div slot="label">地址 {{item.province}}/{{item.city}}/{{item.county}}</div>
						<div>
							<div v-if="isToday(item.time)" class="cell-msg true">今日已申报 {{item.temperate}}℃</div>
							<div v-else class="cell-msg false">今日待申报</div>
							<div class="cell-time" slot="extra">{{dateFormat(item.time)}}</div>
						</div>
					</van-cell>
				</van-cell-group>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
import { getHumans } from '@/api';
import { mapState, mapMutations } from 'vuex';
import { Notify, Toast } from 'vant';

export default {
	name: 'ysfViews',
	data(){
		return {
			isLoading: false,
			loading: false,
			finished: false,
			page: 0,
		}
	},
	computed:{
		...mapState(['humans']),
	},
	methods:{
		...mapMutations(['init','concat']),
		onLoad(page, cb) {
			if(page != undefined)this.page = page + 1;
			getHumans(page != undefined ? page : this.page++)
			.then(({data:{code, msg, data}}) => {
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
					if(page != undefined)this.init(data);
					else if(data.length > 0)this.concat(data);
					else if(data.length <= 0)this.finished = true;
				}
				this.loading = false;
				cb && cb();
			})
			.catch(()=>{
				this.loading = false;
				Notify({
					type: 'danger',
					message: '发生错误，请联系开发人员~',
				});
			})
		},
		isToday(date){
			return new Date().getDate() == new Date(date).getDate()
		},
		onRefresh(){
			this.isLoading = true;
			this.onLoad(0,()=>{
				this.finished = false;
				setTimeout(() => {
					this.$emit('update');
					Toast('刷新成功');
					this.isLoading = false;
				}, 1000);
			})
		},
		dateFormat(date){
			return new Date(date).toLocaleString('chinese',{hour12:false}).replace(/(?<=\s+)24(?=:)/,'00')
		}
	}
}
</script>

<style lang="sass" scoped>
.view-wrap
	height: calc(100vh - 340px)
	overflow: auto
	.cell-msg
		font-size: 14px
		&.true
			color: #07C160
		&.false
			color: #f35
	.cell-time
		padding-top: 10px
		font-size: 12px
</style>
