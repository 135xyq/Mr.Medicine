<template>
	<view class="history-detail-container">
		<ShowRecordDetail :data="data"></ShowRecordDetail>
		<view class="btns">
			<button type="default" size="mini" @click="onHandleSaveAsTemplate" class="save-template btn">保存为模板</button>
			<button type="primary" size="mini" @click="onHandleApply" class="save-apply btn">应用</button>
		</view>
	</view> 

</template>

<script>
	import ShowRecordDetail from "@/components/ShowRecord/ShowRecord.vue"
	export default {
		data() {
			return {
				data: {}, //历史记录的详细数据			
			};
		},
		onLoad(data) {
			this.getHsitoryDetail(data.id);
		},
		methods: {
			async getHsitoryDetail(id) {
				uni.showLoading({
					title: "正在获取数据"
				})
				const res = await uniCloud.callFunction({
					name: "get_one_record",
					data: {
						id,
					}
				})

				this.data = res.result.data;
				uni.hideLoading();
			},
			// 将当前历史记录保存为模板
			async onHandleSaveAsTemplate(){
				// console.log(this.data)
				// this.data.createDate = new Date().getTime();
				const tempData = {
					name:this.data.name,
					avatar:this.data.avatar,
					description:this.data.description,
					is_overdue:true,
					openid:this.data.openid,
					pearRecord:this.data.pearRecord,
					successEat:0,
					createDate:new Date().getTime(),
				}
				const res = await uniCloud.callFunction({
					name:"set_template",
					data:{
						...tempData
					}
				})
				
				uni.showToast({
					title:res.result.msg
				})
				
				setTimeout(()=>{
					uni.switchTab({
						url:"/pages/index/index"
					})
				},1000)
			},
			// 将当前历史记录直接应用
			async onHandleApply(){
				// 获取数据
				const tempData = {
					name:this.data.name,
					avatar:this.data.avatar,
					description:this.data.description,
					is_overdue:false,
					openid:this.data.openid,
					pearRecord:this.data.pearRecord,
					successEat:0,
					createDate:new Date().getTime(),
				}
				
				const res = await uniCloud.callFunction({
					name:"apply_record",
					data:{
						openid:this.data.openid,
						data:{
							...tempData
						}
					}
				})
				
				uni.showModal({
					title:"提示",
					content:"此操作将会结束当前的吃药状态",
					success: (res) => {
						if(res.confirm){
							uni.showToast({
								title:"应用成功"
							})
							
							setTimeout(()=>{
								uni.switchTab({
									url:"/pages/index/index"
								})
							},1000)
						}else if(res.cancel){
							uni.showToast({
								title:"取消应用",
								icon:"none"
							})
						}
					}
				})

				
			}
		}
	}
</script>

<style lang="less" scoped>
@import "./historyDetail.less";
</style>
