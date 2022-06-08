'use strict';
// 保存用户设置
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		openid,
		phoneNumber,
		weixin,
		morningTime,
		noonTime,
		nightTime
	} = event;
	const res = await db.collection("userSetting").where({
		openid,
	}).get();
	if (res.data.length === 0) {
		// 无数据
		const res = await db.collection("userSetting").add({
		openid,
		phoneNumber,
		weixin,
		morningTime,
		noonTime,
		nightTime
		});
	}else{
		const res = await db.collection("userSetting").where({
			openid,
		}).update({
			phoneNumber,
			weixin,
			morningTime,
			noonTime,
			nightTime
		});
	}

	//返回数据给客户端
	return {
		code:0,
		msg:'更新成功',
		data:{}
	}
};
