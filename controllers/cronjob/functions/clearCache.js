
const { clearKey } = require('../../../webServer/services/redis');

module.exports = (id, key) => {
  console.log('CLEARED CACHE');
  clearKey(id, key);

}