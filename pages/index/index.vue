<template>
	<view class="content">
		<view class="" v-if="minDay < 3 && currentRecord.length > 0">
			<uni-notice-bar scrollable single :text="'剩余的药品还能吃 '+ minDay +' 次,请及时补充!'"></uni-notice-bar>
		</view>
		<view class="current-record">
			<view class="example-body">
				<uni-card :is-shadow=true @click="showRecordDetailDrawer" class="card-title" title="今日吃药"
					:extra="currentRecord.length > 0 ? currentRecord[0].name:''">
					<view class=" has-current-record" v-if="currentRecord.length > 0">
						<view class="word-btn-white">药品种类：{{currentRecord[0].pearRecord.length}}种</view>
						<view class="other-record">
							剩下的药品还能吃:{{minDay}} 次
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
							<view class="record-info">
								<RecordInfo ref="recordTitle" :data="recordInfo"></RecordInfo>
							</view>
							<view class="" v-for="(item,index) in currentRecord[0].pearRecord" :key="index">
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
								<button type="default" size="mini" class="button-end"
									@click="onHandleEndModification">结束当前记录</button>
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
		<view class="template">
			<uni-card title="我的模板" spacing="0" padding="0">
				<view class="no-template-record" v-if="templateRecord.length ===0">
					暂无内容
				</view>
				<view class="has-template-record" v-if="templateRecord.length > 0">
					<view class="template-container" v-for="item in templateRecord" :key="item._id">
						<RecordTemplate :data="item" @applyTemplate="onHandleApplyTemplate"
							@deleteTemplate="onHandleDeleteTemplate"></RecordTemplate>
					</view>
				</view>
			</uni-card>
		</view>
		<!-- 		<view class="show-record">
			<ShowRecord></ShowRecord>
					<uni-fab @fabClick="onHandleFabClick"></uni-fab>
		</view> -->
		<view class="daily-data" v-if="currentRecord.length > 0">
			<DailyData :data="currentRecord[0]"></DailyData>
		</view>
	</view>
</template>

<script>
	import RecordCard from "@/components/RecordCard.vue";
	import RecordTemplate from "@/components/RecordTemplate/RecordTemplate.vue";
	import ShowRecord from "@/components/ShowRecord/ShowRecord.vue";
	import RecordInfo from "@/components/RecordInfo/RecordInfo.vue";
	import DailyData from "@/components/DailyData/DailyData.vue";
	import {
		computerLeftoverDrug,
		formateDrug
	} from "@/utils/computerLftoverDrugs.js";
	export default {
		components: {
			RecordCard,
			RecordTemplate,
			ShowRecord,
			RecordInfo,
			DailyData
		},
		data() {
			return {
				currentRecord: [], //当前正在吃的记录
				// tempRecord: {},
				templateRecord: [], //模板记录
				recordInfo: {}, //记录的基本信息
				minDay:0,//最多还能吃多少次
			}
		},
		onLoad() {
			if (!this.$store.state.userInfo.userInfo) {
				// 没有登录
				uni.showToast({
					title: "请登录",
					icon: "none"
				})

				uni.switchTab({
					url: "/pages/self/self"
				})
			}
		},
		async onShow() {
			await this.getCurrentRecord();
			await this.getTemplateRecord();
		},
		// 下拉获取信息
		async onPullDownRefresh() {
			await this.getCurrentRecord();
			await this.getTemplateRecord();
			this.getEatMinDayDrug();//获取最多吃多少天
			setTimeout(() => {
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '刷新成功',
					icon: "none"
				});
			}, 1000)
					
		},
		// watch: {
		// 	currentRecord: function(newData, oldData) {
		// 		// this.tempRecord = JSON.parse(JSON.stringify(newData));
		// 		// console.log(this.tempRecord[0].pearRecord === this.currentRecord[0].pearRecord)
		// 	}
		// },
		async created() {
			// console.log(this.$store.state.userInfo.userInfo.openid)
			// console.log(this.$refs.test1.getRecordCardData())
			uni.showLoading({
				title: "正在获取数据"
			})
			await this.getCurrentRecord();
			await this.getTemplateRecord();
			uni.hideLoading();
			// console.log(this.currentRecord)
			this.getEatMinDayDrug()
		},
		methods: {
			// 获取模板信息
			async getTemplateRecord() {
				const res = await uniCloud.callFunction({
					name: "get_template",
					data: {
						openid: this.$store.state.userInfo.userInfo.openid,
					}
				})

				this.templateRecord = res.result.data;
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
				// console.log(this.$store.state.userInfo.userInfo.openid)
				const res = await uniCloud.callFunction({
					name: 'get_currentRecord',
					data: {
						openid: this.$store.state.userInfo.userInfo.openid,
					}
				});
				// console.log(res)
				if (res.result.data.length > 0) {
					this.currentRecord = res.result.data;
					this.recordInfo.name = this.currentRecord[0].name;
					this.recordInfo.avatar = this.currentRecord[0].avatar;
					this.recordInfo.createDate = this.currentRecord[0].createDate;
					this.recordInfo.description = this.currentRecord[0].description;
				}
			},
			// 取消或者结束预览
			onHandleCancel() {
				this.$refs.showDetails.close();
				this.getCurrentRecord();
				// this.tempRecord = JSON.parse(JSON.stringify(this.currentRecord));
			},
			// 结束当前的记录
			onHandleEndModification() {
				uni.showModal({
					title: "提示",
					content: "确定要结束当前的记录？",
					success: async (res) => {
						if (res.confirm) {
							const res = await uniCloud.callFunction({
								name: "update_record",
								data: {
									id: this.currentRecord[0]._id,
									data: {
										openid: this.$store.state.userInfo.userInfo.openid,
										name: this.currentRecord[0].name,
										avatar: this.currentRecord[0].avatar,
										createDate: this.currentRecord[0].createDate,
										is_overdue: true,
										pearRecord: this.currentRecord[0].pearRecord,
										successEat: this.currentRecord[0].successEat,
										description: this.currentRecord[0].description
									}
								}
							});
							// 自动关闭弹框，并且重新请求数据
							this.onHandleCancel();
						} else if (res.cancel) {
							uni.showToast({
								title: "取消结束当前记录",
								icon: "none"
							})
						}
					}
				})
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
							let tempTitle = this.$refs.recordTitle.getRecordInfoData();
							// console.log(tempTitle)
							if (tempTitle.name === "") {
								uni.showToast({
									title: '请输入记录名称',
									icon: 'error'
								})
								return;
							}
							// console.log(this.currentRecord[0].pearRecord)
							for (let i = 0; i < this.currentRecord[0].pearRecord.length; i++) {
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
								if (temp.drugAvatar === '') {
									// 药名为空
									uni.showToast({
										title: '请输入药品图片',
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
								if (temp.drugAllCount.pearUnit !== temp.drugPearCount.unit) {
									uni.showToast({
										title: "药品单位有误",
										icon: "error"
									})
									return;
								}
								this.currentRecord[0].pearRecord[i] = temp;
							}
							// 修改数据库

							const res = await uniCloud.callFunction({
								name: "update_record",
								data: {
									id: this.currentRecord[0]._id,
									data: {
										openid: this.$store.state.userInfo.userInfo.openid,
										name: tempTitle.name,
										avatar: tempTitle.avatar,
										createDate: this.currentRecord[0].createDate,
										is_overdue: false,
										pearRecord: this.currentRecord[0].pearRecord,
										successEat: this.currentRecord[0].successEat,
										description: tempTitle.description
									}
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
					pearId: '',
					drugName: "",
					drugAvatar: "",
					drugPearCount: {
						count: "",
						unit: "",
					},
					successEat: 0,
					drugAllCount: {
						count: "",
						unit: "",
						pearCount: "",
						pearUnit: ""
					},
					drugDayEatCount: "",
				}; //药品信息

				this.currentRecord[0].pearRecord.push(temp);
			},
			// 新增一个记录
			onHandleNewRecord() {
				// console.log(1)
				uni.navigateTo({
					url: "/pages/newRecord/newRecord",
					animationType: 'pop-in',
					animationDuration: 200
				})
				// uni.go
			},
			// 删除一个药品
			async onHandleDeleteOneRecord(id) {
				if (this.currentRecord[0].pearRecord.length === 1) {
					uni.showToast({
						title: "至少保留一个药品的记录",
						icon: "none"
					})
					return;
				}
				// const res = await 
				this.currentRecord[0].pearRecord = this.currentRecord[0].pearRecord.filter(item => {
					return item.pearId !== id
				})
				const res = await uniCloud.callFunction({
					name: "delete_oneDrugRecord",
					data: {
						_id: this.currentRecord[0]._id,
						newData: this.currentRecord[0].pearRecord,
					}
				});
				uni.showToast({
					title: res.result.msg,
					icon: "none"
				});
				await this.getCurrentRecord();
			},
			// 应用一个模板
			async onHandleApplyTemplate(id) {
				// console.log(id)
				const res = await uniCloud.callFunction({
					name: "apply_template",
					data: {
						openid: this.$store.state.userInfo.userInfo.openid,
						id: id
					}
				});
				uni.showToast({
					title: res.result.mag,
				});
				// 重新获取数据
				await this.getCurrentRecord();
				await this.getTemplateRecord();
			},
			// 删除一个模板
			async onHandleDeleteTemplate(id) {
				const res = await uniCloud.callFunction({
					name: "delete_record",
					data: {
						id,
					}
				});
				uni.showToast({
					title: res.result.msg,
					icon: "none"
				})
				// 重新获取数据
				await this.getCurrentRecord();
				await this.getTemplateRecord();
			},
			// 获取能吃最少天数的药品
			getEatMinDayDrug() {
				let temp = []
				// console.log(this.currentRecord)
				for (let i = 0; i < this.currentRecord[0].pearRecord.length; i++) {
					temp.push(Math.floor(computerLeftoverDrug(this.currentRecord[0].pearRecord[i]) / this
						.currentRecord[0].pearRecord[i].drugPearCount.count)); //得到剩余的药品数量
				}
				this.minDay = Math.min(...temp);
				// console.log(temp)
			},
		}
	}
</script>

<style scoped lang="less">
	@import "./index.less";
</style>
