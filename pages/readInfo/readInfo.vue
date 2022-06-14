<template>
	<view class="read-info-container">
		<view class="search-container">
			<uni-search-bar :radius="100" placeholder="请输入药品名称" @confirm="onHandleSearchConfirm"></uni-search-bar>
		</view>
		<view clsss="read-list">
			<uni-indexed-list :options="data" />
		</view>
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
			// const res = await uniCloud.callFunction({
			// 	name:"get_drug_info",
			// })
			// console.log(res.result.data[0].data)
			// this.data = res.result.data[0].data;
			uni.hideLoading()
			
		},
		methods:{
			// 输入完成
			onHandleSearchConfirm(e){
				uni.navigateTo({
					url:"/pages/drugInfoSearch/drugInfoSearch?k=" + e.value,
				})

				
				
			}
		}
	}
</script>

<style lang="less" scoped>
@import "./readInfo.less";
</style>
