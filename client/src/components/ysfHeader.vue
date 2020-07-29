<template>
	<div class="header-wrap">
		<img class="logo" src="@/assets/img/logo.png" alt="YSF_LOGO">
	</div>
</template>

<script>
export default {
	name: 'ysfHeader',
	data(){
		return {

		}
	}
}
</script>

<style lang="sass" scoped>
.header-wrap
	position: fixed
	z-index: 2
	top: 0
	left: 0
	width: 100%
	height: 50px
	background-color: #fff
	box-shadow: 0 2px 5px 1px rgba(0,0,0,.15)
	overflow: hidden
	.logo
		display: block
		height: 36px
		margin: 7px auto
</style>
