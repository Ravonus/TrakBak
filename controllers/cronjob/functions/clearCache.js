
const { clearKey } = require('../../../webServer/services/redis');

module.exports = (id, key) => {
  console.log('CLEARED CACHE');
  console.log(id, key)
  clearKey(id, key);

}