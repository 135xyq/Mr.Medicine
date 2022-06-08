<template>
	<uni-card class="card-container" :extra="'创建日期:' + formatDate(data.createDate)">
		<view class="buttons">
			<button class="delete-button" type="default" size="mini" @click="onHandleDetele">
				<text>删除</text>
			</button>
			<button class="apply-button" type="primary" size="mini" @click="onHandleApply">
				<text>应用</text>
			</button>
		</view>
		<view class="card-info">
			药品种类：{{data.pearRecord.length}} 种
		</view>
	</uni-card>
</template>

<script>
	import formatDate from "@/utils/formateDate.js";
	export default {
		name: "RecordTemplate",
		props: ['data'],
		data() {
			return {

			};
		},
		methods:{
			formatDate,
			// 删除一个模板
			onHandleDetele(){
				uni.showModal({
					title:"提示",
					content:"确定删除这个模板",
					success: (res) => {
						if(res.confirm){
							this.$emit("deleteTemplate",this.data._id);
						}else if(res.cancel){
							uni.showToast({
								title:"取消删除",
								icon:"none"
							})
						}
					}
				})
				
			},
			//应用模板
			onHandleApply(){
				uni.showModal({
					title:"提示",
					content:"直接应用此模板会覆盖原有的计划",
					success: (res) => {
						if(res.confirm){
							this.$emit("applyTemplate",this.data._id);
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

<style scoped lang="less">
	@import "./RecordTemplate.less";
</style>
