const { clearHash } = require('../../webServer/services/redis');

module.exports = async (options) => {
  if(options.clearCache && options.user) {

    await clearHash(options.user._id);
  }
}