'use strict';
/**
 * 创建一个模板
 */

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		openid,
		name,
		avatar,
		createDate,
		is_overdue,
		pearRecord,
		successEat,
		description
	} = event;
	console.log('event : ', event)
	const res = await db.collection("template").add({
		openid,
		name,
		avatar,
		createDate,
		is_overdue,
		pearRecord,
		successEat,
		description
	});
	console.log(res)
	//返回数据给客户端
	return {
		code:0,
		msg:"新增模板成功",
		data:{
			id:res.id
		}
	}
};
