<template>
	<view class="history-container">
		<view class="has-data" v-if="data.length > 0">
			<view class="list-container" v-for="(item,index) in data" :key="item._id">
				<uni-list-chat :avatar-circle="true" :avatar="item.avatar" :title="item.name"
					:note="'共记录' + item.pearRecord.length+ '种药品'" :time="formateDate(item.createDate)" :clickable="true"
					@click="onHandleShowDetail(item)"></uni-list-chat>
			</view>
		</view>
		<view class="no-data" v-if="data.length===0">
			<uni-card>
				暂无历史记录
			</uni-card>
		</view>
	</view>
</template>

<script>
	import formateDate from "@/utils/formateDate.js";
	import ShowRecordDetail from "@/components/ShowRecordDetail/ShowRecordDetail.vue"
	export default {
		components: {
			ShowRecordDetail,
		},
		data() {
			return {
				data: [],
			}
		},
		async created() {
			await this.getHistory();
		},
		methods: {
			formateDate,
			async getHistory() {
				uni.showLoading({
					title: "正在获取数据"
				})
				const res = await uniCloud.callFunction({
					name: "get_history_record",
					data: {
						openid: this.$store.state.userInfo.userInfo.openid
					}
				})
				this.data = res.result.data;
				uni.hideLoading();
				// console.log(this.data)
			},
			onHandleShowDetail(item) {
				// console.log(item)
				uni.navigateTo({
					url: "/pages/historyDetail/historyDetail?id=" + item._id,
				})

			}
		}
	}
</script>

<style>

</style>
