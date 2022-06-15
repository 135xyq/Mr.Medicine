<template>
	<view>
		<view class="page-section page-section-gap">
			<map style="width: 100%; height: 250px;" @markertap="onHandleClickMarker" :show-compass="true"
				:latitude="latitude" :longitude="longitude" :markers="covers" :polyline="polyline">
			</map>
		</view>
		<view class="path-container">
			<view class="" v-if="!flag">
				当前位置：{{originPlace}}
			</view>
			<scroll-view class="path" :scroll-y="true" v-if="flag">
				<view class="path-to">
					推荐路线：{{originPlace}} -> {{destinationPlace}}
				</view>
				<uni-segmented-control :current="current" :values="items" @clickItem="onHandleChangeItem" styleType="button"
					activeColor="#4cd964" ></uni-segmented-control>
				<view class="content">
					<view v-show="current === 0">
						<view class="all-path">
							全程 {{driverLength}}米
						</view>
						<uni-steps :options="driverPath" active-color="#007AFF" :active="0" direction="column" />
					</view>
					<view v-show="current === 1">
						<view class="all-path">
							全程 {{walkLength}}米
						</view>
						<uni-steps :options="walkPath" active-color="#007AFF" :active="0" direction="column" />
					</view>
					<view v-show="current === 2">
						<view class="all-path">
							全程 {{transitLength}}米
						</view>
						<uni-steps :options="transitPath" active-color="#007AFF" :active="0" direction="column" />
					</view>
				</view>

			</scroll-view>
		</view>
	</view>
</template>

<script>
	import amap from '@/common/amap-wx.130.js';
	const no_active = "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-404cc126-4e0d-4ba0-88d9-e41250c47983/25ac1dc8-c757-4843-967b-9fbf4542ee28.png";
	const active = "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-404cc126-4e0d-4ba0-88d9-e41250c47983/41531d20-b890-46d6-815e-b177b2d59f3d.png"
	export default {
		data() {
			return {
				id: 0,//选中的marker的id
				title: 'map',
				latitude: 27.88326871610071,
				longitude: 112.86443710327148,
				covers: [],
				amapPlugin: null,
				key: 'cc10c660b8c2c382bf12b4e7278e1447',
				addressName: '',
				items: ['驾车', '步行', '骑行'],
				current: 0, //当前选择的出行方式
				driverPath: [], //驾车路线
				walkPath: [], //步行路线
				transitPath: [], //公交路线
				originPlace: "", //起始地点
				destinationPlace: "", //目标地点
				flag: false, //是否选择了路线
				driverLength: 0,
				walkLength: 0,
				transitLength: 0,
				polyline: [], //路线

			}
		},
		onLoad() {
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});

			this.getPoiAroundgetPoiAround();
		},
		methods: {
			getPoiAroundgetPoiAround() {
				uni.showLoading({
					title: '获取信息中'
				});
				this.amapPlugin.getPoiAround({
					querykeywords: "医院",
					sortrule: "weight",
					success: (data) => {
						// console.log(data)
						this.getRegeo();
						this.covers.push(...data.markers);
						this.covers.forEach(item => {
							if (!item.iconPath) {
								item.iconPath = no_active
								item.title = item.name
								item.height = 30;
								item.width = 30;
								item.callout = {
									color: '#000',
									content: item.name,
									fontSize: 12,
									borderRadius: 5,
									bgColor: '#ffffff',
									padding: 5,
									textAlign: 'center',
									display: "ALWAYS"

								}
							}
						})
						uni.hideLoading();
						// console.log(this.covers)
					},
				});
			},
			// 获取当前位置
			getRegeo() {
				this.amapPlugin.getRegeo({
					success: (data) => {
						// console.log(data)
						let temp = {};
						temp.height = 30;
						temp.width = 30;
						temp.iconPath = active;
						temp.id = -1;
						temp.latitude = data[0].latitude;
						temp.longitude = data[0].longitude;
						temp.title = data[0].name;
						this.latitude = data[0].latitude;
						this.longitude = data[0].longitude;
						this.originPlace = data[0].name;
						this.covers.push(temp);
					},
					fail(res) {
						// console.log(res)
					}
				})
			},
			//点击标记点
			onHandleClickMarker(res) {
				let id = res.detail.markerId;
				if (id === -1) {
					// 当前位置
					return;
				} else {
					this.current = 0;
					this.id = res.detail.markerId;
					this.driverPath = [];
					this.walkPath = [];
					this.transitPath = [];
					this.flag = true;
					let temp = this.covers[id].name;
					this.destinationPlace = temp;
					let origin = `${this.longitude},${this.latitude}`;
					let destination = `${this.covers[id].longitude},${this.covers[id].latitude}`;
					// 驾车
					this.amapPlugin.getDrivingRoute({
						origin,
						destination,
						success: (res) => {
							// console.log(res)
							this.driverLength = res.paths[0].distance;
							res.paths[0].steps.forEach(item => {
								let temp = {
									title: item.instruction,
								}
								this.driverPath.push(temp)
							})
							let points = [];
							for (let i = 0; i < res.paths[0].steps.length; i++) {
								let poLen = res.paths[0].steps[i].polyline.split(';');
								for (let j = 0; j < poLen.length; j++) {
									points.push({
										longitude: parseFloat(poLen[j].split(',')[0]),
										latitude: parseFloat(poLen[j].split(',')[1])
									})
								}
							}
							this.polyline = [{
								points: points,
								color: "#0091ff",
								width: 5
							}]
							// console.log(this.polyline)
						}
					})
					// // 步行
					// this.amapPlugin.getWalkingRoute({
					// 	origin,
					// 	destination,
					// 	success: (res) => {
					// 		this.walkLength = res.paths[0].distance;
					// 		res.paths[0].steps.forEach(item => {
					// 			let temp = {
					// 				title: item.instruction,
					// 			}
					// 			this.walkPath.push(temp)
					// 		})
					// 	}
					// })
					// 骑行
					// this.amapPlugin.getRidingRoute({
					// 	origin,
					// 	destination,
					// 	success: (res) => {
					// 		this.transitLength = res.paths[0].distance;
					// 		res.paths[0].rides.forEach(item => {
					// 			let temp = {
					// 				title: item.instruction,
					// 			}
					// 			this.transitPath.push(temp)
					// 		})
					// 	},
					// 	fail(res) {
					// 		console.log(res)
					// 	}
					// })
				}


			},
			// 更改选项卡
			onHandleChangeItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
					let origin = `${this.longitude},${this.latitude}`;
					let destination = `${this.covers[this.id].longitude},${this.covers[this.id].latitude}`;
					if(this.current === 1){
						// 步行
						this.amapPlugin.getWalkingRoute({
							origin,
							destination,
							success: (res) => {
								this.walkLength = res.paths[0].distance;
								res.paths[0].steps.forEach(item => {
									let temp = {
										title: item.instruction,
									}
									this.walkPath.push(temp)
								})
								let points = [];
								for (let i = 0; i < res.paths[0].steps.length; i++) {
									let poLen = res.paths[0].steps[i].polyline.split(';');
									for (let j = 0; j < poLen.length; j++) {
										points.push({
											longitude: parseFloat(poLen[j].split(',')[0]),
											latitude: parseFloat(poLen[j].split(',')[1])
										})
									}
								}
								this.polyline = [{
									points: points,
									color: "#0091ff",
									width: 5
								}]
							}
						})
					}else if(this.current === 2){
						this.amapPlugin.getRidingRoute({
							origin,
							destination,
							success: (res) => {
								this.transitLength = res.paths[0].distance;
								res.paths[0].rides.forEach(item => {
									let temp = {
										title: item.instruction,
									}
									this.transitPath.push(temp)
								})
								let points = [];
								for (let i = 0; i < res.paths[0].rides.length; i++) {
									let poLen = res.paths[0].rides[i].polyline.split(';');
									for (let j = 0; j < poLen.length; j++) {
										points.push({
											longitude: parseFloat(poLen[j].split(',')[0]),
											latitude: parseFloat(poLen[j].split(',')[1])
										})
									}
								}
								this.polyline = [{
									points: points,
									color: "#0091ff",
									width: 5
								}]
							},
							fail(res) {
								console.log(res)
							}
						})
					}
				}
			}

		}
	}
</script>

<style lang="less" scoped>
	@import "./map.less";
</style>
