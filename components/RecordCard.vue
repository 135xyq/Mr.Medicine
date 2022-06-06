<template>
	<view class="record-crad-container">
		<view class="drug-name item">
			<text class="label">药品名称：</text><input class="drug-name-input select" type="text" v-model="drugName"
				placeholder="请输入药品名称" />
		</view>
		<view class="drug-avatar item">
			<text class="label">药品图片：</text>
			<view class="image-box" v-if="!tempImg" @click="addImg">
				<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
			</view>
			<view class="image-box" v-if="tempImg">
				<view class="close-icon" @click="delImage">
					<uni-icons class="icon" type="closeempty" size="16" color="#fff"></uni-icons>
				</view>
				<image class="image" :src="tempImg"></image>
			</view>
		</view>
		<view class="drug-pear-count item">
			<text class="label">每日剂量：</text>
			<picker class="select" @change="onHandleDrugpearChange" mode=multiSelector :range="drugPearCountRange">
				{{drugPearCountRange[0][drugPearCountIndex1]}}{{drugPearCountRange[1][drugPearCountIndex2]}}
			</picker>
		</view>
		<view class="drug-all-count item">
			<text class="label">总药品量：</text>
			<picker class="select" @change="onHandleDrugAllChange" mode=multiSelector :range="drugAllCountRange">
				{{drugAllCountRange[0][drugAllCountIndex1]}}{{drugAllCountRange[1][drugAllCountIndex2]}}{{drugAllCountRange[2][drugAllCountIndex3]}}{{drugAllCountRange[3][drugAllCountIndex4]}}
			</picker>
		</view>
		<view class="drug-day-eat-cout item">
			<text class="label">日服药次数：</text>
			<picker class="select" mode="selector" :range="drugDayEatRange" @change="onHandleDrugDayEatChange">
				{{drugDayEatRange1[drugDayEatIndex-1]}}
			</picker>
		</view>
	</view>

</template>

<script>
	export default {
		name: "RecordCard",
		data() {
			return {
				drugName: '', //药品名称
				drugAvatar: '', //药品图片
				drugPearCount: {
					count: '',
					unit: ''
				}, //药品剂量
				drugDayEatCount: '', //一日几次
				drugAllCount: {
					count: '',
					unit: '',
					pearCount: '', //没和多少粒，
					pearCount: '' //单位
				}, //药品总量
				drugPearCountRange: [
					["请选择剂量", 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
					["请选择单位", '粒', '袋', '剂', '片', '支', "瓶", "盒"]
				],
				drugPearCountIndex1: 2,
				drugPearCountIndex2: 2,
				drugAllCountRange: [
					["请选择总数", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
					["请选择单位", "盒", '袋', "瓶"],
					["每盒/瓶容量", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
						25, 26, 27, 28, 29, 30, 31
					],
					["每盒/瓶容量单位", '粒', '袋', , '剂', '片', '支', ]
				],
				drugAllCountIndex1: 1,
				drugAllCountIndex2: 1,
				drugAllCountIndex3: 12,
				drugAllCountIndex4: 1,
				drugDayEatRange: ["请选择每日服用次数", 1, 2, 3],
				drugDayEatIndex: 3,
				drugDayEatRange1: ['早', "早/晚", "早/中/晚"],
				tempImg: '', //临时地址
			};
		},
		created() {
			// 初始化每日剂量
			this.drugPearCount.count = this.drugPearCountRange[0][this.drugPearCountIndex1];
			this.drugPearCount.unit = this.drugPearCountRange[1][this.drugPearCountIndex2];
			// 初始化总数
			this.drugAllCount.count = this.drugAllCountRange[0][this.drugAllCountIndex1];
			this.drugAllCount.unit = this.drugAllCountRange[1][this.drugAllCountIndex2];
			this.drugAllCount.pearCount = this.drugAllCountRange[2][this.drugAllCountIndex3];
			this.drugAllCount.pearUnit = this.drugAllCountRange[3][this.drugAllCountIndex4];
			// 一天吃几次
			this.drugDayEatCount = this.drugDayEatRange[this.drugDayEatIndex];
		},
		methods: {
			// 修改药品剂量
			onHandleDrugpearChange(e) {
				// 选中提示信息
				if (e.detail.value[0] === 0 || e.detail.value[1] === 0) {
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
				if (e.detail.value[0] === 0 || e.detail.value[1] === 0 || e.detail.value[2] === 0 || e.detail.value[3] ===
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
				// 选中提示信息
				if (e.detail.value === 0) {
					return;
				}
				this.drugDayEatIndex = e.detail.value;
				this.drugDayEatCount = this.drugDayEatRange[this.drugDayEatIndex];
			},
			// 添加图片
			addImg() {
				uni.chooseImage({
					success: (res) => {
						this.tempImg = res.tempFilePaths[0];
					}
				})
			},
			//删除图片
			delImage() {
				this.tempImg = "";
			},
			// 将数据传给父组件
			getRecordCardData() {
				return {
					drugName: this.drugName, //药品名称
					drugAvatar: this.drugAvatar, //药品图片
					drugPearCount: this.drugPearCount, //药品剂量
					drugDayEatCount: this.drugDayEatCount, //一日几次
					drugAllCount:this.drugAllCount, //药品总量
					tempImage:this.tempImg,
				}
			},
		}
	}
</script>

<style scoped lang="less">
	@import "./css/RecordCard.less";
</style>
