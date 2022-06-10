'use strict';
/**
 * 获取用户模板信息
 */

const db  = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {openid} = event;
	const res = await db.collection("template").where({
		openid
	}).get();
	
	//返回数据给客户端
	return {
		code:0,
		msg:"",
		data:res.data
	}
};
