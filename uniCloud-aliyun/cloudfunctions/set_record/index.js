'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	// 新增一个吃药记录
	//event为客户端上传的参数
	const {
		user_openid,
		createDate,
		is_overdue,
		pearRecord,
	} = event;
	
	db.collection("record").add({
		user_openid,
		createDate,
		is_overdue,
		pearRecord,
	})
	//返回数据给客户端
	return {
		code:0,
		data:{
			mag:'保存成功！'
		}
	}
};
