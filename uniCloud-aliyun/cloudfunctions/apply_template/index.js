'use strict';
/**
 * 应用一个模板
 */

const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {id,openid} = event;
	// 将正在进行的记录结束
	const res = await db.collection("record").where({
		openid,
		is_overdue:false
	}).get();
	
	if(res.data.length > 0){
		await db.collection("record").doc(res.data[0]._id).update({
			is_overdue:true,
		})
	}
	
	// 将模板中的数据添加到记录表中
	const res1 = await db.collection("template").doc(id).get();
	const {
		name,
		avatar,
		createDate,
		is_overdue,
		pearRecord,
		successEat,
		description
	} = res1.data[0];
	// console.log(res1.data[0],openid)
	const res2 = await db.collection("record").add({
		openid,
		name,
		avatar,
		createDate,
		is_overdue:false,
		pearRecord,
		successEat,
		description
	})
	//返回数据给客户端
	return {
		code:0,
		msg:"应用成功",
		data:{
			id:res2.id
		}
	}
};
