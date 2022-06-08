'use strict';
/**
 * 获取模板记录
 */

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event);
	const collection = db.collection("record");
	const {user_openid} = event
	const res =  await collection.where({
		user_openid,
		is_template:true
	}).get()
	// console.log(res)
	//返回数据给客户端
	return {
		code:0,
		data:res.data
	}
};
