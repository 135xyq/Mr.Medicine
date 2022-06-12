'use strict';
/**
 * 根据ID获取记录
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {id} = event
	const res = await db.collection("record").doc(id).get();
	// console.log(res)
	//返回数据给客户端
	return {
		code:0,
		msg:"",
		data:res.data[0]
	}
};
