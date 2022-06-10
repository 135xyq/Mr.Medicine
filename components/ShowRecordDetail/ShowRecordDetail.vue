<template>
	<view>
		<view class="" v-for="(item,index) in data.pearRecord" :key="index">
			<RecordCard :parentData="item"></RecordCard>
		</view>
	</view>
</template>

<script>
	import RecordCard from "../RecordCard.vue"
	export default {
		name:"ShowRecordDetail",
		props:["data"],
		components:{
			RecordCard,
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
