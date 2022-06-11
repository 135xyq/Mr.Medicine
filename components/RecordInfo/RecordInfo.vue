<template>
	<view class="record-info-container">
		<view class="name">
			<text class="name-text">记录名称</text>
			<uni-easyinput class="name-input" trim="all" v-model="dataInfo.name" focus placeholder="请输入记录的名称">
			</uni-easyinput>
		</view>
		<view class="img">
			<text class="img-text">记录封面</text>
			<view class="image-box" v-if="!dataInfo.avatar" @click="addImg">
				<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
			</view>
			<view class="image-box" v-if="dataInfo.avatar">
				<view class="close-icon" @click="delImage">
					<uni-icons class="icon" type="closeempty" size="16" color="#fff"></uni-icons>
				</view>
				<image class="image" :src="dataInfo.avatar"></image>
			</view>
		</view>
		<view class="create-time">
			<text class="create-time-text">创建时间</text>
			{{formateDate(dataInfo.createDate)}}
		</view>
		<view class="descrption">
			<text class="descrption-text">记录描述</text>
			<uni-easyinput class="descrption-content" type="textarea" autoHeight v-model="dataInfo.description" placeholder="请输入记录的描述或备注">
			</uni-easyinput>
			</uni-section>
		</view>
	</view>
</template>

<script>
	import formateDate from "@/utils/formateDate.js"
	export default {
		name: "RecordInfo",
		props: ["data"],
		data() {
			return {
				dataInfo: {
					avatar: this.data.avatar || "",
					name: this.data.name || "",
					createDate: this.data.createDate || new Date().getTime(),
					description: this.data.description || ""
				}
			};
		},
		methods: {
			formateDate,
			// 返回修改的内容
			getRecordInfoData() {
				return this.dataInfo;
			},
			// 删除图片
			delImage() {
				this.dataInfo.avatar = "";
			},
			// 新增一个图片
			addImg() {
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						if (res.tempFilePaths.length > 0) {
							let url = res.tempFiles[0].path;
							const result = await uniCloud.uploadFile({
								filePath: url,
								cloudPath: (new Date().getTime() + (Math.floor(Math.random() * 100000 +
										10000))
									.toString(16)) + url.substr(url.lastIndexOf('.')),
							});
							this.dataInfo.avatar = result.filePath;
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.record-info-container {
		.name {
			margin: 20px 20px;
			height: 80rpx;
			line-height: 80rpx;

			.name-text {
				float: left;
				margin-right: 30rpx;
			}

			.name-input {
				float: left;
				width: 70%;
			}
		}

		.img {
			margin: 20px 20px;
			height: 100px;
			width: 100%;

			.img-text {
				line-height: 100px;
				float: left;
				margin-right: 20px;
			}
		}

		.create-time {
			margin: 20px;
			.create-time-text{
				margin-right: 20px;
			}
		}

		.image-box {
			border: 1px solid #eee;
			border-radius: 10rpx;
			width: 100px;
			height: 100px;
			text-align: center;
			line-height: 100px;
			position: relative;
			float: left;
		}

		.image {
			width: 100px;
			height: 100px;
			object-fit: cover;
		}

		.drug-avatar {
			height: 100px;
			// width: 100px;
		}
		
		.close-icon {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			border-radius: 50%;
			z-index: 2;
			right: -6px;
			top: -6px;
			background-color: #ccc;

			.icon {
				position: absolute;
				top: -40px;
				height: 0px;
				right: 2px;
			}
		}
		.descrption{
			margin: 20px;
			.descrption-text{
				float: left;
				margin-right: 20px;
			}
			.descrption-content{
				float: left;
				width: 70%;
			}
			&::after{
				content: "";
				display: block;
				clear: both;
			}
		}
	}
</style>
