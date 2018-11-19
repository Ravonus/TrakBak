const { clearHash } = require('../services/redis');

module.exports =  (req, res, next) => {
  clearHash(req.user.id);
  await next();
}