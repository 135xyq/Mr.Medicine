'use strict';
/**
 * 新增并且应用一个记录
 * @param {*} event 
 * @param {*} context 
 */

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {openid,data} = event;
	const res1 = await db.collection("record").where({
		openid,
		is_overdue:false
	}).get();
	
	if(res1.data.length > 0){
		// 已经存在记录,先结束
		await db.collection("record").doc(res1.data[0]._id).update({
			is_overdue:true,
		})
	}
	
	const res = await db.collection("record").add(data);
	// console.log(res);
	//返回数据给客户端
	return{
		code:0,
		msg:"应用成功！",
		data:{
			id:res.id
		}
	}
};
