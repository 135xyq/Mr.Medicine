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
		// console.log(temp[i].match(reg))
		let tempUrl = temp[i].match(reg)[0].replaceAll("'",'');
		tempUrl = temp[i].match(reg)[0].replaceAll('"','');
		let obj = {
			url:"https://www.yaopinnet.com/" +tempUrl,
			name:temp[i].split('>')[1],
			isImg:false
		}
		if(tempUrl.includes('.jpg')){
			// 是图片
			obj.url = "https://www.yaopinnet.com/tools/" +tempUrl;
			obj.isImg = true;
		}

		result.push(obj)
	}
	return result;
}