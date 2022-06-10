'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	// 新增一个吃药记录
	//event为客户端上传的参数
	const {
		openid,
		name,
		createDate,
		avatar,
		is_overdue,
		pearRecord,
		successEat,
		description
	} = event;
	
	const  res = await db.collection("record").add({
		openid,
		name,
		createDate,
		avatar,
		is_overdue,
		pearRecord,
		successEat,
		description
	})
	//返回数据给客户端
	return {
		code:0,
		msg:"保存成功",
		data:{
			id:res.id
		}
	}
};
