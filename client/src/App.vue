<template>
	<div class="app-wrap">
		<ysf-header></ysf-header>
		<img class="title-logo" src="@/assets/img/title.png" alt="南理工自动体温申报">
		<van-notify v-model="notifyShow" type="primary">
			<van-icon name="bell" style="margin-right: 4px;" />
			<span>共有{{humanTotal}}位同学使用了体温自动申报</span>
		</van-notify>
		<div class="control">
			<van-button class="btn" color="#4F95EA" @click="popInput1">
				<van-icon class="apply-icon" name="add-o" />认领/加入
			</van-button>
			<van-button class="btn" color="#B85498" @click="popInput2">
				<van-icon class="apply-icon" name="delete" />注销退出
			</van-button>
		</div>
		<van-search class="search" v-model="searchKey" show-action clearable background="#fff" @search="onSearch" placeholder="翻累了，直接输入学号查找吧...">
			<div slot="action" @click="onSearch">查找</div>
		</van-search>
		<p class="view-result-msg">自动申报结果公示栏</p>
		<ysf-views @scroll="viewScroll" @update="update" ref="view"></ysf-views>
		<van-popup v-model="popShow1" position="bottom" :style="{ height: '75%' }">
			<div class="pop-content" v-if="isCheck">
				<h2>提交信息</h2>
				<van-form @submit="onSubmit1">
					<van-field
						v-model="stu_num1"
						name="stu_num"
						label="学号"
						placeholder="请输入学生的学号"
						:rules="[{ required: true, message: '请填写学生的学号' }]"
					/>
					<van-field
						v-model="name1"
						name="name"
						label="姓名"
						placeholder="请输入学生的姓名"
						:rules="[{ required: true, message: '请填写学生的姓名' }]"
					/>
					<van-field
						v-model="phone1"
						name="phone"
						label="电话"
						placeholder="请输入联系电话"
						:rules="[{ pattern: /^\d{8,11}$/, message: '请填写合法的联系电话' }]"
					/>
					<van-field
						v-model="email1"
						name="email"
						label="邮箱"
						placeholder="签到状态将通过邮件形式通知"
						:rules="[{pattern:/^(\s*)|(([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4})$/,message:'请输入合法邮箱'}]"
					/>
					<van-field
						v-if="defaultAds"
						readonly
						clickable
						name="area"
						:value="value1"
						label="住址"
						placeholder="点击选择家庭住址"
						@click="showArea1 = true"
					/>
					<van-button v-if="checkBtnShow" :loading="infoLoading" color="#D76789" loading-text="加载中..." native-type="button" @click="checkInfo">点击进行数据校验</van-button>
					<van-popup v-model="showArea1" position="bottom">
						<van-area
							:area-list="areaList"
							@confirm="onConfirm1"
							@cancel="showArea1 = false"
						/>
					</van-popup>
					<van-button :disabled="!isTest" class="submit" block type="primary" native-type="submit">提交信息开始自动登记体温</van-button>
				</van-form>
			</div>
			<div class="user-message pop-content" v-else>
				<h2>《服务条款》</h2>
				<div class="text-content">
					<p><i>1.</i>程序旨在帮助<a href="http://www.nustti.edu.cn/" class="important">南京理工大学泰州科技学院</a>的同学节省假期宝贵时间，专注于学习。</p>
					<p><i>2.</i>程序的功能是帮助<span class="important">健康状况良好的学生</span>自动完成学校所要求每天体温申报的任务。</p>
					<p><i>3.</i>程序只为<span class="important">体温正常</span>、<span class="important">身体状况良好</span>的学生提供服务，所以首先你必须保证你的身体状况良好，然后才能够使用本程序提供的服务。</p>
					<p><i>4.</i>如果由于用户个人隐瞒实际体温导致的一切后果与本程序以及程序的开发人员无关。</p>
					<p><i>5.</i>使用本程序则默认同意以上所有条款。</p>
					<p class="msg"><i>*</i>本程序将对所有用户数据采取加密处理，不会泄露用户的任何个人信息，请放心使用。</p>
				</div>
				<div class="check">
					<van-checkbox class="checkbox" v-model="isAgree" checked-color="#07c160" icon-size="16px">本人身体状况良好，同意以上条款</van-checkbox>
					<van-button :disabled="!isAgree" :type="isAgree ? 'primary' : 'default'" @click="agreeNext">继续</van-button>
				</div>
			</div>
		</van-popup>
		<van-popup v-model="popShow2" position="bottom" :style="{ height: '75%' }">
			<div class="pop-content">
				<h2>退出自动申报</h2>
				<van-form @submit="onSubmit2">
					<van-field
						v-model="stu_num2"
						name="stu_num"
						label="学号"
						placeholder="请输入学生的学号"
						:rules="[{ required: true, message: '请填写学生的学号' }]"
					/>
					<van-field
						v-model="name2"
						name="name"
						label="姓名"
						placeholder="请输入学生的姓名"
						:rules="[{ required: true, message: '请填写学生的姓名' }]"
					/>
					<van-field
						v-model="phone2"
						name="phone"
						label="电话"
						placeholder="请输入加入时填写的联系电话"
						:rules="[{ pattern: /^\d{8,11}$/, message:'请填写合法的联系电话' }]"
					/>
					<van-field
						v-model="email2"
						name="email"
						label="邮箱"
						placeholder="请输入加入时填写的电子邮箱"
						:rules="[{pattern:/^(\s*)|(([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4})$/,message:'请输入合法邮箱'}]"
					/>
					<van-field
						readonly
						clickable
						name="area"
						:value="value2"
						label="住址"
						@click="showArea2 = true"
						placeholder="点击选择加入时使用的家庭住址"
					/>
					<p class="out-msg">*退出后将不再保留用户任何个人信息。</p>
					<van-popup v-model="showArea2" position="bottom">
					<van-area
						:area-list="areaList"
						@confirm="onConfirm2"
						@cancel="showArea2 = false"
					/>
					</van-popup>
					<van-button class="submit" block native-type="submit" color="#B85498">退出自动申报</van-button>
				</van-form>
			</div>
		</van-popup>
		<van-overlay :show="wrapShow" z-index="4" @click="wrapShow = false" duration="0.5">
			<div class="wrapper" @click.stop>
				<div class="content">
					<van-loading color="#1989fa" size="40" class="icon"/>
					<p class="text">疯狂加载中...</p>
				</div>
			</div>
		</van-overlay>
		<van-dialog v-model="infoDialogShow" title="个人信息确认" show-cancel-button cancelButtonText="错误" confirmButtonText="正确" @cancel="cancelInfo" @confirm="confirmInfo">
			<div class="info-check">
				<p>姓名: {{info.name}}</p>
				<p>学号: {{info.stu_num}}</p>
				<p>电话: {{info.phone}}</p>
				<p>住址: {{info.province}}/{{info.city}}/{{info.county}}</p>
			</div>
		</van-dialog>
		<van-dialog v-model="msgInfoDialogShow" :title="(msgInfo.name && msgInfo.phone && /\*/.test(msgInfo.name) && /\*/.test(msgInfo.phone)) ? '查找结果' : '认领成功'" show-confrim-button confirmButtonText="朕已知晓" @confirm="confirmMsgInfo">
			<div class="info-check">
				<p>姓名: {{msgInfo.name}}</p>
				<p>学号: {{msgInfo.stu_num}}</p>
				<p>电话: {{msgInfo.phone}}</p>
				<p>邮箱: {{msgInfo.email}}</p>
				<p>住址: {{msgInfo.province}}/{{msgInfo.city}}/{{msgInfo.county}}</p>
				<p>时间: {{dateFormat(msgInfo.time)}}</p>
				<p>状态: <span v-if="isToday(msgInfo.time)" class="msg-info-true">今日已申报 {{msgInfo.temperate}}℃</span><span v-else class="msg-info-false">今日待申报</span></p>
			</div>
		</van-dialog>
		<van-dialog v-model="warningDialogShow" title="公告" show-confrim-button confirmButtonText="朕已知晓" @confirm="warningDialog">
			<div class="info-check">
				<p>申报时间：00:01:30-13:01:30</p>
				<p>申报间隔：60分钟</p>
				<p>申报结果将以邮件形式通知用户。</p>
				<p>当最后一轮申报仍然失败，将以邮件的形式通知用户进行手动申报。</p>
				<p>用户可以在首页公示栏查看申报情况。</p>
				<p>本程序完全免费，请用户遵守行为规范友善使用。</p>
				<p>服务采用https加密通讯，用户信息均保密，请放心使用。</p>
				<p>使用过程出现问题请联系开发人员。</p>
			</div>
		</van-dialog>
		<div :class="['back-top',{show:backTopShow}]" @click="toTop"></div>
		<ysf-footer></ysf-footer>
	</div>
</template>

<script>
import ysfHeader from './components/ysfHeader';
import ysfFooter from './components/ysfFooter';
import ysfViews from './components/ysfViews';
import areaList from '@/assets/js/area';
import animateScrollTo from 'animated-scroll-to';
import { getTotal, checkInfo, submitApply, submitQuit, search } from '@/api'
import { Notify, Toast } from 'vant';
import { mapMutations } from 'vuex';

export default {
	components:{
		ysfHeader,
		ysfFooter,
		ysfViews,
	},
	data(){
		return {
			popShow1: false,
			popShow2: false,
			isCheck: false,
			isAgree: false,
			stu_num1: '',
			stu_num2: '',
			name1: '',
			name2: '',
			phone1: '',
			phone2: '',
			email1: '',
			email2: '',
			value1: '',
			value2: '',
			address1: {},
			address2: {},
			showArea1: false,
			showArea2: false,
			areaList,
			isTest: false,
			checkBtnShow: true,
			defaultAds: false,
			notifyShow: false,
			humanTotal: 0,
			searchKey: '',
			infoLoading: false,
			infoDialogShow: false,
			msgInfoDialogShow: false,
			info: {},
			msgInfo: {},
			wrapShow: false,
			warningDialogShow: true,
			backTopShow: false
		}
	},
	methods:{
		...mapMutations(['add','remove','stick']),
		warningDialog(){
			this.warningDialogShow = false;
		},
		popInput1(){
			this.popShow1 = true;
		},
		popInput2(){
			this.popShow2 = true;
		},
		agreeNext(){
			this.isCheck = true;
		},
		onSubmit1(values) {
			this.wrapShow = true;
			submitApply({ name:values.name, phone:values.phone, stu_num:values.stu_num, email:values.email, ...this.address1})
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
						message: '服务器错误，请稍后再试~',
					});
				}
				if(code == 1 && data){
					this.add(data);
					this.name1 = '';
					this.phone1 = '';
					this.stu_num1 = '';
					this.isTest = false;
					this.isCheck = false;
					this.isAgree = false;
					this.value1 = '';
					this.defaultAds = false;
					this.popShow1 = false;
					this.checkBtnShow = true;
					this.address1 = {};
					this.email1 = '';
					setTimeout(()=>{
						Toast('自动申报申请成功');
					}, 800)
				}
				this.wrapShow = false;
			})
			.catch(()=>{
				this.wrapShow = false;
				Notify({
					type: 'danger',
					message: '发生错误，请联系开发人员~',
				});
			})
		},
		onSubmit2(values) {
			this.wrapShow = true;
			submitQuit({ name:values.name, phone:values.phone, stu_num:values.stu_num, email:values.email, ...this.address2})
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
						message: '服务器错误，请稍后再试~',
					});
				}
				if(code == 1 && data){
					this.remove(data);
					this.name2 = '';
					this.phone2 = '';
					this.stu_num2 = '';
					this.value2 = '';
					this.popShow2 = false;
					this.address2 = {};
					this.email2 = '';
					setTimeout(()=>{
						Toast('退出自动申报成功');
					},800)
				}
				this.wrapShow = false;
			})
			.catch(()=>{
				this.wrapShow = false;
				Notify({
					type: 'danger',
					message: '发生错误，请联系开发人员~',
				});
			})
		},
		onConfirm1(values) {
			this.value1 = values.map((item) => item.name).join('/');
			values.forEach((i,j)=>{
				switch(j){
					case 0:
						this.address1.province = i.name;
						this.address1.province_id = i.code;
						break;
					case 1:
						this.address1.city = i.name;
						this.address1.city_id = i.code;
						break;
					case 2:
						this.address1.county = i.name;
						this.address1.county_id = i.code;
						break;
				}
			})
			this.showArea1 = false;
			this.isTest = true;
		},
		onConfirm2(values) {
			this.value2 = values.map((item) => item.name).join('/');
			values.forEach((i,j)=>{
				switch(j){
					case 0:
						this.address2.province = i.name;
						this.address2.province_id = i.code;
						break;
					case 1:
						this.address2.city = i.name;
						this.address2.city_id = i.code;
						break;
					case 2:
						this.address2.county = i.name;
						this.address2.county_id = i.code;
						break;
				}
			})
			this.showArea2 = false;
			this.isTest = true;
		},
		confirmMsgInfo(){
			this.msgInfoDialogShow = false
			setTimeout(()=>{
				this.msgInfo = {};
			}, 500)
			if(!/\*/.test(this.msgInfo.name) && !/\*/.test(this.msgInfo.phone)){
				this.popShow1 = false;
				setTimeout(()=>{
					this.isCheck = false;
					this.name1 = '';
					this.email1 = '';
					this.stu_num1 = '';
					this.phone1 = '';
				},500)
			}
		},
		onSearch(){
			if(!this.searchKey){
				Toast('请先输入学号');
				return;
			}
			if(!/^\d{9,10}$/.test(this.searchKey)){
				Toast('学号不合法');
				return;
			}
			this.wrapShow = true;
			search({stu_num:this.searchKey})
			.then(({data:{code,msg,data}}) => {
				if(code == 0){
					Toast(msg);
				}
				if(code == 500){
					Notify({
						type: 'danger',
						message: '服务器错误，请稍后再试~',
					});
				}
				if(code == 1 && data){
					this.msgInfo = data;
					setTimeout(()=>{
						this.msgInfoDialogShow = true;
					}, 800)
				}
				setTimeout(()=>{
					this.wrapShow = false;
				}, 200)
			})
			.catch(()=>{
				this.wrapShow = false;
				Notify({
					type: 'danger',
					message: '发生错误，请联系开发人员~',
				});
			})
		},
		checkInfo(){
			this.infoLoading = true;
			checkInfo({ stu_num:this.stu_num1, name:this.name1, phone:this.phone1, email:this.email1 })
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
						message: '服务器错误，请稍后再试~',
					});
				}
				if(code == 1 && data){
					this.info = data;
					setTimeout(()=>{
						this.infoDialogShow = true;
					}, 500)
				}
				if(code == 2 && data){
					this.msgInfo = data;
					this.stick(data);
					setTimeout(()=>{
						this.msgInfoDialogShow = true;
					},500)
				}
				setTimeout(()=>{
					this.infoLoading = false;
				}, 500)
			})
			.catch(()=>{
				Notify({
					type: 'danger',
					message: '发生错误，请联系开发人员~',
				});
			})
		},
		cancelInfo(){
			this.defaultAds = true;
			this.checkBtnShow = false;
		},
		confirmInfo(){
			this.isTest = true;
			this.checkBtnShow = false;
		},
		isToday(date){
			return new Date().getDate() == new Date(date).getDate()
		},
		viewScroll(ev){
			let scrollTop = ev.target.scrollTop;
			if( scrollTop>= 60 && !this.backTopShow){
				this.backTopShow = true;
			}else if(scrollTop < 60 && this.backTopShow){
				this.backTopShow = false;
			}
		},
		toTop(){
			animateScrollTo(0,{
				elementToScroll: this.$refs.view.$el,
				maxDuration: 2000
			})
		},
		update(){
			getTotal()
			.then(({data:{code, data}}) => {
				if(code == 1 && data){
					this.humanTotal = data
					this.notifyShow = true;
					setTimeout(() => {
						this.notifyShow = false;
					}, 4000);
				}
			})
		},
		dateFormat(date){
			return new Date(date).toLocaleString('chinese',{hour12:false}).replace(/(?<=\s+)24(?=:)/,'00')
		}
	},
	mounted(){
		window.addEventListener('scroll',this.viewScroll.bind(this))
		getTotal()
		.then(({data:{code, data}}) => {
			if(code == 1 && data){
				this.humanTotal = data
				this.notifyShow = true;
				setTimeout(() => {
					this.notifyShow = false;
				}, 4000);
			}
		})
	}
}
</script>

<style lang="sass" scoped>
.app-wrap
	padding-top: 60px
	overflow: auto
	.title-logo
		display: block
		margin: 20px auto
		width: 95%
	.search
		padding: 0 10px
	.view-result-msg
		margin-top: 10px
		padding: 10px 0 5px 5px
		font-size: 14px
		color: #888
		background-color: #F7F8FA
	.van-button
		margin: 10px auto 20px
		display: block
		width: calc(100% - 20px)
		padding: 5px 10px
		font-size: 14px
		border-radius: 10px
	.control
		display: flex
		justify-content: space-around
		.btn
			border-radius: 5px
			width: calc( 50% - 20px )
			.apply-icon
				font-size: 16px
				vertical-align: -2px
				margin-right: 3px
	.pop-content
		position: relative
		padding: 10px
		box-sizing: border-box
		position: absolute
		top: 0
		left: 0
		width: 100%
		height: 100%
		overflow-x: hidden
		overflow-y: auto
		h2
			padding: 10px 0
			text-align: center
			height: 30px
			font-size: 20px
			font-weight: bold
			color: #555
			font-family: 'Microsoft YaHei'
		.submit
			position: absolute
			bottom: 10px
			margin: 0 auto
		.out-msg
			padding-left: 12px
			font-size: 12px
			color: #f00
	.user-message
		.text-content
			padding-top: 10px
			height: calc(100% - 140px)
			overflow: auto
		.important
			color: #56f
			display: inline
		p
			position: relative
			display: block
			margin-left: 30px
			line-height: 2em
			font-size: 16px
			&:first-child
				margin-top: 10px
			i
				position: absolute
				top: 2px
				left: -20px
			&.msg
				font-size: 13px
				line-height: 1.4em
				color: #07C160
				i
					left: -15px
					font-size: 20px
					font-weight: bolder
					color: #f00
		.check
			position: absolute
			bottom: 10px
			width: calc(100%)
			height: 70px
			.van-checkbox
				position: absolute
				top: 0
				left: 50%
				width: fit-content
				transform: translateX(-50%)
				font-size: 14px
			.van-button
				position: absolute
				bottom: 0
				margin: 0
				&[type="default"]
					color: #666
					background-color: #eee
	.info-check
		padding: 5px 10px 15px 20px
		font-size: 14px
		line-height: 1.8em
		.msg-info-true
			color: #07C160
		.msg-info-false
			color: #f35
		p
			word-break: break-all
	.wrapper
		position: relative
		display: flex
		justify-content: center
		align-items: center
		width: 100vw
		height: 100%
		pointer-events: none
		.content
			display: flex
			justify-content: center
			align-items: center
			flex-direction: column
			padding: 15px
			border-radius: 15px
			width: fit-content
			height: fit-content
			background-color: #fff
			.icon, .text
				display: block
			.icon
				padding-top: 10px
			.text
				font-size: 14px
				color: #444
				font-family: 'Microsoft YaHei'
				padding: 10px 10px 0 10px
	.back-top
		display: none
		position: fixed
		bottom: 40px
		right: 20px
		width: 40px
		height: 40px
		background-color: #fff
		border-radius: 10px
		box-shadow: 2px 4px 8px 2px rgba(0,0,0,.15)
		&.show
			display: block
		&::before, &::after
			content: ''
			position: absolute
			top: 24px
			width: 18px
			height: 4px
			border-radius: 4px
			background-color: #2CB044
		&::before
			left: calc(50% - 6px)
			transform-origin: right center
			transform: rotateZ(45deg)
		&::after
			right: calc(50% - 6px)
			transform-origin: left center
			transform: rotateZ(-45deg)
</style>