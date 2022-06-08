<template>
	<view>
		<view class="add-container">
			<view v-for="(item,index) in data.pearRecord" :key="index">
				<RecordCard :parentData="item" @deleteOneRecord="onHandleDeleteOneRecord" :ref='"editRecord"+index'>
				</RecordCard>
			</view>
			<view class="new-add-one">
				<button @click="newAddOneRecord" class="new-add-button" type="primary" size="mini">新增一个药品
				</button>
			</view>
			<view class="buttons">
				<button type="default" size="mini" class="button-cancel" @click="onHandleCancel">取消</button>
				<button type="primary" size="mini" class="button-confirm"
					@click="onHandleConfirmModification">保存为模板</button>
				<button type="primary" size="mini" class="button-apply" @click="onHandleApplyModification">直接应用</button>
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
				data: {
					user_openid: '',
					createDate: '',
					is_overdue: true,
					is_template: false,
					pearRecord: [{
						// pearId
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
					}],
					successEat: 0
				},
				flag: true, //内容填写完整
				newId: '', //新增的ID
			}
		},
		created() {
			this.data.user_openid = this.$store.state.userInfo.userInfo.openid; //获取用户信息
			this.data.createDate = new Date().getTime();
		},
		methods: {
			test() {
				uni.navigateBack()
			},
			// 新增一个药品
			newAddOneRecord() {
				const temp = {
					// pearId: '',
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
				this.data.pearRecord.push(temp);
			},
			// 删除一个药品
			async onHandleDeleteOneRecord(id) {
				for (let i = 0; i < this.data.pearRecord.length; i++) {
					const temp = this.$refs['editRecord' + i][0].getRecordCardData();
					this.data.pearRecord[i] = temp;
				}
				if (this.data.pearRecord.length === 1) {
					uni.showToast({
						title: '最少保留一条记录',
						icon: "none"
					});
					return;
				}
				this.data.pearRecord = this.data.pearRecord.filter(item => {
					return item.pearId !== id
				})
			},
			// 取消编辑
			onHandleCancel() {
				uni.showModal({
					title: "提示",
					content: "此操作将会清空你的填写",
					success: res => {
						if (res.confirm) {
							uni.navigateBack()
						} else if (res.cancel) {
							return;
						}
					}
				})

			},
			// 直接保存为模板
			async onHandleConfirmModification() {
				for (let i = 0; i < this.data.pearRecord.length; i++) {
					const temp = this.$refs['editRecord' + i][0].getRecordCardData();
					if (temp.drugName === '') {
						uni.showToast({
							title: '请填写药品名称',
							icon: "none"
						});
						this.flag = false;
						return;
					}
					if (temp.drugAvatar === '') {
						uni.showToast({
							title: '请上传药品图片',
							icon: "none"
						});
						this.flag = false;
						return;
					}
					this.data.pearRecord[i] = temp;
				}
				this.data.is_template = true;
				const res = await uniCloud.callFunction({
					name: 'set_record',
					data: {
						...this.data,
					}
				})
				uni.showToast({
					title: res.result.msg,
				})
				this.newId = res.result.data.id;
			},
			// 直接应用
			async onHandleApplyModification() {
				await this.onHandleConfirmModification();
				if (this.flag) {
					// 内容填写完整
					const res = await uniCloud.callFunction({
						name: "set_apply_record",
						data: {
							user_openid: this.$store.state.userInfo.userInfo.openid,
							newid: this.newId
						}
					})
					setTimeout(() => {
						uni.navigateBack();
					}, 1000)
				}
			}
		}
	}
</script>

<style scoped lang="less">
	@import "./newRecord.less";
</style>
