<template>
	<view class="history-container">
		<view class="has-data" v-if="data.length > 0">
			<view class="list-container" v-for="(item,index) in data" :key="item._id">
				<uni-list-chat :avatar-circle="true" :avatar="item.pearRecord[0].drugAvatar" :title="'历史记录' + (index+1)"
					:note="'共记录' + item.pearRecord.length+ '种药品'" :time="formateDate(item.createDate)"></uni-list-chat>
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
	export default {
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
				const res = await uniCloud.callFunction({
					name: "get_history_record",
					data: {
						openid: this.$store.state.userInfo.userInfo.openid
					}
				})
				this.data = res.result.data;
				// console.log(this.data)
			}
		}
	}
</script>

<style>

</style>
