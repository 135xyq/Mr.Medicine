<template>
	<view class="daily-data-container">
		<view class="fab-container" @click="hiddenDetail = !hiddenDetail" :class="{'button-hidden-show':!hiddenDetail}">
			{{hiddenDetail?nearTime : '×'}}
		</view>
		<view class="hidden-content" @click="open" v-if="!hiddenDetail" :class="{'hidden-show':!hiddenDetail}">
			<view class="text">
				{{nearText}}
			</view>
			<view class="time">
				{{Math.floor(nearTime / 60)}} 小时{{nearTime % 60}} 分钟
			</view>
		</view>
		<!-- <uni-fab @trigger="onHandleTrigger" :content="content"></uni-fab> -->
		<uni-popup ref="popup" :mask-click="true" background-color="#fff" class="popup-container">
			<swiper class="swiper" ref="swiper" :disable-touch="true" :current="currentIndex">
				<swiper-item v-for="(item,index) in currenData" :key="item.pearid" @touchmove.stop>
					<view class="show-complete" :class="{'no-eat':!hasEat.includes(index)}">
						{{hasEat.includes(index) ? "已吃过" : "未吃过"}}
					</view>
					<img class="drug-img" :src="item.drugAvatar" alt="药品图片">
					<view class="drug-name">
						{{item.drugName}}
					</view>
					<view class="eat-count">
						{{item.drugPearCount.count}} {{item.drugPearCount.unit}}
					</view>
					<view class="btns">
						<button type="primary" class="previous" size="mini" @click="onHandleChangePrevious"
							v-if="currentIndex !== 0">上一张</button>
						<button type="primary" size="mini" @click="onHandleChangeNext"
							v-if="currentIndex !== currenData.length-1">下一张</button>
						<button type="primary" size="mini" @click="onHandleCompleteEatDrug"
							v-if="currentIndex ===currenData.length- 1">完成吃药</button>
					</view>
				</swiper-item>
				<swiper-item @touchmove.stop>
					<view class="show-title">
						剩余药品展示
					</view>
					<ul class="show-conatainer">
						<li v-for="(item,index) in data.pearRecord" :key="item.pearId" class="show-item">
							<text class="drug-show-name"
								:class="{'litter-number':drugLfetNumber[index] <= item.drugPearCount.count}">{{item.drugName}}</text>
							<text class="drug-show-count"
								:class="{'litter-number':drugLfetNumber[index] <= item.drugPearCount.count}">{{drugShow[index]}}</text>
						</li>
					</ul>
					<view class="close-show">
						<button type="primary" size="mini" @click="onHandleChangePrevious"
							class="close-show-return">返回</button>
						<button type="primary" size="mini" @click="onHandleClose">确定</button>
					</view>

				</swiper-item>
			</swiper>
		</uni-popup>
	</view>
</template>

<script>
	import getAllMinutes from "@/utils/getMinutes.js";
	import {
		computerLeftoverDrug,
		formateDrug
	} from "@/utils/computerLftoverDrugs.js";
	export default {
		name: "DailyData",
		props: ["data"],
		data() {
			return {
				currentIndex: 0, //轮播图的当前下标
				hasEat: [], //已经吃过的药品下标
				userSetting: {}, //用户设置
				userSettingMorning: "", //早上吃药时间在一天的第多少分钟
				userSettingNoon: "", //中午吃药时间在一天的第多少分钟
				userSettingNight: "", //晚上吃药时间在一天的第多少分钟
				nearTime: 0, //距离最近吃药时间最近的分钟数
				nearText: "", //距离最近日期的提示词
				hiddenDetail: true, //是否隐藏倒计时详细信息
				drugLfetNumber: [], //剩余药品个数
				drugShow: [], //展示剩余
				currenData: [], //当前吃的药品
				hasEatFlag: false, //是否已经吃过
			};
		},
		computed: {
			content() {
				return [{
					text: this.nearText + this.nearTime
				}]
			}
		},
		async created() {
			await this.getUserSetting(); //获取用户设置
			this.getTimeAndTransform();
			setInterval(() => {
				this.getTimeAndTransform();
			}, 1000 * 60)

			this.getAllLeftoverDrugNumber()

			// console.log(this.drugLfetNumber)
		},
		methods: {
			open() {
				// console.log(1)
				// this.$refs.popup.open();
				this.$refs.popup.open('center')
			},
			// 下一个药品
			onHandleChangeNext() {
				if (this.currentIndex !== this.currenData.length - 1) {
					if (!this.hasEat.includes(this.currentIndex)) {
						this.hasEat.push(this.currentIndex);
					}
					// 最后一张
					this.currentIndex++;
				} else {
					return;
				}
			},
			// 上一个药品
			onHandleChangePrevious() {
				if (this.currentIndex !== 0) {
					this.currentIndex--;
				} else {
					return;
				}
			},
			// 完成吃药
			onHandleCompleteEatDrug() {
				this.hasEat.push(this.currentIndex);
				if (!this.hasEatFlag) {
					uni.showModal({
						title: "提示",
						content: "是否完成本次吃药",
						success: async (res) => {
							if (res.confirm) {
								await this.updateDB();
								this.hasEatFlag = true;
								this.currentIndex++;
							} else if (res.cancel) {
								return;
							}
						}
					})
				} else {
					uni.showToast({
						title: "您已经吃过药了",
						icon: "none"
					})
				}
				// this.$refs.popup.close(); //吃药完成关闭
			},
			//获取用户设置
			async getUserSetting() {
				const res = await uniCloud.callFunction({
					name: "get_user_setting",
					data: {
						openid: this.$store.state.userInfo.userInfo.openid,
					}
				})
				this.userSetting = res.result.data;
				this.userSettingMorning = getAllMinutes(this.userSetting.morningTime);
				this.userSettingNoon = getAllMinutes(this.userSetting.noonTime);
				this.userSettingNight = getAllMinutes(this.userSetting.nightTime);
				// console.log(this.userSettingMorning)
				// console.log(this.userSettingNoon)
				// console.log(this.userSettingNight)
			},
			// 处理当前时间获取该时间段要吃的药
			getTimeAndTransform() {
				const date = new Date();
				const hour = date.getHours();
				const minute = date.getMinutes();
				const nowMinutes = hour * 60 + minute;
				if (nowMinutes > this.userSettingNight) {
					// 在晚饭到24点
					this.nearTime = 24 * 60 - nowMinutes + this.userSettingMorning;
					this.nearText = "距离第二天早上吃药还有";
					this.currenData = [...this.data.pearRecord];
				} else if (nowMinutes > this.userSettingNoon) {
					// 在中午和夜晚之间
					// console.log("下午");
					this.nearTime = this.userSettingNight - nowMinutes;
					this.nearText = "距离晚上吃药还有";
					this.currenData = this.data.pearRecord.filter(item => item.drugDayEatCount >= 2)
				} else if (nowMinutes > this.userSettingMorning) {
					// 在早上和中午之间
					// console.log("上午")
					this.nearTime = this.userSettingNoon - nowMinutes;
					this.nearText = "距离中午吃药还有";
					this.currenData = this.data.pearRecord.filter(item => item.drugDayEatCount === 3)
				} else {
					// 在早上之前
					// console.log("凌晨")
					this.nearTime = this.userSettingMorning - nowMinutes;
					this.nearText = "距离早上吃药还有";
					this.currenData = [...this.data.pearRecord];
				}
				// console.log(this.nearTime)
			},
			// 获取所有药品剩余
			getAllLeftoverDrugNumber() {
				for (let i = 0; i < this.data.pearRecord.length; i++) {
					this.drugLfetNumber.push(computerLeftoverDrug(this.data.pearRecord[i])); //得到剩余的药品数量
					this.drugShow.push(formateDrug(this.data.pearRecord[i], computerLeftoverDrug(this.data.pearRecord[i])))
				}
			},
			// 关闭预览
			onHandleClose() {
				this.$refs.popup.close(); //吃药完成关闭
			},
			// 更新数据库
			async updateDB() {
				let tempData = {};
				tempData.openid = this.data.openid;
				tempData.name = this.data.name;
				tempData.createDate = this.data.createDate;
				tempData.avatar = this.data.avatar;
				tempData.is_overdue = this.data.is_overdue;
				tempData.pearRecord = this.data.pearRecord
				tempData.description = this.data.description;
				tempData.pearRecord.forEach(item => {
					let flag = false;
					let i = 0;
					for (i = 0; i < this.currenData.length; i++) {
						if (this.currenData[i].pearId === item.pearId) {
							flag = true;
							break;
						}
					}
					if (flag) {
						// 今天吃过药了更新数据
						tempData.pearRecord[i].successEat += 1;
					}
				})
				const res = await uniCloud.callFunction({
					name: "update_record",
					data: {
						id: this.data._id,
						data: tempData
					}
				})

				// console.log(res)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "./DailyData.less";
</style>
