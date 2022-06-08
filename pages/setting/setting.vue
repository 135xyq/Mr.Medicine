<template>
	<view class="setting-container">
		<view class="form-container">
			<view class="item" label-width="150">
				<text class="title">紧急联系人</text>
				<uni-easyinput trim="both" class="phone" type="text" v-model="formData.phoneNumber" name="phone"
					placeholder="请输入手机号" />
			</view>
			<view class="item">
				<text class="title">微信亲情号</text>
				<uni-easyinput trim="both"  type="text" class="wx" v-model="formData.weixin" placeholder="请输入要发送信息的微信号" />
			</view>
			<view class="item">
				<text class="title">早上吃药时间</text>
				<picker mode="time" :value="formData.morningTime" start="05:01" end="10:01"
					@change="onHandleMorningTime">
					<view class="picker-title">{{formData.morningTime}}</view>
				</picker>
			</view>
			<view class="item">
				<text class="title">中午吃药时间</text>
				<picker mode="time" :value="formData.noonTime" start="10:01" end="14:01" @change="onHandleNoonTime">
					<view class="picker-title">{{formData.noonTime}}</view>
				</picker>
			</view>
			<view class="item">
				<text class="title">晚上吃药时间</text>
				<picker mode="time" :value="formData.nightTime" start="15:01" end="23:59" @change="onHandleNightTime">
					<view class="picker-title">{{formData.nightTime}}</view>
				</picker>
			</view>

		</view>
		<view class="buttons">
			<button @click="onHandleSubmit" type="primary" size="mini">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					phoneNumber: "",
					weixin: "",
					morningTime: "08:00",
					noonTime: "12:00",
					nightTime: "18:00"
				},
			};
		},
		created(){
			this.getUserSetting();
		},
		methods: {
			// 修改早上时间
			onHandleMorningTime(e) {
				this.formData.morningTime = e.detail.value;
			},
			// 修改中午时间
			onHandleNoonTime(e) {
				this.formData.noonTime = e.detail.value;
				console.log(this.formData.noonTime)
			},
			//修改晚上时间
			onHandleNightTime(e) {
				this.formData.nightTime = e.detail.value;
				console.log(this.formData.nightTime)
			},
			// 获取用户数据
			async getUserSetting(){
				const res = await uniCloud.callFunction({
					name:"get_user_setting",
					data:{
						openid:this.$store.state.userInfo.userInfo.openid
					}
				})
				
				if(res.result.data){
					this.formData.phoneNumber = res.result.data.phoneNumber;
					this.formData.weixin =  res.result.data.weixin;
					this.formData.morningTime =  res.result.data.morningTime;
					this.formData.noonTime =  res.result.data.noonTime;
					this.formData.nightTime =  res.result.data.nightTime;
				}
			},
			// 修改信息
			async onHandleSubmit(){
				if(this.formData.phoneNumber==="" || this.formData.weixin===""){
					uni.showToast({
						title:"请填写完整",
						icon:"none"
					})
					return;
				}
				const res = await uniCloud.callFunction({
					name:'set_user_setting',
					data:{
						openid:this.$store.state.userInfo.userInfo.openid,
						...this.formData
					}
				})
				uni.showToast({
					title:res.result.msg
				})
				
				setTimeout(()=>{
					uni.navigateBack();
				},1000)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "./setting.less";
</style>
