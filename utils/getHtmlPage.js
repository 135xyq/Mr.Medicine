export default function (){
	const imgs = document.querySelectorAll("#yaopintupian img");
	const lists = document.querySelectorAll("#main_content .smsli")
	let imgUrl = "";
	
	if(imgs.length > 0){
		imgUrl = imgs[0].getAttribute("src");
	}
	
	let dataList = [];
	
	lists.forEach(item=>{
		const temp = item.innerHTML.split("】");
		let title = temp[0].split('【')[1];
		let content = temp[1];
		dataList.push({
			title,
			content
		})
	})
	return {
		imgUrl,
		dataList
	}
}