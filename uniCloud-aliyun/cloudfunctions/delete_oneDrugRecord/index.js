'use strict';
/**
 * 删除一个药品的记录
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {_id,newData} = event;
	console.log('event : ', event)
	let res = await db.collection("record").doc(_id).update({
		pearRecord:newData,
	});
	//返回数据给客户端
	return {
		code:0,
		msg:'删除成功！',
		data:{}
	}
};
