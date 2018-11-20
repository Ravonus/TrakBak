const mongoose = require('mongoose');
config = require('../../config/config'),
  redis = require('redis'),
  util = require('util'),
  client = redis.createClient(config.redis),
  CronJob = require('cron').CronJob,
  exec = mongoose.Query.prototype.exec,
  moment = require('moment');

client.hget = util.promisify(client.hget);
client.hset = util.promisify(client.hset);


// client.hgetall('crons', (err, data) => {
//   console.log(data);
// });





mongoose.Query.prototype.cache = function (cache, id) {
  console.log('DIZ ID', id)
  this.clientID = id;
  if (cache) {
    this.useCache = true;

    //  console.log('THISSS', this.clientID);
  }

  return this;
}

mongoose.Query.prototype.exec = async function () {

  if (!this.useCache) {
    return exec.apply(this, arguments)
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // see if we have a vlaue for 'key' in redis.

  const cacheValue = await client.hget(JSON.stringify(this.clientID).replace(/"/g, ''), key);

  if (this.schema && this.schema.obj) {
    var populate = '';
    var model = this;

    Object.keys(this.schema.obj).forEach(function (key) {

      var val = model.schema.obj[key];

      if (typeof val === 'object' && val[0] && val[0].ref) {

        populate += ` ${val[0].ref.toLowerCase()}`

      }
    });

  }

  // If we do, return that.

  if (cacheValue && JSON.parse(cacheValue).length > 0) {

    // console.log(crons[this.clientID + key]);
    var cron = crons[this.clientID + key];

    if (cron) {
      var time = moment(moment(cron.cronTime.source).format()).unix() * 1000;
      if (time > Date.now()) {
        var compare = Date.now() + 3000;

        const CronTime = require('cron').CronTime;
        var time = new CronTime(new Date(compare));

        crons[this.clientID + key].setTime(time);
        crons[this.clientID + key].start();

      } else {
        crons[this.clientID + key].stop();
        delete crons[this.clientID + key];
      }
      const doc = JSON.parse(cacheValue);

      

      if(doc.length > 0) {
     var array = doc.map(d => {
        d.cached = true;
        model = new this.model(d)
        model = model.toObject();
        model.groups = d.groups;
        return Object.assign(model,{cached:true})
      })
    }

      console.log('ARRAY', array)
      return array
    
      
   //   mongoose._doc ? mongoose._doc: mongoose

   //   return doc;
    }
  }

  const result = await exec.apply(this, arguments);
;

  client.hset(JSON.stringify(this.clientID).replace(/"/g, ''), key, JSON.stringify(result));
  

  createCron(this.clientID + key, { timezone: 'America/Denver', runTime: new Date(Date.now() + 6000), runOnInit: false, fireOnce: true, type: { name: 'clearCache', id: this.clientID, key: key } });

  return result;
}

module.exports = {
  clearHash(hashKey) {
    var string = JSON.stringify(hashKey).replace(/\"/g, "");
    client.del(string);

  },
  clearKey(id, key) {

    client.hdel(JSON.stringify(id).replace(/"/g, ''), key, (err, data) => {
      console.log(err);
    });
  },
  saveCrons(cron) {

    if (cron) {

      console.log(cron, 'diz be cron');
      client.hset('crons', Date.now().toString(), JSON.stringify(cron));
    }
  },
  restoreCrons: () => {

    client.hgetall('crons', (err, crons) => {

      if (crons) {
        Object.keys(crons).forEach((cron) => {

          //   console.log('diz be cron', JSON.parse(cronss[cron]))
          cronObj = JSON.parse(JSON.parse(crons[cron]));

          //console.log(cron, JSON.parse(crons[cron]));
          // var obj = JSON.parse(JSON.parse(crons[cron]));
          // console.log(obj)
          //  new CronJob(obj.cronTime, obj.onTick, obj.onComplete, obj.start, obj.timezone, obj.context, obj.runOnInit, obj.unrefTimeout);
          //   console.log(obj)
          //new CronJob(JSON.parse(cronss[cron]));

          var id = cronObj.cronName.split('{')[0];
          var key = cronObj.cronName.match(/\{(.*?)\}/)[0];

          // console.log('ID: ',id, 'KEYL', JSON.stringify(key), typeof(JSON.stringify(key)))
          key = JSON.stringify(key);


          createCron(cronObj.cronName, { timezone: cronObj.cronTime.zone, runTime: moment(cronObj.cronTime.source), runOnInit: false, fireOnce: cronObj.runOnce, type: { name: 'clearCache', id: id, key: key } });




        })

      }


    })

  }
};