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
				templateInfo:{}
			};
		},
		watch:{
			"data":function(newData,oldData){
				this.templateInfo.name=newData.name,
				this.templateInfo.avatar=newData.avatar,
				this.templateInfo.createDate=newData.createDate,
				this.templateInfo.description=newData.description
			}
		}
	}
</script>

<style>

</style>
