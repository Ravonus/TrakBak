const { clearHash } = require('../services/redis');

module.exports =  (req, res, next) => {
  console.log('diz hash', clearHash)
  clearHash(req.user.id);
  await next();
}