'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	// 问题反馈
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		userId,
		feedbackImageList,
		content
	} = event
	const feedback = db.collection("feedback");
	feedback.add({
		user_id:userId,
		feedbackImageList,
		content
	})
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:'反馈成功！'
		}
	}
};
