// 路由拦截器

uni.addInterceptor("switchTab",{
	invoke(e) {
		console.log(23)
		if(e.url === "/pages/index/index" && !uni.getStorageSync("userNnfo")){
			console.log(1)
			return false
		}
	}
})