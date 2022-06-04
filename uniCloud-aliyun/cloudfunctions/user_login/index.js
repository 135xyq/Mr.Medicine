'use strict';
const db = uniCloud.database(); //代码块为cdb
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("user");
	const userInfo = await collection.where({
		openid:event.openid
	}).get();
	if(userInfo.affectedDocs===0){
		// 第一次登录，将用户存入用户表
		collection.add(event);
	}
	//返回数据给客户端
	return {
		code:0,
		mag:'登录成功！',
		data:event,
	}
};
