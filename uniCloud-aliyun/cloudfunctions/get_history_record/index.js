'use strict';
/**
 * 获取历史记录
 */

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {openid} = event;
	const res = await db.collection("record").where({
		openid,
		is_overdue:true,
	}).orderBy("createDate", "desc").get();
	//返回数据给客户端
	return {
		code:0,
		data:res.data,
	}
};
