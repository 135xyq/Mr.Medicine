<template>
	<view class="drug-user-info-container">
		<view class="" v-html="htmlStr">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				htmlStr:""
			};
		},
		async onLoad(options) {
			this.url = options.url;
			const res = await uni.request({
				url:this.url
			})
			// console.log(res[1].data)
			// 内容
			const contentReg = /\<li class="smsli"\>.*<\/li>/g;
			const content = res[1].data.match(contentReg)
			// console.log(temp[0])
			// 图片地址
			const imgReg = /\<div id="yaopintupian"\>.*\<\/div\>/;
			const imgUrl = res[1].data.match(imgReg)
			// console.log(imgUrl[0])
			this.htmlStr = imgUrl[0] + content[0]
			
		}
	}
</script>

<style lang="less">
@import "./drug_user_info.less";

// .drug-user-info-container{
// 	width: 100%;
// 	margin-top: 20px;
// }
// .smsli{
// 	// color: red;
// 	list-style: none;
// 	margin: 20px 10px;
// }

// #yaopintupian{
// 	border: 1px solid red;
// 	width: 100%;
// 	img{
// 		margin:0 20px;
// 	}
// }
</style>
