<template>
	<view class="daily-data-container">
		<button @click="open">打开弹窗</button>
		<uni-popup ref="popup" :mask-click="true" background-color="#fff" class="popup-container">
			<swiper class="swiper" ref="swiper" :disable-touch="true"  :current="currentIndex">
				<swiper-item v-for="(item,index) in data.pearRecord" :key="item.pearid" @touchmove.stop>
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
						<button type="primary" class="previous" size="mini" @click="onHandleChangePrevious" v-if="currentIndex !== 0">上一张</button>
						<button type="primary" size="mini" @click="onHandleChangeNext" v-if="currentIndex !== data.pearRecord.length - 1">下一张</button>
						<button type="primary" size="mini" @click="onHandleCompleteEatDrug" v-if="currentIndex ===data.pearRecord.length - 1">完成吃药</button>
					</view>
				</swiper-item>
			</swiper>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "DailyData",
		props: ["data"],
		data() {
			return {
				currentIndex:0,//轮播图的当前下标
				hasEat:[],//已经吃过的药品下标
			};
		},
		created() {
			// console.log(this.data)
		},
		methods: {
			open() {
				this.$refs.popup.open('center')
			},
			// 下一个药品
			onHandleChangeNext(){
				if(this.currentIndex !== this.data.pearRecord.length - 1){
					if(!this.hasEat.includes(this.currentIndex)){
						this.hasEat.push(this.currentIndex);
					}
					// 最后一张
					this.currentIndex++;
				}else{
					return;
				}
			},
			// 上一个药品
			onHandleChangePrevious(){
				if(this.currentIndex !== 0){
					this.currentIndex--;
				}else{
					return;
				}
			},
			// 完成吃药
			onHandleCompleteEatDrug(){
				this.hasEat.push(this.currentIndex);
				this.$refs.popup.close();//吃药完成关闭
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "./DailyData.less";
</style>
