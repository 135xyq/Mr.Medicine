<template>
	<view class="content">
			<view>
		        <camera device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera>
		        <button type="primary" @click="takePhoto">拍照</button>
		        <view>预览</view>
		        <image mode="widthFix" :src="src"></image>
		    </view>
	</view>
</template>

<script>
	export default {
	    data() {
	        return {
	            src:""
	        }
	    },
	    methods: {
	         takePhoto() {
	            const ctx = uni.createCameraContext();
	            ctx.takePhoto({
	                quality: 'high',
	                success: (res) => {
	                    this.src = res.tempImagePath
	                }
	            });
	        },
	        error(e) {
	            console.log(e.detail);
	        }
	    }
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
