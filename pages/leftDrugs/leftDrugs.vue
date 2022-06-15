<template>
	<view class="left-drug-container">
		<view class="no-record" v-if="!data._id">
			没有正在吃药的记录
			<navigator url="/pages/index/index" open-type="switchTab" class="btn">新增一个记录</navigator>
		</view>
		<view class="has-record" v-if="data._id">
			<ul class="show-conatainer">
				<li v-for="(item,index) in data.pearRecord" :key="item.pearId" class="show-item">
					<text class="drug-show-name"
						:class="{'litter-number':drugLeftNumber[index] <= item.drugPearCount.count}">{{item.drugName}}</text>
					<text class="drug-show-count"
						:class="{'litter-number':drugLeftNumber[index] <= item.drugPearCount.count}">{{drugShow[index]}}</text>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import {
		computerLeftoverDrug,
		formateDrug
	} from "@/utils/computerLftoverDrugs.js";
	export default {
		data() {
			return {
				data: {},
				drugShow: [],
				drugLeftNumber: [],
			};
		},
		async created() {
			// await this.getCurrentRecord();
			// this.getAllLeftoverDrugNumber();

			// console.log(this.data)
			// console.log(this.drugShow)
			// console.log(this.drugLeftNumber)
		},
		methods: {
			getAllLeftoverDrugNumber() {
				for (let i = 0; i < this.data.pearRecord.length; i++) {
					this.drugLeftNumber.push(computerLeftoverDrug(this.data.pearRecord[i])); //得到剩余的药品数量
					this.drugShow.push(formateDrug(this.data.pearRecord[i], computerLeftoverDrug(this.data.pearRecord[i])))
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
					this.data = res.result.data[0];
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.btn{
		height: 30px;
		background-color: green;
		color: #fff;
		line-height: 30px;
		padding: 2px 10px;
		width: 200rpx;
		border-radius: 10px;
		margin-top: 20px;
	}
	.show-conatainer {
		margin: 10px 0;

		.show-item {
			height: 30px;
			line-height: 30px;
			margin: 0 30px;

			&::after {
				content: "";
				display: block;
				clear: both;
			}
		}

		.drug-show-name {
			float: left;
		}

		.drug-show-count {
			float: right;
		}

		.litter-number {
			color: red;
		}
	}
</style>
