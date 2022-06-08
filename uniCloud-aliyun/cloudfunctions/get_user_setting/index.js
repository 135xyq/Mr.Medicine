'use strict';
// 获取用户设置
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {openid} = event;
	const res = await db.collection("userSetting").get();
	//返回数据给客户端
	if(res.data.length > 0){
		return {
			code:0,
			data:res.data[0]
		}
	}else{
		return{
			code:0,
			data:null
		}
	}
};
