<template>
	<view class="record-crad-container">
		<uni-card :is-shadow="true">
			<view class="delete-record" @click="onHandleDeleteThisRecord">
				<uni-icons type="trash" size="30" color="#ccc"></uni-icons>
			</view>
			<view class="drug-name item">
				<text class="label">药品名称：</text>
				<input class="drug-name-input select" type="text" v-model="drugName" placeholder="请输入药品名称"></input>
			</view>
			<view class="drug-avatar item">
				<text class="label">药品图片：</text>
				<view class="image-box" v-if="!drugAvatar" @click="addImg">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
				<view class="image-box" v-if="drugAvatar">
					<view class="close-icon" @click="delImage">
						<uni-icons class="icon" type="closeempty" size="16" color="#fff"></uni-icons>
					</view>
					<image class="image" :src="drugAvatar"></image>
				</view>
			</view>
			<view class="drug-pear-count item">
				<text class="label">每日剂量：</text>
				<picker class="select" @change="onHandleDrugpearChange" mode=multiSelector :range="drugPearCountRange">
					{{drugPearCount.count}}{{drugPearCount.unit}}
				</picker>
			</view>
			<view class="drug-all-count item">
				<text class="label">总药品量：</text>
				<picker class="select" @change="onHandleDrugAllChange" mode=multiSelector :range="drugAllCountRange">
					{{drugAllCount.count}}{{drugAllCount.unit}}{{drugAllCount.pearCount}}{{drugAllCount.pearUnit}}
				</picker>
			</view>
			<view class="drug-day-eat-cout item">
				<text class="label">日服药次数：</text>
				<picker class="select" mode="selector" :range="drugDayEatRange" @change="onHandleDrugDayEatChange">
					{{drugDayEatRange1[drugDayEatIndex-1]}}
				</picker>
			</view>
		</uni-card>

	</view>

</template>

<script>
	export default {
		name: "RecordCard",
		props: {
			parentData: {}
		},
		data() {
			return {
				pearId: this.parentData.pearId || (new Date().getTime() + (Math.floor(Math.random() * 100000 + 10000))
					.toString(16)),
				a: '1',
				drugName: this.parentData.drugName || '', //药品名称
				drugAvatar: this.parentData.drugAvatar || '', //药品图片
				successEat:this.parentData.successEat ||0,//药品吃过的次数
				drugPearCount: this.parentData.pearCount || {
					count: '',
					unit: ''
				}, //药品剂量
				drugDayEatCount: this.parentData.drugDayEatCount || '', //一日几次
				drugAllCount: this.parentData.allCount || {
					count: '',
					unit: '',
					pearCount: '', //没和多少粒，
					pearUnit: '' //单位
				}, //药品总量
				drugPearCountRange: [
					["请选择剂量", 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
					["请选择单位", '粒', '袋', '剂', '片', '支', "瓶", "盒"]
				],
				drugPearCountIndex1: 2,
				drugPearCountIndex2: 1,
				drugAllCountRange: [
					["请选择总数", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,50,100],
					["请选择单位", "盒", '袋', "瓶"],
					["每盒/瓶容量", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
						25, 26, 27, 28, 29, 30, 31,50,100,200,300
					],
					["每盒/瓶容量单位", '粒', '袋', '剂', '片', '支', ]
				],
				drugAllCountIndex1: 1,
				drugAllCountIndex2: 1,
				drugAllCountIndex3: 12,
				drugAllCountIndex4: 1,
				drugDayEatRange: ["请选择每日服用次数", 1, 2, 3],
				drugDayEatIndex: 3,
				drugDayEatRange1: ['早', "早/晚", "早/中/晚"],
				// tempImg: this.parentData.drugAvatar || '', //临时地址
			};
		},
		created() {
			// 初始化每日剂量
			// console.log(this.parentData)
			this.drugPearCount.count = this.parentData.drugPearCount ? this.parentData.drugPearCount.count : this
				.drugPearCountRange[0][this.drugPearCountIndex1];
			this.drugPearCount.unit = this.parentData.drugPearCount ? this.parentData.drugPearCount.unit : this.drugPearCountRange[
				1][this.drugPearCountIndex2];
			// 初始化总数
			this.drugAllCount.count = this.parentData.drugAllCount ? this.parentData.drugAllCount.count : this.drugAllCountRange[0]
				[this.drugAllCountIndex1];
			this.drugAllCount.unit = this.parentData.drugAllCount ? this.parentData.drugAllCount.unit : this.drugAllCountRange[1][
				this.drugAllCountIndex2
			];
			this.drugAllCount.pearCount = this.parentData.drugAllCount ? this.parentData.drugAllCount.pearCount : this
				.drugAllCountRange[2][this.drugAllCountIndex3];
			this.drugAllCount.pearUnit = this.parentData.drugAllCount ? this.parentData.drugAllCount.pearUnit : this
				.drugAllCountRange[3][this.drugAllCountIndex4];
			// 一天吃几次
			this.drugDayEatCount = this.parentData.drugDayEatCount || this.drugDayEatRange[this.drugDayEatIndex];
			this.drugDayEatIndex = this.drugDayEatCount;
			// console.log(this.parentData.drugPearCount,this.parentData.drugAllCount)
			// console.log(this.drugPearCount,this.drugAllCount)
		},
		methods: {
			// 修改药品剂量
			onHandleDrugpearChange(e) {
				// 选中提示信息
				if (e.detail.value[0] == 0 || e.detail.value[1] == 0) {
					return;
				}
				this.drugPearCountIndex1 = e.detail.value[0];
				this.drugPearCountIndex2 = e.detail.value[1];
				this.drugPearCount.count = this.drugPearCountRange[0][this.drugPearCountIndex1];
				this.drugPearCount.unit = this.drugPearCountRange[1][this.drugPearCountIndex2];
			},
			// 修改总量
			onHandleDrugAllChange(e) {
				// 选中提示信息
				// console.log(e.detail.value)
				if (e.detail.value[0] == 0 || e.detail.value[1] == 0 || e.detail.value[2] == 0 || e.detail.value[3] ==
					0) {
					return;
				}
				this.drugAllCountIndex1 = e.detail.value[0];
				this.drugAllCountIndex2 = e.detail.value[1];
				this.drugAllCountIndex3 = e.detail.value[2];
				this.drugAllCountIndex4 = e.detail.value[3];
				this.drugAllCount.count = this.drugAllCountRange[0][this.drugAllCountIndex1];
				this.drugAllCount.unit = this.drugAllCountRange[1][this.drugAllCountIndex2];
				this.drugAllCount.pearCount = this.drugAllCountRange[2][this.drugAllCountIndex3];
				this.drugAllCount.pearUnit = this.drugAllCountRange[3][this.drugAllCountIndex4];
			},
			// 修改日服药次数
			onHandleDrugDayEatChange(e) {
				// console.log(121,e.detail.value)
				// 选中提示信息
				if (e.detail.value == 0) {
					return;
				}
				this.drugDayEatIndex = e.detail.value;
				this.drugDayEatCount = this.drugDayEatRange[this.drugDayEatIndex];
			},
			// 添加图片
			addImg() {
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						// this.drugAvatar = res.tempFiles[0];
						// 上传图片
						if (res.tempFilePaths.length > 0) {
							let url = res.tempFiles[0].path;
							const result = await uniCloud.uploadFile({
								filePath: url,
								cloudPath: (new Date().getTime() + (Math.floor(Math.random() * 100000 + 10000))
					.toString(16)) + url.substr(url.lastIndexOf('.')),
							});
							this.drugAvatar = result.filePath;
							// console.log(result)
							// console.log(this.drugAvatar)
						}
					}
				})

			},
			//删除图片
			delImage() {
				this.drugAvatar = "";
			},
			// 将数据传给父组件
			getRecordCardData() {
				return {
					pearId: this.pearId, //唯一ID
					drugName: this.drugName, //药品名称
					drugAvatar: this.drugAvatar, //药品图片
					drugPearCount: this.drugPearCount, //药品剂量
					drugDayEatCount: this.drugDayEatCount, //一日几次
					drugAllCount: this.drugAllCount, //药品总量
					successEat:this.successEat,//吃过多少次
					// tempImage: this.tempImg,
				}
			},

			// 删除当前记录
			onHandleDeleteThisRecord(e) {
				uni.showModal({
					title: "提示",
					content: "确定要删除该药品",
					success: res => {
						if (res.confirm) {
							// 确认删除
							this.$emit("deleteOneRecord", this.pearId)
						} else if (res.cancel) {
							// 取消
							uni.showToast({
								title: '取消删除',
								icon: "none"
							});
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	@import "./css/RecordCard.less";
</style>
