'use strict';
/**
 * 修改编辑当前药品信息
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);
	const {id,recordData} = event;
	const collection = db.collection("record");
	const res = await collection.doc(id).update({
		pearRecord:recordData
	});
	// console.log(res)
	//返回数据给客户端
	return {
		code:0,
		msg:'更新成功！',
		data:{}
	}
};
