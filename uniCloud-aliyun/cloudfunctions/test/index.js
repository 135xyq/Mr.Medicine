'use strict';
exports.main = async (event, context) => {
	const {code} = event;
	return await uni.request({
		url:`https://api.weixin.qq.com/sns/jscode2session?appid=wxf600daae2dc114e6&secret=1dd92382dbe76240929007795b89005e&js_code=${code}&grant_type=authorization_code`,
		method:"GET"
	});
};
