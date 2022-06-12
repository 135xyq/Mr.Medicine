<template>
	<view>
		<template>
			<uni-indexed-list :options="data" />
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:[],
			};
		},
		async created(){
			uni.showLoading({
				title:"正在获取数据"
			})
			// this.data
			const res = await uniCloud.callFunction({
				name:"get_drug_info",
			})
			// console.log(res.result.data[0].data)
			this.data = res.result.data[0].data;
			uni.hideLoading()
			
		}
	}
</script>

<style lang="less">

</style>
