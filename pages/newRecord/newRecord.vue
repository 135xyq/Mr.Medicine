<template>
	<view>
		<view class="add-container">
			<view class="basic-info">
				<RecordInfo :data="basicInfo" ref="newRecordInfo"></RecordInfo>
			</view>
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
	import RecordCard from "@/components/RecordCard.vue";
	import RecordInfo from "@/components/RecordInfo/RecordInfo.vue";
	export default {
		components: {
			RecordCard,
			RecordInfo
		},
		data() {
			return {
				tempInfo:{},
				basicInfo:{
					name:"",
					avatar:"",
					description:"",
					createDate:new Date().getTime(),
				},
				data: {
					openid: '',
					is_overdue: true,
					pearRecord: [{
						pearId:"",
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
			this.data.openid = this.$store.state.userInfo.userInfo.openid; //获取用户信息
		},
		methods: {
			// 新增一个药品
			newAddOneRecord() {
				const temp = {
					pearId: '',
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
			// 获取填写的信息
			getAllData(){
				// 获取基本信息
				this.flag = true;
				this.tempInfo = this.$refs.newRecordInfo.getRecordInfoData();
				if(this.tempInfo.name === ""){
					uni.showToast({
						title: '请填写记录名称',
						icon: "none"
					});
					this.flag = false;
					return;
				}
				if(this.tempInfo.avatar === ""){
					uni.showToast({
						title: '请填写记录图片',
						icon: "none"
					});
					this.flag = false;
					return;
				}
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
					if(temp.drugAllCount.pearUnit !== temp.drugPearCount.unit){
						uni.showToast({
							title:"药品单位选择有误",
							icon:"none"
						})
						this.flag = false;
						return;
					}
					this.data.pearRecord[i] = temp;
				}
			},
			// 直接保存为模板
			async onHandleConfirmModification() {
				this.getAllData();
				// console.log(this.data)
				// console.log(tempInfo)
				if(this.flag){
					// 信息填写完整
					const res = await uniCloud.callFunction({
						name: 'set_template',
						data: {
							...this.data,
							...this.tempInfo
						}
					})
					uni.showToast({
						title: res.result.msg,
					})
					this.newId = res.result.data.id;
					setTimeout(()=>{
						uni.navigateBack();
					},1000)
				}
			},
			// 直接应用
			async onHandleApplyModification() {
				this.getAllData();//获取所有数据
				if (this.flag) {
					// 内容填写完整
					this.data.is_overdue = false;
					const res = await uniCloud.callFunction({
						name: "apply_record",
						data: {
							openid: this.$store.state.userInfo.userInfo.openid,
							data:{
								...this.data,
								...this.tempInfo
							}
						}
					})
					uni.showToast({
						title:"应用成功"
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
