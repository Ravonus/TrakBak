const { clearHash } = require('../../webServer/services/redis');

module.exports = async (options) => {
  if(options.clearCache && options.user) {
    console.log('clear dat shit');
    await clearHash(options.user._id);
  }
}