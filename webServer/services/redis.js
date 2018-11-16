const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget =  util.promisify(client.hget);


const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(cache) {
  if(cache){
  this.useCache = true;
  }

  return this;
}

mongoose.Query.prototype.exec = async function() {
  if(!this.useCache) {
    console.log('da fucc uhhhry');
    return exec.apply(this, arguments)
  }


 const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // see if we have a vlaue for 'key' in redis.


  const cacheValue = await client.hget(this.clientID, key);
  
  console.log(cacheValue);

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

  console.log('it breaks here');

  const result = await exec.apply(this, arguments);


  console.log(JSON.stringify(result), 'diz resultz');
  client.hset(this.clientID, key, JSON.stringify(result), 'EX', 10);

  console.log('Dat fool', key);
  return result;
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};