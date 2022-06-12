<template>
	<uni-card :border="false" class="card-container" :title="data.name" :extra="formatDate(data.createDate)"
		@click="onHandleShowDrawer">
		<view class="img">
			<img slot="cover" class="image" :src="data.avatar" alt="">
		</view>
		<view class="description">
			<text class="title">描述信息：</text> {{data.description}}
		</view>
		<view class="card-info">
			<text class="title">药品种类：</text>{{data.pearRecord.length}} 种
		</view>
		<view class="buttons">
			<button class="delete-button" type="default" size="mini" @click="onHandleDetele">
				<text>删除</text>
			</button>
			<button class="apply-button" type="primary" size="mini" @click="onHandleApply">
				<text>应用</text>
			</button>
		</view>
		<view class="drawer">
			<uni-drawer ref="showDrawer" mode="right" :mask-click="true" width="350">
				<scroll-view style="height: 100%;" scroll-y="true">
					<ShowRecordDetail :data="data"></ShowRecordDetail>
					<view class="buttons">
						<button class="btn-cancel" type="default" size="mini" @click="onHandleCloseDrawer">取消</button>
						<button type="primary" size="mini" @click="onHandleEdit">确定</button>
					</view>
				</scroll-view>
			</uni-drawer>
		</view>

	</uni-card>
</template>

<script>
	import formatDate from "@/utils/formateDate.js";
	import ShowRecordDetail from "@/components/ShowRecordDetail/ShowRecordDetail.vue";
	export default {
		components: {
			ShowRecordDetail,
		},
		name: "RecordTemplate",
		props: ['data'],
		data() {
			return {

			};
		},
		methods: {
			formatDate,
			// 删除一个模板
			onHandleDetele() {
				uni.showModal({
					title: "提示",
					content: "确定删除这个模板",
					success: (res) => {
						if (res.confirm) {
							this.$emit("deleteTemplate", this.data._id);
						} else if (res.cancel) {
							uni.showToast({
								title: "取消删除",
								icon: "none"
							})
							this.$refs.showDrawer.close();
						}
					}
				})

			},
			//应用模板
			onHandleApply() {
				uni.showModal({
					title: "提示",
					content: "直接应用此模板会覆盖原有的计划",
					success: (res) => {
						if (res.confirm) {
							this.$emit("applyTemplate", this.data._id);
							this.$refs.showDrawer.close();
						} else if (res.cancel) {
							uni.showToast({
								title: "取消应用",
								icon: "none"
							})
						}
					}
				})
			},
			// 显示详细信息
			onHandleShowDrawer() {
				this.$refs.showDrawer.open()
			},
			// 关闭
			onHandleCloseDrawer() {
				this.$refs.showDrawer.close()
			},
			// 修改模板
			onHandleEdit() {
				uni.showToast({
					title: "功能待完善",
					icon: "none"
				})
			}
		}
	}
</script>

<style scoped lang="less">
	@import "./RecordTemplate.less";
</style>
