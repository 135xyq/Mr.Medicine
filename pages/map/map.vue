<template>
	<view>
		<view class="page-section page-section-gap">
			<map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers">
			</map>
		</view>
	</view>
</template>

<script>
	import imgUrl from "@/static/img/location.png"
	export default {
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
					latitude: 27.88326871610071,
					longitude: 112.86443710327148, 
				covers: [{
					latitude: 27.88326871610071,
					longitude: 112.86443710327148, 
					iconPath: imgUrl
				}]
			}
		}
	}
</script>

<style lang="less">

</style>
