/**
 * 
 * @param {Object} obj 包含药品的基本信息，每次服药次数，总量
 */
export  function computerLeftoverDrug(obj){
	// 每次吃药的数量和单位
	const pearCount = obj.drugPearCount.count;
	// const pearUnit = obj.drugPearCount.unit;
	
	// 所有药品的数量和单位
	const allCount = obj.drugAllCount.count;//多少大包装
	// const allUnit = obj.drugAllCount.unit;
	const oneCount = obj.drugAllCount.pearCount;//每个小包装的量
	// const oneUnit = obj.drugAllCount.pearUnit
	
	const number = obj.successEat;
	let allCounts = allCount * oneCount;//总药品的数量
	let lastCount = allCounts - pearCount * number;
	return lastCount;
}

/**
 * 根据剩余量得到包装数
 * @param {Object} obj 
 * @param {NUmber} number 
 */
export function formateDrug(obj,number){
	// 每次吃药的数量和单位
	const pearCount = obj.drugPearCount.count;
	// const pearUnit = obj.drugPearCount.unit;
	
	// 所有药品的数量和单位
	const allCount = obj.drugAllCount.count;//多少大包装
	const allUnit = obj.drugAllCount.unit;
	const oneCount = obj.drugAllCount.pearCount;//每个小包装的量
	const oneUnit = obj.drugAllCount.pearUnit
	
	const big = Math.floor(number /oneCount);
	const small = number % oneCount;
	if(big === 0 && oneCount ===0){
		return `无剩余`
	}else if(big === 0){
		return `${small}${oneUnit}`;
	}else if(small === 0){
		return `${big}${allUnit}整`
	}else{
		return `${big}${allUnit} ${small}${oneUnit}`
	}
}