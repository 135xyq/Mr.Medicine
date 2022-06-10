'use strict';
/**
 * 修改记录信息
 */

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {id,data} = event;
	const res = await db.collection("record").doc(id).update(data);
	//返回数据给客户端
	return{
		code:0,
		msg:'修改成功',
		data:null,
	}
};
