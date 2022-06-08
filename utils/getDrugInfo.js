const list1 = document.querySelectorAll("#c_list1 ul li a");
const list2 = document.querySelectorAll("#c_list1 ul li a");
const data = [];
list1.forEach(item=>{
	const temp = {};
	temp.name = item.innerHTML;
	temp.url = "https://www.yaopinnet.com" + item.getAttribute("href");
	data.push(temp)
})

list2.forEach(item=>{
	const temp = {};
	temp.name = item.innerHTML;
	temp.url = "https://www.yaopinnet.com" + item.getAttribute("href");
	data.push(temp)
})
console.log(JSON.stringify(data))

