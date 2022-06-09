<template>
	<view>
		1212
		<uni-countdown :show-day="false" :hour="1" :minute="12" :second="40"></uni-countdown>

	</view>
</template>

<script>
	export default {
		name: "ShowRecord",
		data() {
			return {
				uerSetting: {},
			};
		},
		async created() {
			this.getUserSetting()
		},
		methods: {
			// 获取用户设置
			async getUserSetting() {
				console.log(this.$store.state.userInfo.userInfo.openid)
				const res = await uniCloud.callFunction({
					name: 'get_user_setting',
					data: {
						openid: this.$store.state.userInfo.userInfo.openid,
					}
				})
				
				this.userSetting = res.result.data;
			},
			onHandleFabClick(){
				console.log(1)
			}
		}
	}
</script>

<style lang="less">

</style>
