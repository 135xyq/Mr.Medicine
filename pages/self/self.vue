<template>
	<view>
		<!-- 未登录显示微信登录 -->
		<view class="wx-login" v-if="!userLogin">
			<image :src="userInfo.avatar" class="unlogin-user-avatar"></image>
			<button type="primary" @click="wxLogin" class="login-button">微信登录</button>

		</view>
		<!-- 登录完成 -->
		<view class="wx-logined" v-if="userLogin">
			<!-- 头部个人信息 -->
			<view class="header">
				<uni-row class="header-info">
					<uni-col :span="7" class="user-item">
						<image :src="userInfo.avatar" class="login-user-avatar" mode="aspectFit"></image>
					</uni-col>
					<uni-col :span="12" class="user-item">
						<view class="nick-name">
							{{userInfo.nickName}}
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="content">
				<!-- 历史记录 -->
				<view class="history item" @click="onHandleToHistory">
					<uni-icons custom-prefix="iconfont" type="icon-lishi" size="25"></uni-icons>
					<view class="select-item">历史记录</view>
					<uni-icons type="forward" color="#939188" size="20" class="load-to-page"></uni-icons>
				</view>
				<!-- 问题反馈 -->
				<view class="chat item" @click="onHandleToFeedback">
					<uni-icons custom-prefix="iconfont" type="icon-fankui" size="25"></uni-icons>
					<!-- <uni-icons type="gear" size="25"></uni-icons> -->
					<view class="select-item chat-item">问题反馈</view>
					<uni-icons type="forward" color="#939188" size="20" class="load-to-page"></uni-icons>
					
				</view>
				<!-- 剩余药品-->
				<view class="chat item" @click="onHandleToLeft">
					<uni-icons  type="map" size="25"></uni-icons>
					<!-- <uni-icons type="gear" size="25"></uni-icons> -->
					<view class="select-item chat-item">剩余药品</view>
					<uni-icons type="forward" color="#939188" size="20" class="load-to-page"></uni-icons>
					
				</view>
				<!-- 设置 -->
				<view class="set item" @click="onHandleToSet">
					<uni-icons type="gear" size="25"></uni-icons>
					<view class="select-item set-item">设置</view>
					<uni-icons type="forward" color="#939188" size="20" class="load-to-page"></uni-icons>
				</view>
			</view>
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
											uni.showToast({
												title: '登录成功',
												icon: 'success',
												duration: 2000
											});
											// 修改仓库的用户信息
											this.$store.dispatch(
												"userInfo/updateUserInfo", res
												.result.data);
											// 修改登录状态
											this.userLogin = true;
											// 获取用户信息
											// 获取登录用户信息
											this.userInfo.nickName = this.$store
												.state.userInfo.userInfo.nickName;
											this.userInfo.avatar = this.$store
												.state.userInfo.userInfo.avatarUrl;
											this.userInfo.openid = this.$store
												.state.userInfo.userInfo.openid;
											// 直接转去设置
											uni.showModal({
												title:"提示",
												content:"请完成基本设置",
												success: (res) => {
													if(res.confirm){
														uni.navigateTo({
															url:"/pages/setting/setting"
														})
													}else if(res.cancel){
														uni.showToast({
															title:"请完成个人设置",
															icon:"error"
														})
													}
												}
											})
										}
									})
									this.avatar = res.rawData.avatarUrl; //登录成功给出新的头像
								},
								fail: res => {
									// console.log(res);
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
				
				// const res = await uniCloud.callFunction({
				// 	name: 'getOpenId',
				// 	data: {
				// 		code,
				// 	}
				// });
				// console.log(res)
				const temp = "1dd92382dbe76240929007795b89005e";
				const temp1 = "wxf600daae2dc114e6"
				uni.request({
					url: `https://api.weixin.qq.com/sns/jscode2session?appid=${temp1}&secret=${temp}&js_code=${code}&grant_type=authorization_code`,
					method: "GET"
				}).then(res => {
					this.openId = res[1].data.openid
				})
			}, 
			// 跳转到历史记录
			onHandleToHistory() {
				uni.navigateTo({
					url: '/pages/hsitoryPage/hsitoryPage',
				})
			},
			// 跳转到问题反馈
			onHandleToFeedback(){
				uni.navigateTo({
					url: '/pages/feedback/feedback',
				})
			},
			// 跳转到设置页
			onHandleToSet(){
				uni.navigateTo({
					url: '/pages/setting/setting',
				})
			},
			// 跳转到剩余药品数量
			onHandleToLeft(){
				uni.navigateTo({
					url: '/pages/leftDrugs/leftDrugs',
				})
			}
		}
	}
</script>

<style scoped lang="less">
	@import "@/static/iconfont.css";
	@import "./self.less";
</style>
