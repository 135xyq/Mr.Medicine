<template>
	<view class="drug-info-search-container">
		<view class="not-found-data" v-if="isNotFound">
			抱歉！没有找到与 <text style="color: #ff0000;">{{data}}</text> 相关的药品，请检查输入！
		</view>
		<view class="found-data" v-if="!isNotFound">
			<view class="tips">
				与 <text style="color: #ff0000;">{{data}}</text>有关的数据如下：
			</view>
			<ul class="data-container">
				<li class="data-item"  v-for="(item,index) in searchList" :key="index" :class="{'bg':index % 2==0}"
				>
					<navigator
					class="url-to"
						:url="'/pages/drug_user_info/drug_user_info?data=' + JSON.stringify(item)">
						{{index+1}} . {{item.name}}
					</navigator>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import getSearchDataArray from "@/utils/getSearchDataArray.js";
	export default {
		data() {
			return {
				data: '',
				searchList: [], //搜索数据列表
				isNotFound: false, //没有找到数据
			};
		},
		onLoad(e) {
			this.data = e.k;
			this.getSearchData(this.data);
		},
		methods: {
			getSearchData(data) {
				uni.request({
					url: "https://www.yaopinnet.com/tools/load/sms_load.asp",
					data: {
						k: data
					},
					success: (res) => {
						if (res.data.includes("没有找到")) {
							// 找不到药品
							this.isNotFound = true;
							// console.log("no")
						} else {
							this.searchList = getSearchDataArray(res.data);
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
@import "./drugInfoSearch.less";
</style>
