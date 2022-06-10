<template>
	<view class="history-container">
		<view class="has-data" v-if="data.length > 0">
			<view class="list-container" v-for="(item,index) in data" :key="item._id">
				<uni-list-chat :avatar-circle="true" :avatar="item.pearRecord[0].drugAvatar" :title="'历史记录' + (index+1)"
					:note="'共记录' + item.pearRecord.length+ '种药品'" :time="formateDate(item.createDate)" :clickable="true"
					@click="onHandleShowDetail(item)"></uni-list-chat>
			</view>
			<view class="drawer">
				<uni-drawer ref="showDrawer" mode="right" :mask-click="true" width="300">
					<scroll-view style="height: 100%;" scroll-y="true">
						<ShowRecordDetail :data="showData"></ShowRecordDetail>
					</scroll-view>
				</uni-drawer>
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
		components:{
			ShowRecordDetail,
		},
		data() {
			return {
				data: [],
				showData:{},
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
			},
			onHandleShowDetail(item) {
				this.showData = item;
				this.$refs.showDrawer.open()
			}
		}
	}
</script>

<style>

</style>
