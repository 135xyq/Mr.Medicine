<template>
	<view class="content">
		<view class="test">
			<RecordCard ref="test1"></RecordCard>
			<RecordCard ref="test2"></RecordCard>
		</view>
		<button type="default" @click="getData">获取</button>
	</view>
</template>

<script>
	import RecordCard from "@/components/RecordCard.vue"
	export default {
		components: {
			RecordCard
		},
		data() {
			return {
				src: ""
			}
		},
		mounted(){
			// console.log(this.$refs.test1.getRecordCardData())
		},
		methods: {
			getData(){
				console.log(this.$refs.test1.getRecordCardData())
				console.log(this.$refs.test2.getRecordCardData())
			}
		}
	}
</script>

<style>
	.test{
		width: 100%;
	}
</style>
