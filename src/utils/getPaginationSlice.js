
/**
 * @param {Number} page
 * @param {Number} limit
 * @returns {Number[]} 
 */
export default (page,limit)=>{
  if(!page) return [0,limit]
  var start =  parseInt((page - 1) * limit);
  var end = parseInt(page * limit);
  return [start,end]
}
