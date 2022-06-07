<template>
	<view>
		<button type="default" @click="test">qwq</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			test(){
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>
