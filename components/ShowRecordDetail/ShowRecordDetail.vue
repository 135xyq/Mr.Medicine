<template>
	<view>
		<view class="template-title">
			<RecordInfo :data="templateInfo"></RecordInfo>
		</view>
		<view class="" v-for="(item,index) in data.pearRecord" :key="index">
			<RecordCard :parentData="item"></RecordCard>
		</view>
	</view>
</template>

<script>
	import RecordCard from "../RecordCard.vue";
	import RecordInfo from "../RecordInfo/RecordInfo.vue"
	export default {
		name:"ShowRecordDetail",
		props:["data"],
		components:{
			RecordCard,
			RecordInfo
		},
		data() {
			return {
			};
		},
		computed:{
			templateInfo(){
				return{
					name:this.data.name,
					avatar:this.data.avatar,
					createDate:this.data.createDate,
					description:this.data.description
				}
			}
		}
		// created() {
		// 	console.log(this.data)
		// }
	}
</script>

<style>

</style>
