<template>
	<view class="drug-info-search-container">
		<view class="" v-html="data">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:''
			};
		},
		onLoad(e){
			this.getSearchData(e.k);
		},
		methods:{
			getSearchData(data){
				uni.request({
					url:"https://www.yaopinnet.com/tools/load/sms_load.asp",
					data:{
						k:data
					},
					success: (res) => {
						console.log(res.data)
						this.data = res.data;
						console.log(this.data)
					}
				})
			}
		}
	}
</script>

<style lang="less">

</style>
