

module.exports = exports = function countExists(schema, options) {

  schema.pre('save', async function (next) {

     let count = await m_models.Counts.m_read({type:"findOne", query:{name:options.modelName}});

     if(!count) {
      
      return next({err:"No count found"});

     } 

     if(options.modelName === 'Permissions') {
      
        schema.count = !count.count ? 1 : count.count === 1 ? 2 : count.count * 2;
        console.log('count', schema.count, count);
     } 

      next();

  });


  schema.post('save', async function (doc, next) {

    if(options.modelName === 'Permissions') {

      console.log(doc._id, schema.count);

      m_models.Permissions.m_update({where:{_id:doc._id}, body:{permissions:schema.count}});
      m_models.Counts.m_update({where:{name:options.modelName}, body:{count:schema.count}});

    }


     next();
 
 });
  
};