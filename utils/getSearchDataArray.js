export default function getSearchDataArray(str){
	const temp = str.split("</li>");
	let result = []
	// console.log(temp)
	temp.pop();
	for(let i = 0 ; i < temp.length; i++){
		temp[i] = temp[i].substring(4).split('</a>')[0]
	}
	
	const reg = /["'].*?["']/;
	for(let i = 0 ; i < temp.length;i++){
		let tempUrl = temp[i].match(reg)[0];
		// console.log(tempUrl)
		let obj = {
			url:tempUrl,
			name:temp[i].split('>')[1],
			isImg:false
		}
		if(!tempUrl.includes('.htm')){
			// 是图片
			let temp = tempUrl.split("?id=")[1];
			// console.log(temp.substring(temp.length-1))
			obj.url = temp.substring(0,temp.length-1);
			obj.isImg = true;
		}

		result.push(obj)
	}
	return result;
}