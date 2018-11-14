const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  config = require('../../config/config'),
  iv = Buffer.from(config.ivId, 'hex');

module.exports = (text, salt) => {

  try {
    var decipher = crypto.createDecipheriv(algorithm, salt, iv)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  } catch (err) {
    console.log(err);
  }

}