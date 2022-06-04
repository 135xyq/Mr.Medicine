<template>
	<view>
		<!-- 未登录显示微信登录 -->
		<view class="wx-login" v-if="!userLogin">
			<image :src="userInfo.avatar" class="unlogin-user-avatar"></image>
			<button type="primary" @click="wxLogin" class="login-button">微信登录</button>
			
		</view>
		<!-- 显示用户头像 -->
		<view class="header">
		</view>
	</view>
</template>


<script>
	import avatarUrl from "../../static/img/default_avatar.jpg";
	export default {
		data() {
			return {
				openId: '', //唯一标识
				userLogin: false, //用户是否登录
				userInfo: {
					avatar: avatarUrl
				}, //用户信息
			}
		},
		created() {
			if (this.$store.state.userInfo.userInfo != null) {
				// 已经登录
				this.userLogin = true;
				// 获取登录用户信息
				this.userInfo.nickName = this.$store.state.userInfo.userInfo.nickName;
				this.userInfo.avatar = this.$store.state.userInfo.userInfo.avatarUrl;
				this.userInfo.openid = this.$store.state.userInfo.userInfo.openid;
				console.log(this.userInfo)
			}

		},
		methods: {
			// 获取code
			getCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: "weixin",
						success: (e) => {
							resolve(e)
						},
						fail: (err) => {
							reject(new Error("获取code失败"))
						}
					})
				})
			},
			async wxLogin() {
				const {
					code
				} = await this.getCode();
				uni.showModal({
					title: '温馨提示',
					content: '授权微信登录后才能正常使用小程序功能',
					success: (res) => {
						//如果用户点击了确定按钮
						if (res.confirm) {
							uni.getUserProfile({
								desc: '获取你的昵称、头像',
								success: res => {
									res.rawData = JSON.parse(res.rawData); //将字符串转为对象
									uniCloud.callFunction({
										name: "user_login",
										data: {
											...res.rawData,
											...({
												openid: this.openId
											})
										},
										success: (res) => {
											// 修改仓库的用户信息
											this.$store.dispatch(
												"userInfo/updateUserInfo", res
												.result.data);
											// 修改登录状态
											this.userLogin = true;
											// 获取用户信息
											// 获取登录用户信息
											this.userInfo.nickName = this.$store.state.userInfo.userInfo.nickName;
											this.userInfo.avatar = this.$store.state.userInfo.userInfo.avatarUrl;
											this.userInfo.openid = this.$store.state.userInfo.userInfo.openid;
										}
									})
									this.avatar = res.rawData.avatarUrl; //登录成功给出新的头像
								},
								fail: res => {
									console.log(res);
									//拒绝授权
									uni.showToast({
										title: '拒绝授权',
										icon: 'error',
										duration: 2000
									});
									return;
								}
							});
						} else if (res.cancel) {
							//如果用户点击了取消按钮
							uni.showToast({
								title: '您拒绝了授权',
								icon: 'error',
								duration: 2000
							});
							return;
						}
					}
				})
				uni.request({
					url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxf600daae2dc114e6&secret=1dd92382dbe76240929007795b89005e&js_code=${code}&grant_type=authorization_code`,
					method: "GET"
				}).then(res => {
					this.openId = res[1].data.openid
				})
			}
			,
		}
	}
</script>

<style>
	.wx-login{
		width:100%;
		position: relative;
	}
	.unlogin-user-avatar{
		width: 300rpx;
		height: 300rpx;
		border-radius: 50%;
		position: absolute;
		top: 30rpx;
		left: calc(50% - 150rpx);
	}
	.login-button{
		width:70vw;
		font-size: 20px;
		position: absolute;
		top: 400rpx;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
