import React from 'react';
import axios from 'axios';




class Channel{
  constructor(axios){
    this.axios = axios
  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.params
   * @returns {Promise}
   */
  list(args={params:{}}){
    const {params} = args
    return this.axios.get('/api/channels/',{
      params
    })

  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.params
   * @returns {Promise}
   */
  listModels(args={params:{}}){
    const {params} = args
    return this.axios.get('/api/channels/models/',{
      params
    })
  }

  /**
   * 
   * @param {Object} args
   * @param {Number} args.id - discord channel id
   * @returns {Promise}
   */
  retrieve(args){
    const {id} = args
    return this.axios.get('/api/channels/'+id+"/")
  }


  /**
   * 
   * @param {Object} args
   * @param {Object} args.data
   * @param {String} args.data.server - server id
   * @param {String} args.data.name - channel name
   * @param {String} args.data.topic - topic of the channel
   * @param {String[]} args.data.product_ids - list of product ids
   * @returns {Promise}
   */
  create(args){
    const {data} = args
    
    return this.axios({
      method:'post',
      url:'/api/channels/',
      data:{
        name:"No name",
        topic:"",
        ...data
      }
    })
  }

  /**
   * 
   * @param {Object} args 
   * @param {Number} args.id - discord channel database id
   * @returns {Promise}
   */
  delete(args){
    const {id} = args
    return this.axios.delete("/api/channels/"+id+"/")

  }

  /**
   * 
   * @param {Object} args 
   * @param {Number} args.id - discord channel database id
   * @returns {Promise}
   */
  deleteModel(args){
    const {id} = args
    return this.axios.delete("/api/channels/models/"+id+"/")

  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.data
   * @param {Number[]} args.data.ids
   * @returns {Promise}
   */
  deleteModelList(args){
    const {data} = args
    return this.axios({
      method:'delete',
      url:"/api/channels/models/",
      data
    })
   }

}



/**
 * subscription class
 */

class Subscription{
  constructor(axios){
    this.axios = axios
  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.params
   * @param {String} args.params.starting_after - subscription id
   * @param {String} args.params.ending_before - subscription id
   * @param {String} args.params.limit - 
   * @returns {Promise}
   */
  list(args={params:{}}){
    const {params} = args
    return this.axios.get("/api/subscriptions/",{
      params
    })

  }
}





class Chart{
  constructor(axios){
    this.axios = axios
  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.data
   * @param {String} args.data.name
   * @param {String} args.data.url
   * @param {String[]} args.data.product_ids
   * @returns {Promise}
   */
  create(args){
    const {data} = args
    return this.axios({
      method:'post',
      url:"/api/charts/",
      data
    })
  }


  /**
   * 
   * @param {Object} args
   * @param {Object} args.parmas
   * @returns {Promise}
   */
  list(args={params:{}}){
    const {params} = args
    return this.axios.get("/api/charts/",{
      params
    })
  }
  /**
   * 
   * @param {Object} args
   * @param {Object} args.parmas
   * @returns {Promise}
   */
  listChartResult(args={params:{}}){
    const {params} = args
    return this.axios.get("/api/charts/task/list/",{
      params
    })
  }


  /**
   * 
   * @param {Object} args
   * @param {Number} args.id
   * @returns {Promise}
   */
  delete(args){
    const {id} = args
    return this.axios.delete("/api/charts/"+id+"/")
  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.data
   * @param {Number[]} args.data.ids
   * @returns {Promise}
   */
  deleteList(args){
    const {data} = args
    return this.axios({
      method:'delete',
      url:"/api/charts/",
      data
    })
  }


}




class Subscribers{
  constructor(axios){
    this.axios = axios
  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.params
   * @returns {Promise}
   */
  list(args={params:{}}){
    const {params} = args
    
    return this.axios.get("/api/stripeusers/",{
      params
    })
  }


  /**
   * 
   * @param {Object} args
   * @param {Object} args.id
   * @returns {Promise}
   */
  retrieve(args){
    const {id} = args
    return this.axios.get("/api/stripeusers/"+id+"/")
  }


  

  /**
   * 
   * @param {Object} args
   * @param {Number} args.id
   * @param {Object} args.data
   * @param {String} [args.data.tradingview_username]
   * @returns {Promise}
   */
  update(args){
    const {data,id} = args
    return this.axios({
      method:'put',
      url:"/api/stripeusers/"+id+'/',
      data
    })
  }

  /**
   * 
   * @param {Object} args
   * @param {Number} args.id
   * @returns {Promise}
   */
  delete(args){
    const {id} = args
    return this.axios.delete("/api/stripeusers/"+id+"/")
  }

  

  
}


class Webhook{
  constructor(axios){
    this.axios = axios
  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.params
   * @returns {Promise}
   */
  list(args={params:{}}){
    const {params} = args
    
    return this.axios.get("/api/webhooks/",{
      params
    })
  }


  /**
   * 
   * @param {Object} args
   * @param {Object} args.id
   * @returns {Promise}
   */
  retrieve(args){
    const {id} = args
    return this.axios.get("/api/webhooks/"+id+"/")
  }


  /**
   * 
   * @param {Object} args
   * @param {String} args.channel
   * @param {String} args.name
   * @param {String} [args.reason]
   * @returns {Reponse}
   */
  create(args){
    const {data} = args
    return this.axios({
      url:"/api/webhooks/",
      method:'post',
      data
    })
  }


  /**
   * 
   * @param {Object} args
   * @param {Number} args.id
   * @param {Object} args.data
   * @param {String} args.data.name
   * @param {String} args.data.reason
   * @returns {Promise}
   */
  update(args){
    const {data,id} = args
    return this.axios({
      method:'put',
      url:"/api/webhooks/"+id+'/',
      data
    })
  }

  /**
   * 
   * @param {Object} args
   * @param {Number} args.id
   * @returns {Promise}
   */
  delete(args){
    const {id} = args
    return this.axios.delete("/api/webhooks/"+id+"/")
  }

  

  
}


class Server{
  constructor(axios){
    this.axios = axios
  }

  /**
   * 
   * @param {Object} args
   * @param {Object} args.parmas
   * @returns {Promise}
   */
  list(args={params:{}}){
    const {params} = args
    return this.axios.get("/api/guilds/",{
      params
    })
  }
}


class Task{
  constructor(axios){
    this.axios = axios
  }

  /**
   * 
   * @returns {Promise}
   */
  list(){
    return this.axios.get("/api/tasks/")
  }


  /**
   * 
   * @param {Object} args
   * @param {String} args.type
   * @returns {Promise}
   */
  perform(args){
    const {type} = args
    return this.axios({
      url:"/api/tasks/",
      method:'post',
      data:{
        type
      }
    })
  }


  /**
   * 
   * @param {Object} args
   * @param {String} args.id
   * @returns {Promise}
   */
  result(args){
    const {id} = args
    return this.axios.get(`/api/tasks/${id}/`)
  }



}



class Product{
  constructor(axios){
    this.axios = axios
  }


  /**
   * 
   * @param {Object} args
   * @param {Object} args.params
   * @param {Number} args.params.limit
   * @param {String} args.params.starting_after
   * @returns {Promise}
   */
  list(args={params:{}}){
    const {params} = args
    return this.axios.get("/api/products/",{
      params
    })
  }
}


class Auth{
  constructor(axios){
    this.axios = axios
  }


  
  /**
   * 
   * @param {Object} args
   * @param {Object} args.data
   * @param {String} args.data.email
   * @param {String} args.data.password
   * @returns {Promise}
   */
  login(args={}){
    const {data} = args
    var config = {
      method: 'post',
      url: '/api/auth/login/',
      data 
    };
    return this.axios(config)
  }
}








class Sdk{
  constructor(){
    this.source = axios.CancelToken.source();

    let headers;

    const token = localStorage.getItem("token")

    if(token){
      headers = {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${token}`
      }
    }else{
      headers = {
        "Content-Type": "application/json"
      }
    }

  this.axios = axios.create({
    // baseURL: 'https://some-domain.com/api/',
    timeout: 30000,
    headers,
    cancelToken: this.source.token
  });


  this.Channel = new Channel(this.axios)
  this.Subscription = new Subscription(this.axios)
  this.Chart = new Chart(this.axios)
  this.Webhook = new Webhook(this.axios)
  this.Server = new Server(this.axios)
  this.Task = new Task(this.axios)
  this.Product = new Product(this.axios)
  this.Auth = new Auth(this.axios)
  this.Subscribers = new Subscribers(this.axios)
  }


  abort(message="request has been cancel"){
    this.source.cancel(message)
  }

}


export default (props)=>{
  return new Sdk()
}
