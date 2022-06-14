<template>
	<view class="drug-user-info-container">
		<view  class="show-only-img" v-if="isImg">
			<image class="img" :src="showImgUrl" mode="widthFix"></image>
		</view>
		<view class="show-detail">
			<view class="" v-html="htmlStr">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				htmlStr: "",
				isImg: false,
				imgUrl: '',
				showImgUrl:'',//展示的图片
			};
		},
		async onLoad(options) {
			let temp = null;
			if(options.data){
				temp = JSON.parse(options.data);
			}else{
				temp = options
			}
			if (temp.name) {
				// 说明是搜索传递的数据
				if (temp.isImg) {
					// 数据是图片
					this.isImg = true;
					this.imgUrl = "https://www.yaopinnet.com/tools/yaopinshuomingshu.asp?id=" + temp.url;
					const res = await uni.request({
						url: this.imgUrl
					})

					const imgReg = /\<img .*?>/g;
					let content = res[1].data.match(imgReg)[1];
					content = content.match(/["'].*?["']/)[0];
					content = content.slice(1,content.length-1);
					this.showImgUrl = "https://www.yaopinnet.com/" +content
				}else{
					let tempUrl = temp.url.slice(1,temp.url.length-1);
					const res = await uni.request({
						url: 'https://www.yaopinnet.com/' + tempUrl
					})
					const contentReg = /\<li class="smsli"\>.*<\/li>/g;
					const content = res[1].data.match(contentReg)
					// console.log(temp[0])
					// 图片地址
					const imgReg = /\<div id="yaopintupian"\>.*\<\/div\>/;
					const imgUrl = res[1].data.match(imgReg)
					// console.log(imgUrl[0])
					this.htmlStr = imgUrl[0] + content[0]
					// console.log(this.htmlStr)
				}
			}else{
				const res = await uni.request({
					url: temp.url
				})
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
