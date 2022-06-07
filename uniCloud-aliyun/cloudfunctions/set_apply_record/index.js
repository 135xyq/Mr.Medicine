'use strict';
/**
 * 应用一个record
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {user_openid,newid} = event;
	const collection = db.collection("record");
	// 先将原来的结束
	// 在替换新的
	const res = await collection.where({
		user_openid,
		is_overdue:false
	}).get();
	// 如果已经有开始的记录，则关闭
	if(res.data.length > 0){
		// console.log(res.data[0]._id)
		await collection.doc(res.data[0]._id).update({
			is_overdue:true,
		})
	}
	const result = await collection.doc(newid).update({
		is_overdue:false
	})
	
	// console.log(result)
	
	
	//返回数据给客户端
	return{
		code:0,
		msg:"应用成功",
		data:{}
	}
};
