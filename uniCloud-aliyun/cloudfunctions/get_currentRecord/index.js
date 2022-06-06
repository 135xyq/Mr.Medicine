'use strict';
/**
 * 获取正在进行的吃药记录
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {openid} = event;
	const collection = db.collection("record");
	const records = await collection.where({
		user_openid:openid,
		is_overdue:false
	}).get();
	//返回数据给客户端
	return {
		code:0,
		data:records.data
	}
};
