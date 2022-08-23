'use strict';

const got = require('got')
cloud.init()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {code} = event;
	const temp = "1dd92382dbe76240929007795b89005e";
	const temp1 = "wxf600daae2dc114e6"
	const res = await got(`https://api.weixin.qq.com/sns/jscode2session?
	appid=${temp1}&secret=${temp}&js_code=${code}&grant_type=authorization_code`,)
	console.log(1231243,res)
	//返回数据给客户端
	return{
		code:0,
		data:res
	}
};
