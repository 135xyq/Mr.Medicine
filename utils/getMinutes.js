/**
 * 传入一个 12:00 输出这是一天中的第多少分钟
 * @param {*} str 
 */
export default function getMinutes(str){
	const temp = str.split(":");
	let hour = +temp[0];
	let minute = +temp[1];
	return hour * 60 + minute;
}