<template>
	<view class="content">
		<view class="current-record">
			<view class="example-body">
				<uni-card @click="showRecordDetailDrawer" title="今日吃药">
					<view class="has-current-record" v-if="currentRecord.length > 0">
						<view class="word-btn-white">药品种类：{{currentRecord[0].pearRecord.length}}种</view>
						<view class="">
							剩下的药品还能吃:12天
						</view>
					</view>
					<view class="no-current-record" v-if="currentRecord.length === 0">
						暂无记录
					</view>
				</uni-card>
				<uni-drawer ref="showDetails" mode="right" :width="350">
					<view class="scroll-view" v-if="currentRecord.length > 0">
						<scroll-view class="scroll-view-box" scroll-y="true">
							<view class="" v-for="(item,index) in currentRecord[0].pearRecord" :key="index">
								<RecordCard :parentData="item" :ref='"editRecord"+index'></RecordCard>
							</view>
							<view class="buttons">
								<button type="default" class="button-cancel" @click="onHandleCancel" size="mini">取消</button>
								<button type="primary" size="mini" @click="onHandleConfirmModification">确认</button>
							</view>
						</scroll-view>
					</view>
				</uni-drawer>
			</view>
		</view>
	</view>
</template>

<script>
	import RecordCard from "@/components/RecordCard.vue"
	export default {
		components: {
			RecordCard
		},
		data() {
			return {
				currentRecord: {}, //当前正在吃的记录
			}
		},
		created() {
			// console.log(this.$refs.test1.getRecordCardData())
			this.getCurrentRecord();
		},
		methods: {
			// 获取信息
			getData() {
				console.log(this.$refs.test1.getRecordCardData())
				console.log(this.$refs.test2.getRecordCardData())
			},
			// 打开今日吃药的抽屉
			showRecordDetailDrawer() {
				if (this.currentRecord.length) {
					this.$refs.showDetails.open()
				} else {
					uni.showToast({
						title: '暂无记录,请添加新的记录',
						icon: "none"
					})
				}
			},
			// 获取当前正在进行的吃药记录
			async getCurrentRecord() {
				const res = await uniCloud.callFunction({
					name: 'get_currentRecord',
					data: {
						openid: this.$store.state.userInfo.userInfo.openId,
					}
				});
				this.currentRecord = res.result.data;
			},
			// 取消或者结束预览
			onHandleCancel(){
				this.$refs.showDetails.close();
			},
			// 确认修改信息
			async onHandleConfirmModification(){
				uni.showModal({
					title:'提示',
					content:"确定要修改药品信息?",
					success:async (res)=> {
						if(res.confirm){
							// 确认修改
							const newData = [];
							// 将修改后的信息保存下来
							for(let i = 0 ;i < this.currentRecord[0].pearRecord.length;i++){
								const temp = this.$refs['editRecord'+i][0].getRecordCardData();
								if(temp.drugName === ''){
									// 药名为空
									uni.showToast({
										title:'请输入药品名称！',
										icon:'error'
									})
									return;
								}
								newData.push(temp);
							}
							// 修改数据库
							const res = await uniCloud.callFunction({
								name:"edit_record",
								data:{
									id:this.currentRecord[0]._id,
									recordData:newData
								}
							});
							uni.showToast({
								title:res.result.msg,
							})
							this.$refs.showDetails.close();
						}else if(res.cancel){
							uni.showToast({
								title:'取消修改',
								icon:"none"
							})
							this.$refs.showDetails.close();
						}
					}
				})
				
				// console.log(newData);
			}
		}
	}
</script>

<style scoped lang="less">
	.test {
		width: 100%;
	}

	.scroll-view,
	.scroll-view-box {
		height: 100%;
		.buttons{
			width: 100%;
			text-align: center;
			margin: 30px 0;
			.button-cancel{
				margin: 0 30px;
			}
		}
	}
</style>
