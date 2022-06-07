<template>
	<view class="content">
		<view class="current-record">
			<view class="example-body">
				<uni-card :is-shadow=true @click="showRecordDetailDrawer" class="card-title" title="今日吃药">
					<view class="has-current-record" v-if="currentRecord.length > 0">
						<view class="word-btn-white">药品种类：{{currentRecord[0].pearRecord.length}}种</view>
						<view class="other-record">
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
							<view class="show-draw-title">
								<text>当前记录的详细信息</text>
							</view>
							<view class="" v-for="(item,index) in tempRecord[0].pearRecord" :key="index">
								<RecordCard @deleteOneRecord="onHandleDeleteOneRecord" :parentData="item"
									:ref='"editRecord"+index'></RecordCard>
							</view>
							<view class="new-add-one">
								<button @click="newAddOneRecord" class="new-add-button" type="primary"
									size="mini">新增一个药品
								</button>
							</view>
							<view class="buttons">
								<button type="default" size="mini" class="button-cancel"
									@click="onHandleCancel">取消</button>
								<button type="primary" size="mini" class="button-confirm"
									@click="onHandleConfirmModification">确认</button>
							</view>
						</scroll-view>
					</view>
				</uni-drawer>
			</view>
		</view>
		<view class="new-record">
			<button type="default" size="mini" @click="onHandleNewRecord">新建一个记录</button>
			<!-- <RecordCard :parentData="{}" @deleteOneRecord="onHandleDeleteOneRecord"></RecordCard> -->
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
				tempRecord: {},
			}
		},
		// 下拉获取信息
		async onPullDownRefresh() {
			await this.getCurrentRecord();
			setTimeout(()=>{
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '刷新成功',
					icon:"none"
				});
			},1000)
		},
		watch: {
			currentRecord: function(newData, oldData) {
				this.tempRecord = JSON.parse(JSON.stringify(newData));
				// console.log(this.tempRecord[0].pearRecord === this.currentRecord[0].pearRecord)
			}
		},
		async created() {
			// console.log(this.$refs.test1.getRecordCardData())
			await this.getCurrentRecord();
		},
		methods: {
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
				// console.log(this.$store.state.userInfo.userInfo.openid)
				const res = await uniCloud.callFunction({
					name: 'get_currentRecord',
					data: {
						openid: this.$store.state.userInfo.userInfo.openid,
						newId:'213'
					}
				});
				this.currentRecord = res.result.data;
			},
			// 取消或者结束预览
			onHandleCancel() {
				this.$refs.showDetails.close();
				this.tempRecord = JSON.parse(JSON.stringify(this.currentRecord));
			},
			// 确认修改信息
			async onHandleConfirmModification() {
				uni.showModal({
					title: '提示',
					content: "确定要修改药品信息?",
					success: async (res) => {
						if (res.confirm) {
							// 确认修改
							const newData = [];
							// 将修改后的信息保存下来
							for (let i = 0; i < this.tempRecord[0].pearRecord.length; i++) {
								const temp = this.$refs['editRecord' + i][0]
									.getRecordCardData(); //获取每一个RecordCard的数据
								// console.log(temp)
								if (temp.drugName === '') {
									// 药名为空
									uni.showToast({
										title: '请输入药品名称',
										icon: 'error'
									})
									return;
								}
								if (temp.drugPearCount.count === '') {
									// 每次剂量为空
									uni.showToast({
										title: '请输入药品每次服用剂量',
										icon: 'error'
									})
									return;
								}
								if (temp.drugAllCount.count === '') {
									// 药品总量为空
									uni.showToast({
										title: '请输入药品总量',
										icon: 'error'
									})
									return;
								}
								newData.push(temp);
							}
							// 修改数据库
							const res = await uniCloud.callFunction({
								name: "edit_record",
								data: {
									id: this.currentRecord[0]._id,
									recordData: newData
								}
							});
							uni.showToast({
								title: res.result.msg,
							})
							this.$refs.showDetails.close(); //关闭抽屉
							this.getCurrentRecord(); //重新获取数据
						} else if (res.cancel) {
							uni.showToast({
								title: '取消修改',
								icon: "none"
							})
							this.$refs.showDetails.close();
						}
					}
				})

			},
			// 新增一个药品信息
			newAddOneRecord() {
				const temp = {
					pearId:'',
					drugName: "",
					drugAvatar: "",
					drugPearCount: {
						count: "",
						unit: ""
					},
					drugAllCount: {
						count: "",
						unit: "",
						pearCount: "",
						pearUnit: ""
					},
					drugDayEatCount: "",
				}; //药品信息

				this.tempRecord[0].pearRecord.push(temp);
			},
			// 新增一个记录
			onHandleNewRecord(){
				// console.log(1)
				uni.navigateTo({
					url:"/pages/newRecord/newRecord",
						animationType: 'pop-in',
						animationDuration: 200
				})
				// uni.go
			},
			// 删除一个药品
			async onHandleDeleteOneRecord(id) {
				// const res = await 
				this.tempRecord[0].pearRecord = this.tempRecord[0].pearRecord.filter(item => {
					return item.pearId !== id
				})
				const res = await uniCloud.callFunction({
					name: "delete_oneDrugRecord",
					data: {
						_id: this.tempRecord[0]._id,
						newData: this.tempRecord[0].pearRecord,
					}
				});
				uni.showToast({
					title: res.result.msg,
					icon: "none"
				});
				this.getCurrentRecord();
			}
		}
	}
</script>

<style scoped lang="less">
	@import "./index.less";
</style>
