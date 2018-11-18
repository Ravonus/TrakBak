const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const CircularJSON = require('circular-json');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget =  util.promisify(client.hget);
client.hset =  util.promisify(client.hset);
const CronJob = require('cron').CronJob;
const exec = mongoose.Query.prototype.exec;




  // client.hgetall('crons', (err, data) => {
  //   console.log(data);
  // });
  client.hgetall('crons', (err, crons) => {
 
    if(crons) {
    Object.keys(crons).forEach( (cron) => {


      //console.log(cron, JSON.parse(crons[cron]));
      var obj = JSON.parse(JSON.parse(crons[cron]));
      console.log(obj)
      new CronJob(obj.cronTime, obj.onTick, obj.onComplete, obj.start, obj.timezone, obj.context, obj.runOnInit, obj.unrefTimeout);
      console.log(obj)
    //new CronJob(obj);



      
    })

  }

    
  })
  



mongoose.Query.prototype.cache = function(cache, id) {
  this.clientID = id;
  if(cache){
  this.useCache = true;
  
//  console.log('THISSS', this.clientID);
  }

  return this;
}

mongoose.Query.prototype.exec = async function() {
  if(!this.useCache) {
    return exec.apply(this, arguments)
  }


 const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // see if we have a vlaue for 'key' in redis.

  
  const cacheValue = await client.hget(JSON.stringify(this.clientID).replace(/"/g,''), key);

    // If we do, return that.
    

    if (cacheValue) {
     
     

      const doc =  JSON.parse(cacheValue);

  
      return Array.isArray(doc) 
      ? doc.map(d => new this.model(d) )
      : new this.model(doc);
    }

    

  // if (cacheValue) {


  //   const doc =  JSON.parse(cacheValue);

  //  // this.model
  // //  this.model = doc;

  //   await doc.map((d, index) => {
      
   
  //   new this.model(d)

  //   if(doc.map.length === index) {
     
  //    return this
      
    
  //   }


   
  // });


   
  // //return exec.apply(this, arguments)
  // return Array.isArray(doc) 
  // ? doc.map(d => {
  //   console.log(this.model(d))
  //   new this.model(d)}
  // )
  // : new this.model(doc);

  // }

  // Otherwise, issue the query and store the result in redis.



  const result = await exec.apply(this, arguments);

  client.hset(JSON.stringify(this.clientID).replace(/"/g,''), key, JSON.stringify(result));

  createCron(this.clientID + key, {timezone:'America/Denver' , runTime:new Date(Date.now()+12000), runOnInit:false, fireOnce: true, type: { name:'clearCache', id:this.clientID, key:key } });

  return result;
}

module.exports = {
  clearHash(hashKey) {
    var string = JSON.stringify(hashKey).replace(/\"/g,"");
    client.del(string);

  },
  clearKey(id, key) {
    client.hdel(JSON.stringify(id).replace(/"/g,''), key);
  },
  saveCrons(cron) {
    if(cron){
      console.log(cron)
    client.hset('crons', Date.now().toString(), JSON.stringify(cron));
    }
  }
};