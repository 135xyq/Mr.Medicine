<template>
	<view>
		<view class="header">
			<image :src="avatar" :mode="scaleToFill" class="user-avatar"></image>
		</view>
		<button type="default" @click="wxLogin">登录获取</button>
	</view>
</template>


<script>
	import avatarUrl from "../../static/img/default_avatar.jpg";
	export default {
		data() {
			return {
				avatar: avatarUrl, //头像
				a: '1'
			}
		},
		methods: {
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
				wx.showModal({
					title: '温馨提示',
					content: '授权微信登录后才能正常使用小程序功能',
					success: (res) => {
						//如果用户点击了确定按钮
						if (res.confirm) {
							wx.getUserProfile({
								desc: '获取你的昵称、头像、地区及性别',
								success: res => {
									res.rawData = JSON.parse(res.rawData);//将字符串转为对象
									this.avatar = res.rawData.avatarUrl;//登录成功给出新的头像
								},
								fail: res => {
									console.log(res)
									//拒绝授权
									wx.showToast({
										title: '您拒绝了请求,不能正常使用小程序',
										icon: 'error',
										duration: 2000
									});
									return;
								}
							});
						} else if (res.cancel) {
							//如果用户点击了取消按钮
							wx.showToast({
								title: '您拒绝了请求,不能正常使用小程序',
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
					console.log(res);
				})
			}
		}
	}
</script>
