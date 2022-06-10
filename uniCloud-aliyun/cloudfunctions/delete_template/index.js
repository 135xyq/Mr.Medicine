'use strict';
/**
 * 删除一个模板
 */

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {id} = event;
	const res = await db.collection("template").doc(id).remove();
	//返回数据给客户端
	return {
		code:0,
		msg:"删除成功",
		data:null
	}
};
