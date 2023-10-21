

export const hash = "cache2f027d3876074885926e54b72c77df70"

const getMinuteExtend = minute =>{
  return new Date(Date.now() + (1000*60*minute))
}

export const clearCache = () =>{
  window.localStorage.removeItem(hash)
}


/**
 * 
 * @param {Object} args
 * @param {String} args.key
 * @param {String} args.url
 * @param {Object} args.params
 * @returns {Object|Boolean}
 */
export const loader =  ({key,url,params}={params:{}})=>{
  const store = JSON.parse(window.localStorage.getItem(hash))
  if(!store){
    return false
  }
  
  let result = store[key]
  
  if(Date(result.expiringDate) > Date.now()&&result.url==url&&JSON.stringify(result.params)==JSON.stringify(params)){
    return data
  }else{
    return false
  }
  
}

/**
 * 
 * @param {Object} args
 * @param {String} args.key
 * @param {String} args.url
 * @param {Object} args.params
 * @param {Object} args.data
 * @param {Date} args.expiringDate
 * @returns 
 */
export const setter = ({key,data,url,params,expiringDate}={expiringDate:getMinuteExtend(10),params:{}}) =>{
  let store = JSON.parse(window.localStorage.getItem(hash))
  if(!store){
    store = {}
  }
  store = {...store,[key]:{data,url,expiringDate,params}}
  window.localStorage.setItem(hash,JSON.stringify(store))
}
