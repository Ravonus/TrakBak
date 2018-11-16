const { clearHash } = require('../services/redis');

module.exports = async (req, res, next) => {
  await next();

  clearHash(req.user.id);
}